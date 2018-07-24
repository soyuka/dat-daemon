const Websocket = require('websocket-stream')
const {Instruction, Subject, Answer} = require('@dat-daemon/protocol')
// @TODO do something with this?
const configuration = {
  port: 8477
}

async function open (url) {
  return new Promise(function (resolve, reject) {
    const ws = Websocket(url)
    function resolver () {
      resolve(ws)
      ws.socket.removeEventListener('open', resolver)
    }

    function errorer () {
      reject(ws)
      ws.socket.removeEventListener('error', errorer)
    }

    ws.socket.addEventListener('open', resolver)
    ws.socket.addEventListener('error', errorer)
  })
}

async function DatDaemonClient (url = `ws://${configuration.host}:${configuration.port}`) {
  const client = await open(url)
  let id = 0
  /**
   * This stores promised by "id", it's used to route the answer to the correct resolution
   */
  const router = new Map()

  client.on('data', function (d) {
    const answer = Answer.decode(d)

    router.get(answer.id)(answer)
  })

  function route (id, transform) {
    return new Promise(function (resolve, reject) {
      router.set(id, function (data) {
        router.delete(id)
        if (data.failure === 1) {
          return reject(new Error(data.message))
        }

        resolve(transform ? transform(data) : data)
      })
    })
  }

  function list () {
    const current = ++id
    client.write(Instruction.encode({
      subject: Subject.LIST,
      action: Instruction.Action.GET,
      id: current
    }))

    return route(current, function (data) {
      return data.list
    })
  }

  function add (path, key = null) {
    const current = ++id
    client.write(Instruction.encode({
      subject: Subject.LIST,
      action: Instruction.Action.ADD,
      path: path,
      key: key,
      id: current
    }))

    return route(current)
  }

  function removeList (key) {
    const current = ++id
    client.write(Instruction.encode({
      subject: Subject.LIST,
      action: Instruction.Action.REMOVE,
      key: key,
      id: current
    }))

    return route(current)
  }

  function start (key) {
    const current = ++id

    client.write(Instruction.encode({
      subject: Subject.ITEM,
      action: Instruction.Action.START,
      key: key,
      id: current
    }))

    return route(current)
  }

  function remove (key) {
    const current = ++id

    client.write(Instruction.encode({
      subject: Subject.ITEM,
      action: Instruction.Action.REMOVE,
      key: key,
      id: current
    }))

    return route(current)
  }

  function load (key) {
    const current = ++id

    client.write(Instruction.encode({
      subject: Subject.ITEM,
      action: Instruction.Action.LOAD,
      key: key,
      id: current
    }))

    return route(current)
  }

  function watch (key) {
    const current = ++id

    client.write(Instruction.encode({
      subject: Subject.ITEM,
      action: Instruction.Action.WATCH,
      key: key,
      id: current
    }))

    return route(current)
  }

  function mkdir (key, path) {
    const current = ++id

    client.write(Instruction.encode({
      subject: Subject.ITEM,
      action: Instruction.Action.MKDIR,
      path: path,
      key: key,
      id: current
    }))

    return route(current)
  }

  function readdir (key, path = '') {
    const current = ++id

    client.write(Instruction.encode({
      subject: Subject.ITEM,
      action: Instruction.Action.READDIR,
      path: path,
      key: key,
      id: current
    }))

    return route(current, function (data) {
      return data.files
    })
  }

  function rmdir (key, path) {
    const current = ++id

    client.write(Instruction.encode({
      subject: Subject.ITEM,
      action: Instruction.Action.RMDIR,
      path: path,
      key: key,
      id: current
    }))

    return route(current)
  }

  function unlink (key, path) {
    const current = ++id

    client.write(Instruction.encode({
      subject: Subject.ITEM,
      action: Instruction.Action.UNLINK,
      path: path,
      key: key,
      id: current
    }))

    return route(current)
  }

  function info (key) {
    const current = ++id

    client.write(Instruction.encode({
      subject: Subject.ITEM,
      action: Instruction.Action.INFO,
      key: key,
      id: current
    }))

    return route(current)
  }

  async function createReadStream (key, path) {
    return open(`${url}/${key}/read/${path}`)
  }

  async function createWriteStream (key, path) {
    return open(`${url}/${key}/write/${path}`)
  }

  return {
    list,
    add,
    removeList,
    start,
    load,
    remove,
    watch,
    mkdir,
    readdir,
    rmdir,
    unlink,
    info,
    createReadStream,
    createWriteStream
  }
}

module.exports = DatDaemonClient
