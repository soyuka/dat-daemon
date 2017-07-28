const config = require('../config')()

const argv = require('minimist')(process.argv.slice(2))
const directory = argv._[0]

if (!directory) {
  console.error('No directory to share.')
  process.exit(1)
}

const net = require('net')
const client = net.connect(config.socket, () => {
  client.write(`add ${directory}`)
})

client.on('data', (msg) => {
  console.log(msg.toString())
})
