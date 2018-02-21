const {Instruction} = require('../protocol')

module.exports = help

function help () {
  console.log(`
Usage: datdaemon [action] [key] [directory]

Where "action" one of: ${Object.keys(Instruction.Action).map(e => e.toLowerCase()).join(', ')}

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
`)
}
