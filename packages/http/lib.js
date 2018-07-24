const datResolve = require('dat-link-resolve')
const config = require('@dat-daemon/config')()
const Url = require('url')

module.exports = async function resolve (client, url) {
  return new Promise((resolve, reject) => {

    if (!url) {
      return reject(new Error('Not found'))
    }

    if (url.startsWith('/')) {
      url = 'dat:/' + url
    } else if (!url.startsWith('dat://')) {
      url = 'dat://' + url
    }

    const query = Url.parse(url)

    datResolve(query.href, async function (err, key) {
      if (err) {
        return reject(err)
      } else if (!key) {
        return reject(new Error('Can not resolve key.'))
      }

      const dat = await client.info(key)

      if (dat.failure !== 0) {
        return reject(new Error(dat.message))
      }

      let path = query.pathname

      if (!path || path === '/') {
        path = 'index.html'
      }

      return resolve({path: path, key: dat.key})
    })
  })
}
