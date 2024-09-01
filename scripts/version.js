import fs from 'node:fs';
import path from 'node:path';

console.log(
  JSON.parse(fs.readFileSync(path.resolve('package.json'), 'utf-8')).version,
);
