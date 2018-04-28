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

function prefix (args) {
  const t = new Date()
  args.unshift(`${t.getHours()}:${t.getMinutes()}:${t.getSeconds()}`, prefix)
}

function log (...args) {
  console.log.apply(null, args.map(colorize('blue')))
}

function error (...args) {
  console.log.apply(null, args.map(colorize('red')))
}

module.exports = {
  info: log,
  log: log,
  error: error,
}
