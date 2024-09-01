/* eslint-disable @typescript-eslint/explicit-function-return-type */
import fs from 'node:fs/promises';
import path from 'node:path';
import url from 'node:url';
import { spawn } from 'node:child_process';
import builder from 'electron-builder';
import { config } from 'dotenv';

config();

/**
 * exec and inherit stdio
 * @param {string} command
 * @param {string[]} args
 * @param {import('child_process').SpawnOptionsWithoutStdio} options
 */
const exec = (command, args, options) => {
  return new Promise((resolve, reject) => {
    // Need to do some weirdness to get `npx` to execute on windows. First we
    // set `shell` to `true`, and also we change `npx` to `cmd.npx`.
    const _command = command === 'npx' && process.platform === 'win32' ? 'npx.cmd' : command
    const child = spawn(_command, args, { stdio: 'inherit', shell: true, ...options });

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });
  });
};

/**
 * Remove the devtools script tag from the index.html file
 */
export const removeDevtools = async () => {
  const __filename = url.fileURLToPath(import.meta.url);
  const __project = path.join(__filename, '../..');
  const __index = path.join(__project, 'index.html');

  const file = await fs.readFile(__index, 'utf-8');
  const lines = file.split('\n');

  // Find the index of the line that includes the devtools script tag
  const index = lines.findIndex((line) =>
    line.includes('<script src="http://localhost:8098"></script>'),
  );

  if (index > -1) {
    lines.splice(index, 1);
  }

  await fs.writeFile(__index, lines.join('\n'));
};

const build = async ({ publish = false }) => {
  //
  // Env validation
  //
  if (process.platform === 'darwin' && (!process.env.CSC_LINK || !process.env.CSC_KEY_PASSWORD)) {
    throw Error('Missing code signing env variable(s)');
  }

  if (
    publish &&
    process.platform === 'darwin' &&
    (!process.env.GITHUB_TOKEN ||
      !process.env.APPLE_ID ||
      !process.env.APPLE_APP_SPECIFIC_PASSWORD ||
      !process.env.APPLE_TEAM_ID)
  ) {
    throw Error('Missing notarizing env variable(s)');
  }

  await removeDevtools();
  await exec('npx', ['vue-tsc', '--noEmit']);
  await exec('npx', ['vite', 'build']);

  /**
   * @type {import('electron-builder').Configuration}
   * @see https://www.electron.build/configuration/configuration
   */
  const config = {
    appId: 'com.bucket-browser.app',
    asar: true,
    productName: 'Bucket Browser',
    directories: {
      output: 'release/${version}',
    },
    files: ['dist', 'dist-electron'],
    mac: {
      target: {
        target: 'dmg',
        arch: ['x64', 'arm64'],
      },
      artifactName: 'bucket-browser-macOS-${arch}-${version}.${ext}',
      notarize: publish ? { teamId: process.env.APPLE_TEAM_ID } : false,
    },
    win: {
      target: [
        {
          target: 'nsis',
          arch: ['x64'],
        },
      ],
      artifactName: 'bucket-browser-windows-${arch}-${version}.${ext}',
    },
    nsis: {
      oneClick: false,
      perMachine: false,
      allowToChangeInstallationDirectory: true,
      deleteAppDataOnUninstall: false,
    },
    linux: {
      target: ['AppImage'],
      artifactName: 'bucket-browser-linux-${arch}-${version}.${ext}',
    },
    publish: {
      provider: 'github',
    },
  };

  await builder.build({
    config,
    publish: publish ? 'always' : 'never',
  });
};

//
// Main
//
if (process.argv.includes('--build')) {
  await build({ publish: process.argv.includes('--publish') });
}
