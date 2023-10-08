#! /usr/bin/env node

import { Command } from 'commander';
import { log, init, book, opf } from '../lib/index.js';

const program = new Command();

program
  .name('pub')
  .usage(log.helpCmd)
  .description(log.helpDescription())
  .addHelpCommand('help [cmd]', 'Display help for [command].')
  .configureHelp(log.helpConfig)
  .helpOption(false)
  .action(function (options) {
    options.help ? program.outputHelp() : console.log(log.header);
  });

program
  .command('init')
  .option('-y, --yes', 'Generates without any question.')
  .description('Generates .epub project template')
  .action(function (options) {
    options.yes && init(options.yes);
  });

program
  .command('book')
  .description('Generate .epub book asset.')
  .option('-d, --metadata', 'Update metadata.')
  .option('-u, --update <project directory>', 'Sync manifest and spine.')
  .option('-t, --trim <file>', 'Trim EOL or \\n character.')
  .option('-s, --sass', 'Generates sass template.')
  .action((options) => {
    options.sass && book.sass();
    options.trim && book.trim(options.trim);
    // options.metadata &&
    options.sync === '.'
      ? opf.updateMnifestSpine(process.cwd())
      : opf.updateMnifestSpine(options.sync);
  });

program.parse(process.argv);
