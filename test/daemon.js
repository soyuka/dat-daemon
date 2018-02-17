process.env.DATDAEMON_CONFIG = `${__dirname}/fixtures/datdaemon/config.json`
require('rimraf').sync(process.env.DATDAEMON_CONFIG)
const tape = require('tape')
const {create} = require('../lib/dat.js')
const {onmessage} = require('..')
const {Instruction, Answer} = require('../lib/proto')
const DAT_DIR = `${__dirname}/fixtures/dat`
const ACTION_REQUIRE_KEY = [Instruction.Action.REMOVE, Instruction.Action.START, Instruction.Action.PAUSE, Instruction.Action.STATISTICS]

async function test (o) {
  const message = await onmessage(Instruction.encode(o))
  return Answer.decode(message)
}

tape('daemon', async function (t) {
  let dat = await create(null, DAT_DIR)
  const key = dat.key.toString('hex')

  t.same(await test({action: Instruction.Action.ADD}), {
    message: 'Key and directory are required.',
    statistics: null,
    failure: true
  })

  t.same(await test({action: Instruction.Action.ADD, directory: DAT_DIR}), {
    message: 'Key and directory are required.',
    statistics: null,
    failure: true
  })

  t.same(await test({action: Instruction.Action.ADD, directory: DAT_DIR, key: key}), {
    message: `${key} added.`,
    statistics: null,
    failure: false
  })

  t.same(await test({action: Instruction.Action.PAUSE, key: key}), {
    message: `${key} paused.`,
    statistics: null,
    failure: false
  })

  t.same(await test({action: Instruction.Action.START, key: key}), {
    message: `${key} started.`,
    statistics: null,
    failure: false
  })

  t.same(await test({action: Instruction.Action.LIST}), {
    message: `${key} ${DAT_DIR}`,
    statistics: null,
    failure: false
  })

  const b = await test({action: Instruction.Action.STATISTICS, key: key})
  t.same(b.failure, false)
  t.same(Object.keys(b.statistics), ['files', 'connected', 'byteLength', 'version', 'downloadSpeed', 'uploadSpeed', 'totalPeers', 'completePeers'])

  t.same(await test({action: Instruction.Action.REMOVE, key: key}), {
    message: `${key} removed.`,
    statistics: null,
    failure: false
  })

  for (let i = 0; i < ACTION_REQUIRE_KEY.length; i++) {
    t.same({
      message: `${key} not found.`,
      statistics: null,
      failure: true
    },
    await test({action: ACTION_REQUIRE_KEY[i], key: key}))
  }

  t.end()
})

tape('daemon key required', async function (t) {
  for (let i = 0; i < ACTION_REQUIRE_KEY.length; i++) {
    t.same({
      message: `Key required.`,
      statistics: null,
      failure: true
    },
    await test({action: ACTION_REQUIRE_KEY[i]}))
  }

  t.end()
})

process.on('unhandledRejection', function (err) {
  console.error(err.stack)
})
