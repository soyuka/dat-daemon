class List {
  constructor(db, multidat) {
    this.DATABASE_KEY = 'links'
    this.db = db
    this.multidat = multidat
  }

  async share (directory) {
    const {dat, duplicate} = await this.multidat.createAsync(directory, {watch: true, resume: true})

    this.key = dat.key.toString('hex')

    if (!dat.writable) {
      throw new Error('List is not writable!')
    }

    if (duplicate === true) {
      return
    }

    dat.importFiles({watch: true})
    dat.joinNetwork()

    await this.save()

    return Promise.resolve(dat)
  }

  get list() {
    return this.multidat.list()
      .filter((e) => {
        if (e instanceof Error) {
          console.error('Error in dat list:', e.message)

          return false
        }

        return true
      })
      .map((e) => e.key.toString('hex'))
      .filter(e => e !== this.key)
  }

  async save () {
    return new Promise((resolve, reject) => {
      this.db.write(
        this.DATABASE_KEY,
        this.list,
        function(err) {
          if (err) {
            reject(err)
            return
          }

          resolve()
        }
      )
    })
  }
}

module.exports = List
