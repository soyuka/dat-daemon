var Client = require('./')

async function main () {
  try {
    const client = await Client()
    // const list = await client.list()
    const a = await client.add('/home/abluchet/dat-photo-lib-temp', 'dat://f0abcd6b1c4fc524e2d48da043b3d8399b96d9374d6606fca51182ee230b6b59/')

    const i = await client.createReadStream(a.key, 'index.html')

    i.on('data', function(e) {
      console.log(e.toString())
    })

    // const a = await client.add('/home/abluchet/Downloads/dojoklub')
    // console.log(await client.readdir(a.key, ''))

  } catch (err) {
    console.error('eerr', err)
  }
}

main()
