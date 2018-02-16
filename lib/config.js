const mkdirp = require('mkdirp')

const CONFIG_PATHS = [
  '~/.config/dat-daemon/config.json',
  `${__dirname}/../config.example.json`
]

var config

function parseConfiguration () {
  if (config !== undefined) {
    return config
  }

  try {
    // read config and remove json comments
    config = require('fs').readFileSync(require('first-existing-path').sync(CONFIG_PATHS)).toString().replace(/\s*\/\/.+$/gm, '')
  } catch (e) {
    console.error('No configuration file found in the following paths:\n', CONFIG_PATHS.join('\n'))
    process.exit(1)
  }

  try {
    config = JSON.parse(config)
  } catch (e) {
    console.error('Configuration is not valid JSON:', config)
    process.exit(1)
  }

  try {
    mkdirp.sync(config.data)
  } catch (e) {}

  config.socket = `${config.data}/${config.socket}`
  config.database = `${config.data}/${config.database}`

  console.error('Configuration is %j', config)

  return config
}

module.exports = parseConfiguration
