# React Router Chakra Starter Kit

<p align="center">
  <img src="app/assets/logo.svg" alt="Logo" width="120" height="120">
</p>

<p align="center">
  A modern, production-ready full-stack React template powered by React Router v7, Chakra UI, and Cloudflare Workers.
</p>

<p align="center">
  <a href="./README-zh-CN.md">简体中文</a> | English
</p>

<p align="center">
  <strong>🚀 Live Demo:</strong> <a href="https://asuk.app/gallery/react-router-chakra-starter-kit">https://asuk.app/gallery/react-router-chakra-starter-kit</a>
</p>

---

## ✨ Features

| Category | Technologies |
|----------|-------------|
| **Framework** | [React Router v7](https://reactrouter.com/) with SSR |
| **UI** | [Chakra UI v3](https://chakra-ui.com/) - Modern, accessible design system |
| **Authentication** | [Better Auth](https://www.better-auth.com/) - GitHub OAuth integration |
| **Database** | [Cloudflare D1](https://developers.cloudflare.com/d1) + [Drizzle ORM](https://orm.drizzle.team/) |
| **Deployment** | [Cloudflare Workers](https://workers.cloudflare.com/) - Edge computing |
| **Language** | TypeScript - Full type safety |
| **Build Tool** | [Vite](https://vitejs.dev/) - Lightning fast HMR |

### Why This Stack?

- 🌍 **Edge-First Architecture** - Deploy globally with Cloudflare's edge network
- ⚡ **Blazing Fast** - Server-side rendering with streaming support
- 🔐 **Secure by Default** - Built-in authentication with session management
- 📦 **Zero Config Database** - Cloudflare D1 with automatic migrations
- 🎨 **Beautiful UI** - Accessible components with dark mode support
- 🔄 **Full-Stack Type Safety** - End-to-end TypeScript from database to UI

## 📁 Project Structure

```
├── app/
│   ├── components/       # Reusable UI components
│   │   ├── auth-provider.tsx
│   │   ├── chakra-provider.tsx
│   │   ├── sign-in-button.tsx
│   │   └── ...
│   ├── db/
│   │   ├── client.ts     # Database client
│   │   └── schema.ts     # Drizzle ORM schema
│   ├── lib/
│   │   ├── auth.server.ts    # Server-side auth config
│   │   ├── auth-client.ts    # Client-side auth hooks
│   │   └── environment.ts    # Environment utilities
│   ├── routes/           # File-based routing
│   │   ├── _app.tsx      # App layout
│   │   ├── _app._index.tsx   # Home page
│   │   └── api.auth.*.ts     # Auth API routes
│   └── root.tsx          # Root component
├── drizzle/
│   └── migrations/       # Database migrations
├── workers/
│   └── app.ts            # Cloudflare Worker entry
└── wrangler.jsonc        # Cloudflare configuration
```

## 🚀 Quick Start

### Prerequisites

- Node.js >= 20.x
- pnpm >= 10.x
- Cloudflare account (for deployment)
- GitHub OAuth App (for authentication)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/react-router-chakra-starter-kit.git
cd react-router-chakra-starter-kit

# Install dependencies
pnpm install

# Copy environment variables
cp .dev.vars.example .dev.vars
```

### Development

```bash
# Start development server
pnpm dev
```

Visit `http://localhost:5173/gallery/react-router-chakra-starter-kit` in your browser.

### Database Setup

```bash
# Generate migrations from schema
pnpm run db:generate

# Apply migrations to local database
pnpm run db:migrate:local

# View database in Drizzle Studio
pnpm run db:studio
```

## 🔐 Authentication Setup

This template uses Better Auth with GitHub OAuth. Follow the [Authentication Setup Guide](./AUTH_SETUP.md) to configure:

1. Create a GitHub OAuth App
2. Configure environment variables
3. Set up the D1 database

## 📦 Available Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start development server with HMR |
| `pnpm build` | Build for production |
| `pnpm preview` | Preview production build locally |
| `pnpm deploy` | Deploy to Cloudflare Workers |
| `pnpm db:generate` | Generate database migrations |
| `pnpm db:migrate:local` | Apply migrations locally |
| `pnpm db:migrate:remote` | Apply migrations to production |
| `pnpm db:studio` | Open Drizzle Studio |
| `pnpm typecheck` | Run TypeScript type checking |
| `pnpm format` | Format code with Biome |

## 🌐 Deployment

### Configure Production Secrets

```bash
# Set GitHub OAuth credentials
npx wrangler secret put GITHUB_CLIENT_ID
npx wrangler secret put GITHUB_CLIENT_SECRET

# Set health check token
npx wrangler secret put HEALTH_CHECK_TOKEN
```

### Deploy to Cloudflare Workers

```bash
# Full deployment (migrate + build + deploy)
pnpm deploy
```

### Preview Deployments

```bash
# Upload a preview version
npx wrangler versions upload

# Promote to production
npx wrangler versions deploy
```

## 🛠️ Configuration

### Subpath Deployment

This template supports subpath deployment. Configuration is centralized in `app/lib/environment.ts`:

- `APP_BASENAME` - Base path for routing
- `APP_DOMAIN` - Production domain
- `APP_BASE_URL` - Full production URL
- `APP_TRUSTED_ORIGINS` - Trusted origins for CORS

### Build-Time Configuration

- `react-router.config.ts` - React Router basename
- `vite.config.ts` - Vite asset base path
- `wrangler.jsonc` - Cloudflare Workers route pattern

## 📚 Documentation

- [Authentication Setup](./AUTH_SETUP.md) - Detailed auth configuration guide
- [Authentication Architecture](./AUTHENTICATION.md) - Technical overview
- [Database Migration](./DATABASE_MIGRATION.md) - Migration workflow guide
- [Contributing Guidelines](./AGENTS.md) - Code style and conventions

## 🔗 Resources

- [React Router Documentation](https://reactrouter.com/)
- [Chakra UI Documentation](https://chakra-ui.com/)
- [Better Auth Documentation](https://www.better-auth.com/)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)

## 📄 License

MIT License - feel free to use this template for your own projects.

---

<p align="center">
  Built with ❤️ using React Router v7
</p>
