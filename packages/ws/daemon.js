#!/usr/bin/env node
const WebSocket = require('websocket-stream')
const router = require('find-my-way')()
const {Transform} = require('stream')
const {onmessage, joinNetworks, close, updateState, config, log, get} = require('dat-daemon')
const configuration = config()
var server

daemon()

router.on('GET', '/', (req, res, params) => {
  res.pipe(
    new Transform({
      async transform (chunk, enc, cb) {
        try {
          this.push(await onmessage(chunk))
          cb()
        } catch (err) {
          cb(err)
        }
      }
    })
  ).pipe(res)
})

router.on('GET', '/:key/*', (req, res, params) => {
  const dat = get(params.key)

  // do error
  if (!dat) {
  }

  var stream = dat.archive.createReadStream('/' + params['*'])

  stream.on('data', function() {
    console.log('got d')
  })

  stream.on('end', function() {
    console.log('end')
  })
  stream.on('close', function() {
    console.log('close')
  })

  stream.pipe(res)
})

function handle (socket, request) {
  request.method = 'GET'
  // console.log(request.url)
  router.lookup(request, socket)
}

async function daemon () {
  await updateState()
  joinNetworks()

  log('Server listening on %s', configuration.port)
  server = WebSocket.createServer({ port: configuration.port, perMessageDeflate: false }, handle)
}

function onexit () {
  server && server.close()
  close()
}

process.on('exit', onexit)
process.on('SIGINT', onexit)
process.on('unhandledRejection', function (err) {
  console.error(err.stack)
})
