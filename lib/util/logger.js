import chalk from 'chalk';

// text color
export const yellow = chalk.yellowBright;
export const red = chalk.redBright;
export const blue = chalk.blueBright;
export const green = chalk.green;

// textbold
export const _yellow = chalk.yellowBright.bold;
export const _red = chalk.redBright.bold;
export const _blue = chalk.blueBright.bold;
export const _green = chalk.green.bold;

// background block
export const _yellow_ = chalk.yellowBright;
export const _red_ = chalk.bgRedBright;
export const _blue_ = chalk.bgBlueBright;
export const _green_ = chalk.bgGreen;

// alert
export const warn = chalk.bold.yellowBright('warning : ');
export const error = chalk.bold.redBright('error : ');
export const info = chalk.bold.blueBright('info : ');
export const succed = chalk.bold.green('succed : ');

export const clear = chalk.reset;

export const text = {
  warn(message) {
    return `${warn}${yellow(message)}`;
  },
  error(message) {
    return `${error}${red(message)}`;
  },
  info(message) {
    return `${info}${blue(message)}`;
  },
  succed(message) {
    return `${succed}${green(message)}`;
  },
};

export const print = {
  warn(message) {
    return console.log(`${warn}${yellow(message)}`);
  },
  error(message) {
    return console.log(`${error}${red(message)}`);
  },
  info(message) {
    return console.log(`${info}${blue(message)}`);
  },
  succed(message) {
    return console.log(`${succed}${green(message)}`);
  },
};

export function banner() {
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

  const setLink = (text, url) => {
    const ESC = '\u001b';
    const OSC = `${ESC}]`;
    const BEL = '\u0007';

    const link = `${OSC}8;;${url}${BEL}${text}${OSC}8;;${BEL}`;

    return chalk.blue(link);
  };

  const replacements = [
    { key: /\[PEPUB\]/, value: chalk.blue('[PEPUB]') },
    { key: /\+/, value: chalk.yellow('+') },
    { key: '▶', value: chalk.green('▶') },
    { key: '│', value: chalk.red('│') },
    { key: '─', value: chalk.red('─') },
    { key: '╭', value: chalk.red('╭') },
    { key: '╰', value: chalk.red('╰') },
    { key: '╮', value: chalk.red('╮') },
    { key: '╯', value: chalk.red('╯') },
    { key: '┬', value: chalk.red('┬') },
    { key: '┴', value: chalk.red('┴') },
    { key: '├', value: chalk.red('├') },
    { key: '▓', value: chalk.red('▓') },
    { key: '░', value: chalk.red('░') },
    { key: link, value: setLink(link, url) },
  ];

  let modified = helpImg.join('\n');
  replacements.forEach((rep) => {
    modified = modified.replace(new RegExp(rep.key, 'g'), rep.value);
  });

  return modified;
}
