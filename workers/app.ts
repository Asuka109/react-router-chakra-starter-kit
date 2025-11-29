import { createRequestHandler, RouterContextProvider } from 'react-router';

declare module 'react-router' {
  export interface RouterContextProvider {
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

/**
 * Cloudflare Workers entry point
 * Static asset serving is handled by React Router middleware in app/root.tsx
 */
export default {
  async fetch(request, env, ctx) {
    const context = new RouterContextProvider();
    // Use Object.assign for migration compatibility
    // See: https://reactrouter.com/how-to/middleware#migration-from-apploadcontext
    Object.assign(context, { cloudflare: { env, ctx } });
    return requestHandler(request, context);
  },
} satisfies ExportedHandler<Env>;
