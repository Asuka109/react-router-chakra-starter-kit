import { memoize } from 'es-toolkit';
import { joinURL } from 'ufo';
import { z } from 'zod';

export const StaticEnvironmentSchema = z.looseObject({
  // Application configuration
  APP_ORIGIN: z.url().default('http://localhost:5173'),
  APP_BASENAME: z.string().default('/'),
  ASSETS_BASENAME: z.string().default('/assets'),
});

export type StaticEnvironment = z.infer<typeof StaticEnvironmentSchema>;

export const getStaticEnvironment = memoize(() => {
  const parsed: StaticEnvironment = StaticEnvironmentSchema.parse({
    GITHUB_CLIENT_ID: import.meta.env.VITE_GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: import.meta.env.VITE_GITHUB_CLIENT_SECRET,
    BETTER_AUTH_SECRET: import.meta.env.VITE_BETTER_AUTH_SECRET,
  });
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

export const RuntimeEnvironmentSchema = z.looseObject({
  // Authentication configuration (required for auth functionality)
  GITHUB_CLIENT_ID: z.string(),
  GITHUB_CLIENT_SECRET: z.string(),
  BETTER_AUTH_SECRET: z.string(),

  // Debug configuration
  DEBUG: z.string().optional(),
  // Development OAuth proxy (allows local dev to work with production OAuth redirect)
  // Set to 'true' to enable the dev OAuth proxy endpoint
  DEV_OAUTH_PROXY_ENABLED: z
    .string()
    .optional()
    .transform((val) => val === 'true'),
});

export type RuntimeEnvironment = z.infer<typeof RuntimeEnvironmentSchema>;

export const getRuntimeEnvironment = memoize(
  (env: Record<string, string | undefined>): RuntimeEnvironment => {
    return RuntimeEnvironmentSchema.parse(env);
  },
);

export const getEnvironment = memoize(<Extended extends {}>(env: Extended) => {
  return { ...getStaticEnvironment(), ...getRuntimeEnvironment(env) };
});
