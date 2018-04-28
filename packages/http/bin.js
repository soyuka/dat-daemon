#!/usr/bin/env node
const express = require('express')
const url = require('url')
const datResolve = require('dat-link-resolve')
const Client = require('@dat-daemon/client')
const config = require('dat-daemon/lib/config')()
const app = express()

async function main () {
  const client = await Client(`ws://${config.hostname}:${config.port}`)

  app.get('*', (req, res) => {
    const q = url.parse(req.url)

    datResolve(q.href, async function (err, key) {
      if (err || !key) {
        res.status(500).send(err)
        return
      }

      const a = await client.add(config.gateway.sites, key)

      let path = q.pathname
      if (path.endsWith('/') || !path) {
        path += 'index.html'
      }

      const stream = await client.createReadStream(a.key, path)

      stream.pipe(res)
    })
  })

  app.listen(config.gateway.port, config.gateway.hostname, () => console.log('Dat gateway listening on port %s!', config.gateway.port))
}

main()
