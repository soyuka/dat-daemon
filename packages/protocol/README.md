/**
 * Protocol buffers (https://github.com/mafintosh/protocol-buffers) for dat-daemon
 * Instruction to give to the daemon
 */
message Instruction {
  enum Action {
    ADD = 0;
    REMOVE = 1;
    START = 2;
    PAUSE = 3;
    STATISTICS = 4;
    LIST = 5;
  }

  required Action action = 1;
  optional string key = 2;
  optional string directory = 3;
}

/**
 * Answer given after processing an Instruction
 */
message Answer {
  required string message = 1;
  optional Statistics statistics = 2;
  optional bool failure = 3 [default = 0];
}

/**
 * When the Instruction was Statistics, you'll get this
 */
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

/**
 * Internal storage of the List in leveldb
 */
message Dat {
  required string key = 1;
  required string directory = 2;
}

message List {
  repeated Dat list = 1;
}
/**
 * Protocol buffers (https://github.com/mafintosh/protocol-buffers) for dat-daemon
 * Instruction to give to the daemon
 */
message Instruction {
  enum Action {
    ADD = 0;
    REMOVE = 1;
    START = 2;
    PAUSE = 3;
    STATISTICS = 4;
    LIST = 5;
  }

  required Action action = 1;
  optional string key = 2;
  optional string directory = 3;
}

/**
 * Answer given after processing an Instruction
 */
message Answer {
  required string message = 1;
  optional Statistics statistics = 2;
  optional bool failure = 3 [default = 0];
}

/**
 * When the Instruction was Statistics, you'll get this
 */
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

/**
 * Internal storage of the List in leveldb
 */
message Dat {
  required string key = 1;
  required string directory = 2;
}

message List {
  repeated Dat list = 1;
}
/**
 * Protocol buffers (https://github.com/mafintosh/protocol-buffers) for dat-daemon
 * Instruction to give to the daemon
 */
message Instruction {
  enum Action {
    ADD = 0;
    REMOVE = 1;
    START = 2;
    PAUSE = 3;
    STATISTICS = 4;
    LIST = 5;
  }

  required Action action = 1;
  optional string key = 2;
  optional string directory = 3;
}

/**
 * Answer given after processing an Instruction
 */
message Answer {
  required string message = 1;
  optional Statistics statistics = 2;
  optional bool failure = 3 [default = 0];
}

/**
 * When the Instruction was Statistics, you'll get this
 */
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

/**
 * Internal storage of the List in leveldb
 */
message Dat {
  required string key = 1;
  required string directory = 2;
}

message List {
  repeated Dat list = 1;
}
