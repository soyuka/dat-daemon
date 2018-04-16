const express = require('express')
const p = require('path')
const replaceStream = require('replacestream')
const app = express()
const url = require('url')
const datResolve = require('dat-link-resolve')
const Client = require('dat-daemon-client')

async function main() {
  const client = await Client()

  app.get('*', (req, res) => {
    const q = url.parse(req.url)

    console.log(q.href)
    datResolve(q.href, async function (err, key) {
      if (err) {
        res.status(500).send(err)
        return
      }

      const a = await client.add('/home/soyuka/.config/dat-daemon/test', key)
      let path = q.pathname
      if (path.endsWith('/') || !path) {
        path += 'index.html'
      }

      let stream = await client.createReadStream(a.key, path)

      // if (p.extname(path) === '.html') {
      //   stream = stream.pipe(replaceStream('<head>', `<head><base href="http://localhost:4560/${q.href}/">`))
      // }

      stream.pipe(res)
    })
  })

  app.listen(3000, () => console.log('Example app listening on port 3000!'))
}

main()
