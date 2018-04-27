const chalk = require('chalk')
const prefix = chalk.grey('[dat-daemon]') + ' -'
function colorize (color) {
  return function (e, i) {
    if (typeof e === 'object') {
      e = JSON.stringify(e, true, 2)
    }

    return i === 0 ? e : chalk[color](e)
  }
}

function log (...args) {
  args.unshift(prefix)
  console.log.apply(null, args.map(colorize('blue')))
}

function error (...args) {
  args.unshift(prefix)
  console.log.apply(null, args.map(colorize('red')))
}

module.exports = {
  info: log,
  log: log,
  error: error,
}
