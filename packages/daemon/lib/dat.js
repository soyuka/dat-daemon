const datResolve = require('dat-link-resolve')
const Dat = require('dat-node')

module.exports.resolve = function (link) {
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

module.exports.readdir = function (dat, path) {
  return new Promise(function (resolve, reject) {
    dat.archive.readdir(path, function (err, list) {
      if (err) return reject(err)
      resolve(list)
    })
  })
}

module.exports.rmdir = function (dat, path) {
  return new Promise(function (resolve, reject) {
    dat.archive.rmdir(path, function (err) {
      if (err) return reject(err)
      resolve()
    })
  })
}

module.exports.mkdir = function (dat, path) {
  return new Promise(function (resolve, reject) {
    dat.archive.mkdir(path, function (err) {
      if (err) return reject(err)
      resolve()
    })
  })
}

module.exports.unlink = function (dat, path) {
  return new Promise(function (resolve, reject) {
    dat.archive.unlink(path, function (err) {
      if (err) return reject(err)
      resolve()
    })
  })
}

module.exports.stat = function (dat, path) {
  return new Promise(function (resolve, reject) {
    dat.archive.stat(path, function (err, stat) {
      if (err) return reject(err)
      resolve(stat)
    })
  })
}

