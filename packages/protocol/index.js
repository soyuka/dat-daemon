// This file is auto generated by the protocol-buffers cli tool

/* eslint-disable quotes */
/* eslint-disable indent */
/* eslint-disable no-redeclare */
/* eslint-disable camelcase */

// Remember to `npm install --save protocol-buffers-encodings`
var encodings = require('protocol-buffers-encodings')
var varint = encodings.varint
var skip = encodings.skip

var Instruction = exports.Instruction = {
  buffer: true,
  encodingLength: null,
  encode: null,
  decode: null
}

var Options = exports.Options = {
  buffer: true,
  encodingLength: null,
  encode: null,
  decode: null
}

var Answer = exports.Answer = {
  buffer: true,
  encodingLength: null,
  encode: null,
  decode: null
}

var Statistics = exports.Statistics = {
  buffer: true,
  encodingLength: null,
  encode: null,
  decode: null
}

var Dat = exports.Dat = {
  buffer: true,
  encodingLength: null,
  encode: null,
  decode: null
}

var List = exports.List = {
  buffer: true,
  encodingLength: null,
  encode: null,
  decode: null
}

defineInstruction()
defineOptions()
defineAnswer()
defineStatistics()
defineDat()
defineList()

function defineInstruction () {
  Instruction.Action = {
  "ADD": 0,
  "REMOVE": 1,
  "START": 2,
  "PAUSE": 3,
  "STATISTICS": 4,
  "LIST": 5
}

  var enc = [
    encodings.enum,
    encodings.string,
    Options
  ]

  Instruction.encodingLength = encodingLength
  Instruction.encode = encode
  Instruction.decode = decode

  function encodingLength (obj) {
    var length = 0
    if (!defined(obj.action)) throw new Error("action is required")
    var len = enc[0].encodingLength(obj.action)
    length += 1 + len
    if (defined(obj.key)) {
      var len = enc[1].encodingLength(obj.key)
      length += 1 + len
    }
    if (defined(obj.path)) {
      var len = enc[1].encodingLength(obj.path)
      length += 1 + len
    }
    if (defined(obj.options)) {
      var len = enc[2].encodingLength(obj.options)
      length += varint.encodingLength(len)
      length += 1 + len
    }
    return length
  }

  function encode (obj, buf, offset) {
    if (!offset) offset = 0
    if (!buf) buf = Buffer.allocUnsafe(encodingLength(obj))
    var oldOffset = offset
    if (!defined(obj.action)) throw new Error("action is required")
    buf[offset++] = 8
    enc[0].encode(obj.action, buf, offset)
    offset += enc[0].encode.bytes
    if (defined(obj.key)) {
      buf[offset++] = 18
      enc[1].encode(obj.key, buf, offset)
      offset += enc[1].encode.bytes
    }
    if (defined(obj.path)) {
      buf[offset++] = 26
      enc[1].encode(obj.path, buf, offset)
      offset += enc[1].encode.bytes
    }
    if (defined(obj.options)) {
      buf[offset++] = 34
      varint.encode(enc[2].encodingLength(obj.options), buf, offset)
      offset += varint.encode.bytes
      enc[2].encode(obj.options, buf, offset)
      offset += enc[2].encode.bytes
    }
    encode.bytes = offset - oldOffset
    return buf
  }

  function decode (buf, offset, end) {
    if (!offset) offset = 0
    if (!end) end = buf.length
    if (!(end <= buf.length && offset <= buf.length)) throw new Error("Decoded message is not valid")
    var oldOffset = offset
    var obj = {
      action: 0,
      key: "",
      path: "",
      options: null
    }
    var found0 = false
    while (true) {
      if (end <= offset) {
        if (!found0) throw new Error("Decoded message is not valid")
        decode.bytes = offset - oldOffset
        return obj
      }
      var prefix = varint.decode(buf, offset)
      offset += varint.decode.bytes
      var tag = prefix >> 3
      switch (tag) {
        case 1:
        obj.action = enc[0].decode(buf, offset)
        offset += enc[0].decode.bytes
        found0 = true
        break
        case 2:
        obj.key = enc[1].decode(buf, offset)
        offset += enc[1].decode.bytes
        break
        case 3:
        obj.path = enc[1].decode(buf, offset)
        offset += enc[1].decode.bytes
        break
        case 4:
        var len = varint.decode(buf, offset)
        offset += varint.decode.bytes
        obj.options = enc[2].decode(buf, offset, offset + len)
        offset += enc[2].decode.bytes
        break
        default:
        offset = skip(prefix & 7, buf, offset)
      }
    }
  }
}

function defineOptions () {
  var enc = [
    encodings.bool,
    encodings.int32
  ]

  Options.encodingLength = encodingLength
  Options.encode = encode
  Options.decode = decode

  function encodingLength (obj) {
    var length = 0
    if (defined(obj.sparse)) {
      var len = enc[0].encodingLength(obj.sparse)
      length += 1 + len
    }
    if (defined(obj.upload)) {
      var len = enc[0].encodingLength(obj.upload)
      length += 1 + len
    }
    if (defined(obj.download)) {
      var len = enc[0].encodingLength(obj.download)
      length += 1 + len
    }
    if (defined(obj.port)) {
      var len = enc[1].encodingLength(obj.port)
      length += 1 + len
    }
    if (defined(obj.utp)) {
      var len = enc[0].encodingLength(obj.utp)
      length += 1 + len
    }
    if (defined(obj.tcp)) {
      var len = enc[0].encodingLength(obj.tcp)
      length += 1 + len
    }
    if (defined(obj.importFiles)) {
      var len = enc[0].encodingLength(obj.importFiles)
      length += 1 + len
    }
    if (defined(obj.count)) {
      var len = enc[0].encodingLength(obj.count)
      length += 1 + len
    }
    return length
  }

  function encode (obj, buf, offset) {
    if (!offset) offset = 0
    if (!buf) buf = Buffer.allocUnsafe(encodingLength(obj))
    var oldOffset = offset
    if (defined(obj.sparse)) {
      buf[offset++] = 8
      enc[0].encode(obj.sparse, buf, offset)
      offset += enc[0].encode.bytes
    }
    if (defined(obj.upload)) {
      buf[offset++] = 16
      enc[0].encode(obj.upload, buf, offset)
      offset += enc[0].encode.bytes
    }
    if (defined(obj.download)) {
      buf[offset++] = 24
      enc[0].encode(obj.download, buf, offset)
      offset += enc[0].encode.bytes
    }
    if (defined(obj.port)) {
      buf[offset++] = 32
      enc[1].encode(obj.port, buf, offset)
      offset += enc[1].encode.bytes
    }
    if (defined(obj.utp)) {
      buf[offset++] = 40
      enc[0].encode(obj.utp, buf, offset)
      offset += enc[0].encode.bytes
    }
    if (defined(obj.tcp)) {
      buf[offset++] = 48
      enc[0].encode(obj.tcp, buf, offset)
      offset += enc[0].encode.bytes
    }
    if (defined(obj.importFiles)) {
      buf[offset++] = 56
      enc[0].encode(obj.importFiles, buf, offset)
      offset += enc[0].encode.bytes
    }
    if (defined(obj.count)) {
      buf[offset++] = 64
      enc[0].encode(obj.count, buf, offset)
      offset += enc[0].encode.bytes
    }
    encode.bytes = offset - oldOffset
    return buf
  }

  function decode (buf, offset, end) {
    if (!offset) offset = 0
    if (!end) end = buf.length
    if (!(end <= buf.length && offset <= buf.length)) throw new Error("Decoded message is not valid")
    var oldOffset = offset
    var obj = {
      sparse: false,
      upload: true,
      download: true,
      port: 0,
      utp: true,
      tcp: true,
      importFiles: false,
      count: false
    }
    while (true) {
      if (end <= offset) {
        decode.bytes = offset - oldOffset
        return obj
      }
      var prefix = varint.decode(buf, offset)
      offset += varint.decode.bytes
      var tag = prefix >> 3
      switch (tag) {
        case 1:
        obj.sparse = enc[0].decode(buf, offset)
        offset += enc[0].decode.bytes
        break
        case 2:
        obj.upload = enc[0].decode(buf, offset)
        offset += enc[0].decode.bytes
        break
        case 3:
        obj.download = enc[0].decode(buf, offset)
        offset += enc[0].decode.bytes
        break
        case 4:
        obj.port = enc[1].decode(buf, offset)
        offset += enc[1].decode.bytes
        break
        case 5:
        obj.utp = enc[0].decode(buf, offset)
        offset += enc[0].decode.bytes
        break
        case 6:
        obj.tcp = enc[0].decode(buf, offset)
        offset += enc[0].decode.bytes
        break
        case 7:
        obj.importFiles = enc[0].decode(buf, offset)
        offset += enc[0].decode.bytes
        break
        case 8:
        obj.count = enc[0].decode(buf, offset)
        offset += enc[0].decode.bytes
        break
        default:
        offset = skip(prefix & 7, buf, offset)
      }
    }
  }
}

function defineAnswer () {
  var enc = [
    encodings.string,
    Statistics,
    encodings.int32
  ]

  Answer.encodingLength = encodingLength
  Answer.encode = encode
  Answer.decode = decode

  function encodingLength (obj) {
    var length = 0
    if (!defined(obj.message)) throw new Error("message is required")
    var len = enc[0].encodingLength(obj.message)
    length += 1 + len
    if (defined(obj.statistics)) {
      var len = enc[1].encodingLength(obj.statistics)
      length += varint.encodingLength(len)
      length += 1 + len
    }
    if (defined(obj.failure)) {
      var len = enc[2].encodingLength(obj.failure)
      length += 1 + len
    }
    return length
  }

  function encode (obj, buf, offset) {
    if (!offset) offset = 0
    if (!buf) buf = Buffer.allocUnsafe(encodingLength(obj))
    var oldOffset = offset
    if (!defined(obj.message)) throw new Error("message is required")
    buf[offset++] = 10
    enc[0].encode(obj.message, buf, offset)
    offset += enc[0].encode.bytes
    if (defined(obj.statistics)) {
      buf[offset++] = 18
      varint.encode(enc[1].encodingLength(obj.statistics), buf, offset)
      offset += varint.encode.bytes
      enc[1].encode(obj.statistics, buf, offset)
      offset += enc[1].encode.bytes
    }
    if (defined(obj.failure)) {
      buf[offset++] = 24
      enc[2].encode(obj.failure, buf, offset)
      offset += enc[2].encode.bytes
    }
    encode.bytes = offset - oldOffset
    return buf
  }

  function decode (buf, offset, end) {
    if (!offset) offset = 0
    if (!end) end = buf.length
    if (!(end <= buf.length && offset <= buf.length)) throw new Error("Decoded message is not valid")
    var oldOffset = offset
    var obj = {
      message: "",
      statistics: null,
      failure: 0
    }
    var found0 = false
    while (true) {
      if (end <= offset) {
        if (!found0) throw new Error("Decoded message is not valid")
        decode.bytes = offset - oldOffset
        return obj
      }
      var prefix = varint.decode(buf, offset)
      offset += varint.decode.bytes
      var tag = prefix >> 3
      switch (tag) {
        case 1:
        obj.message = enc[0].decode(buf, offset)
        offset += enc[0].decode.bytes
        found0 = true
        break
        case 2:
        var len = varint.decode(buf, offset)
        offset += varint.decode.bytes
        obj.statistics = enc[1].decode(buf, offset, offset + len)
        offset += enc[1].decode.bytes
        break
        case 3:
        obj.failure = enc[2].decode(buf, offset)
        offset += enc[2].decode.bytes
        break
        default:
        offset = skip(prefix & 7, buf, offset)
      }
    }
  }
}

function defineStatistics () {
  var enc = [
    encodings.int64,
    encodings.float
  ]

  Statistics.encodingLength = encodingLength
  Statistics.encode = encode
  Statistics.decode = decode

  function encodingLength (obj) {
    var length = 0
    if (!defined(obj.files)) throw new Error("files is required")
    var len = enc[0].encodingLength(obj.files)
    length += 1 + len
    if (!defined(obj.connected)) throw new Error("connected is required")
    var len = enc[0].encodingLength(obj.connected)
    length += 1 + len
    if (!defined(obj.byteLength)) throw new Error("byteLength is required")
    var len = enc[0].encodingLength(obj.byteLength)
    length += 1 + len
    if (!defined(obj.version)) throw new Error("version is required")
    var len = enc[0].encodingLength(obj.version)
    length += 1 + len
    if (!defined(obj.downloadSpeed)) throw new Error("downloadSpeed is required")
    var len = enc[1].encodingLength(obj.downloadSpeed)
    length += 1 + len
    if (!defined(obj.uploadSpeed)) throw new Error("uploadSpeed is required")
    var len = enc[1].encodingLength(obj.uploadSpeed)
    length += 1 + len
    if (!defined(obj.totalPeers)) throw new Error("totalPeers is required")
    var len = enc[1].encodingLength(obj.totalPeers)
    length += 1 + len
    if (!defined(obj.completePeers)) throw new Error("completePeers is required")
    var len = enc[1].encodingLength(obj.completePeers)
    length += 1 + len
    return length
  }

  function encode (obj, buf, offset) {
    if (!offset) offset = 0
    if (!buf) buf = Buffer.allocUnsafe(encodingLength(obj))
    var oldOffset = offset
    if (!defined(obj.files)) throw new Error("files is required")
    buf[offset++] = 8
    enc[0].encode(obj.files, buf, offset)
    offset += enc[0].encode.bytes
    if (!defined(obj.connected)) throw new Error("connected is required")
    buf[offset++] = 16
    enc[0].encode(obj.connected, buf, offset)
    offset += enc[0].encode.bytes
    if (!defined(obj.byteLength)) throw new Error("byteLength is required")
    buf[offset++] = 24
    enc[0].encode(obj.byteLength, buf, offset)
    offset += enc[0].encode.bytes
    if (!defined(obj.version)) throw new Error("version is required")
    buf[offset++] = 32
    enc[0].encode(obj.version, buf, offset)
    offset += enc[0].encode.bytes
    if (!defined(obj.downloadSpeed)) throw new Error("downloadSpeed is required")
    buf[offset++] = 45
    enc[1].encode(obj.downloadSpeed, buf, offset)
    offset += enc[1].encode.bytes
    if (!defined(obj.uploadSpeed)) throw new Error("uploadSpeed is required")
    buf[offset++] = 53
    enc[1].encode(obj.uploadSpeed, buf, offset)
    offset += enc[1].encode.bytes
    if (!defined(obj.totalPeers)) throw new Error("totalPeers is required")
    buf[offset++] = 61
    enc[1].encode(obj.totalPeers, buf, offset)
    offset += enc[1].encode.bytes
    if (!defined(obj.completePeers)) throw new Error("completePeers is required")
    buf[offset++] = 69
    enc[1].encode(obj.completePeers, buf, offset)
    offset += enc[1].encode.bytes
    encode.bytes = offset - oldOffset
    return buf
  }

  function decode (buf, offset, end) {
    if (!offset) offset = 0
    if (!end) end = buf.length
    if (!(end <= buf.length && offset <= buf.length)) throw new Error("Decoded message is not valid")
    var oldOffset = offset
    var obj = {
      files: 0,
      connected: 0,
      byteLength: 0,
      version: 0,
      downloadSpeed: 0,
      uploadSpeed: 0,
      totalPeers: 0,
      completePeers: 0
    }
    var found0 = false
    var found1 = false
    var found2 = false
    var found3 = false
    var found4 = false
    var found5 = false
    var found6 = false
    var found7 = false
    while (true) {
      if (end <= offset) {
        if (!found0 || !found1 || !found2 || !found3 || !found4 || !found5 || !found6 || !found7) throw new Error("Decoded message is not valid")
        decode.bytes = offset - oldOffset
        return obj
      }
      var prefix = varint.decode(buf, offset)
      offset += varint.decode.bytes
      var tag = prefix >> 3
      switch (tag) {
        case 1:
        obj.files = enc[0].decode(buf, offset)
        offset += enc[0].decode.bytes
        found0 = true
        break
        case 2:
        obj.connected = enc[0].decode(buf, offset)
        offset += enc[0].decode.bytes
        found1 = true
        break
        case 3:
        obj.byteLength = enc[0].decode(buf, offset)
        offset += enc[0].decode.bytes
        found2 = true
        break
        case 4:
        obj.version = enc[0].decode(buf, offset)
        offset += enc[0].decode.bytes
        found3 = true
        break
        case 5:
        obj.downloadSpeed = enc[1].decode(buf, offset)
        offset += enc[1].decode.bytes
        found4 = true
        break
        case 6:
        obj.uploadSpeed = enc[1].decode(buf, offset)
        offset += enc[1].decode.bytes
        found5 = true
        break
        case 7:
        obj.totalPeers = enc[1].decode(buf, offset)
        offset += enc[1].decode.bytes
        found6 = true
        break
        case 8:
        obj.completePeers = enc[1].decode(buf, offset)
        offset += enc[1].decode.bytes
        found7 = true
        break
        default:
        offset = skip(prefix & 7, buf, offset)
      }
    }
  }
}

function defineDat () {
  var enc = [
    encodings.string,
    Options
  ]

  Dat.encodingLength = encodingLength
  Dat.encode = encode
  Dat.decode = decode

  function encodingLength (obj) {
    var length = 0
    if (!defined(obj.key)) throw new Error("key is required")
    var len = enc[0].encodingLength(obj.key)
    length += 1 + len
    if (!defined(obj.path)) throw new Error("path is required")
    var len = enc[0].encodingLength(obj.path)
    length += 1 + len
    if (defined(obj.options)) {
      var len = enc[1].encodingLength(obj.options)
      length += varint.encodingLength(len)
      length += 1 + len
    }
    return length
  }

  function encode (obj, buf, offset) {
    if (!offset) offset = 0
    if (!buf) buf = Buffer.allocUnsafe(encodingLength(obj))
    var oldOffset = offset
    if (!defined(obj.key)) throw new Error("key is required")
    buf[offset++] = 10
    enc[0].encode(obj.key, buf, offset)
    offset += enc[0].encode.bytes
    if (!defined(obj.path)) throw new Error("path is required")
    buf[offset++] = 18
    enc[0].encode(obj.path, buf, offset)
    offset += enc[0].encode.bytes
    if (defined(obj.options)) {
      buf[offset++] = 26
      varint.encode(enc[1].encodingLength(obj.options), buf, offset)
      offset += varint.encode.bytes
      enc[1].encode(obj.options, buf, offset)
      offset += enc[1].encode.bytes
    }
    encode.bytes = offset - oldOffset
    return buf
  }

  function decode (buf, offset, end) {
    if (!offset) offset = 0
    if (!end) end = buf.length
    if (!(end <= buf.length && offset <= buf.length)) throw new Error("Decoded message is not valid")
    var oldOffset = offset
    var obj = {
      key: "",
      path: "",
      options: null
    }
    var found0 = false
    var found1 = false
    while (true) {
      if (end <= offset) {
        if (!found0 || !found1) throw new Error("Decoded message is not valid")
        decode.bytes = offset - oldOffset
        return obj
      }
      var prefix = varint.decode(buf, offset)
      offset += varint.decode.bytes
      var tag = prefix >> 3
      switch (tag) {
        case 1:
        obj.key = enc[0].decode(buf, offset)
        offset += enc[0].decode.bytes
        found0 = true
        break
        case 2:
        obj.path = enc[0].decode(buf, offset)
        offset += enc[0].decode.bytes
        found1 = true
        break
        case 3:
        var len = varint.decode(buf, offset)
        offset += varint.decode.bytes
        obj.options = enc[1].decode(buf, offset, offset + len)
        offset += enc[1].decode.bytes
        break
        default:
        offset = skip(prefix & 7, buf, offset)
      }
    }
  }
}

function defineList () {
  var enc = [
    Dat
  ]

  List.encodingLength = encodingLength
  List.encode = encode
  List.decode = decode

  function encodingLength (obj) {
    var length = 0
    if (defined(obj.list)) {
      for (var i = 0; i < obj.list.length; i++) {
        if (!defined(obj.list[i])) continue
        var len = enc[0].encodingLength(obj.list[i])
        length += varint.encodingLength(len)
        length += 1 + len
      }
    }
    return length
  }

  function encode (obj, buf, offset) {
    if (!offset) offset = 0
    if (!buf) buf = Buffer.allocUnsafe(encodingLength(obj))
    var oldOffset = offset
    if (defined(obj.list)) {
      for (var i = 0; i < obj.list.length; i++) {
        if (!defined(obj.list[i])) continue
        buf[offset++] = 10
        varint.encode(enc[0].encodingLength(obj.list[i]), buf, offset)
        offset += varint.encode.bytes
        enc[0].encode(obj.list[i], buf, offset)
        offset += enc[0].encode.bytes
      }
    }
    encode.bytes = offset - oldOffset
    return buf
  }

  function decode (buf, offset, end) {
    if (!offset) offset = 0
    if (!end) end = buf.length
    if (!(end <= buf.length && offset <= buf.length)) throw new Error("Decoded message is not valid")
    var oldOffset = offset
    var obj = {
      list: []
    }
    while (true) {
      if (end <= offset) {
        decode.bytes = offset - oldOffset
        return obj
      }
      var prefix = varint.decode(buf, offset)
      offset += varint.decode.bytes
      var tag = prefix >> 3
      switch (tag) {
        case 1:
        var len = varint.decode(buf, offset)
        offset += varint.decode.bytes
        obj.list.push(enc[0].decode(buf, offset, offset + len))
        offset += enc[0].decode.bytes
        break
        default:
        offset = skip(prefix & 7, buf, offset)
      }
    }
  }
}

function defined (val) {
  return val !== null && val !== undefined && (typeof val !== 'number' || !isNaN(val))
}
