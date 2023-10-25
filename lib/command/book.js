import path from 'path';
import ora from 'ora';
import * as log from '#util/logger.js';
import * as myfun from '#util/function.js';
import * as fs from 'fs';
import __lib from '#lib/index.js';

const { print, text } = log;

/**
 * Genereates sass templates
 * @returns
 */
export function sass() {
  const samplePath = path.join(__lib, '/sample/sass-one');
  const sampleFile = fs.readdirSync(samplePath);
  const rootOuptut = 'sass';

  const rootdir = myfun.makeDir(rootOuptut);
  const spinner = ora('process...').start();

  // generates sample to target
  sampleFile.forEach((file, i) => {
    const originPath = path.join(samplePath, file);
    const targetPath = path.join(rootOuptut, file);
    const data = fs.readFileSync(originPath);

    setTimeout(() => {
      // generates scss file
      fs.writeFileSync(targetPath, data);
      spinner.text = text.succed(`"${file}" generated.`);

      i === sampleFile.length - 1 &&
        (spinner.stop(), print.succed(rootdir.msg));
    }, i * 250);
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
    return console.log(filePath + " file doesn't exist.");
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

  myfun.makeFile(saveFile, content);
}
