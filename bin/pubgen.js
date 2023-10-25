#! /usr/bin/env node

import { Command } from 'commander';
import init from '#command/init.js';
import * as book from '#command/book.js';
import * as log from '#util/logger.js';

const program = new Command();
const description = [
  'PUBGEN is CLI app for create an .epub book but use terminal,',
  'you can managing your metadata about that book, its provides',
  'the same functionality like app that use GUI.',
  '',
];

program
  .name('pub')
  .usage('[cmd] | pub help [cmd]')
  .description(description.join('\n'))
  .addHelpCommand('help [cmd]', 'Display help for [command].')
  .helpOption(false)
  .configureHelp({
    sortSubcommands: true,
    subcommandTerm: (cmd) => log.blue(cmd.name()),
    optionTerm: (opt) => log.green(opt.flags),
    argumentTerm: (arg) => log.red(arg.name()),
  })
  .action(function (options) {
    options.help ? program.outputHelp() : console.log(log.banner());
  });

program
  .command('init')
  .option('-y, --yes', 'Generates without any question.')
  .description('Generates .epub project template')
  .action(function (option) {
    init(option.yes);
  });

program
  .command('book')
  .description('Generate .epub book asset.')
  // .option('-d, --metadata', 'Update metadata.')
  .option('-u, --update <project directory>', 'Sync manifest and spine.')
  .option('-t, --trim <file>', 'Trim EOL or \\n character.')
  .option('-s, --sass', 'Generates sass template.')
  .action((options) => {
    options.sass && book.sass();
    options.trim && book.trim(options.trim);
    // options.metadata &&
    // options.update === '.'
    //   ? opf.updateMnifestSpine(process.cwd())
    //   : opf.updateMnifestSpine(options.update);
  });

program.parse(process.argv);
