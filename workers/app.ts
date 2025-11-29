import { createRequestHandler } from 'react-router';
import { APP_BASE_PATH } from '../app/constants';

declare module 'react-router' {
  export interface AppLoadContext {
    cloudflare: {
      env: Env;
      ctx: ExecutionContext;
    };
  }
}

const requestHandler = createRequestHandler(
  () => import('virtual:react-router/server-build'),
  import.meta.env.MODE,
);

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Strip the base path from the URL for asset lookup
    const pathWithoutBase = url.pathname.replace(APP_BASE_PATH, '') || '/';

    // Try to serve static assets first
    if (env.ASSETS) {
      const assetUrl = new URL(pathWithoutBase, url.origin);
      const assetResponse = await env.ASSETS.fetch(
        new Request(assetUrl, request),
      );

      // If asset found (not 404), return it
      if (assetResponse.status !== 404) {
        return assetResponse;
      }
    }

    // Fall back to React Router for non-asset requests
    return requestHandler(request, {
      cloudflare: { env, ctx },
    });
  },
} satisfies ExportedHandler<Env>;
