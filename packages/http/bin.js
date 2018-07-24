#!/usr/bin/env node
const express = require('express')
const Client = require('@dat-daemon/client')
const config = require('@dat-daemon/config')()
const resolve = require('./lib')
const pump = require('pump')
const streamReplacer = require('stream-replacer').default
const app = express()

const replacer = streamReplacer({
  single: true,
  pattern: /(dat:\/\/)/,
  substitute: function (match, tag, done) {
    done(null, `http://${config.gateway.host}:${config.gateway.port}/`)
  }
})

async function main () {
  const client = await Client(`ws://${config.host}:${config.port}`)

  app.get('*', async (req, res) => {
    if (req.url === '/') {
      return res.status(404).end()
    }

    try {
      const {key, path} = await resolve(client, req.url)

      console.log('Reading %s/%s', key, path)

      const stream = await client.createReadStream(key, path)

      if (path.endsWith('.html')) {
        res.set('Content-Type', 'text/html')
        pump(stream, replacer, res, function (err) {
          if (err) throw err
        })
      } else {
        stream.pipe(res)
      }

    } catch (err) {
      res.status(500).send({error: err.message})
    }
  })

  app.listen(config.gateway.port, config.gateway.host, () => console.log('Dat gateway listening on port %s!', config.gateway.port))
}

main()
