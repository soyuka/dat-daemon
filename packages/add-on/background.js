var Client = require('dat-daemon-client')

async function main() {
  var client = await Client()
  var datUrl = decodeURIComponent(window.location.hash.substring(2))

  const a = await client.add('/home/abluchet/.config/dat-daemon/test', datUrl)

  const index = await client.createReadStream(a.key, 'index.html')
  let body = ''

  index.on('data', function(e) {
    body += e.toString()
  })

  index.on('end', function () {
    document.body.innerHTML = body
  })
}

main()
