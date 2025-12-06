import { memoize } from 'es-toolkit';
import { joinURL } from 'ufo';
import { z } from 'zod';

/**
 * Zod schema for validating Cloudflare Worker environment variables
 */
export const EnvironmentSchema = z.looseObject({
  // Debug configuration
  DEBUG: z.string().optional(),

  // Application configuration
  APP_ORIGIN: z.url().default('http://localhost:5173'),
  APP_BASENAME: z.string().default('/'),
  ASSETS_BASENAME: z.string().default('/assets'),

  // Authentication configuration (required for auth functionality)
  GITHUB_CLIENT_ID: z.string(),
  GITHUB_CLIENT_SECRET: z.string(),
  BETTER_AUTH_SECRET: z.string(),

  // Development OAuth proxy (allows local dev to work with production OAuth redirect)
  // Set to 'true' to enable the dev OAuth proxy endpoint
  DEV_OAUTH_PROXY_ENABLED: z
    .string()
    .optional()
    .transform((val) => val === 'true'),
});

/**
 * Inferred TypeScript type from the schema
 */
export type Environment = z.infer<typeof EnvironmentSchema>;

export const getEnvironment = memoize(<Extended extends {}>(env?: Extended) => {
  const staticVars: Record<string, string> = {
    APP_ORIGIN: import.meta.env.VITE_APP_ORIGIN,
    APP_BASENAME: import.meta.env.VITE_APP_BASENAME,
    ASSETS_BASENAME: import.meta.env.VITE_ASSETS_BASENAME,
    GITHUB_CLIENT_ID: import.meta.env.VITE_GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: import.meta.env.VITE_GITHUB_CLIENT_SECRET,
    BETTER_AUTH_SECRET: import.meta.env.VITE_BETTER_AUTH_SECRET,
  };
  const vars = Object.assign({}, staticVars, env);
  const parsed = EnvironmentSchema.parse(vars) as Environment & Extended;

  const APP_BASE_URL = joinURL(parsed.APP_ORIGIN, parsed.APP_BASENAME);
  const AUTH_BASE_URL = joinURL(APP_BASE_URL, 'api/auth');
  const APP_TRUSTED_ORIGINS = [parsed.APP_ORIGIN, 'localhost:*'];
  return {
    ...parsed,
    APP_BASE_URL,
    AUTH_BASE_URL,
    APP_TRUSTED_ORIGINS,
  };
});
