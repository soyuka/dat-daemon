var Client = require('dat-daemon-client')

async function main () {
  var client = await Client()
  var datUrl = decodeURIComponent(window.location.hash.substring(2))

  console.log(datUrl)
  if (!datUrl) {
    alert('whoops no dat url')
    return
  }
  const a = await client.add('/home/soyuka/.config/dat-daemon/test', datUrl)
  const frame = document.getElementById('datdoc')
  frame.src = 'dat://'+a.key

  // const doc = document.implementation.createHTMLDocument('')
  // doc.open()

  // const index = await client.createReadStream(a.key, 'index.html')
  //
  // index.on('data', function(e) {
  //   // console.log(e.toString())
  //   // doc.write(e.toString())
  // })
  // index.on('end', function () {
  //   doc.close()
  //   // var destDocument = frame.contentDocument
  //   // var srcNode = doc.documentElement
  //   // var newNode = destDocument.importNode(srcNode, true)
  //   // destDocument.replaceChild(newNode, destDocument.documentElement)
  //   console.log(doc)
  // })

}

main()

function requestListener (requestDetails) {
  console.log("Loading: " + requestDetails.url);
}

browser.webRequest.onBeforeRequest.addListener(
  requestListener,
  {urls: ['all:urls']}
);


  // "protocol_handlers": [
  //   {"protocol": "dat", "name": "Dat", "uriTemplate": "/background.html#!%s"}
  // ]
