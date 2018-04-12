const {Instruction, Subject, Answer} = require('dat-daemon-protocol')
const eol = require('os').EOL
const { Writable } = require('stream')
const config = require('./lib/config')()
const database = require('./lib/database')
const Dat = require('./lib/dat')
const KEY_REQUIRED_ANSWER = id => Answer.encode({message: 'Key required.', failure: 1, id: id})
const KEY_NOT_FOUND_ANSWER = id => Answer.encode({message: `${key} not found.`, failure: 1, id: id})
const state = new Map()

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
async function init() {
  await updateState()
  joinNetworks()
}

module.exports.init = init

async function add(message) {
  if (!message.path) {
    return Answer.encode({message: 'Directory is required.', failure: 1, id: message.id})
  }

  if (!message.key) {
    const options = {importFiles: true}
    const dat = await Dat.create(null, message.path, )
    dat._daemonOptions = options
    state.set(item.key, dat)
    message.key = dat.key.toString('hex')
  }

  if (keyExists(message) === true) {
    log(`${message.key} exists`)
    return Answer.encode({message: `${message.key} exists already.`, failure: 2, id: message.id})
  }

  await database.put({key: message.key, path: message.path || `${config.data}/${message.key}`, options: message.options})
  await init()
  log(`Added ${message.key}.`)
  return Answer.encode({message: `${message.key} added.`, id: message.id})
}

async function remove(message) {
  const exists = keyExists(message)
  if (exists === false) return KEY_NOT_FOUND_ANSWER(message.id)
  if (exists === undefined) return KEY_REQUIRED_ANSWER(message.id)

  await database.remove(message.key)
  state.get(message.key).pause()
  state.delete(message.key)
  log(`Removed ${message.key}.`)
  return Answer.encode({message: `${message.key} removed.`, id: message.id})
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

  const exists = keyExists(message)

  if (exists === undefined) return KEY_REQUIRED_ANSWER(message.id)
  if (exists === false) return KEY_NOT_FOUND_ANSWER(message.id)

  switch (message.action) {
    // List
    case Instruction.Action.START:
      state.get(message.key).resume()
      log(`Started ${message.key}.`)
      return Answer.encode({message: `${message.key} started.`, id: message.id})

    case Instruction.Action.PAUSE:
      state.get(message.key).pause()
      log(`Paused ${message.key}.`)
      return Answer.encode({message: `${message.key} paused.`, id: message.id})

    case Instruction.Action.LOAD:
      state.get(message.key).importFiles()
      log(`Importing files ${message.key}.`)
      return Answer.encode({message: `${message.key} loaded.`, id: message.id})

    case Instruction.Action.WATCH:
      return Answer.encode({message: `Watch not implemented.`, id: message.id})

    case Instruction.Action.MKDIR:
      try {
        await Dat.mkdir(state.get(message.key), message.path)
        return Answer.encode({message: `Directory created.`, id: message.id})
      } catch (err) {
        log(`Error mkdir`, err.message)
        return Answer.encode({message: `Error while creating the directory: ${err.message}`, id: message.id, failure: 1})
      }

    case Instruction.Action.READDIR:
      try {
        const list = await Dat.readdir(state.get(message.key), message.path)
        return Answer.encode({message: `Directory created.`, id: message.id, files: list})
      } catch (err) {
        log(`Error readdir`, err.message)
        return Answer.encode({message: `Error while reading the directory: ${err.message}`, id: message.id, failure: 1})
      }

    case Instruction.Action.RMDIR:
      try {
        await Dat.rmdir(state.get(message.key), message.path)
        return Answer.encode({message: `Directory removed.`, id: message.id})
      } catch (err) {
        log(`Error rmdir`, err.message)
        return Answer.encode({message: `Error while removing the directory: ${err.message}`, id: message.id, failure: 1})
      }

    case Instruction.Action.UNLINK:
      try {
        await Dat.unlink(state.get(message.key), message.path)
        return Answer.encode({message: `File removed.`, id: message.id})
      } catch (err) {
        log(`Error unlink`, err.message)
        return Answer.encode({message: `Error while removing the file: ${err.message}`, id: message.id, failure: 1})
      }

    case Instruction.Action.INFO:
      const {stats, network} = state.get(message.key)
      const files = stats.get()

      const statistics = {
        files: files.files,
        byteLength: files.byteLength,
        version: files.version,
        connected: network.connected,
        downloadSpeed: stats.network.downloadSpeed,
        uploadSpeed: stats.network.uploadSpeed,
        totalPeers: stats.peers.total,
        completePeers: stats.peers.complete
      }

      return Answer.encode({statistics})

    default:
      return Answer.encode({message: `Unsupported action, actions are one of: ${Object.keys(Instruction.Action)}`, failure: 1})
  }
}

module.exports.onmessage = onmessage

function onrequest (url, socket) {
  url = url.split('/')
  url.shift()

  const action = url.shift()
  const key = url.shift()
  const path = url.join('/')
  const exists = keyExists(key)

  if (exists === undefined) return KEY_REQUIRED_ANSWER(message.id)
  if (exists !== true) return KEY_NOT_FOUND_ANSWER(message.id)

  switch (action) {
    case 'read':
      state.get(key).archive.createReadStream(path).pipe(socket)
      break
    case 'write':
      socket.pipe(state.get(key).archive.createWriteStream(path))
      break
    default:
      return Answer.encode({message: `Unsupported action, actions are one of: read, write`, failure: 1})
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
