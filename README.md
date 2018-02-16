# DatDaemon

Helps to share multiple dats.

## Why?

Let's say you have some spare bandwith and you want to help the dat community sharing their content:
- install
- start the daemon
- add some dats

## Usage

```
npm install -g dat-daemon
datdaemond &
datdaemon add dat://peer-to-peer-web.com/ peer-to-peer-web
```

You can daemonize the `datdaemond` with [lil-pids](https://github.com/mafintosh/lil-pids) or [pm2](https://github.com/Unitech/pm2):

```
pm2 start datdaemond
```

## CLI

```
Usage: datdaemon [action] [key] [directory]

Where "action" one of: add, remove, start, pause, statistics, list

The "key" is a dat resolvable key.

The "directory" is the location of the given dat. If not provided it'll default to the "key".

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
  "database": "database", // name of the level database
  "socket": "datdaemon.sock" // name of the socket
}
```

Everything will be stored in `data`. If you don't specify a directory when adding a dat it'll be downloaded there too.
