const {Writable} = require('stream')
const Websocket = require('websocket-stream')
const {Answer, Instruction} = require('dat-daemon-protocol')
const {config, getMessage} = require('dat-daemon')
const configuration = config()
const EventEmitter = require('events')
const ee = new EventEmitter()
const URL = `ws://localhost:${configuration.port}`
const ws = Websocket(URL)

ws.pipe(new Writable({
  write (message, encoding, cb) {
    message = Answer.decode(message)
    ee.emit('next', message)
    cb(null, message)
  }
}))

async function send (message) {
  ws.write(message)
  return new Promise(function (resolve, reject) {
    ee.once('next', resolve)
  })
}

function createReadStream (path) {
  var temp = Websocket(`${URL}/${path}`)
  var stream = new Writable({
    write (message, encoding, cb) {
      console.log('got d', message)
      cb(null, message)
    }
  })

  temp.pipe(stream)

  stream.on('end', function () {
    console.log('read stream end')
  })

  return stream
}

module.exports = send

async function test () {
  var list = await send(Instruction.encode({action: Instruction.Action.LIST}))

  console.log('got list', list)

  var readfile = createReadStream('bb0ff1cf3539cd3371f4ced2efcfee46bf6cb6f54c45bd61499a5f0277f51a34/foo.test')
  readfile.on('data', function () {
    console.log('got data')
  })
}

test()

process.on('unhandledRejection', function (err) {
  console.error(err.stack)
  process.exit(1)
})
