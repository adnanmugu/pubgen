import * as fs from 'fs';
import * as log from '#util/logger.js';
import path from 'path';

const { print } = log;

/**
 * Make a root directory and console the status
 * @param {string} name target name directory
 * @returns
 */
export function makeRootDir(name) {
  const basename = path.basename(name);

  if (!fs.existsSync(name)) {
    fs.mkdirSync(name);
    return print.succed(`"${basename}/" generated.`);
  }
  return print.error(`"${basename}/" is exist.`);
}

/**
 * Make an directory and return object status
 * and string message
 * * @param {string} name name for target directory
 * @returns
 */
export function makeDir(name) {
  const basename = path.basename(name);

  if (!fs.existsSync(name)) {
    fs.mkdirSync(name);
    return { status: true, msg: `"${basename}/" generated.` };
  }
  return { status: false, msg: `"${basename}/" is exist.` };
}

/**
 * Create file
 * @param {string} samplePath content data path
 * @param {string} targetPath target path outputh
 * @returns
 */
export function makeFile(targetPath, samplePath) {
  const basename = path.basename(targetPath);

  if (!fs.existsSync(targetPath)) {
    const data = fs.readFileSync(samplePath, 'utf-8');
    fs.writeFileSync(targetPath, data);

    return { status: true, msg: `"${basename}" generated.` };
  }

  return { status: false, msg: `"${basename}" is exist.` };
}

/**
 * Limited word return only 2 word and add _
 * @param {string} name name for directory
 * @returns
 */
export function getDirName(name) {
  return name.split(' ').slice(0, 2).join('_');
}

export function unlisted(files, opf) {
  const result = { files: [], opf: [] };

  //   check missing package
  for (const item of files) {
    if (!opf.includes(item)) {
      result.opf.push(item);
    }
  }

  //   check missing files
  for (const item of opf) {
    if (!files.includes(item)) {
      result.files.push(item);
    }
  }

  return result;
}

export function getFiles(projectPath) {
  const tempPath = [
    'OEBPS/public/',
    'OEBPS/src/img/',
    'OEBPS/src/css/',
    'OEBPS/src/font',
  ];
  const oebdir = [];
  const exists = [];
  const result = [];

  tempPath.forEach((dir) => {
    oebdir.push(path.join(projectPath, dir));
  });

  oebdir.forEach((dir) => {
    if (fs.existsSync(dir)) {
      exists.push(dir);
    }
  });

  exists.forEach((dir) => {
    result.push(...fs.readdirSync(dir));
  });

  return result;
}
