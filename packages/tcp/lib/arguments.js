const path = require('path')
const {Instruction} = require('dat-daemon-protocol')
const {datResolve} = require('./dat')

const Actions = Object.keys(Instruction.Action).map(e => e.toLowerCase())

/**
 * This function transforms a list of arguments (from the command line)
 * to an Instruction (see dat-daemon-protocol)
 *
 * @return Buffer
 */
async function getMessage (argv) {
  let action = argv._[0]

  if (!~Actions.indexOf(action)) {
    throw new Error(action ? `Action "${action}" is not valid.` : 'No action specified.')
  }

  action = Instruction.Action[action.toUpperCase()]

  let key
  let directory

  if (action !== Instruction.Action.LIST) {
    key = argv._[1]
    if (!key) {
      throw new Error('Key is required')
    } else {
      key = await datResolve(key)
    }

    if (argv._[2]) {
      directory = path.resolve(process.cwd(), argv._[2])
    }
  }

  return Instruction.encode({action, key, path: directory})
}

module.exports = getMessage
