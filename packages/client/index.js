const Websocket = require('websocket-stream')
const {Instruction, Subject, Answer} = require('dat-daemon-protocol')
const configuration = {
  port: 8477
}

async function open(url) {
  const ws = Websocket(url)

  return new Promise(function (resolve, reject) {
    ws.on('open', function () {
      resolve(ws)
    })

    ws.on('error', reject)
  })
}

async function DatDaemonClient(url = `ws://localhost:${configuration.port}`, onanswer) {
  const client = await open(url)
  let id = 0

  client.on('data', function (d) {
    onanswer(Answer.decode(d))
  })

  function list () {
    client.write(Instruction.encode({
      subject: Subject.LIST,
      action: Instruction.Action.GET,
      id: ++id
    }))
  }

  function add (path, key) {
    client.write(Instruction.encode({
      subject: Subject.LIST,
      action: Instruction.Action.ADD,
      path: path,
      key: key,
      id: ++id
    }))
  }

  function remove (path, key) {
    client.write(Instruction.encode({
      subject: Subject.LIST,
      action: Instruction.Action.REMOVE,
      key: key,
      id: ++id
    }))
  }

  async function createReadStream(key, path) {
    return await open(`${url}/${key}/read/${path}`)
  }

  async function createWriteStream(key, path) {
    return await open(`${url}/${key}/write/${path}`)
  }

  return {
    list,
    add,
    remove,
    createReadStream,
    createWriteStream,
  }
}

module.exports = DatDaemonClient
