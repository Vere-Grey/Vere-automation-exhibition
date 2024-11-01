import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import eslint from 'vite-plugin-eslint';
import istanbul from 'vite-plugin-istanbul';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE');
  return {
    // expose all vite "VITE_*" variables as process.env.VITE_* in the browser
    define: {
      'process.env': env,
    },
    server: {
      port: 3000,
    },
    build: {
      outDir: 'build',
      sourcemap: true,
    },
    plugins: [
      react(),
      eslint(),
      istanbul({
        cypress: true,
        requireEnv: true,
        exclude: ['node_modules', 'cypress', 'dist'],
        forceBuildInstrument: true,
      }),
    ],
    // to get aws amplify to work with vite
    resolve: {
      alias: [
        {
          find: './runtimeConfig',
          replacement: './runtimeConfig.browser', // ensures browser compatible version of AWS JS SDK is used
        },
      ],
    },
  };
});
