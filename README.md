# React Router Chakra Starter Kit

A modern, production-ready template for building full-stack React applications using React Router and Chakra UI.

**Production URL**: [https://asuk.app/gallery/react-router-chakra-starter-kit](https://asuk.app/gallery/react-router-chakra-starter-kit)

## Features

- 🚀 Server-side rendering on Cloudflare Workers
- ⚡️ Hot Module Replacement (HMR)
- 📦 Asset bundling and optimization
- 🔄 Data loading and mutations
- 🔒 TypeScript by default
- 🎨 Chakra UI for styling
- 🔐 Better Auth for authentication
- 🗄️ Cloudflare D1 database with Drizzle ORM
- 📖 [React Router docs](https://reactrouter.com/)

## Getting Started

### Installation

Install the dependencies:

```bash
pnpm install
```

### Development

#### Environment Setup

Copy the example environment file and configure your local environment variables:

```bash
cp .dev.vars.example .dev.vars
```

The `.dev.vars` file contains sensitive configuration like the `HEALTH_CHECK_TOKEN`. You can generate a new secure token using:

```bash
openssl rand -base64 32
```

#### Start Development Server

Start the development server with HMR:

```bash
pnpm run dev
```

Your application will be available at `http://localhost:5173/gallery/react-router-chakra-starter-kit`.

## Previewing the Production Build

Preview the production build locally:

```bash
pnpm run preview
```

## Building for Production

Create a production build:

```bash
pnpm run build
```

## Deployment

This application is deployed to Cloudflare Workers at `https://asuk.app/gallery/react-router-chakra-starter-kit`.

Deployment is done using the Wrangler CLI.

### Configure Production Secrets

Before deploying to production, configure your secrets:

```sh
# Set the health check token (generate a new one for production!)
npx wrangler secret put HEALTH_CHECK_TOKEN

# Set GitHub OAuth credentials for authentication
npx wrangler secret put GITHUB_CLIENT_ID
npx wrangler secret put GITHUB_CLIENT_SECRET
```

When prompted, enter your production token. Generate a secure token using:

```sh
openssl rand -base64 32
```

### Deploy to Production

To build and deploy directly to production:

```sh
pnpm run deploy
```

### Preview Deployments

To deploy a preview URL:

```sh
npx wrangler versions upload
```

You can then promote a version to production after verification or roll it out progressively:

```sh
npx wrangler versions deploy
```

## Subpath Deployment Configuration

This application is configured to run under a subpath (`/gallery/react-router-chakra-starter-kit`). The path configuration is centralized in `app/constants.ts`:

- `APP_BASE_PATH` - The base path for routing and assets
- `APP_DOMAIN` - The production domain
- `APP_BASE_URL` - The full production URL
- `APP_TRUSTED_ORIGINS` - Trusted origins for authentication

Files using constants:

- `app/lib/auth-client.ts` - Uses `APP_BASE_URL` for auth client
- `app/lib/auth.server.ts` - Uses `APP_BASE_URL` and `APP_TRUSTED_ORIGINS` for server auth

Files using string literals (build-time configs):

- `react-router.config.ts` - Sets React Router basename
- `vite.config.ts` - Sets Vite asset base path
- `wrangler.jsonc` - Defines route pattern for Cloudflare Workers

## Styling

This template uses [Chakra UI](https://chakra-ui.com/) for component styling with a modern, accessible design system.

---

Built with ❤️ using React Router.
