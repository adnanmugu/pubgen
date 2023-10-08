import path from 'path';
import log from './log.js';

function container() {
  const document = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<container version="1.0"',
    'xmlns="urn:oasis:names:tc:opendocument:xmlns:container">',
    '<rootfiles>',
    '<rootfile full-path="OEBPS/package.opf" media-type="application/',
    'oebps-package+xml"/>',
    '</rootfiles>',
    '</container>',
  ];

  return document.join('\n');
}

function packageOpf() {
  const document = [
    '<?xml version="1.0" encoding="utf-8"?>',
    '<package version="3.0" unique-identifier="BookId"',
    'xmlns="http://www.idpf.org/2007/opf">',
    '<metadata xmlns:dc="http://purl.org/dc/elements/1.1/"',
    'xmlns:opf="http://www.idpf.org/2007/opf">',
    '</metadata>',
    '<manifest>',
    '</manifest>',
    '<spine>',
    '</spine>',
    '</package>',
  ];

  return document.join('\n');
}

function nav() {
  const document = [
    '<?xml version="1.0" encoding="utf-8"?>',
    '<!DOCTYPE html>',
    '<html xmlns="http://www.w3.org/1999/xhtml"',
    'xmlns:epub="http://www.idpf.org/2007/ops"',
    'lang="en" xml:lang="en">',
    '<head>',
    '<title>ePub NAV</title>',
    '<meta charset="utf-8" />',
    '<link rel="stylesheet" href="_res/css/main.css" />',
    '</head>',
    '<body epub:type="frontmatter" lang="en">',
    '<nav epub:type="toc" id="toc" role="doc-toc">',
    '<h1>Table of Contents</h1>',
    '<ol><li>',
    '<a href="Section0001.xhtml">Start</a>',
    '</li></ol>',
    '</nav>',
    '<nav epub:type="landmarks" id="landmarks" hidden="">',
    '<h2>Landmarks</h2>',
    '<ol><li>',
    '<a epub:type="toc" href="#toc">Table of Contents</a>',
    '</li></ol>',
    '</nav>',
    '</body>',
    '</html>',
  ];

  return document.join('\n');
}

function section() {
  const document = [
    '<?xml version="1.0" encoding="utf-8"?>',
    '<!DOCTYPE html>',
    '<html xmlns="http://www.w3.org/1999/xhtml" ',
    'xmlns:epub="http://www.idpf.org/2007/ops" >',
    '<head>',
    '<link rel="stylesheet" href="_res/css/main.css" />',
    '<title></title>',
    '</head>',
    '<body lang="en"></body>',
    '</html>',
  ];

  return document.join('\n');
}

const defaultMeta = {
  title: 'Title',
  author: 'Unknown',
  contributor: '',
  publisher: '',
  rights: '',
  subject: '',
  description: '',
  isbn: '',
};

const metaRequest = [
  {
    type: 'input',
    name: 'title',
    default: path.basename(process.cwd()),
    message: log.clear('title:'),
    prefix: '',
  },
  {
    type: 'input',
    name: 'author',
    message: log.clear('author:'),
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

const metaConfirm = {
  type: 'confirm',
  name: 'confirm',
  message: 'is OK ?',
  prefix: '',
};

const templateDir = [
  'META-INF',
  'OEBPS',
  'OEBPS/public',
  'OEBPS/src',
  'OEBPS/src/img',
  'OEBPS/src/font',
  'OEBPS/src/css',
];

const templateFile = [
  {
    name: 'mimetype',
    path: '',
    content: 'application/epub+zip',
  },
  {
    name: 'container.xml',
    path: 'META-INF/',
    content: container(),
  },
  {
    name: 'package.opf',
    path: 'OEBPS/',
    content: packageOpf(),
  },
  {
    name: 'nav.xhtml',
    path: 'OEBPS/public/',
    content: nav(),
  },
  {
    name: 'sec_0001.xhtml',
    path: 'OEBPS/public/',
    content: section(),
  },
  {
    name: 'main.css',
    path: 'OEBPS/src/css',
    content: '',
  },
];

const template = {
  mimetype: 'application',
  container: container(),
  package: packageOpf(),
  navbar: nav(),
  section: section(),
  defaultMeta: defaultMeta,
  metaConfirm: metaConfirm,
  metaRequest: metaRequest,
  templateDir: templateDir,
  templateFile: templateFile,
};

export default template;
