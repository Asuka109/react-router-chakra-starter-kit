/**
 * Application constants
 * Centralized configuration for deployment paths and URLs
 */

import { joinURL } from 'ufo';

/**
 * The base path for the application when deployed under a subpath
 * Used by React Router basename and Vite base configuration
 */
export const APP_BASE_PATH = '/gallery/react-router-chakra-starter-kit';

/**
 * The production domain for the application
 */
export const APP_DOMAIN = 'asuk.app';

/**
 * The production origin URL
 */
export const APP_ORIGIN = `https://${APP_DOMAIN}`;

/**
 * The full production base URL for the application
 * Used by auth configuration and API endpoints
 */
export const APP_BASE_URL = joinURL(APP_ORIGIN, APP_BASE_PATH);

/**
 * Trusted origins for authentication
 * These origins are allowed to make authenticated requests
 */
export const APP_TRUSTED_ORIGINS = [APP_ORIGIN] as const;

/**
 * Helper function to create a URL with the base path
 * @param path - The path to join with the base path
 * @returns The full path with base prefix
 */
export function withBasePath(path: string): string {
  return joinURL(APP_BASE_PATH, path);
}
