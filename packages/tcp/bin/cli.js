#!/usr/bin/env node
const argv = require('minimist')(process.argv.slice(2))
const net = require('net')
const config = require('../lib/config')()
const {Answer} = require('dat-daemon-protocol')
const getMessage = require('../lib/arguments')
const help = require('../lib/help')

async function start () {
  try {
    const message = await getMessage(argv)

    const client = net.connect(config.socket, function () {
      client.write(message)
    })

    client.on('data', function (message) {
      message = Answer.decode(message)
      if (message.failure) {
        console.error(message.message)
        process.exit(1)
      }

      console.log(message.message)
      process.exit(0)
    })
  } catch (err) {
    console.error(err.stack)
    help()
    process.exit(1)
  }
}

start()

process.on('unhandledRejection', function (err) {
  console.error(err.stack)
  process.exit(1)
})
