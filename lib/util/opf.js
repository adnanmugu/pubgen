import path from 'path';
import * as fs from 'fs';
import * as uuid from 'uuid';
import * as cheerio from 'cheerio';
import { __root, log } from '../index.js';
import { getFiles, unlisted } from './function.js';

/**
 * Get package.opf file if exist
 * @param {string} projectPath target project path
 * @returns package.opf file
 */
export function getPackage(projectPath) {
  const opfPath = path.join(projectPath, '/OEBPS/package.opf');

  if (!fs.existsSync(opfPath)) {
    return log.warn('Pleasa change dir to base project.');
  }

  const file = fs.readFileSync(opfPath, 'utf-8');
  return cheerio.load(file, { xmlMode: true, xml: true });
}

/**
 * Check itemtag and generates based on extension file
 * @param {string} file target file
 * @returns manifest itemtag
 */
function getItemTag(file) {
  const extension = path.extname(file);
  const id = `id="${file}" `;

  const href = (file) => {
    switch (extension) {
      case '.css':
        return `href="src/css/${file}"`;
      case '.jpg':
        return `href="src/img/${file}"`;
      case '.svg':
        return `href="src/img/${file}"`;
      default:
        return `href="public/${file}"`;
    }
  };

  const type = () => {
    switch (extension) {
      case '.css':
        return 'media-type="text/css"';
      case '.jpg':
        return 'media-type="image/jpeg"';
      case '.svg':
        return 'media-type="image/svg"';
      default:
        return 'media-type="application/xhtml+xml"';
    }
  };

  if (path.basename(file) === 'nav.xhtml') {
    return `<item ${id} ${href(file)} ${type()} properties="nav" />`;
  }

  return `<item ${id} ${href(file)} ${type()} />`;
}

/**
 * Generates metadata based on metadata param
 * @param {string} $ cheerio document
 * @param {object} metadata metadata object
 * @returns metadata result
 */
function setMetadata($, metadata) {
  const result = [];
  const serial = uuid.v4();

  Object.keys(metadata).forEach((key) => {
    let str;
    if (metadata[key] !== '') {
      if (key === 'isbn') {
        str = `<dc:identifier>urn:isbn:${metadata[key]}</dc:identifier>`;
        result.push(str);
      } else if (key === 'rights') {
        str = `<dc:${key}>Copyright © ${metadata[key]}</dc:${key}>`;
        result.push(str);
      } else {
        str = `<dc:${key}>${metadata[key]}</dc:${key}>`;
        result.push(str);
      }
    }
  });

  result.push(`<dc:identifier>urn:uuid:${serial}</dc:identifier>`);
  return $('metadata').append(result.join('\n'));
}

/**
 * Generates manifest itemtag
 * @param {string} $ cheerio documentt
 * @param {Array} data files array
 * @returns set manifest
 */
function setManifest($, data) {
  const result = [];

  data.forEach((file) => {
    result.push(getItemTag(file));
  });

  return $('manifest').append(result.join('\n'));
}

/**
 * Generates spine tag
 * @param {string} $ cheerio document
 * @param {Array} data array spine
 * @returns
 */
function setSpine($, data) {
  const result = [];

  data.forEach((file) => {
    if (path.basename(file) === 'nav.xhtml') {
      result.push(`<itemref idref="${file}" linear="no"/>`);
    } else if (path.extname(file) === '.xhtml') {
      result.push(`<itemref idref="${file}"/>`);
    }
  });

  return $('spine').append(result.join('\n'));
}

/**
 * Set package.opf
 * @param {string} projectDirectory Project directory name
 * @param {object} metadata metadata
 * @returns {string} xml document
 */
export function setPackage(projectDirectory, metadata) {
  const $ = getPackage(projectDirectory);
  const files = getFiles(projectDirectory);

  setMetadata($, metadata);
  setManifest($, files);
  setSpine($, files);

  return $.html();
}

/**
 * Sycncronize manifest & spine tag
 * @param {string} projectPath target project path
 * @returns
 */
export function updateMnifestSpine(projectPath) {
  const output = path.join(projectPath, '/OEBPS/package.opf');
  const manifestItems = [];
  const spineItems = [];
  const $ = getPackage(projectPath);

  $('item').each(function () {
    manifestItems.push($(this).attr('id'));
  });

  $('itemref').each(function () {
    spineItems.push($(this).attr('idref'));
  });

  const files = getFiles(projectPath);
  const appendManifest = unlisted(files, manifestItems);
  const appendSpine = unlisted(files, spineItems);

  setManifest($, appendManifest.opf);
  setSpine($, appendSpine.opf);

  fs.writeFileSync(output, $.html());
  log.done('"package.opf" has been updated.');

  if (appendManifest.files.length !== 0 || appendSpine.files.length !== 0) {
    appendManifest.files.forEach((item) => {
      log.warn(`Please add ${item} into your project.`);
    });
    appendSpine.files.forEach((item) => {
      log.warn(`Please add ${item} into your project.`);
    });
    return;
  }
}
