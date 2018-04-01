# RFC dat-daemon protocol

## Description

`dat-daemon` is a background running service that allows interactions with `dat` through a RPC protocol.
The RPC protocol is designed to work well on websockets (although it's main use will be locally). For example it can allow browser extensions to interact with local dats (filesystem access). It can also be used in CLI to maintain a list of dats.

## Capacities

### LIST

`dat-daemon` holds an in-memory list of dats. On a given `LIST` one must be able to:

- `ADD` add a dat to the list
- `REMOVE` remove a dat from a list (by key)
- `GET` get the list

### ITEM

Each dat in the list has an associated `ITEM`. Following actions are available on an `ITEM`:

- `START` start sharing
- `PAUSE` pause sharing
- `LOAD` known as `importFiles`
- `WATCH` watch files
- `MKDIR` creates a directory
- `READDIR` reads a directory
- `UNLINK` removes a file
- `INFO` peer informations and statistics

### WRITEFILE/READFILE

Reading/writing files works slightly differently and there is one connection per read/write. The `dat-daemon` will handle binary data through a given URL and close the connection when the data has been written.

### EVENTS

Some events are available same long polling connection basis:

- `NETWORK` live network statistics events (new peer)
- `FILES` live files events (new file, download/upload)

## Protocol

The RPC protocol is using protocol buffers.

### Messaging

```protobuf
enum Subject {
  LIST = 0;
  ITEM = 1;
}

message Dat {
  required string key = 1;
  required string path = 2;
}
```

#### Instruction

An instruction is sent from a client and interpreted by the `dat-daemon`.

```protobuf
message Instruction {
  enum Action {
    // List
    ADD = 0;
    REMOVE = 1;
    GET = 3;
    // Item
    START = 4;
    PAUSE = 5;
    LOAD = 6;
    WATCH = 7;
    MKDIR = 8;
    READDIR = 9;
    UNLINK = 10;
    INFO = 11;
    // FS
    WRITE = 12;
    READ = 13;
  }

  required int32 id = 1;
  required Action action = 2;
  required Subject subject = 3;
  optional string key = 4;
  optional string path = 5;
}
```

#### Answer

An answer is received by the client.

```protobuf
// not complete yet
message Statistics {
  required int64 files = 1;
  required int64 connected = 2;
  required int64 byteLength = 3;
  required int64 version = 4;
  required float downloadSpeed = 5;
  required float uploadSpeed = 6;
  required float totalPeers = 7;
  required float completePeers = 8;
}

message Answer {
  required int32 id = 1;
  required int32 failure = 2 [default = 0];
  required Subject subject = 3;
  optional Statistics statistics = 4;
  repeated Dat list = 5;
}
```

### Filesystem

The websocket connection endpoint to read/write files is of the type:

`ws://URL[:PORT]/KEY/ACTION/PATH`

Where:

- `URL[:PORT]` is the websocket url/port
- `KEY` is the dat key we want to read/write from/to
- `ACTION` is one of `write` / `read`
- `PATH` is the path we want to read/write from/to

An error is returned if:

- `KEY` is not in the list
- `ACTION` is not `write` nor `read`
- `PATH` does not exists when `ACTION` is `read`

