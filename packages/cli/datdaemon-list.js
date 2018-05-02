const Client = require('@dat-daemon/client')
const log = require('./lib/log')

async function main() {
  const client = await Client()
  const list = await client.list()
  if (list.length) {
    list.forEach((e) => {
      log.info(`${e.path} ${e.key}`)
    })
  } else {
    log.info('Nothing there.')
  }
  process.exit(0)
}

try {
  main()
} catch (err) {
  require('./lib/error')(err)
}
