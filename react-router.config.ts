import type { Config } from '@react-router/dev/config';

/**
 * React Router configuration
 * Deployed to: https://asuk.app/gallery/react-router-chakra-starter-kit
 */
export default {
  ssr: true,
  basename: '/gallery/react-router-chakra-starter-kit',
  future: {
    unstable_viteEnvironmentApi: true,
  },
} satisfies Config;
