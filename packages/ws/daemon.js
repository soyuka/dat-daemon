#!/usr/bin/env node
const WebSocket = require('websocket-stream')
const {Transform} = require('stream')
const {onmessage, joinNetworks, close, updateState, config} = require('dat-daemon')
const configuration = config()
var server

daemon()

async function daemon () {
  await updateState()
  joinNetworks()

  server = WebSocket.createServer({ port: configuration.port, perMessageDeflate: false }, function (socket) {
    socket.pipe(
      new Transform({
        async transform (chunk, enc, cb) {
          try {
            this.push(await onmessage(chunk))
            cb()
          } catch (err) {
            cb(err)
          }
        }
      })
    ).pipe(socket)
  })
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
