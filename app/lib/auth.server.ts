import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { createDatabaseClient } from '~/db/client';
import { getEnvironment } from '~/utils/environment';

export function createAuth(d1: D1Database, env: Env) {
  const db = createDatabaseClient(d1);
  const vars = getEnvironment(env);

  return betterAuth({
    database: drizzleAdapter(db, { provider: 'sqlite' }),
    secret: vars.BETTER_AUTH_SECRET,
    baseURL: vars.AUTH_BASE_URL,
    trustedOrigins: [...vars.APP_TRUSTED_ORIGINS],
    socialProviders: {
      github: {
        clientId: vars.GITHUB_CLIENT_ID,
        clientSecret: vars.GITHUB_CLIENT_SECRET,
      },
    },
    session: {
      expiresIn: 60 * 60 * 24 * 7, // 7 days
      updateAge: 60 * 60 * 24, // 1 day
      cookieCache: {
        enabled: true,
        maxAge: 5 * 60, // 5 minutes
      },
    },
    advanced: {
      database: {
        generateId: () => crypto.randomUUID(),
      },
    },
  });
}

export type Auth = ReturnType<typeof createAuth>;
