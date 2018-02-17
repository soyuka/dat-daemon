const mkdirp = require('mkdirp')
const os = require('os')
const path = require('path')
const fs = require('fs')
const CONFIG_PATH = process.env.DATDAEMON_CONFIG || `${os.homedir()}/.config/dat-daemon/config.json`
const CONFIG_DIR = path.dirname(CONFIG_PATH)

if (!fs.existsSync(CONFIG_DIR)) {
  mkdirp.sync(CONFIG_DIR)
}

if (!fs.existsSync(CONFIG_PATH)) {
  fs.writeFileSync(CONFIG_PATH, JSON.stringify({
    data: `${CONFIG_DIR}`,
    database: 'database',
    socket: 'datdaemon.sock'
  }, null, 2))
}

var config

function parseConfiguration () {
  if (config !== undefined) {
    return config
  }

  try {
    if (process.env.DEBUG) {
      console.error('Reading configuration from %s', CONFIG_PATH)
    }
    // read config and remove json comments
    config = require('fs').readFileSync(CONFIG_PATH).toString().replace(/\s*\/\/.+$/gm, '')
  } catch (e) {
    console.error('No configuration file found in the following paths:\n', CONFIG_PATH)
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

  if (process.env.DEBUG) {
    console.error('Configuration is %j', config)
  }

  return config
}

module.exports = parseConfiguration
