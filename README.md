# React Router Chakra UI Starter Kit

## Getting Started

### Installation

Install the dependencies:

```bash
pnpm install
```

### Development

Start the development server with HMR:

```bash
pnpm run dev
```

Your application will be available at `http://localhost:5173`.

## Building for Production

Create a production build:

```bash
pnpm run build
```

## Deployment

### Docker Deployment

To build and run using Docker:

```bash
docker build -t my-app .

# Run the container
docker run -p 3000:3000 my-app
```

The containerized application can be deployed to any platform that supports Docker, including:

- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway

### DIY Deployment

If you're familiar with deploying Node applications, the built-in app server is production-ready.

Make sure to deploy the output of `pnpm run build`

```
├── package.json
├── package-lock.json (or pnpm-lock.yaml, or bun.lockb)
├── build/
│   ├── client/    # Static assets
│   └── server/    # Server-side code
```

## Code Quality

This project uses [Biome](https://biomejs.dev/) for formatting, linting, and organizing imports.

```bash
# Format all files
pnpm exec biome format --write

# Format specific files
pnpm exec biome format --write <files>

# Lint and apply safe fixes to all files
pnpm exec biome lint --write

# Lint files and apply safe fixes to specific files
pnpm exec biome lint --write <files>

# Format, lint, and organize imports of all files
pnpm exec biome check --write

# Format, lint, and organize imports of specific files
pnpm exec biome check --write <files>
```

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever CSS framework you prefer.
