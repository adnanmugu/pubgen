import * as fs from 'fs';
import { fun, log, __root } from '../index.js';
import ora from 'ora';
import path from 'path';

/**
 * Generates sass template
 * @returns {void}
 */
export function sass() {
  const tempPath = path.join(__root, '/template/sass');
  const tempFile = fs.readdirSync(tempPath);
  const outputDir = './sass';
  const exist = fun.makeRootDir(outputDir);

  if (exist) {
    return;
  }

  const spinner = ora('process...').start();
  tempFile.forEach((file, i) => {
    setTimeout(() => {
      const originPath = path.join(tempPath, file);
      const stats = fs.statSync(originPath);

      if (stats.isFile()) {
        const writePath = path.join(outputDir, file);

        // Render template
        fun.renderTemplate(originPath, writePath);
        spinner.text = 'genreates : ' + file;
      }

      if (i === tempFile.length - 1) {
        spinner.stop();
        log.done('All has been generates succcessfully.');
      }
    }, i * 200);
  });
}
