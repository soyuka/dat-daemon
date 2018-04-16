// var Client = require('dat-daemon-client')
//
// async function main () {
//   var client = await Client()
//   // var datUrl = decodeURIComponent(window.location.hash.substring(2))
//   // console.log(datUrl)
//   // if (!datUrl) {
//   //   alert('whoops no dat url')
//   //   return
//   // }
//   // const doc = document.implementation.createHTMLDocument('')
//   // doc.open()
//   // const index = await client.createReadStream(a.key, 'index.html')
//   //
//   // index.on('data', function(e) {
//   //   // console.log(e.toString())
//   //   // doc.write(e.toString())
//   // })
//   // index.on('end', function () {
//   //   doc.close()
//   //   // var destDocument = frame.contentDocument
//   //   // var srcNode = doc.documentElement
//   //   // var newNode = destDocument.importNode(srcNode, true)
//   //   // destDocument.replaceChild(newNode, destDocument.documentElement)
//   //   console.log(doc)
//   // })
//
// }
//
// main()

console.log(browser.browserAction)
// browser.pageAction.onClicked.addListener((tab) => {
//
//   console.log(tab)
// })
function listener(details) {
  // browser.tabs.update(tab.id, {
  //   url: tab.url.replace('https://', 'dat://'),
  // })
  // let filter = browser.webRequest.filterResponseData(details.requestId);
  // let decoder = new TextDecoder("utf-8");
  // let encoder = new TextEncoder();
  console.log('prout')

  // filter.ondata = event => {
  //   let str = decoder.decode(event.data, {stream: true});
  //   // Just change any instance of Example in the HTTP response
  //   // to WebExtension Example.
  //   str = str.replace(/Example/g, 'WebExtension Example');
  //   filter.write(encoder.encode(str));
  //   filter.disconnect();
  // }

  return {};
}

browser.webRequest.onBeforeRequest.addListener(
  listener,
  {urls: ["http://localhost/dat*"], types: ["main_frame"]},
  ["blocking"]
);

    // "idle",
    // "activeTab",
    // "tabs",
    // "notifications",
    // "alarms",
    // "storage",
    // "contextMenus",
    // "clipboardWrite",
    // "webNavigation",
