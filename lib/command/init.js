import path from 'path';
import inquirer from 'inquirer';
import * as myfun from '#util/function.js';
import * as log from '#util/logger.js';
import * as fs from 'fs';
import { setPackage } from '#util/opf.js';
import __lib from '#lib/index.js';

const { print, text } = log;

/**
 * initilize asking user for metadata
 * @returns {object} metadata
 */
async function getMetadata() {
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
  console.log(description.join(''));

  const metarequest = [
    {
      type: 'input',
      name: 'title',
      default: path.basename(process.cwd()),
      message: log.clear('title:'),
      prefix: '',
    },
    {
      type: 'input',
      name: 'creator',
      message: log.clear('creator:'),
      prefix: '',
    },
    {
      type: 'input',
      name: 'contributor',
      message: log.clear('contributor:'),
      default: 'adnanmugu',
      prefix: '',
    },
    {
      type: 'input',
      name: 'publisher',
      message: log.clear('publisher:'),
      prefix: '',
    },
    {
      type: 'input',
      name: 'rights',
      message: log.clear('copyrights:'),
      prefix: '',
    },
    {
      type: 'input',
      name: 'subject',
      message: log.clear('subject:'),
      prefix: '',
    },
    {
      type: 'input',
      name: 'isbn',
      message: log.clear('isbn:'),
      prefix: '',
    },
    {
      type: 'input',
      name: 'description',
      message: log.clear('description:'),
      prefix: '',
    },
  ];

  // Request metadata from user
  const metadata = await inquirer.prompt(metarequest).then((data) => {
    console.log('\n', data, '\n');
    return data;
  });

  // Confirm metadata
  const isconfirm = await inquirer.prompt({
    type: 'confirm',
    name: 'confirm',
    message: 'is OK ?',
    prefix: '',
  });

  if (isconfirm.confirm) {
    return { status: true, meta: metadata };
  }

  return { status: false, meta: undefined };
}

/**
 * Generates template for .epub project directories
 * @param {object} metadata metadata for package.opf
 * @param {string} rootdir root directory name
 */
async function generateTemplate(metadata, rootdir) {
  const structure = [
    'META-INF',
    'OEBPS',
    'OEBPS/public',
    'OEBPS/src',
    'OEBPS/src/img',
    'OEBPS/src/font',
    'OEBPS/src/css',
  ];

  const outputfiles = [
    'mimetype',
    'META-INF/container.xml',
    'OEBPS/package.opf',
    'OEBPS/public/nav.xhtml',
    'OEBPS/public/S001.xhtml',
    'OEBPS/src/css/main.css',
  ];

  // create root project directory
  myfun.makeRootDir(rootdir);

  structure.forEach((dir) => {
    // set time out for ora spinner
    const originPath = path.join(rootdir, dir);

    const output = myfun.makeDir(originPath);
    print.succed(output.msg);
  });

  const samplePath = path.join(__lib, 'sample/epub-three');
  const sampleFile = fs.readdirSync(samplePath);

  // generates project content file
  outputfiles.forEach((file) => {
    const basename = path.basename(file);
    const targetPath = path.join(rootdir, file);

    if (sampleFile.includes(basename)) {
      const originPath = path.join(samplePath, basename);

      const output = myfun.makeFile(targetPath, originPath);
      print.succed(output.msg);
    }
  });

  // adding metadata
  setPackage(rootdir, metadata);
}

/**
 * Get user default options
 * @param {boolean} options boolean options default
 * @returns
 */
export default async function init(option) {
  const defaultmeta = {
    title: 'default',
    creator: 'unknown',
    contributor: 'adnanmugu',
    publisher: '',
    rights: '',
    subject: '',
    description: '',
    isbn: '',
  };

  // if options are not provided, fetch metadata & generate the template
  if (!option) {
    //requesting metadata from user
    const request = await getMetadata();
    if (!request.status) {
      return log.print.warn('Initilize has been canceled.');
    }

    const rootdir = myfun.getDirName(request.meta.title);
    generateTemplate(request.meta, rootdir);
    return;
  }

  // default metadata;
  generateTemplate(defaultmeta, defaultmeta.title);
}
