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
    logs: `${CONFIG_DIR}/logs`,
    database: 'database',
    host: 'localhost',
    port: 8477,
    socket: 'datdaemon.sock',
    gateway: {
      host: 'localhost',
      port: 3000,
      sites: `${CONFIG_DIR}/sites`
    }
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
    config = fs.readFileSync(CONFIG_PATH).toString().replace(/\s*\/\/.+$/gm, '')
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
  try {
    mkdirp.sync(config.logs)
  } catch (e) {}
  try {
    mkdirp.sync(config.sites)
  } catch (e) {}

  config.socket = `${config.data}/${config.socket}`
  config.port = config.port || 8477
  config.database = `${config.data}/${config.database}`

  if (process.env.DEBUG) {
    console.error('Configuration is %j', config)
  }

  config.CONFIG_PATH = CONFIG_PATH

  return config
}

module.exports = parseConfiguration
