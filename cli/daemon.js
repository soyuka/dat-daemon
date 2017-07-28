const config = require('../config')()
const fs = require('fs-jetpack')
const ToiletDbAsync = require('../lib/ToiletDbAsync')
const MultidatAsync = require('../lib/MultidatAsync')
const fixMultidat = require('../lib/MultidatAsync').fixMultidat
const List = require('../lib/List')
const net = require('net')

async function daemon() {
  fs.remove(config.socket)

  const multidatDb = await ToiletDbAsync(`${config.metadata}/multidat.json`)
  const multidat = await MultidatAsync(multidatDb)
  const list = new List(await ToiletDbAsync(config.list), multidat)

  await list.share(config.dirList)

  net.createServer((socket) => {
    socket.on('data', async (data) => {

      data = data.toString().split(' ')
      const command = data[0]

      switch(command) {
        case 'add':
          const directory = data[1]

          const {dat, duplicate} = await multidat.createAsync(directory, {resume: true})

          if (duplicate) {
            socket.end(`Error: duplicate ${dat.key.toString('hex')}`)
            return
          }

          dat.importFiles()
          dat.joinNetwork()

          socket.end(`${directory} => ${dat.key.toString('hex')}`)

          await list.save()
          await fixMultidat(multidat, multidatDb)

          break;
        case 'list':
          socket.write(`List available on dat://${list.key}\n`)

          list.list
          .forEach((e) => {
            socket.write(`dat://${e}\n`)
          })

          socket.end()
          break;
        case 'remove':
          const key = data[1]

          if (!key) {
            socket.end('No key.')
            return
          }

          await multidat.closeAsync(key)

          socket.end(`${key} removed`)
          await list.save()
          await fixMultidat(multidat, multidatDb)
        default:
          socket.write(`Command "${command}" not found.`)
      }
    })
  }).listen(config.socket)
}

daemon()


process.on('unhandledRejection', function (err) {
  console.error(err.stack)
})
