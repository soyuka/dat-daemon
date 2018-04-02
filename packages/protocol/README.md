```
enum Subject {
  LIST = 0;
  ITEM = 1;
}

message Dat {
  required string key = 1;
  required string path = 2;
}

message List {
  repeated Dat list = 1;
}

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
