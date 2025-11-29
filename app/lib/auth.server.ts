import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { APP_BASE_URL, APP_TRUSTED_ORIGINS } from '~/constants';
import { createDatabaseClient } from '~/db/client';

/**
 * Server-side auth configuration
 * Deployed to: https://asuk.app/gallery/react-router-chakra-starter-kit
 */
export function createAuth(d1: D1Database, env: Env) {
  const db = createDatabaseClient(d1);

  return betterAuth({
    database: drizzleAdapter(db, {
      provider: 'sqlite',
    }),
    baseURL: APP_BASE_URL,
    basePath: '/api/auth',
    trustedOrigins: [...APP_TRUSTED_ORIGINS],
    socialProviders: {
      github: {
        clientId: env.GITHUB_CLIENT_ID,
        clientSecret: env.GITHUB_CLIENT_SECRET,
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
