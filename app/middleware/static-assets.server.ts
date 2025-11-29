/**
 * Static Assets Middleware
 * Handles serving static assets for subpath deployment on Cloudflare Workers
 * Only runs in production - Vite handles assets in development
 */

import debug from 'debug';
import { withoutBase } from 'ufo';
import type { Route } from '../+types/root';
import { APP_BASENAME } from '../constants';

/**
 * Check if a path looks like a static asset (has a file extension)
 */
function isStaticAssetPath(pathname: string): boolean {
  // Match paths with file extensions (e.g., .js, .css, .svg, .png, .ico)
  return /\.[a-zA-Z0-9]+$/.test(pathname);
}

const log = debug('app:middleware:static-assets');

/**
 * Middleware that serves static assets from Cloudflare Workers ASSETS binding
 * Strips the base path and fetches from the ASSETS binding
 * Only runs in production with Cloudflare Workers
 */
export const staticAssetsMiddleware: Route.MiddlewareFunction = async (
  { request, context },
  next,
) => {
  log('incoming request url:', request.url);
  
  const assetsBinding = context.cloudflare.env.ASSETS;
  
  // Only handle if ASSETS binding is available (production only)
  if (!assetsBinding) return next();
  
  // Only handle static asset requests (paths with file extensions)
  const url = new URL(request.url);
  if (!isStaticAssetPath(url.pathname)) return next();

  // Strip the base path from the URL for asset lookup
  const pathWithoutBase = withoutBase(url.pathname, APP_BASENAME) || '/';

  // Try to serve static assets
  const assetUrl = new URL(pathWithoutBase, url.origin);
  log('retrieving asset from:', assetUrl.href);
  const assetRequest = new Request(assetUrl, request);
  const assetResponse = await assetsBinding.fetch(assetRequest);
  log('asset response content type:', assetResponse.headers.get('content-type'));

  // If asset found (not 404), return it directly
  if (assetResponse.status !== 404) {
    return assetResponse;
  }

  // Fall through to next middleware / route handler
  return next();
};
