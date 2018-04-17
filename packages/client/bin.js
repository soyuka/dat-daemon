var Client = require('./')

/**
 * TODO command line client
 */
async function main () {
  try {
    const client = await Client()
  } catch (err) {
    console.error('eerr', err)
  }
}

main()
