var hyperdrive = require('hyperdrive')
var archive = hyperdrive(webstorage('my-dataset'))
var raf = require('./random-access-messaging.js')

function webstorage() {
  return {
    metadata: function (name, opts) {
			// if (name === 'secret_key') return secretStorage(opts.secretDir)(path.join(dir, prefix + 'metadata.ogd'), {key: opts.key, discoveryKey: opts.discoveryKey})


    },
    content: function (name, opts, archive) {
      if (!archive) archive = opts
      if (name === 'data') return createStorage(archive, dir)
      return raf()
    }
  }
}
