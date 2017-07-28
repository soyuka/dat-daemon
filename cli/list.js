const config = require('../config')()
const net = require('net')
const client = net.connect(config.socket, () => {
  client.write('list')
})

client.on('data', (msg) => {
  console.log(msg.toString())
})
