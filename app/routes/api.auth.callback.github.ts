/**
 * GitHub OAuth Callback Handler with Dev Redirect Support
 *
 * This route handles GitHub OAuth callback and supports local development
 * by redirecting OAuth responses to localhost when needed.
 *
 * Usage for local development:
 * 1. Visit: https://production.com/api/auth/callback/github?dev_port=5173
 * 2. This sets a cookie and redirects to GitHub OAuth
 * 3. GitHub redirects back to this endpoint
 * 4. The endpoint detects the cookie and forwards to localhost:5173
 *
 * Security:
 * - Only works when DEV_OAUTH_PROXY_ENABLED=true
 * - Cookie expires in 5 minutes
 * - Only redirects to localhost
 */

import { env } from 'cloudflare:workers';
import { createAuth } from '~/lib/auth.server';
import { getEnvironment } from '~/utils/environment';
import type { Route } from './+types/api.auth.callback.github';

const DEV_PORT_COOKIE = '__dev_oauth_port';
const COOKIE_MAX_AGE = 5 * 60; // 5 minutes

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const vars = getEnvironment(env);

  // Check if this is a dev OAuth initiation request
  const devPort = url.searchParams.get('dev_port');

  if (devPort && vars.DEV_OAUTH_PROXY_ENABLED) {
    // Validate port
    if (!/^\d+$/.test(devPort)) {
      return new Response(JSON.stringify({ error: 'Invalid port number' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Build GitHub OAuth URL
    const githubAuthUrl = new URL('https://github.com/login/oauth/authorize');
    githubAuthUrl.searchParams.set('client_id', vars.GITHUB_CLIENT_ID);
    githubAuthUrl.searchParams.set(
      'redirect_uri',
      `${vars.APP_ORIGIN}/api/auth/callback/github`
    );
    githubAuthUrl.searchParams.set('scope', 'read:user user:email');
    githubAuthUrl.searchParams.set('state', crypto.randomUUID());

    // Set cookie and redirect to GitHub
    return new Response(null, {
      status: 302,
      headers: {
        Location: githubAuthUrl.toString(),
        'Set-Cookie': `${DEV_PORT_COOKIE}=${devPort}; HttpOnly; Secure; SameSite=Lax; Max-Age=${COOKIE_MAX_AGE}; Path=/`,
      },
    });
  }

  // Check for dev port cookie (GitHub callback with dev mode)
  if (vars.DEV_OAUTH_PROXY_ENABLED && url.searchParams.has('code')) {
    const devPortFromCookie = parseDevPortCookie(request);

    if (devPortFromCookie) {
      // Redirect to localhost with OAuth params
      const localUrl = new URL(
        '/api/auth/callback/github',
        `http://localhost:${devPortFromCookie}`
      );

      for (const [key, value] of url.searchParams) {
        localUrl.searchParams.set(key, value);
      }

      // Clear cookie and redirect
      return new Response(null, {
        status: 302,
        headers: {
          Location: localUrl.toString(),
          'Set-Cookie': `${DEV_PORT_COOKIE}=; HttpOnly; Secure; SameSite=Lax; Max-Age=0; Path=/`,
        },
      });
    }
  }

  // Normal flow - process with better-auth
  const auth = createAuth(env.DB, env);
  return auth.handler(request);
}

function parseDevPortCookie(request: Request): string | null {
  const cookieHeader = request.headers.get('Cookie');
  if (!cookieHeader) return null;

  const cookies = cookieHeader.split(';').map((c) => c.trim());
  const devCookie = cookies.find((c) => c.startsWith(`${DEV_PORT_COOKIE}=`));

  if (!devCookie) return null;

  const port = devCookie.slice(`${DEV_PORT_COOKIE}=`.length);
  return /^\d+$/.test(port) ? port : null;
}
