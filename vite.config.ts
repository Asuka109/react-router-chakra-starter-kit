import { cloudflare } from '@cloudflare/vite-plugin';
import { reactRouter } from '@react-router/dev/vite';
import { defineConfig } from 'vite';
import devtoolsJson from 'vite-plugin-devtools-json';
import tsconfigPaths from 'vite-tsconfig-paths';

/**
 * Vite configuration
 * Deployed to: https://asuk.app/gallery/react-router-chakra-starter-kit
 */
export default defineConfig({
  base: '/gallery/react-router-chakra-starter-kit/',
  plugins: [
    cloudflare({ viteEnvironment: { name: 'ssr' } }),
    reactRouter(),
    tsconfigPaths(),
    devtoolsJson(),
  ],
});
