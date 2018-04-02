// This file is auto generated by the protocol-buffers cli tool

/* eslint-disable quotes */
/* eslint-disable indent */
/* eslint-disable no-redeclare */
/* eslint-disable camelcase */

// Remember to `npm install --save protocol-buffers-encodings`
var encodings = require('protocol-buffers-encodings')
var varint = encodings.varint
var skip = encodings.skip

exports.Subject = {
  "LIST": 0,
  "ITEM": 1
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

var Instruction = exports.Instruction = {
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

var Answer = exports.Answer = {
  buffer: true,
  encodingLength: null,
  encode: null,
  decode: null
}

defineDat()
defineList()
defineInstruction()
defineStatistics()
defineAnswer()

function defineDat () {
  var enc = [
    encodings.string
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
      path: ""
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

function defineInstruction () {
  Instruction.Action = {
  "ADD": 0,
  "REMOVE": 1,
  "GET": 3,
  "START": 4,
  "PAUSE": 5,
  "LOAD": 6,
  "WATCH": 7,
  "MKDIR": 8,
  "READDIR": 9,
  "UNLINK": 10,
  "INFO": 11,
  "WRITE": 12,
  "READ": 13
}

  var enc = [
    encodings.int32,
    encodings.enum,
    encodings.enum,
    encodings.string
  ]

  Instruction.encodingLength = encodingLength
  Instruction.encode = encode
  Instruction.decode = decode

  function encodingLength (obj) {
    var length = 0
    if (!defined(obj.id)) throw new Error("id is required")
    var len = enc[0].encodingLength(obj.id)
    length += 1 + len
    if (!defined(obj.action)) throw new Error("action is required")
    var len = enc[1].encodingLength(obj.action)
    length += 1 + len
    if (!defined(obj.subject)) throw new Error("subject is required")
    var len = enc[2].encodingLength(obj.subject)
    length += 1 + len
    if (defined(obj.key)) {
      var len = enc[3].encodingLength(obj.key)
      length += 1 + len
    }
    if (defined(obj.path)) {
      var len = enc[3].encodingLength(obj.path)
      length += 1 + len
    }
    return length
  }

  function encode (obj, buf, offset) {
    if (!offset) offset = 0
    if (!buf) buf = Buffer.allocUnsafe(encodingLength(obj))
    var oldOffset = offset
    if (!defined(obj.id)) throw new Error("id is required")
    buf[offset++] = 8
    enc[0].encode(obj.id, buf, offset)
    offset += enc[0].encode.bytes
    if (!defined(obj.action)) throw new Error("action is required")
    buf[offset++] = 16
    enc[1].encode(obj.action, buf, offset)
    offset += enc[1].encode.bytes
    if (!defined(obj.subject)) throw new Error("subject is required")
    buf[offset++] = 24
    enc[2].encode(obj.subject, buf, offset)
    offset += enc[2].encode.bytes
    if (defined(obj.key)) {
      buf[offset++] = 34
      enc[3].encode(obj.key, buf, offset)
      offset += enc[3].encode.bytes
    }
    if (defined(obj.path)) {
      buf[offset++] = 42
      enc[3].encode(obj.path, buf, offset)
      offset += enc[3].encode.bytes
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
      id: 0,
      action: 0,
      subject: 0,
      key: "",
      path: ""
    }
    var found0 = false
    var found1 = false
    var found2 = false
    while (true) {
      if (end <= offset) {
        if (!found0 || !found1 || !found2) throw new Error("Decoded message is not valid")
        decode.bytes = offset - oldOffset
        return obj
      }
      var prefix = varint.decode(buf, offset)
      offset += varint.decode.bytes
      var tag = prefix >> 3
      switch (tag) {
        case 1:
        obj.id = enc[0].decode(buf, offset)
        offset += enc[0].decode.bytes
        found0 = true
        break
        case 2:
        obj.action = enc[1].decode(buf, offset)
        offset += enc[1].decode.bytes
        found1 = true
        break
        case 3:
        obj.subject = enc[2].decode(buf, offset)
        offset += enc[2].decode.bytes
        found2 = true
        break
        case 4:
        obj.key = enc[3].decode(buf, offset)
        offset += enc[3].decode.bytes
        break
        case 5:
        obj.path = enc[3].decode(buf, offset)
        offset += enc[3].decode.bytes
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

function defineAnswer () {
  var enc = [
    encodings.int32,
    encodings.enum,
    Statistics,
    Dat
  ]

  Answer.encodingLength = encodingLength
  Answer.encode = encode
  Answer.decode = decode

  function encodingLength (obj) {
    var length = 0
    if (!defined(obj.id)) throw new Error("id is required")
    var len = enc[0].encodingLength(obj.id)
    length += 1 + len
    if (!defined(obj.failure)) throw new Error("failure is required")
    var len = enc[0].encodingLength(obj.failure)
    length += 1 + len
    if (!defined(obj.subject)) throw new Error("subject is required")
    var len = enc[1].encodingLength(obj.subject)
    length += 1 + len
    if (defined(obj.statistics)) {
      var len = enc[2].encodingLength(obj.statistics)
      length += varint.encodingLength(len)
      length += 1 + len
    }
    if (defined(obj.list)) {
      for (var i = 0; i < obj.list.length; i++) {
        if (!defined(obj.list[i])) continue
        var len = enc[3].encodingLength(obj.list[i])
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
    if (!defined(obj.id)) throw new Error("id is required")
    buf[offset++] = 8
    enc[0].encode(obj.id, buf, offset)
    offset += enc[0].encode.bytes
    if (!defined(obj.failure)) throw new Error("failure is required")
    buf[offset++] = 16
    enc[0].encode(obj.failure, buf, offset)
    offset += enc[0].encode.bytes
    if (!defined(obj.subject)) throw new Error("subject is required")
    buf[offset++] = 24
    enc[1].encode(obj.subject, buf, offset)
    offset += enc[1].encode.bytes
    if (defined(obj.statistics)) {
      buf[offset++] = 34
      varint.encode(enc[2].encodingLength(obj.statistics), buf, offset)
      offset += varint.encode.bytes
      enc[2].encode(obj.statistics, buf, offset)
      offset += enc[2].encode.bytes
    }
    if (defined(obj.list)) {
      for (var i = 0; i < obj.list.length; i++) {
        if (!defined(obj.list[i])) continue
        buf[offset++] = 42
        varint.encode(enc[3].encodingLength(obj.list[i]), buf, offset)
        offset += varint.encode.bytes
        enc[3].encode(obj.list[i], buf, offset)
        offset += enc[3].encode.bytes
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
      id: 0,
      failure: 0,
      subject: 0,
      statistics: null,
      list: []
    }
    var found0 = false
    var found1 = false
    var found2 = false
    while (true) {
      if (end <= offset) {
        if (!found0 || !found1 || !found2) throw new Error("Decoded message is not valid")
        decode.bytes = offset - oldOffset
        return obj
      }
      var prefix = varint.decode(buf, offset)
      offset += varint.decode.bytes
      var tag = prefix >> 3
      switch (tag) {
        case 1:
        obj.id = enc[0].decode(buf, offset)
        offset += enc[0].decode.bytes
        found0 = true
        break
        case 2:
        obj.failure = enc[0].decode(buf, offset)
        offset += enc[0].decode.bytes
        found1 = true
        break
        case 3:
        obj.subject = enc[1].decode(buf, offset)
        offset += enc[1].decode.bytes
        found2 = true
        break
        case 4:
        var len = varint.decode(buf, offset)
        offset += varint.decode.bytes
        obj.statistics = enc[2].decode(buf, offset, offset + len)
        offset += enc[2].decode.bytes
        break
        case 5:
        var len = varint.decode(buf, offset)
        offset += varint.decode.bytes
        obj.list.push(enc[3].decode(buf, offset, offset + len))
        offset += enc[3].decode.bytes
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
