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

