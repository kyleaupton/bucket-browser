/**
 * This script is used to get the version of the package.json file.
 * It is used in the build process, and it will append the version to the
 * GitHub Actions env file.
 */

import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

if (!process.env.GITHUB_ENV) {
  throw new Error('GITHUB_ENV not found');
}

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const packageJson = path.join(__dirname, '..', 'package.json');

const { version } = JSON.parse(fs.readFileSync(packageJson, 'utf-8'));
const envVar = `APP_VERSION=${version}`;

fs.appendFileSync(process.env.GITHUB_ENV, envVar);
