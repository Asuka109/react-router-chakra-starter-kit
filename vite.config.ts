import { cloudflare } from '@cloudflare/vite-plugin';
import { reactRouter } from '@react-router/dev/vite';
import { defineConfig, loadEnv } from 'vite';
import devtoolsJson from 'vite-plugin-devtools-json';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  Object.assign(import.meta, { env });
  Object.assign(process.env, env);

  return {
    base: import.meta.env.VITE_ASSETS_BASENAME || '/',
    plugins: [
      cloudflare({ viteEnvironment: { name: 'ssr' } }),
      reactRouter(),
      tsconfigPaths(),
      devtoolsJson(),
    ],
  };
});
