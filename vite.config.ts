import { join } from 'node:path/posix';
import { cloudflare } from '@cloudflare/vite-plugin';
import { reactRouter } from '@react-router/dev/vite';
import { defineConfig, loadEnv } from 'vite';
import devtoolsJson from 'vite-plugin-devtools-json';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(({ mode, isSsrBuild }) => {
  const env = loadEnv(mode, process.cwd());
  Object.assign(import.meta, { env });
  Object.assign(process.env, env);

  const base = import.meta.env.VITE_APP_BASENAME || '/';

  const assetsDir = join('assets', import.meta.env.VITE_ASSETS_BASENAME || '');

  return {
    base,
    build: { assetsDir },
    plugins: [
      cloudflare({ viteEnvironment: { name: 'ssr' } }),
      reactRouter(),
      tsconfigPaths(),
      devtoolsJson(),
    ],
    environments: {
      ssr: {
        build: { assetsDir: 'assets' },
      },
    },
  };
});
