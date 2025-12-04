import type { Config } from '@react-router/dev/config';

const basename = import.meta.env.VITE_APP_BASENAME || '/';

export default {
  ssr: true,
  basename,
  future: { v8_viteEnvironmentApi: true, v8_middleware: true },
} satisfies Config;
