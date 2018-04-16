const gui = require('gui')
const Logger = require('relieve-logger')
const Worker = require('relieve/workers/Worker')
const Task = require('relieve/tasks/ScriptTask')
const config = require('dat-daemon-server/lib/config')()

async function main () {
  const icon = gui.Image.createFromPath(`${__dirname}/dat-hexagon.png`)
  const tray = gui.Tray.createWithImage(icon)

  const daemonLogger = new Logger(`${config.logs}/daemon.log`, `${config.logs}/daemon.err.log`, {delay: '1d'})
  const daemon = new Task(require.resolve('dat-daemon-server/bin.js'), {
    interfaces: [daemonLogger],
    name: 'dat-daemon'
  })
  daemon.on('exit', reload)
  await daemon.start()

  const gatewayLogger = new Logger(`${config.logs}/gateway.log`, `${config.logs}/gateway.err.log`, {delay: '1d'})
  const gateway = new Task(require.resolve('dat-daemon-http-gateway/bin.js'), {
    interfaces: [gatewayLogger],
    name: 'dat-daemon'
  })
  gateway.on('exit', reload)
  await gateway.start()
  reload()

  function reload () {
    tray.setMenu(getMenu())
  }

  async function toggle (task) {
    if (task.running) {
      await task.kill()
    } else {
      await task.start()
    }

    reload()
  }

  function getMenu () {
    return gui.Menu.create([
      {
        label: `Dat daemon ${daemon.running ? `ws://${config.host}:${config.port}` : 'not running'}`,
        submenu: [
          {
            label: daemon.running ? 'Stop' : 'Start',
            checked: daemon.running,
            type: 'checkbox',
            onClick: () => toggle(daemon)
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
        label: `Http gateway ${gateway.running ? `http://${config.gateway.host}:${config.gateway.port}` : 'not running'}`,
        submenu: [
          {
            label: 'Start',
            type: 'checkbox',
            checked: gateway.running,
            onClick: () => toggle(gateway),
          }
        ],
      },
      {
        label: `Config: ${config.CONFIG_PATH}`
      }
    ])
  }
}

main()
