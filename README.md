# DatDaemon

[![Build Status](https://travis-ci.org/soyuka/dat-daemon.svg?branch=master)](https://travis-ci.org/soyuka/dat-daemon)

This repository contains [dat](datproject.org) tools backed up by a WebSocket accessible [daemon](https://en.wikipedia.org/wiki/Daemon_(computing)).

## Why ?

By using a daemon for dat we can:
  - keep sharing data in background
  - have multiple tools (CLI, web, applications) share the same data
  - ease application development with a client that is available everywhere

RFC for the dat daemon protocol is available [here](./rfc.md)

## Quick start

```
npm install dat-daemon @dat-daemon/cli -g
datdaemond &
datdaemon list
datdaemon add ~/berlin-p2p 38bd32e351630dcb179ee52752d0312ccc6fe95e3ec35c1c9ba7d4d7f15276fe
```

## Installation

### Daemon

```
npm install dat-daemon -g
datdaemond &
```

### Cli

```
npm install @dat-daemon/cli -g
datdaemon --help
```

## Tools

### HTTP Gateway

```
npm install dat-daemon-http-gateway -g
datdaemonhttpd &
```

### Tray UI

> Add screenshot
> Build multi platform

### Javascript Client

> review the API so that it fits DatArchive!
> Document

## TODO

- fork `dat-desktop` and plug it on the daemon
- fork `dat-cli` and plug it on the daemon
