const pretty = require('prettier-bytes')
const eol = require('os').EOL
const config = require('./lib/config')()
const {Instruction, Answer} = require('./protocol')
const database = require('./lib/database')
const Dat = require('./lib/dat')
const KEY_REQUIRED_ANSWER = Answer.encode({message: 'Key required.', failure: true})
const state = new Map()

/**
 * @TODO check silent or whatever
 */
function log (...data) {
  console.error.apply(this, data)
}

function found (key) {
  if (!key) return
  if (state.has(key)) return true
  return Answer.encode({message: `${key} not found.`, failure: true})
}

async function updateState () {
  var list = await database.get()
  list = list.list

  for (let i = 0; i < list.length; i++) {
    const item = list[i]
    if (!state.has(item.key)) {
      state.set(item.key, await Dat.create(item.key, item.directory))
    }
  }
}

module.exports.updateState = updateState

async function onmessage (message) {
  message = Instruction.decode(message)
  const exists = found(message.key)

  switch (message.action) {
    case Instruction.Action.ADD:
      if (!message.key || !message.directory) {
        return Answer.encode({message: 'Key and directory are required.', failure: true})
      }

      if (exists === true) {
        return Answer.encode({message: `${message.key} exists already.`, failure: true})
      }

      await database.put({key: message.key, directory: message.directory || `${config.data}/${message.key}`})
      await updateState()
      joinNetworks()
      log(`Added ${message.key}.`)
      return Answer.encode({message: `${message.key} added.`})

    case Instruction.Action.REMOVE:
      if (exists === undefined) return KEY_REQUIRED_ANSWER
      if (exists !== true) return exists

      await database.remove(message.key)
      state.get(message.key).pause()
      state.delete(message.key)
      log(`Removed ${message.key}.`)
      return Answer.encode({message: `${message.key} removed.`})

    case Instruction.Action.START:
      if (exists === undefined) return KEY_REQUIRED_ANSWER
      if (exists !== true) return exists

      state.get(message.key).resume()
      log(`Started ${message.key}.`)
      return Answer.encode({message: `${message.key} started.`})

    case Instruction.Action.PAUSE:
      if (exists === undefined) return KEY_REQUIRED_ANSWER
      if (exists !== true) return exists

      state.get(message.key).pause()
      log(`Paused ${message.key}.`)
      return Answer.encode({message: `${message.key} paused.`})

    case Instruction.Action.LIST:
      var list = await database.get()

      return Answer.encode({message: list.list.map(function (item) {
        return `${item.key} ${item.directory}`
      }).join(eol)})

    case Instruction.Action.STATISTICS:
      if (exists === undefined) return KEY_REQUIRED_ANSWER
      if (exists !== true) return exists

      const {stats, network} = state.get(message.key)
      const files = stats.get()
      const str = `
${files.files} files (${pretty(files.byteLength)})
${network.connected} / ${stats.peers.total} Peers
${pretty(stats.network.uploadSpeed)} Upload ${pretty(stats.network.downloadSpeed)} Download
`
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

      return Answer.encode({message: str, statistics})
    default:
      return Answer.encode({message: `Unsupported action, actions are one of: ${Object.keys(Instruction.Action)}`, failure: true})
  }
}

module.exports.onmessage = onmessage

function close () {
  for (let value of state.values()) {
    value.close()
  }
}

module.exports.close = close

function joinNetworks () {
  for (let dat of state.values()) {
    if (!dat.network) {
      dat.joinNetwork()
    }

    if (!dat.stats) {
      dat.trackStats()
    }
  }
}

module.exports.joinNetworks = joinNetworks

module.exports.config = require('./lib/config')
module.exports.protocol = require('./protocol')
