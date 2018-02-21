#!/usr/bin/env node
const WebSocketServer = require('uws').Server
const {onmessage, joinNetworks, close, updateState, config} = require('dat-daemon')
const configuration = config()
var server

daemon()

async function daemon () {
  await updateState()
  joinNetworks()

  server = new WebSocketServer({ port: configuration.port })
  server.on('connection', onconnection)
}

function onconnection (socket) {
  socket.on('message', onsocketmessage)

  async function onsocketmessage (msg) {
    socket.send(await onmessage(msg))
  }
}

function onexit () {
  server && server.close()
  close()
}

process.on('exit', onexit)
process.on('SIGINT', onexit)
process.on('unhandledRejection', function (err) {
  console.error(err.stack)
})
