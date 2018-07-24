const test = require('tape')
const resolve = require('./lib')

const client = {
  add: function (path, key) {
    return Promise.resolve({key})
  }
}

test('resolve simple', async function (t) {
  const result = await resolve(client, 'fcfdb7671f91cbf660625c59dae695d81f553a5010853934ac69d2632ef4f3e5')

  t.equal(result.key, 'fcfdb7671f91cbf660625c59dae695d81f553a5010853934ac69d2632ef4f3e5')
  t.equal(result.path, 'index.html')
  t.end()
})

test('resolve /', async function (t) {
  const result = await resolve(client, '/fcfdb7671f91cbf660625c59dae695d81f553a5010853934ac69d2632ef4f3e5')

  t.equal(result.key, 'fcfdb7671f91cbf660625c59dae695d81f553a5010853934ac69d2632ef4f3e5')
  t.equal(result.path, 'index.html')
  t.end()
})

test('resolve protocol', async function (t) {
  const result = await resolve(client, 'dat://fcfdb7671f91cbf660625c59dae695d81f553a5010853934ac69d2632ef4f3e5')

  t.equal(result.key, 'fcfdb7671f91cbf660625c59dae695d81f553a5010853934ac69d2632ef4f3e5')
  t.equal(result.path, 'index.html')
  t.end()
})

test('resolve path', async function (t) {
  const result = await resolve(client, '/fcfdb7671f91cbf660625c59dae695d81f553a5010853934ac69d2632ef4f3e5/foo.html')

  t.equal(result.key, 'fcfdb7671f91cbf660625c59dae695d81f553a5010853934ac69d2632ef4f3e5')
  t.equal(result.path, '/foo.html')
  t.end()
})
