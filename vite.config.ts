import { cloudflare } from '@cloudflare/vite-plugin';
import { reactRouter } from '@react-router/dev/vite';
import { withoutLeadingSlash } from 'ufo';
import { defineConfig, loadEnv } from 'vite';
import devtoolsJson from 'vite-plugin-devtools-json';
import tsconfigPaths from 'vite-tsconfig-paths';
import { getEnvironment } from './app/utils/environment';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  Object.assign(import.meta, { env });
  Object.assign(process.env, env);

  const vars = getEnvironment();
  const assetsDir = withoutLeadingSlash(vars.ASSETS_BASENAME);

  return {
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
