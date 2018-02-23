#!/usr/bin/env node
const {Writable} = require('stream')
const argv = require('minimist')(process.argv.slice(2))
const Websocket = require('websocket-stream')
const {Answer} = require('dat-daemon-protocol')
const {config, getMessage, help} = require('dat-daemon')
const configuration = config()

async function start () {
  const client = Websocket(`ws://localhost:${configuration.port}`)

  try {
    client.write(await getMessage(argv))
  } catch (err) {
    console.error(err.stack)
    help()
    process.exit(1)
  }

  client.pipe(new Writable({
    write (message, encoding, cb) {
      message = Answer.decode(message)

      if (message.failure) {
        console.error(message.message)
        process.exit(message.failure)
      }

      console.log(message.message)
      process.exit(0)
    }
  }))
}

start()

process.on('unhandledRejection', function (err) {
  console.error(err.stack)
  process.exit(1)
})
