import { debug } from 'debug';
import { memoize, once } from 'es-toolkit';
import { joinURL, withLeadingSlash, withoutTrailingSlash } from 'ufo';
import { z } from 'zod/v4';

const log = debug('app:env');

/** Normalize a path to ensure it has a leading slash but no trailing slash. */
const normalizePath = (val: string) =>
  withoutTrailingSlash(withLeadingSlash(val));

const logEnv = (vars: Record<string, unknown>) => {
  if (!log.enabled) return;

  const pairs: [string, unknown][] = [];
  for (const [key, value] of Object.entries(vars)) {
    if (key.includes('SECRET') && typeof value === 'string') {
      pairs.push([key, '*'.repeat(value.length)]);
    } else {
      pairs.push([key, value]);
    }
  }
  log(
    'Retrieved static environment variables:\n',
    ...pairs.map(([key, value]) => `  ${key}: ${value}\n`),
  );
};

export const StaticEnvironmentSchema = z.object({
  // Application configuration
  APP_ORIGIN: z
    .url()
    .default('http://localhost:5173')
    .transform((val) => withoutTrailingSlash(val)),
  APP_BASENAME: z.string().default('/').transform(normalizePath),
  ASSETS_BASENAME: z.string().default('/assets').transform(normalizePath),
});

export interface StaticEnvironment
  extends z.infer<typeof StaticEnvironmentSchema> {
  APP_BASE_URL: string;
  AUTH_BASE_URL: string;
  APP_TRUSTED_ORIGINS: string[];
}

const logStaticEnv = once(logEnv);

export const getStaticEnvironment = memoize((): StaticEnvironment => {
  const parsed = StaticEnvironmentSchema.parse({
    APP_ORIGIN: import.meta.env.VITE_APP_ORIGIN,
    APP_BASENAME: import.meta.env.VITE_APP_BASENAME,
    ASSETS_BASENAME: import.meta.env.VITE_ASSETS_BASENAME,
  });
  const APP_BASE_URL = joinURL(parsed.APP_ORIGIN, parsed.APP_BASENAME);
  const AUTH_BASE_URL = joinURL(APP_BASE_URL, 'api/auth');
  const APP_TRUSTED_ORIGINS = [parsed.APP_ORIGIN, 'localhost:*'];

  const ret = { ...parsed, APP_BASE_URL, AUTH_BASE_URL, APP_TRUSTED_ORIGINS };
  logStaticEnv(ret);
  return ret;
});

export const STATIC_ENV = getStaticEnvironment();

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

export interface RuntimeEnvironment
  extends z.infer<typeof RuntimeEnvironmentSchema> {}

const logRuntimeEnv = once(logEnv);

export const getRuntimeEnvironment = memoize(
  (env: Record<string, string | undefined>): RuntimeEnvironment => {
    const staticEnv = {
      GITHUB_CLIENT_ID: import.meta.env.VITE_GITHUB_CLIENT_ID,
      GITHUB_CLIENT_SECRET: import.meta.env.VITE_GITHUB_CLIENT_SECRET,
      BETTER_AUTH_SECRET: import.meta.env.VITE_BETTER_AUTH_SECRET,
      DEBUG: import.meta.env.VITE_DEBUG,
    };
    const ret = RuntimeEnvironmentSchema.parse({ ...staticEnv, ...env });
    logRuntimeEnv(ret);
    return ret;
  },
);

export type Environment = StaticEnvironment & RuntimeEnvironment;

export const getEnvironment = memoize(<Extended extends {}>(env: Extended) => {
  const res: Environment = {
    ...getStaticEnvironment(),
    ...getRuntimeEnvironment(env),
  };
  return res as Environment & Extended;
});
