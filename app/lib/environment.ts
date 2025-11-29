import 'urlpattern-polyfill';

/**
 * URL patterns for local development environments
 * These patterns match common localhost configurations
 */
export const LOCAL_ENVIRONMENT_HOSTNAMES = [
  'localhost',
  '127.0.0.1',
  '*.local',
  '[::1]', // IPv6 localhost
] as const;

/**
 * URL patterns for preview deployment environments
 * These patterns match Cloudflare Pages preview deployments
 */
export const PREVIEW_ENVIRONMENT_HOSTNAMES = [
  '*.pages.dev', // Cloudflare Pages preview and production
  '*.workers.dev', // Cloudflare Workers preview
] as const;

/**
 * Test if the current hostname matches any of the provided patterns
 * @param hostname - The hostname to test
 * @param patterns - Array of hostname patterns to match against
 * @returns true if hostname matches any pattern
 */
function matchesHostnamePatterns(
  hostname: string,
  patterns: readonly string[],
): boolean {
  return patterns.some((pattern) => {
    try {
      const urlPattern = new URLPattern({ hostname: pattern });
      return urlPattern.test({ hostname });
    } catch (error) {
      console.error(`[Environment] Invalid URL pattern: ${pattern}`, error);
      return false;
    }
  });
}

/**
 * Check if the current environment is a local development environment
 * @returns true if running in local development
 */
export function isLocalEnvironment(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  return matchesHostnamePatterns(
    window.location.hostname,
    LOCAL_ENVIRONMENT_HOSTNAMES,
  );
}

/**
 * Check if the current environment is a preview deployment
 * @returns true if running in preview deployment
 */
export function isPreviewEnvironment(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  return matchesHostnamePatterns(
    window.location.hostname,
    PREVIEW_ENVIRONMENT_HOSTNAMES,
  );
}

/**
 * Check if the current environment is either local or preview
 * This is commonly used for enabling development/debugging tools
 * @returns true if running in local or preview environment
 */
export function isDevelopmentOrPreviewEnvironment(): boolean {
  return isLocalEnvironment() || isPreviewEnvironment();
}

/**
 * Check if the current environment is production
 * @returns true if running in production (not local or preview)
 */
export function isProductionEnvironment(): boolean {
  if (typeof window === 'undefined') {
    return true; // Assume production on server side
  }

  return !isDevelopmentOrPreviewEnvironment();
}

/**
 * Get the current environment type
 * @returns 'local' | 'preview' | 'production'
 */
export function getEnvironmentType(): 'local' | 'preview' | 'production' {
  if (isLocalEnvironment()) {
    return 'local';
  }

  if (isPreviewEnvironment()) {
    return 'preview';
  }

  return 'production';
}
