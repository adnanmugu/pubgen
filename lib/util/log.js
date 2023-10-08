import chalk from 'chalk';

// text color
const normal = {
  amber: chalk.yellowBright,
  flame: chalk.redBright,
  azure: chalk.blueBright,
  grass: chalk.green,
};

// textbold
const bold = {
  amber: chalk.yellowBright.bold,
  flame: chalk.redBright.bold,
  azure: chalk.blueBright.bold,
  grass: chalk.green.bold,
};

// background block
const block = {
  amber: chalk.yellowBright,
  flame: chalk.bgRedBright,
  azure: chalk.bgBlueBright,
  grass: chalk.bgGreen,
};

// alert
const alert = {
  warn: chalk.bold.yellowBright('warning : '),
  error: chalk.bold.redBright('error : '),
  info: chalk.bold.blueBright('info : '),
  done: chalk.bold.green('succed : '),
};

const helpCmd = `[cmd]
       pub help [cmd]`;

const log = {
  helpCmd: helpCmd,
  header: header(),
  clear: chalk.reset,
  helpConfig: {
    sortSubcommands: true,
    subcommandTerm: (cmd) => normal.azure(cmd.name()),
    optionTerm: (opt) => normal.grass(opt.flags),
    argumentTerm: (arg) => normal.flame(arg.name()),
  },
  grass(msg) {
    console.log(normal.grass(msg));
  },
  azure(msg) {
    console.log(normal.azure(msg));
  },
  amber(msg) {
    console.log(normal.amber(msg));
  },
  flame(msg) {
    console.log(normal.flame(msg));
  },

  // bold
  grassB(msg) {
    console.log(bold.grass(msg));
  },
  azureB(msg) {
    console.log(bold.azure(msg));
  },
  amberB(msg) {
    console.log(bold.amber(msg));
  },
  flameB(msg) {
    console.log(bold.flame(msg));
  },

  // block
  grass_(msg) {
    console.log(block.grass(msg));
  },
  azure_(msg) {
    console.log(block.azure(msg));
  },
  amber_(msg) {
    console.log(block.amber(msg));
  },
  flame_(msg) {
    console.log(block.flame(msg));
  },

  // alert
  done(msg) {
    console.log(normal.grass(alert.done + msg));
  },
  info(msg) {
    console.log(normal.azure(alert.info + msg));
  },
  warn(msg) {
    console.log(normal.amber(alert.warn + msg));
  },
  error(msg) {
    console.log(normal.flame(alert.error + msg));
  },
  initDescription() {
    const doc = [
      'This tool guides you in creating a directory ',
      'structure for an epub project.',
      '\nIt focuses on the essential elements and ',
      'suggests reasonable defaults.\n',
      '',
      '\nRefer to `pub help init` for comprehensive ',
      'documentation on these fields',
      '\nand their specific purposes.\n',
      '',
      '\nPress ^C at any point to exit the process.',
    ];

    return console.log(doc.join(''));
  },
  helpDescription() {
    const doc = [
      'PUBGEN is CLI app for create an .epub book but use terminal,',
      'you can managing your metadata about that book, its provides',
      'the same functionality like app that use GUI.',
      '',
    ];
    return doc.join('\n');
  },
};

function header() {
  const link = 'github.com/adnanmugu';
  const url = 'https://github.com/adnanmugu';
  const helpImg = [
    ' ╭┬≈≈────╮    .    +                              ',
    '░├▓   🍁 │ *    ˆ  ▶ is a cli app for generates   ',
    '░├▓   ¨¨ │  .  *     .epub books templates.       ',
    '▓├▓   ˆ  │ +    .  ▶ code by adnanmugu.           ',
    '░├▓ * [PEPUB]      ▶ github.com/adnanmugu         ',
    ' ╰┴──────╯                                        ',
  ];
  const replacements = [
    { key: /\[PEPUB\]/, value: normal.azure('[PEPUB]') },
    { key: /\+/, value: normal.amber('+') },
    { key: '▶', value: normal.grass('▶') },
    { key: '│', value: normal.flame('│') },
    { key: '─', value: normal.flame('─') },
    { key: '╭', value: normal.flame('╭') },
    { key: '╰', value: normal.flame('╰') },
    { key: '╮', value: normal.flame('╮') },
    { key: '╯', value: normal.flame('╯') },
    { key: '┬', value: normal.flame('┬') },
    { key: '┴', value: normal.flame('┴') },
    { key: '├', value: normal.flame('├') },
    { key: '▓', value: normal.flame('▓') },
    { key: '░', value: normal.flame('░') },
    { key: link, value: setLink(link, url) },
  ];

  let modified = helpImg.join('\n');
  replacements.forEach((rep) => {
    modified = modified.replace(new RegExp(rep.key, 'g'), rep.value);
  });

  return modified;
}

function setLink(text, url) {
  const ESC = '\u001b';
  const OSC = `${ESC}]`;
  const BEL = '\u0007';

  const link = `${OSC}8;;${url}${BEL}${text}${OSC}8;;${BEL}`;

  return normal.azure(link);
}

export default log;
