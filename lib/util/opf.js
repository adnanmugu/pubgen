import path from 'path';
import * as fs from 'fs';
import * as uuid from 'uuid';
import * as cheerio from 'cheerio';
import { __root, log } from '../index.js';
import { getFiles, unlisted } from './function.js';

function getUuid() {
  const serial = uuid.v4();
  return `<dc:identifier>urn:uuid:${serial}</dc:identifier>`;
}

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

function getOpfFile(projectPath) {
  const opfPath = path.join(projectPath, '/OEBPS/package.opf');

  if (!fs.existsSync(opfPath)) {
    return log.warn('Pleasa change dir to base project.');
  }

  const file = fs.readFileSync(opfPath, 'utf-8');
  return cheerio.load(file, { xmlMode: true, xml: true });
}

function getItemRef(file) {
  if (path.basename(file) === 'nav.xhtml') {
    return `<itemref idref="${file}" linear="no" />`;
  }

  if (path.extname(file) === '.xhtml') {
    return `<itemref idref="${file}"/>`;
  }
}

function setMetadata($, metadata) {
  const result = [];

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

  result.push(getUuid());
  return $('metadata').append(result.join('\n'));
}

function setManifest($, data) {
  const result = [];

  data.forEach((file) => {
    result.push(getItemTag(file));
  });

  return $('manifest').append(result.join('\n'));
}

function setSpine($, data) {
  const result = [];

  data.forEach((file) => {
    result.push(getItemRef(file));
  });

  return $('spine').append(result.join('\n'));
}

export function setPackage(projectName, metadata) {
  const temp = path.join(__root, '/template/epub/OEBPS/package.opf');
  const file = fs.readFileSync(temp, 'utf-8');
  const data = getFiles(projectName);
  const $ = cheerio.load(file, { xmlMode: true, xml: true });

  setMetadata($, metadata);
  setManifest($, data);
  setSpine($, data);

  return $.html();
}

export function updateManifest(projectPath) {
  const $ = getOpfFile(projectPath);
  const itemManifest = [];

  $('item').each(function () {
    itemManifest.push($(this).attr('id'));
  });

  const newManifest = getFiles(projectPath);
  const itemsToAdd = unlisted(newManifest, itemManifest);

  setManifest($, itemsToAdd.opf);

  if (itemsToAdd.files.length !== 0) {
    itemsToAdd.files.forEach((item) => {
      log.warn(`Please add ${item} into your project.`);
    });
    return;
  }

  // fs.writeFileSync(opfPath, $.html());
  // return log.done(`${path.basename(opfPath)} manifest has been updated.`);
}

export function updateSpine(projectPath) {
  const $ = getOpfFile(projectPath);

  const itemSpines = [];
  $('itemref').each(function () {
    itemSpines.push($(this).attr('idref'));
  });

  const itemSpine = getFiles(projectPath);
  const itemsToAdd = unlisted(itemSpine, itemSpines);

  getItemRef($, itemsToAdd.opf);

  if (itemsToAdd.files.length !== 0) {
    itemsToAdd.files.forEach((item) => {
      log.warn(`Please add ${item}`);
    });
    return;
  }

  return $.html();
  // fs.writeFileSync(opfPath, $.html());
  // return log.done(`${path.basename(opfPath)} spine tag has been updated.`);
}
