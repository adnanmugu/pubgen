import path from 'path';

export * as book from './command/book.js';
export { default as init } from './command/init.js';
export * as fun from './util/function.js';
export * as opf from './util/opf.js';
export { default as tem } from './util/template.js';
export { default as log } from './util/log.js';

export const __root = path.resolve('..');
