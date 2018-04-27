const log = require('./log')
module.exports = function (err) {
  log.error(err.message)
}
