import ora from 'ora';
import path from 'path';
import * as fs from 'fs';
import { fun, log } from '../index.js';

/**
 * Genereates sass templates
 * @returns
 */
export function sass() {
  const tempPath = path.resolve('../sample/sass-one');
  const tempFile = fs.readdirSync(tempPath);
  const output = 'sass';
  if (fs.existsSync(output)) {
    return log.error(`"${output}" has been exist.`);
  }

  fun.createDirectory(output);

  const spinner = ora('process...').start();
  tempFile.forEach((file, i) => {
    setTimeout(() => {
      const originPath = path.join(tempPath, file);

      if (fs.statSync(originPath).isFile()) {
        const content = fs.readFileSync(originPath);

        fs.writeFileSync(path.join(output, file), content);
        spinner.text = 'genreate: ' + file;
      }

      if (i === tempFile.length - 1) {
        spinner.stop();
        log.done('All has been generates succcessfully.');
      }
    }, i * 200);
  });
}

/**
 * Trim \n charachter and generate cleared file
 * @param {string} filePath target file path
 * @returns
 */
export function trim(filePath) {
  const emptyLineIndexes = [];
  const sliceStartIndexes = [];
  const trimmedLines = [];

  if (!fs.existsSync(filePath)) {
    return log.error(filePath + " file doesn't exist.");
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const lines = fileContent.split('\n');

  // searching index empty line
  lines.forEach((line, i) => {
    if (line === '' && line.length === 0) {
      sliceStartIndexes.push(i);
      emptyLineIndexes.push(i);
    }
  });

  const newStart = [0, ...sliceStartIndexes];
  const newEmpty = [...emptyLineIndexes, lines.length];

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
    trimmedLines.push(sliced);
  });

  // save into new txt fie
  const content = trimmedLines.join('\n\n');
  const fileName = path.parse(filePath);
  const saveFile = '__' + fileName.name + '.md';

  fun.createFile(saveFile, content);
}
