#!/usr/bin/env node
import { program } from 'commander'
import updateNotifier from 'update-notifier'
import { readPackageUpSync } from 'read-pkg-up'

import { r } from './utils'
import { getBanner } from './utils/show-banner'

const pkg = readPackageUpSync({ cwd: r() })?.packageJson
const notifier = updateNotifier({
  pkg: { name: pkg!.name, version: pkg!.version },
})

const cli = program
  .version(pkg?.version || '', '-v, --version')
  .hook('preAction', () => {
    notifier.notify()
  })
  .addHelpText('beforeAll', () => `${getBanner()}\n`)

const commands = {
  create: async () => await import('./create').then((res) => res.create),
  list: async () => await import('./list').then((res) => res.list),
  add: async () => await import('./add').then((res) => res.add),
  prepack: async () => await import('./prepack').then((res) => res.prepack),
  whoami: async () => await import('./whoami').then((res) => res.whoami),
}

const handler = (cmdName: string) => {
  return async function (...args: any[]) {
    const cmd = await commands[cmdName]()
    await cmd(...args)
  }
}

cli
  .command('create [alias] [project]')
  .description('Generate a new project from a neo template')
  .alias('c')
  .option('--store-dir [storeDir]', 'Set store dir')
  .option('-ps, --preset [presets...]', 'Create templates filtered by presets')
  .option('--latest', 'Create project from remote latest template', false)
  .action(handler('create'))

cli
  .command('list')
  .description('List all templates')
  .alias('l')
  .option('--store-dir [storeDir]', 'Set store dir')
  .option('-ps, --preset [presets...]', 'List templates filtered by presets')
  .action(handler('list'))

cli.command('whoami').alias('me').description('Who is neo?').action(handler('whoami'))

cli
  .command('prepack')
  .alias('p')
  .description('Prepack neo ci, lint, husky, etc.. to your project')
  .option('-m, --module [modules...]', 'Prepack partial of ci, lint, husky, etc... to your project')
  .action(handler('prepack'))

cli
  .command('add [alias]')
  .description('Load template or preset into the `.neo-store`')
  .option('--store-dir [storeDir]', 'Set store dir')
  .option('--preset', 'If true, load `alias` as preset')
  .action(handler('add'))

program.parse(process.argv)
