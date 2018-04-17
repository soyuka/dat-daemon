#!/usr/bin/env node
const {Writable} = require('stream')
const fs = require('fs')
const argv = require('minimist')(process.argv.slice(2))
const Websocket = require('websocket-stream')
const {Answer} = require('dat-daemon-protocol')
const {config, getMessage, help} = require('dat-daemon')
const configuration = config()

async function start () {
  // const client = Websocket(`ws://localhost:${configuration.port}`)

  try {
    // client.write(await getMessage(argv))
  } catch (err) {
    console.error(err.stack)
    help()
    process.exit(1)
  }

  // const c2 = Websocket(`ws://localhost:${configuration.port}/read/a87001a0b073047a2e9d204c6d212a794c7326fc2b54596f35170ea15772c81f/abc`)
  // const w = new Writable({
  //   write (message, enc, cb) {
  //     console.log(message.toString())
  //     cb()
  //   }
  // })
  //
  // w.on('finish', function() {
  //   c2.socket.close()
  // })
  //
  // c2.pipe(w)

  const c3 = Websocket(`ws://localhost:${configuration.port}/write/a87001a0b073047a2e9d204c6d212a794c7326fc2b54596f35170ea15772c81f/package.json`)

  const stream = fs.createReadStream('./package.json')
  c3.on('connect', function() {
    stream.pipe(c3)
  })

  // client.pipe(new Writable({
  //   write (message, encoding, cb) {
  //     message = Answer.decode(message)
  //
  //     if (message.failure) {
  //       console.error(message.message)
  //       process.exit(message.failure)
  //     }
  //
  //     console.log(message.message)
  //     process.exit(0)
  //   }
  // }))
}

start()

process.on('unhandledRejection', function (err) {
  console.error(err.stack)
  process.exit(1)
})
