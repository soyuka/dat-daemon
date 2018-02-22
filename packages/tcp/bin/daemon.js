#!/usr/bin/env node
const net = require('net')
const http = require('http')
const fs = require('fs')
const {Transform} = require('stream')
const config = require('../lib/config')()
const {onmessage, joinNetworks, close, updateState} = require('..')
var server

daemon()

async function daemon () {
  unlink()
  await updateState()
  joinNetworks()

  if (config.http) {
    server = http.createServer(onconnection)
    server.listen(config.port)
    return
  }

  server = net.createServer(onconnection)
  server.listen(config.socket)
}

function unlink () {
  if (config.http) return

  try {
    fs.unlinkSync(config.socket)
  } catch (e) {}
}

function onconnection (socket, res) {
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
  ).pipe(res || socket)
}

function onexit () {
  (server && server.close(unlink)) || unlink()
  close()
}

process.on('exit', onexit)
process.on('SIGINT', onexit)
process.on('unhandledRejection', function (err) {
  console.error(err.stack)
})
