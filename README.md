# Welcome to React Router!

A modern, production-ready template for building full-stack React applications using React Router.

## Features

- 🚀 Server-side rendering
- ⚡️ Hot Module Replacement (HMR)
- 📦 Asset bundling and optimization
- 🔄 Data loading and mutations
- 🔒 TypeScript by default
- 🎉 TailwindCSS for styling
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

Your application will be available at `http://localhost:5173`.

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

Deployment is done using the Wrangler CLI.

### Configure Production Secrets

Before deploying to production, configure your secrets:

```sh
# Set the health check token (generate a new one for production!)
npx wrangler secret put HEALTH_CHECK_TOKEN
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

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever CSS framework you prefer.

---

Built with ❤️ using React Router.
