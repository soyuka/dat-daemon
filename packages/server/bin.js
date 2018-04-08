#!/usr/bin/env node
const WebSocket = require('websocket-stream')
const {Transform} = require('stream')
const {onmessage, close, config, onrequest, init, log} = require('./')
const configuration = config()
var server

daemon()

async function daemon () {
  await init()

  log('Launching server on port %s', configuration.port)

  server = WebSocket.createServer({ port: configuration.port, perMessageDeflate: false }, function (socket, req) {
    if (req.url !== '/') {
      onrequest(req.url, socket)
      return
    }

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
