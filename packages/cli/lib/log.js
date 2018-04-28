const chalk = require('chalk')
const prefix = chalk.grey('[dat-daemon]') + ' -'

function colorize (color) {
  return function (e, i) {
    if (typeof e === 'object') {
      e = JSON.stringify(e, true, 2)
    }

    return chalk[color](e)
  }
}

function pad(s) {
  return `0${s}`.slice(-2)
}

function pretty (args, color) {
  const t = new Date()
  args = args.map(colorize(color))
  args.unshift([pad(t.getHours()), pad(t.getMinutes()), pad(t.getSeconds())].join(':'), prefix)
  return args
}

function log (...args) {
  console.log.apply(null, pretty(args, 'blue'))
}

function error (...args) {
  console.log.apply(null, pretty(args, 'red'))
}

module.exports = {
  info: log,
  log: log,
  error: error,
}
