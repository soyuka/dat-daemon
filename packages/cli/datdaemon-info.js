#!/usr/bin/env node
const Client = require('@dat-daemon/client')
const program = require('commander')
const Table = require('cli-table')
const log = require('./lib/log')

program
  .parse(process.argv)

const [key] = program.args

async function main () {
  try {
    if (!key) {
      throw new Error('Key is required.')
    }
    const client = await Client()
    const answer = await client.info(key)

    const table = new Table()
    for (let i in answer.statistics) {
      table.push({[i]: answer.statistics[i]})
    }
    log.info(`Statistics for ${key}`)
    console.log(table.toString())
    process.exit(0)
  } catch (err) {
    require('./lib/error')(err)
    process.exit(1)
  }
}

main()
