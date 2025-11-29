import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import {
  APP_TRUSTED_ORIGINS,
  AUTH_BASE_URL,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
} from '~/constants';
import { createDatabaseClient } from '~/db/client';

export function createAuth(d1: D1Database, env: Env) {
  const db = createDatabaseClient(d1);

  return betterAuth({
    database: drizzleAdapter(db, {
      provider: 'sqlite',
    }),
    baseURL: AUTH_BASE_URL,
    trustedOrigins: [...APP_TRUSTED_ORIGINS],
    socialProviders: {
      github: {
        clientId: GITHUB_CLIENT_ID,
        clientSecret: GITHUB_CLIENT_SECRET,
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
        generateId: () => {
          // Use crypto.randomUUID() for better compatibility with Cloudflare Workers
          return crypto.randomUUID();
        },
      },
    },
  });
}

export type Auth = ReturnType<typeof createAuth>;
