const gui = require('gui')
var Worker = require('relieve/workers/Worker')
var Task = require('relieve/tasks/ScriptTask')

var daemon = new Task(require.resolve('dat-daemon-server/bin.js'))
var gateway = new Task(require.resolve('dat-daemon-http-gateway/bin.js'))

console.log(daemon)

const menu = gui.Menu.create([
  {
    label: `Dat daemon ${daemon.running ? 'ws://localhost:xxxx' : 'not running'}`,
    submenu: [
      {
        label: daemon.running ? 'Stop' : 'Start',
        checked: daemon.running,
        type: 'checkbox',
        onClick: () => {
          console.log(daemon)
          if (daemon.running) {
            daemon.start()
          } else {
            daemon.kill()
          }
          console.log('start')
        },
      },
      {
        label: 'Logs',
        onClick: () => {
          console.log('logs')
        }
      },
      {
        label: 'List',
        submenu: [
          {
            label: 'xxx'
          }
        ]
      }
    ],
  },
  {
    label: 'Http gateway not running',
    submenu: [
      {
        label: 'Start',
        type: 'checkbox',
        onClick: () => {
          console.log('start')
        },
      },
      {
        label: 'logs',
        onClick: () => {
          console.log('logs')
        }
      }
    ],
  },
])
const icon = gui.Image.createFromPath(`${__dirname}/dat-hexagon.png`)
const tray = gui.Tray.createWithImage(icon)
tray.setMenu(menu)

