import fs from 'node:fs';
import path from 'node:path';

// For some reason, on mac we need to use console.log
// and on windows we need to use process.stdout.write

const { version } = JSON.parse(
  fs.readFileSync(path.resolve('package.json'), 'utf-8'),
);

const string = `APP_VERSION=${version}`

if (process.platform === 'win32') {
  process.stdout.write(string);
} else {
  console.log(string);
}
