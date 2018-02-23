# DatDaemon

[![Build Status](https://travis-ci.org/soyuka/dat-daemon.svg?branch=master)](https://travis-ci.org/soyuka/dat-daemon)

Helps to share multiple dats.

## Why?

Let's say you have some spare bandwith and you want to help the dat community sharing their content:
- install
- start the daemon
- add some dats

## Usage

```
npm install -g dat-daemon
# or if you want websockets instead of tcp:
npm install -g dat-daemon-ws

datdaemond &
datdaemon add dat://peer-to-peer-web.com/ peer-to-peer-web
```

You can daemonize the `datdaemond` with [pm2](https://github.com/Unitech/pm2):

```
pm2 start datdaemond
```

Or [lil-pids](https://github.com/mafintosh/lil-pids):

```
lil-pids ./services
```

Where services contains:

```
datdaemond
```

## CLI

/!\ This is a very basic command line utility to interact with the daemon. It's not meant to replace [dat](http://github.com/datproject/dat) CLI but is only a way to interact with the daemon through TCP.

```
Usage: datdaemon [action] [key] [path] [options]

Where "action" one of: add, remove, start, pause, statistics, list
With dat "options":
--sparse (false)
--upload (true)
--download (true)
--port=1234
--utp (true)
--tcp (true)
--importFiles (false)

The "key" is a dat resolvable key.

The "path" is the location of the given dat. If not provided it'll default to the "key".

Examples:

# Starts to share the peer-to-peer-web website
datdaemon add dat://peer-to-peer-web.com/ peer-to-peer-web
> 38bd32e351630dcb179ee52752d0312ccc6fe95e3ec35c1c9ba7d4d7f15276fe added.

datdaemon statistics dat://peer-to-peer-web.com/
> V-1301 | 234 files (1.2 GB)
> 8 / 8 Peers
> 0 B Upload 0 B Download

datdaemon list
> 38bd32e351630dcb179ee52752d0312ccc6fe95e3ec35c1c9ba7d4d7f15276fe peer-to-peer-web

datdaemon remove dat://peer-to-peer-web.com/
> 38bd32e351630dcb179ee52752d0312ccc6fe95e3ec35c1c9ba7d4d7f15276fe removed.
```

## Configuration

Configuration location: `~/.config/dat-daemon/config.json`:

```json
{
  "data": "~/.config/dat-daemon",
  "port": 8477, // used for http or websockets
  "http": false, // Experimental http layer instead of tcp
  "database": "database", // name of the level database
  "socket": "datdaemon.sock" // name of the socket
}
```

Everything will be stored in `data`. If you don't specify a path when adding a dat it'll be downloaded there too.

The configuration directory can be overwritten with the env variable `DATDAEMON_CONFIG`.

## Client

You can build your own tcp client to communicate with the daemon, the included command line tool is only an example.
The client should:

- send protobuf Instruction buffers
- receive protobuf Answer

See [daemon.proto](https://github.com/soyuka/dat-daemon/blob/master/packages/protocol/daemon.proto) file.

When the Client tries to add an existing key, it should exit the program with a code 2.

### Example

Here is an example client that connects to the `dat-daemon-ws` and executes an ADD instruction (assuming the port is 8477):

```javascript
var {Instruction, Answer} = require('dat-daemon-protocol')
var socket = new WebSocket('ws://localhost:8477')

socket.on('message', function (message) {
  message = Answer.decode(message)
  if (message.failure) {
    console.error(message.message)
    process.exit(message.failure)
  }

  console.log(message.message)
  process.exit(0)
})

socket.on('open', async function () {
  socket.send(Instruction.encode({
    action: Instruction.Action.ADD,
    key: 'somedatkey',
    path: 'dir',
    options: {importFiles: true}
  }))
})
```

You can also check simple CLI examples [on WebSockets](https://github.com/soyuka/dat-daemon/blob/master/packages/ws/cli.js) or [on tcp](https://github.com/soyuka/dat-daemon/blob/master/packages/tcp/bin/cli.js)
