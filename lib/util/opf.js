import path from 'path';
import * as log from '#util/logger.js';
import * as cheerio from 'cheerio';
import * as uuid from 'uuid';
import * as fs from 'fs';
import { getFiles, unlisted } from './function.js';

const { print } = log;

/**
 * Get package.opf file if exist
 * @param {string} rootdir root project directory path
 * @returns
 */
export function getPackage(rootdir) {
  const fileopf = path.join(rootdir, '/OEBPS/package.opf');

  if (!fs.existsSync(fileopf)) {
    return print.warn('Pleasa change dir to base project.');
  }

  const file = fs.readFileSync(fileopf, 'utf-8');
  return cheerio.load(file, { xmlMode: true, xml: true });
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
    if (metadata[key] !== '') {
      if (key === 'isbn') {
        result.push(`<dc:identifier>urn:isbn:${metadata[key]}</dc:identifier>`);
      } else if (key === 'rights') {
        result.push(`<dc:${key}>Copyright © ${metadata[key]}</dc:${key}>`);
      } else {
        result.push(`<dc:${key}>${metadata[key]}</dc:${key}>`);
      }
    }
  });

  result.push(`<dc:identifier id="BookId">urn:uuid:${serial}</dc:identifier>`);
  result.push(`<dc:language>en</dc:language>`);

  return $('metadata').append(result.join('\n'));
}

/**
 * Generates manifest itemtag
 * @param {string} $ cheerio documentt
 * @param {Array} data files array
 * @returns
 */
function setManifest($, data) {
  const result = [];

  const itemTag = (file) => {
    const extension = path.extname(file);
    const id = path.parse(file);

    if (path.basename(file, '.xhtml') === 'NAV') {
      return (
        `id="${id.name}" href="public/${file}" ` +
        'media-type="application/xhtml+xml" propertieis="nav"'
      );
    }

    if (path.basename(file, '.jpg') === 'cover') {
      return (
        `id="${id.name}" href="src/img/${file}" ` +
        'media-type="application/xhtml+xml" propertieis="cover-image"'
      );
    }

    switch (extension) {
      case '.css':
        return `id="${id.name}" href="src/css/${file}" media-type="text/css"`;
      case '.js':
        return `id="${id.name}" href="src/js/${file}" media-type="text/js"`;
      case '.jpg':
        return `id="${id.name}" href="src/img/${file}" media-type="image/jpeg"`;
      case '.png':
        return `id="${id.name}" href="src/img/${file}" media-type="image/png"`;
      case '.svg':
        return `id="${id.name}" href="src/img/${file}" media-type="image/svg+xml"`;
      case '.gif':
        return `id="${id.name}" href="src/img/${file}" media-type="image/gif"`;
      default:
        return (
          `id="${id.name}" href="public/${file}" ` +
          'media-type="application/xhtml+xml"'
        );
    }
  };

  data.forEach((file) => {
    const properties = itemTag(file);
    result.push(`<item ${properties} />`);
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
    const base = path.parse(file);

    if (base.name === 'NAV') {
      result.push(`<itemref idref="${base.name}" linear="no"/>`);
    }
    result.push(`<itemref idref="${base.name}"/>`);
  });

  return $('spine').append(result.join('\n'));
}

/**
 * Set package.opf
 * @param {string} rootdir root project directory path
 * @param {object} metadata metadata
 * @returns
 */
export function setPackage(rootdir, metadata) {
  const output = path.join(rootdir, 'OEBPS/package.opf');
  const $ = getPackage(rootdir);

  setMetadata($, metadata);
  const data = $.html();
  fs.writeFileSync(output, data);
  return;
}

/**
 * Set package.opf
 * @param {string} rootdir root project directory path
 * @param {object} metadata metadata
 * @returns
 */
export function updatePackage(rootdir, metadata) {
  const $ = getPackage(rootdir);
  const files = getFiles(rootdir);

  setMetadata($, metadata);
  setManifest($, files);
  setSpine($, files);

  return $.html();
}

/**
 * Sycncronize manifest & spine tag
 * @param {string} rootdir root project directory path
 * @returns
 */
export function updateManifestSpine(rootdir) {
  const output = path.join(rootdir, '/OEBPS/package.opf');
  const $ = getPackage(rootdir);
  const manifestItems = [];
  const spineItems = [];

  $('item').each(function () {
    manifestItems.push($(this).attr('id'));
  });

  $('itemref').each(function () {
    spineItems.push($(this).attr('idref'));
  });

  const files = getFiles(rootdir);
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
