/**
 * Static Assets Middleware
 * Handles serving static assets for subpath deployment on Cloudflare Workers
 */

import { withoutBase } from 'ufo';
import type { Route } from '../+types/root';
import { APP_BASE_PATH } from '../constants';

/**
 * Middleware that serves static assets from Cloudflare Workers ASSETS binding
 * Strips the base path and fetches from the ASSETS binding
 */
export const staticAssetsMiddleware: Route.MiddlewareFunction = async (
  { request, context },
  next,
) => {
  const { cloudflare } = context;

  // Only handle if ASSETS binding is available
  if (!cloudflare?.env?.ASSETS) return next();

  const url = new URL(request.url);

  // Strip the base path from the URL for asset lookup
  const pathWithoutBase = withoutBase(url.pathname, APP_BASE_PATH) || '/';

  // Try to serve static assets
  const assetUrl = new URL(pathWithoutBase, url.origin);
  const assetResponse = await cloudflare.env.ASSETS.fetch(
    new Request(assetUrl, request),
  );

  // If asset found (not 404), return it directly
  if (assetResponse.status !== 404) {
    return assetResponse;
  }

  // Fall through to next middleware / route handler
  return next();
};
