import path from 'path';
import * as fs from 'fs';
import inquirer from 'inquirer';
import { log, fun, tem, opf } from '../index.js';

/**
 * initilize asking user for metadata
 * @returns {object} metadata
 */
async function getMetadata() {
  const request = tem.metaRequest;
  const confirm = tem.metaConfirm;
  log.initDescription();

  // Request metadata from user

  const metadata = await inquirer.prompt(request).then((data) => {
    console.log('\n', data, '\n');
    return data;
  });

  // Confirm metadata
  const OK = await inquirer.prompt(confirm);
  if (!OK.confirm) {
    log.warn('init has been canceled.');
    return false;
  }

  return metadata;
}

/**
 * Generates template for .epub project directories
 * @param {object} metadata metadata for package.opf
 * @param {string} directoryName root directory name
 */
function generateTemplate(metadata, directoryName = 'epub') {
  const packagePath = path.join(directoryName, 'OEBPS/package.opf');
  const templateDir = tem.templateDir;
  const templateFiles = tem.templateFile;

  fun.createDirectory(directoryName);
  templateDir.forEach((dir) => {
    fun.createDirectory(path.join(directoryName, dir));
  });

  templateFiles.forEach((file) => {
    const fullPath = path.join(directoryName, file.path, file.name);
    fun.createFile(fullPath, file.content);
  });

  // check if init default or not
  if (metadata !== undefined) {
    let content = opf.setPackage(directoryName, metadata);
    fs.writeFileSync(packagePath, content);
    return;
  }

  // updating package opf

  content = opf.setPackage(directoryName, tem.defaultMeta);
  fs.writeFileSync(packagePath, content);
}

/**
 * Get user default options
 * @param {boolean} options boolean options default
 * @returns
 */
export default async function init(options) {
  // if options are not provided, fetch metadata & generate the template
  if (options === undefined) {
    const metadata = await getMetadata();

    if (metadata) {
      generateTemplate(metadata, metadata.title);
      return;
    }
  }

  generateTemplate(undefined);
}
