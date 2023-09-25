import * as fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';
import { setOpf } from './edit.js';
import { log, fun, inp, __root, tem } from '../index.js';

async function initializeData() {
  const description = [
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
  const cancelMsg = 'init has been canceled.';

  // get data from user for metadata package.opf
  console.log(description.join(' '));
  const initData = await inquirer.prompt(inp.init).then((data) => {
    console.log('\n', data, '\n');
    return data;
  });

  // confirm init data
  const OK = await inquirer.prompt(inp.confirm);
  if (!OK.confirm) {
    return log.warn(cancelMsg);
  }

  // generate root dir && get name for root
  return initData;
}

function generateTemplate(tempDefault, data) {
  const tempPath = path.join(__root, '/template/epub');
  let rootName = 'epub_default';

  if (tempDefault) {
    rootName = fun.getDirName(data.title);
  }

  fun.makeRootDir(rootName);

  const dirs = fun.readDirectoryRecursive(tempPath);
  dirs.forEach((dir) => {
    const relPath = path.relative(tempPath, dir);
    const outPath = path.join(rootName, relPath);
    const outFile = path.basename(relPath);

    fs.mkdirSync(path.dirname(outPath), { recursive: true });

    const extFile = path.extname(relPath);

    if (extFile !== '' || outFile === 'mimetype') {
      if (extFile !== '.opf') {
        const content = fs.readFileSync(dir, 'utf-8');
        fs.writeFileSync(outPath, content, 'utf-8');
      }
    }
  });

  const content = setOpf(rootName, data);
  fs.writeFileSync(path.join(rootName, '/OEBPS/package.opf'), content);
}

export default async function init(option) {
  let tempDefault = true;

  if (option === 'man') {
    const data = await initializeData();
    generateTemplate(tempDefault, data);
  }

  if (option === 'yes') {
    tempDefault = false;
    generateTemplate(tempDefault, undefined);
  }

  return;
}
