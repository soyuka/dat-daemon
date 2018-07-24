const {Instruction, Subject, Answer} = require('@dat-daemon/protocol')
const { existsSync, mkdir } = require('fs')
const config = require('@dat-daemon/config')()
const database = require('./lib/database')
const Dat = require('./lib/dat')
const KEY_REQUIRED_ANSWER = id => Answer.encode({message: 'Key required.', failure: 1, id: id})
const KEY_NOT_FOUND_ANSWER = (key, id) => Answer.encode({message: `${key} not found.`, failure: 1, id: id})
const state = new Map()
const pathState = new Map()

function fsMkdir (path) {
  return new Promise(function (resolve, reject) {
    mkdir(path, function (err) {
      if (err) {
        return reject(err)
      }

      resolve()
    })
  })
}

function keyExists (key) {
  if (!key) return
  if (state.has(key)) return true
  return false
}

/**
 * @TODO check silent or whatever
 */
function log (...data) {
  console.error.apply(this, data)
}

module.exports.log = log

//  update state + join network etc.
async function init () {
  await updateState()
  joinNetworks()
}

module.exports.init = init

async function add (message) {
  if (!message.path) {
    return Answer.encode({message: 'Directory is required.', failure: 1, id: message.id})
  }

  if (!existsSync(message.path)) {
    await fsMkdir(message.path)
  }

  if (!message.key && !pathState.has(message.path)) {
    const options = {importFiles: true}
    const dat = await Dat.create(null, message.path, options)
    dat._daemonOptions = options
    message.key = dat.key.toString('hex')
    state.set(message.key, dat)
    pathState.set(message.path, message.key)
  } else if (keyExists(message.key) === true || pathState.has(message.path)) {
    log(`${message.key} exists`)
    return Answer.encode({message: `${message.key || message.path} exists already.`, failure: 2, id: message.id, key: message.key})
  }

  const key = await Dat.resolve(message.key)

  await database.put({key: key, path: message.path || `${config.data}/${key}`, options: message.options})
  await init()
  log(`Added ${key}.`)
  return Answer.encode({message: `${key} added.`, id: message.id, key: key})
}

async function remove (message) {
  const key = await Dat.resolve(message.key)
  const exists = keyExists(key)
  if (exists === false) return KEY_NOT_FOUND_ANSWER(message.key, message.id)
  if (exists === undefined) return KEY_REQUIRED_ANSWER(message.id)

  state.get(key).pause()
  const current = await database.getItem(key)
  await database.remove(key)
  pathState.delete(current.path)
  state.delete(key)
  log(`Removed ${message.key}.`)
  return Answer.encode({message: `${message.key} removed.`, id: message.id, key: message.key})
}

async function onmessage (message) {
  message = Instruction.decode(message)

  if (message.subject === Subject.LIST) {
    switch (message.action) {
      // List
      case Instruction.Action.ADD:
        return add(message)
      case Instruction.Action.REMOVE:
        return remove(message)
      case Instruction.Action.GET:
        let list = await database.get()
        return Answer.encode({
          list: list.list,
          id: message.id
        })
      default:
        return Answer.encode({message: `Unsupported action, actions are one of: ADD, REMOVE, GET`, failure: 1, id: message.id})
    }
  }

  if (message.subject !== Subject.ITEM) {
    return Answer.encode({message: `Unsupported subject, subject must be one of: LIST, ITEM`, failure: 1, id: message.id})
  }

  const key = await Dat.resolve(message.key)
  const exists = keyExists(key)

  if (exists === undefined) return KEY_REQUIRED_ANSWER(message.id)
  if (exists === false) return KEY_NOT_FOUND_ANSWER(message.key, message.id)

  switch (message.action) {
    // List
    case Instruction.Action.START:
      state.get(key).resume()
      log(`Started ${message.key}.`)
      return Answer.encode({message: `${message.key} started.`, id: message.id, key: message.key})

    case Instruction.Action.PAUSE:
      state.get(key).pause()
      log(`Paused ${message.key}.`)
      return Answer.encode({message: `${message.key} paused.`, id: message.id, key: message.key})

    case Instruction.Action.LOAD:
      state.get(key).importFiles()
      log(`Importing files ${message.key}.`)
      return Answer.encode({message: `${message.key} loaded.`, id: message.id, key: message.key})

    case Instruction.Action.WATCH:
      return Answer.encode({message: `Watch not implemented.`, id: message.id, key: message.key})

    case Instruction.Action.MKDIR:
      try {
        await Dat.mkdir(state.get(key), message.path)
        return Answer.encode({message: `Directory created.`, id: message.id, key: message.key})
      } catch (err) {
        log(`Error mkdir`, err.message)
        return Answer.encode({message: `Error while creating the directory: ${err.message}`, id: message.id, failure: 1, key: message.key})
      }

    case Instruction.Action.READDIR:
      try {
        const list = await Dat.readdir(state.get(key), message.path)
        return Answer.encode({message: `List success.`, id: message.id, files: list, key: message.key})
      } catch (err) {
        log(`Error readdir`, err.message)
        return Answer.encode({message: `Error while reading the directory: ${err.message}`, id: message.id, failure: 1, key: message.key})
      }

    case Instruction.Action.STAT:
      try {
        const stat = await Dat.stat(state.get(key), message.path)
        return Answer.encode({message: `Stat success.`, id: message.id, stat: stat, key: message.key})
      } catch (err) {
        log(`Error stat`, err.message)
        return Answer.encode({message: `Error while reading the directory: ${err.message}`, id: message.id, failure: 1, key: message.key})
      }

    case Instruction.Action.RMDIR:
      try {
        await Dat.rmdir(state.get(key), message.path)
        return Answer.encode({message: `Directory removed.`, id: message.id, key: message.key})
      } catch (err) {
        log(`Error rmdir`, err.message)
        return Answer.encode({message: `Error while removing the directory: ${err.message}`, id: message.id, failure: 1, key: message.key})
      }

    case Instruction.Action.UNLINK:
      try {
        await Dat.unlink(state.get(key), message.path)
        return Answer.encode({message: `File removed.`, id: message.id, key: message.key})
      } catch (err) {
        log(`Error unlink`, err.message)
        return Answer.encode({message: `Error while removing the file: ${err.message}`, id: message.id, failure: 1, key: message.key})
      }

    case Instruction.Action.INFO:
      const {stats, network} = state.get(key)
      const files = stats.get()

      const statistics = {
        files: files.files,
        byteLength: files.byteLength,
        version: files.version,
        connected: network.connected,
        downloadSpeed: stats.network.downloadSpeed,
        uploadSpeed: stats.network.uploadSpeed,
        downloadTotal: stats.network.downloadTotal,
        uploadTotal: stats.network.uploadTotal,
        totalPeers: stats.peers.total,
        completePeers: stats.peers.complete
      }

      return Answer.encode({statistics, key: message.key, id: message.id})

    default:
      return Answer.encode({message: `Unsupported action, actions are one of: ${Object.keys(Instruction.Action)}`, failure: 1})
  }
}

module.exports.onmessage = onmessage

function onrequest (url, socket) {
  url = url.replace('dat://', '').split(/\/\/?/)
  url.shift()

  const key = url.shift()
  const action = url.shift()
  const path = url.join('/')
  const exists = keyExists(key)

  if (exists === undefined) return socket.destroy()
  if (exists !== true) return socket.destroy()
  // if (exists === undefined) return KEY_REQUIRED_ANSWER(-1)
  // if (exists !== true) return KEY_NOT_FOUND_ANSWER(key, -1)

  switch (action) {
    case 'read':
      log('Creating read stream on dat://%s/%s', key, path)
      state.get(key).archive.createReadStream(path).pipe(socket)
      break
    case 'write':
      log('Creating write stream on dat://%s/%s', key, path)
      socket.pipe(state.get(key).archive.createWriteStream(path))
      break
    default:
      return socket.destroy()
      // return Answer.encode({message: `Unsupported action, actions are one of: read, write`, failure: 1, key: key})
  }
}

module.exports.onrequest = onrequest

async function updateState () {
  let list = await database.get()
  list = list.list

  for (let i = 0; i < list.length; i++) {
    const item = list[i]
    if (!state.has(item.key)) {
      const dat = await Dat.create(item.key, item.path, item.options)
      dat._daemonOptions = item.options
      state.set(item.key, dat)
      pathState.set(item.path, item.key)
    }
  }
}

function joinNetworks () {
  for (let dat of state.values()) {
    if (dat._daemonOptions && dat._daemonOptions.importFiles && !dat._daemonOptions.didImportFiles) {
      dat.importFiles()
      dat._daemonOptions.didImportFiles = true
    }

    if (!dat.network) {
      dat.joinNetwork()
    }

    if (!dat.stats) {
      dat.trackStats()
    }
  }
}

function close () {
  for (let value of state.values()) {
    value.close()
  }
}

module.exports.close = close
module.exports.config = require('./lib/config')
