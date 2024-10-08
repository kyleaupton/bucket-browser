import fs from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import alias from '@rollup/plugin-alias';
import electron from 'vite-plugin-electron/simple';
import tailwind from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import pkg from './package.json';

const _alias = alias({
  entries: [
    {
      find: '@main',
      replacement: path.resolve(__dirname, './electron/main'),
    },
    {
      find: '@preload',
      replacement: path.resolve(__dirname, './electron/preload'),
    },
    {
      find: '@shared',
      replacement: path.resolve(__dirname, './electron/shared'),
    },
  ],
});

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  fs.rmSync('dist-electron', { recursive: true, force: true });

  const isServe = command === 'serve';
  const isBuild = command === 'build';
  const sourcemap = isServe || !!process.env.VSCODE_DEBUG;

  return {
    css: {
      postcss: {
        plugins: [tailwind(), autoprefixer()],
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@main': path.resolve(__dirname, './electron/main'),
        '@preload': path.resolve(__dirname, './electron/preload'),
        '@shared': path.resolve(__dirname, './electron/shared'),
      },
    },
    plugins: [
      vue(),
      electron({
        main: {
          // Shortcut of `build.lib.entry`
          entry: 'electron/main/index.ts',
          onstart({ startup }) {
            if (process.env.VSCODE_DEBUG) {
              console.log(
                /* For `.vscode/.debug.script.mjs` */ '[startup] Electron App',
              );
            } else {
              startup();
            }
          },
          vite: {
            build: {
              target: 'esnext',
              sourcemap,
              minify: isBuild,
              outDir: 'dist-electron/main',
              rollupOptions: {
                plugins: [_alias],
                // Some third-party Node.js libraries may not be built correctly by Vite, especially `C/C++` addons,
                // we can use `external` to exclude them to ensure they work correctly.
                // Others need to put them in `dependencies` to ensure they are collected into `app.asar` after the app is built.
                // Of course, this is not absolute, just this way is relatively simple. :)
                external: Object.keys(
                  'dependencies' in pkg ? pkg.dependencies : {},
                ),
              },
            },
          },
        },
        preload: {
          // Shortcut of `build.rollupOptions.input`.
          // Preload scripts may contain Web assets, so use the `build.rollupOptions.input` instead `build.lib.entry`.
          input: 'electron/preload/index.ts',
          vite: {
            build: {
              target: 'esnext',
              sourcemap: sourcemap ? 'inline' : undefined, // #332
              minify: isBuild,
              outDir: 'dist-electron/preload',
              rollupOptions: {
                plugins: [_alias],
                external: Object.keys(
                  'dependencies' in pkg ? pkg.dependencies : {},
                ),
              },
            },
          },
        },
        // Ployfill the Electron and Node.js API for Renderer process.
        // If you want use Node.js in Renderer process, the `nodeIntegration` needs to be enabled in the Main process.
        // See 👉 https://github.com/electron-vite/vite-plugin-electron-renderer
        renderer: {},
      }),
    ],
    server:
      process.env.VSCODE_DEBUG &&
      (() => {
        const url = new URL(pkg.debug.env.VITE_DEV_SERVER_URL);
        return {
          host: url.hostname,
          port: +url.port,
        };
      })(),
    clearScreen: false,
  };
});
