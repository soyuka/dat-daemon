var inherits = require('util').inherits
var path = require('path')
var RandomAccess = require('random-access-storage')

module.exports = RandomAccessMessaging

function RandomAccessMessaging (filename, opts) {
  if (!(this instanceof RandomAccessMessaging)) return new RandomAccessMessaging(filename, opts)
  RandomAccess.call(this)

  if (!opts) opts = {}
  if (opts.directory) filename = path.join(opts.directory, filename)

  this.directory = opts.directory || null
  this.filename = filename
  this.fd = 0

  // makes random-access-storage open in writable mode first
  if (opts.writable || opts.truncate) this.preferReadonly = false

  this._size = opts.size || opts.length || 0
  this._truncate = !!opts.truncate || this._size > 0
  this._rmdir = !!opts.rmdir
}

inherits(RandomAccessMessaging, RandomAccess)
