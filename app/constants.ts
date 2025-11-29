/**
 * Application constants
 * Centralized configuration for deployment paths and URLs
 */

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
 * The full production base URL for the application
 * Used by auth configuration and API endpoints
 */
export const APP_BASE_URL = `https://${APP_DOMAIN}${APP_BASE_PATH}`;

/**
 * Trusted origins for authentication
 * These origins are allowed to make authenticated requests
 */
export const APP_TRUSTED_ORIGINS = [`https://${APP_DOMAIN}`] as const;

