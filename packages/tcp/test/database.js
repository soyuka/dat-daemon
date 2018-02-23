process.env.DATDAEMON_CONFIG = `${__dirname}/fixtures/datdaemon/config.json`
require('rimraf').sync(process.env.DATDAEMON_CONFIG)
const tape = require('tape')
const {get, put, remove} = require('../lib/database')

tape('database', async function (t) {
  var list = await get()
  t.same(list, {list: []})

  try {
    await put({key: 'foo'})
  } catch (e) {
    t.same(e.message, 'path is required')
  }

  try {
    await put({path: 'foo'})
  } catch (e) {
    t.same(e.message, 'key is required')
  }

  await put({key: 'foo', path: 'bar'})

  list = await get()
  t.same(list, {list: [{key: 'foo', path: 'bar', options: null}]})
  t.same(await remove('bar'), false)
  await remove('foo')

  list = await get()
  t.same(list, {list: []})

  t.end()
})
