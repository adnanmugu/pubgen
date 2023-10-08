import * as fs from 'fs';
import path from 'path';
import log from './log.js';

export function createRootDirectory(rootName) {
  const failed = rootName + ' directory exist';
  const succes = rootName + ' directory succesfuly generated.';

  if (fs.existsSync(rootName)) {
    log.error(failed);
    return true;
  }

  fs.mkdirSync(rootName);
  log.done(succes);
  return false;
}

export function readDirectoryRecursive(templatePath) {
  const files = fs.readdirSync(templatePath);
  const nestedFiles = [];

  for (const file of files) {
    const fullPath = path.join(templatePath, file);

    if (fs.statSync(fullPath).isDirectory()) {
      nestedFiles.push(...readDirectoryRecursive(fullPath));
    } else {
      nestedFiles.push(fullPath);
    }
  }

  return nestedFiles;
}

export function getDirName(dirName) {
  return dirName.split(' ').slice(0, 2).join('_');
}

export function renderTemplate(sourcePath, destinationPath) {
  const contents = fs.readFileSync(sourcePath, 'utf-8');
  fs.writeFileSync(destinationPath, contents, 'utf-8');
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

/**
 * create directory based on path
 * @param {string} directoryPath path or name
 * @returns {void}
 */
export function createDirectory(directoryPath) {
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath);
    return log.grass(`"${directoryPath}" succesfuly generated.`);
  }

  return log.error(`"${directoryPath}" has been exsist.`);
}

/**
 * Perform check file and write file
 * @param {string} filePath target file
 * @param {string} content content
 * @returns {:void}
 */
export function createFile(filePath, content) {
  // create file
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content);
    return log.grass(filePath + ' succesfuly generated.');
  }

  return log.error(filePath + ' file is exist.');
}
