import log from './log.js';
import path from 'path';

export const init = [
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

export const confirm = {
  type: 'confirm',
  name: 'confirm',
  message: 'is OK ?',
  prefix: '',
};
