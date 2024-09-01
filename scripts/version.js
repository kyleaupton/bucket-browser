import fs from 'node:fs';
import path from 'node:path';

// For some reason, on mac we need to use console.log
// and on windows we need to use process.stdout.write

const fun = process.platform === 'win32' ? process.stdout.write : console.log;
fun(JSON.parse(fs.readFileSync(path.resolve('package.json'), 'utf-8')).version);
