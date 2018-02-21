const datResolve = require('dat-link-resolve')
const Dat = require('dat-node')

module.exports.datResolve = function (link) {
  return new Promise(function (resolve, reject) {
    datResolve(link, function (err, key) {
      if (err) {
        reject(err)
        return
      }

      resolve(key)
    })
  })
}

module.exports.create = function (key, directory, options) {
  return new Promise(function (resolve, reject) {
    Dat(directory, Object.assign(options || {}, {key: key}), function (err, dat) {
      if (err) {
        reject(err)
        return
      }

      resolve(dat)
    })
  })
}
