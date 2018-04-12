var Client = require('./')

async function main() {
  const client = await Client()
  const list = await client.list()
  console.log(list)
}

main()
