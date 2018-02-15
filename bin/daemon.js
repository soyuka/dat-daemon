#!/usr/bin/env node

const net = require('net')
const eol = require('os').EOL
const fs = require('fs')
const pretty = require('prettier-bytes')
const config = require('../lib/config')()
const {Instruction, Answer} = require('../lib/proto')
const database = require('../lib/database')
const Dat = require('../lib/dat')
const state = new Map()

var server

function found (key, socket) {
  if (state.has(key)) {
    return true
  }

  socket.write(Answer.encode({message: `${key} not found.`, failure: true}))
}

async function daemon () {
  unlink()

  server = net.createServer((socket) => {
    socket.on('data', async (message) => {
      message = Instruction.decode(message)

      switch (message.action) {
        case Instruction.Action.ADD:
          if (state.has(message.key)) {
            socket.write(Answer.encode({message: `${message.key} exists already.`, failure: true}))
            return
          }

          await database.push({key: message.key, directory: message.directory || `${config.data}/${message.key}`})
          joinNetworks()
          console.error(`Added ${message.key}.`)
          socket.write(Answer.encode({message: `${message.key} added.`}))
          return

        case Instruction.Action.REMOVE:
          if (!found(message.key, socket)) {
            return
          }

          await database.remove(message.key)
          state.get(message.key).pause()
          state.delete(message.key)
          console.error(`Removed ${message.key}.`)
          socket.write(Answer.encode({message: `${message.key} removed.`}))
          return

        case Instruction.Action.START:
          if (!found(message.key, socket)) {
            return
          }

          state.get(message.key).resume()
          console.error(`Started ${message.key}.`)
          socket.write(Answer.encode({message: `${message.key} started.`}))
          return

        case Instruction.Action.PAUSE:
          if (!found(message.key, socket)) {
            return
          }

          state.get(message.key).pause()
          console.error(`Paused ${message.key}.`)
          socket.write(Answer.encode({message: `${message.key} paused.`}))
          return

        case Instruction.Action.LIST:
          const list = await database.get()
          socket.write(Answer.encode({message: list.list.map(function (item) {
            return `${item.key} ${item.directory}`
          }).join(eol)}))
          return

        case Instruction.Action.STATISTICS:
          if (!found(message.key, socket)) {
            return
          }

          const {stats, network} = state.get(message.key)
          const files = stats.get()
          socket.write(Answer.encode({message: `
V-${files.version} | ${files.files} files (${pretty(files.byteLength)})
${network.connected} / ${stats.peers.total} Peers
${pretty(stats.network.uploadSpeed)} Upload ${pretty(stats.network.downloadSpeed)} Download
`}))
          return
        default:
          socket.write(Answer.encode({message: `Unsupported action, actions are one of: ${Object.keys(Instruction.Action)}`, failure: true}))
      }
    })
  })

  server.listen(config.socket)
}

async function joinNetworks () {
  const list = await database.get()

  list.list.forEach(async function (item) {
    if (!state.has(item.key)) {
      state.set(item.key, await Dat.create(item.key, item.directory))
    }

    const dat = state.get(item.key)

    if (!dat.network) {
      dat.joinNetwork()
    }

    if (!dat.stats) {
      dat.trackStats()
    }
  })
}

daemon()
joinNetworks()

function unlink () {
  try {
    fs.unlinkSync(config.socket)
  } catch (e) {}
}

function close () {
  (server && server.close(unlink)) || unlink()

  for (let value of state.values()) {
    value.close()
  }
}

process.on('exit', close)
process.on('SIGINT', close)
process.on('unhandledRejection', function (err) {
  console.error(err.stack)
})
