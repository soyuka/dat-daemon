#!/usr/bin/env node
const program = require('commander')

program
  .version(require('./package.json').version)
  .description('Dat daemon command line interface')
  .command('add [path] <key>', 'Adds an element').alias('a')
  .command('remove [key]', 'Removes an element').alias('rm')
  .command('info [key]', 'Informations about an element')
  .command('list', 'Output list').alias('l')
  .parse(process.argv)

if (!process.argv.slice(2).length) {
  program.outputHelp()
}
