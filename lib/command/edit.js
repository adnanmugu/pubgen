import * as fs from 'fs';
import * as path from 'path';
import { log, opf } from '../index.js';

export function setOpf(projectPath, metadata) {
  const defaultData = {
    title: 'Title',
    author: 'Unknown',
    contributor: '',
    publisher: '',
    rights: '',
    subject: '',
    description: '',
    isbn: '',
  };

  if (metadata === undefined) {
    metadata = defaultData;
  }

  const result = opf.setPackage(projectPath, metadata);
  return result;
}

export function updateOpf() {}
export function updateMetaSpine() {}

export function trim(filePath) {
  const emptyLines = [];
  const starts = [];
  const result = [];

  if (!fs.existsSync(filePath)) {
    return log.error(filePath + " file doesn't exist.");
  }

  const texts = fs.readFileSync(filePath, 'utf-8');
  const lines = texts.split('\n');

  // Search index empty lines
  lines.forEach((line, i) => {
    if (line === '' && line.length === 0) {
      starts.push(i);
      emptyLines.push(i);
    }
  });

  const newStart = [0, ...starts];
  const newEmpty = [...emptyLines, lines.length];

  // Looping for sliced an array
  // prev for store previous value
  let prev = 0;
  newEmpty.forEach((line, i) => {
    if (line === 1) {
      newStart[i] = 0;
    } else {
      newStart[i] + 1;
    }

    let start = newStart[i];
    let length = prev + line;

    let sliced = lines.slice(start, length).join(' ');
    result.push(sliced);
  });

  // save into new txt fie
  const contents = result.join('\n\n');
  const fileName = path.parse(filePath);
  const saveFile = '__' + fileName.name + '.md';

  fs.writeFile(saveFile, contents, function (err) {
    if (err) {
      log.error(err);
    } else {
      log.done(saveFile + ' has be done.');
    }
  });
}
