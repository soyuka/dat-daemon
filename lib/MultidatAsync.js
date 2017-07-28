const Dat = require('dat-node')
const Multidat = require('multidat')
const bluebird = require('bluebird')

async function MultidatAsync(db) {
  return new Promise((resolve, reject) => {
    Multidat(db, {dat: Dat}, (err, multidat) => {
      if (err) {
        reject(err)
        return
      }

      multidat.createAsync = function(dir, opts = {}) {
        return new Promise((resolve, reject) => {
          multidat.create(dir, opts, function(err, dat, duplicate) {
            if (err) {
              reject(err)
              return
            }

            resolve({dat, duplicate})
          })
        })
      }

      multidat.closeAsync = function(key) {
        return new Promise((resolve, reject) => {
          multidat.close(key, function(err) {
            if (err) {
              reject(err)
              return
            }

            resolve()
          })
        })
      }

      resolve(multidat)
    })
  })
}

module.exports = MultidatAsync

/**
 * Weird but toiletDb loses informations if we:
 * 1. start daemon
 * 2. create some dats
 * 3. close daemon
 * 4. start daemon
 * 5. create 1 dat => database only has this one...
 */
function fixMultidat(multidat, multidatDatabase) {
  const values = multidat.list().filter((e) => {
    if (e instanceof Error) {
        console.error('Removing this dat from the list because:', e.message)

      return false
    }

    return true
  })
  const promises = []

  for (let i = 0; i < values.length; i++) {
    const dat = values[i]
    promises.push(new Promise((resolve, reject) => {
      multidatDatabase.write(
        dat.key.toString('hex'),
        JSON.stringify({
          dir: dat.options.dir,
          opts: {watch: dat.options.watch || false, resume: dat.options.resume || true}
        }),
        function(err) {
          if (err) {
            reject(err)
            return
          }

          resolve()
        }
      )
    }))
  }

  return Promise.all(promises)
}

module.exports.fixMultidat = fixMultidat
