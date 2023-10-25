import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __lib = dirname(fileURLToPath(import.meta.url));
export default __lib;
