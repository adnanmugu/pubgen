#! /usr/bin/env node

import { Command } from 'commander';
import { log, init, book, edit } from '../lib/index.js';

const program = new Command();

program
  .name('pub')
  .description('These are pub command used in various situations.')
  .addHelpCommand('help [cmd]', 'Display help for [cmd]')
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
    options.yes ? init('yes') : init('man');
  });

program
  .command('edit')
  .description('Edit a package.opf file.')
  .option('-d, --metadata', 'Update metadata.')
  .option('-f, --manifest <dir>', 'Update manifest.')
  .option('-s, --spine <dir>', 'Update Spine.')
  .option('-t, --trim <file>', 'Trim EOL or \\n character.')
  .action((options) => {
    const projectName = process.cwd();
    options.manifest === '.' && edit.updateManifest(projectName);
    options.spine === '.' && edit.updateSpine(projectName);
    options.metadata && edit.updateManifest();
    options.trim && edit.trim(options.trim);
  });

program
  .command('book')
  .description('Generate .epub book asset.')
  .option('-p, --pakcage', 'Sync package.opf file.')
  .option('-c, --cover <file>', 'Add book cover.')
  .option('-s, --sass', 'Generates sass template.')
  .action((options) => {
    options.sass && book.sass();
  });

program.parse(process.argv);
