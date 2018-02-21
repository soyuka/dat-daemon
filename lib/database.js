const level = require('level')
const config = require('./config')()
const db = level(config.database)
const {List} = require('../protocol')

const KEY = 'list'

async function put (item) {
  const list = await get()
  list.list.push(item)

  return db.put(KEY, list, {valueEncoding: List})
}

async function get () {
  return new Promise(function (resolve, reject) {
    db.get(KEY, {valueEncoding: List}, function (err, list) {
      if (err) {
        if (err.notFound) {
          resolve({list: []})
          return
        }

        reject(err)
        return
      }

      resolve(list)
    })
  })
}

async function remove (key) {
  const list = await get()

  const index = list.list.findIndex(function (e) {
    return e.key === key
  })

  if (!~index) {
    return false
  }

  list.list.splice(index, 1)

  return db.put(KEY, list, {valueEncoding: List})
}

module.exports = {put, get, remove}
