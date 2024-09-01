import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

// For some reason, on mac we need to use console.log
// and on windows we need to use process.stdout.write

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const packageJson = path.join(__dirname, '..', 'package.json');

const { version } = JSON.parse(fs.readFileSync(packageJson, 'utf-8'));
const string = `APP_VERSION=${version}`;

if (process.platform === 'win32') {
  process.stdout.write(string);
} else {
  console.log(string);
}
