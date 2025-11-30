/**
 * Application constants
 * Centralized configuration for deployment paths and URLs
 *
 * Environment variables:
 * - Runtime (Cloudflare Workers): APP_BASENAME, APP_ORIGIN from wrangler.jsonc vars
 * - Build time (Vite): VITE_APP_BASENAME, VITE_APP_ORIGIN from .env
 */
import { joinURL, withBase, withoutBase, withoutTrailingSlash, withTrailingSlash } from 'ufo';
import { invariant } from './utils/invariant';

/**
 * The production origin URL
 */
export const APP_ORIGIN = withoutTrailingSlash(
  import.meta.env.VITE_APP_ORIGIN || 'http://localhost:5173',
);

/**
 * The base path for the application when deployed under a subpath
 * Used by React Router basename and Vite base configuration
 */
export const APP_BASENAME = withTrailingSlash(
  import.meta.env.VITE_APP_BASENAME || '/',
);

/**
 * The full production base URL for the application
 * Used by auth configuration and API endpoints
 */
export const APP_BASE_URL = joinURL(APP_ORIGIN, APP_BASENAME);

/**
 * The base path for the assets when deployed under a subpath
 * Used by Vite base configuration
 */
export const ASSETS_BASENAME: string = withTrailingSlash(
  import.meta.env.VITE_ASSETS_BASENAME || '/',
);

export const AUTH_BASE_URL = joinURL(APP_BASE_URL, 'api/auth');

export const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID;
invariant(GITHUB_CLIENT_ID, 'VITE_GITHUB_CLIENT_ID is required');

export const GITHUB_CLIENT_SECRET = import.meta.env.VITE_GITHUB_CLIENT_SECRET;
invariant(GITHUB_CLIENT_SECRET, 'VITE_GITHUB_CLIENT_ID is required');

/**
 * Trusted origins for authentication
 * These origins are allowed to make authenticated requests
 */
export const APP_TRUSTED_ORIGINS = [APP_ORIGIN] as const;

export function withAssetsBase(path: string): string {
  return withBase(path, ASSETS_BASENAME);
}

export function withoutAssetsBase(path: string): string {
  return withoutBase(path, ASSETS_BASENAME);
}
