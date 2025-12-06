# Authentication Setup Guide

This guide will help you set up Better Auth with Drizzle ORM and Cloudflare D1 for React Router Chakra Starter Kit.

## Prerequisites

- A Cloudflare account
- A GitHub account for OAuth setup
- wrangler CLI installed and configured

## Step 1: Create D1 Database

First, create a D1 database in Cloudflare:

```bash
# Create the database
wrangler d1 create react-router-chakra-starter-kit-db

# This will output something like:
# ✅ Successfully created DB 'react-router-chakra-starter-kit-db' in region WEUR
# Created your database using D1's new storage backend.
# The new storage backend is not yet recommended for production
# workloads, but backs up your data via point-in-time restore.
# 
# [[d1_databases]]
# binding = "DB"
# database_name = "react-router-chakra-starter-kit-db"
# database_id = "<YOUR_DATABASE_ID>"
```

Copy the `database_id` value from the output.

## Step 2: Update wrangler.jsonc

Update the `database_id` in `wrangler.jsonc` with the value from Step 1:

```jsonc
"d1_databases": [
  {
    "binding": "DB",
    "database_name": "react-router-chakra-starter-kit-db",
    "database_id": "YOUR_DATABASE_ID", // Replace this with your actual database ID
    "migrations_dir": "drizzle/migrations"
  }
]
```

## Step 3: Generate Database Schema

Generate the database migration files:

```bash
# Generate migration files
npx drizzle-kit generate
```

This will create SQL migration files in the `drizzle/migrations` directory.

## Step 4: Apply Database Migrations

Apply the migrations to your D1 database:

```bash
# For local development
wrangler d1 migrations apply react-router-chakra-starter-kit-db --local

# For production
wrangler d1 migrations apply react-router-chakra-starter-kit-db --remote
```

## Step 5: Create GitHub OAuth App

1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Click "New OAuth App"
3. Fill in the details:
   - **Application name**: React Router Chakra Starter Kit
   - **Homepage URL**: `https://YOUR_DOMAIN.workers.dev`
   - **Authorization callback URL**: `https://YOUR_DOMAIN.workers.dev/api/auth/callback/github`
4. Click "Register application"
5. On the next page, click "Generate a new client secret"
6. Copy both the **Client ID** and **Client Secret**

## Step 6: Configure Environment Variables

### For Local Development

1. Copy `.dev.vars.example` to `.dev.vars`:

```bash
cp .dev.vars.example .dev.vars
```

2. Update `.dev.vars` with your actual values:

```bash
HEALTH_CHECK_TOKEN=your-secure-token-here
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

### For Production

Set the secrets in Cloudflare Workers:

```bash
# Set GitHub Client ID
wrangler secret put GITHUB_CLIENT_ID
# When prompted, paste your GitHub Client ID

# Set GitHub Client Secret
wrangler secret put GITHUB_CLIENT_SECRET
# When prompted, paste your GitHub Client Secret

# Set Health Check Token (optional)
wrangler secret put HEALTH_CHECK_TOKEN
# When prompted, paste a secure token
```

## Step 7: Test Locally

Run the development server:

```bash
pnpm dev
```

Visit `http://localhost:5173` and test the GitHub login functionality.

## Step 8: Deploy to Production

Deploy your application to Cloudflare Workers:

```bash
pnpm run deploy
```

## Authentication Flow

1. User clicks "Sign in with GitHub" button
2. User is redirected to GitHub for authorization
3. After authorization, GitHub redirects back to `/api/auth/callback/github`
4. Better Auth processes the callback and creates a session
5. User is redirected to the homepage with an active session

## API Endpoints

- `POST /api/auth/sign-in/social` - Initiate social login
- `GET /api/auth/callback/github` - GitHub OAuth callback
- `POST /api/auth/sign-out` - Sign out the current user
- `GET /api/auth/session` - Get current session

## Database Schema

The following tables are created:

- **user** - Stores user information
- **session** - Stores active sessions
- **account** - Stores OAuth account connections
- **verification** - Stores verification tokens

## Local Development with Production OAuth

GitHub OAuth requires a fixed redirect URL, which is typically set to your production domain. This makes local development challenging. We provide a **Dev OAuth Redirect** feature to solve this problem.

### How It Works

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  localhost:5173 │────▶│  production.com  │────▶│     GitHub      │
│   (Your local   │     │ /api/auth/call-  │     │  OAuth Server   │
│    dev server)  │     │ back/github      │     │                 │
│                 │     │ ?dev_port=5173   │     │                 │
└─────────────────┘     └──────────────────┘     └─────────────────┘
        ▲                        │                       │
        │                        │                       │
        │                        ▼                       ▼
        │               ┌──────────────────┐     ┌─────────────────┐
        └───────────────│  production.com  │◀────│   GitHub OAuth  │
                        │ /api/auth/call-  │     │    Callback     │
                        │  back/github     │     │                 │
                        └──────────────────┘     └─────────────────┘
```

1. Local dev visits `https://production.com/api/auth/callback/github?dev_port=5173`
2. Production sets a cookie and redirects to GitHub OAuth
3. GitHub authenticates and redirects back to production
4. Production detects the cookie and forwards to `localhost:5173`
5. Local dev receives the OAuth callback and completes authentication

### Setup

1. **Enable the feature on production** by setting the environment variable:

```bash
# In production (Cloudflare Workers)
wrangler secret put DEV_OAUTH_PROXY_ENABLED
# Enter: true
```

2. **Modify your local sign-in button** to use the dev redirect:

```tsx
import { authClient } from '~/lib/auth-client';

const handleSignIn = () => {
  if (import.meta.env.DEV && import.meta.env.VITE_PRODUCTION_ORIGIN) {
    // Use production callback with dev_port for local OAuth
    const productionOrigin = import.meta.env.VITE_PRODUCTION_ORIGIN;
    const port = window.location.port || '5173';
    window.location.href = `${productionOrigin}/api/auth/callback/github?dev_port=${port}`;
  } else {
    // Normal OAuth flow
    authClient.signIn.social({ provider: 'github' });
  }
};
```

3. **Add to your local `.env` file**:

```bash
# .env.development.local
VITE_PRODUCTION_ORIGIN=https://your-production-domain.workers.dev
```

### Security Considerations

- The dev OAuth redirect is **disabled by default**
- Only enable it when you need local development OAuth testing
- The cookie expires after **5 minutes**
- Redirects only go to `localhost` addresses
- Consider disabling it in production when not actively developing

### Alternative: Multiple GitHub OAuth Apps

If you prefer not to use the dev redirect, you can create two GitHub OAuth Apps:

1. **Production App**: Redirect URL set to your production domain
2. **Development App**: Redirect URL set to `http://localhost:5173`

Then use different `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` values for each environment.

## Troubleshooting

### Issue: Database not found

Make sure you've created the D1 database and updated the `database_id` in `wrangler.jsonc`.

### Issue: GitHub OAuth not working

1. Check that your GitHub OAuth App callback URL matches exactly
2. Verify that the `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` are set correctly
3. Make sure the `baseURL` in `app/lib/auth.server.ts` matches your domain

### Issue: Session not persisting

1. Check that cookies are enabled in your browser
2. Verify that the domain is correct in the auth configuration
3. Check browser console for any CORS errors

### Issue: Dev OAuth Proxy not working

1. Ensure `DEV_OAUTH_PROXY_ENABLED` is set to `'true'` on production
2. Check that your local dev server is running on the correct port
3. Verify the production URL in your dev proxy redirect is correct
4. The proxy cookie expires after 5 minutes - try again if it's been too long
5. Check browser DevTools Network tab to see the redirect chain

## Security Notes

1. Never commit `.dev.vars` to version control
2. Use strong, randomly generated secrets for production
3. Enable HTTPS in production (Cloudflare Workers automatically provides this)
4. Regularly rotate your GitHub OAuth credentials
5. Monitor your application logs for suspicious activity

## Additional Resources

- [Better Auth Documentation](https://www.better-auth.com/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team)
- [Cloudflare D1 Documentation](https://developers.cloudflare.com/d1)
- [GitHub OAuth Documentation](https://docs.github.com/en/apps/oauth-apps)

