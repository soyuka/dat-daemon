#!/usr/bin/env node
const Client = require('@dat-daemon/client')
const program = require('commander')
const log = require('./lib/log')

program
  .parse(process.argv)

const [dir, key] = program.args

async function main() {
  try {
    if (!dir) {
      throw new Error('Directory is required.')
    }
    const client = await Client()
    const answer = await client.add(dir, key)
    log.info(answer.message)
    process.exit(0)
  } catch (err) {
    require('./lib/error')(err)
    process.exit(1)
  }
}

main()
