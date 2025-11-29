import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { createDatabaseClient } from '~/db/client';

export function createAuth(d1: D1Database, env: Env) {
  const db = createDatabaseClient(d1);

  return betterAuth({
    database: drizzleAdapter(db, {
      provider: 'sqlite',
    }),
    // baseURL: "https://YOUR_DOMAIN.workers.dev",
    // trustedOrigins: ["https://YOUR_DOMAIN.workers.dev"],
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
