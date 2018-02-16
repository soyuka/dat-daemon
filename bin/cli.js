#!/usr/bin/env node

const path = require('path')
const argv = require('minimist')(process.argv.slice(2))
const net = require('net')
const config = require('../lib/config')()
const {Instruction, Answer} = require('../lib/proto')
const {datResolve} = require('../lib/dat')
const help = require('../lib/help')

const Actions = Object.keys(Instruction.Action).map(e => e.toLowerCase())

async function getMessage () {
  let action = argv._[0]

  if (!~Actions.indexOf(action)) {
    throw new Error(action ? `Action "${action}" is not valid.` : 'No action specified.')
  }

  action = Instruction.Action[action.toUpperCase()]

  let key
  let directory

  if (action !== Instruction.Action.LIST) {
    key = argv._[1]
    if (!key) {
      throw new Error('Key is required')
    } else {
      key = await datResolve(key)
    }

    if (argv._[2]) {
      directory = path.resolve(process.cwd(), argv._[2])
    }
  }

  return Instruction.encode({action, key, directory})
}

async function start () {
  try {
    const message = await getMessage()

    const client = net.connect(config.socket, () => {
      client.write(message)
    })

    client.on('data', (message) => {
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
