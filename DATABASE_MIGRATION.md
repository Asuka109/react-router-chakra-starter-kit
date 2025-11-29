# Database Migration Guide

## Current Issue

When deploying to production, you may encounter errors like:

```
ERROR [Better Auth]: Error Error: Failed query: insert into "verification" ...
```

This occurs because database migrations haven't been applied to the production database.

## Solutions

### Solution 1: Automatic Migration on Deploy (Recommended) ✅

The `deploy` script has been updated to automatically run migrations before deployment:

```bash
pnpm run deploy
```

This will:
1. Apply migrations to remote database (`db:migrate:remote`)
2. Build the application (`build`)
3. Deploy to Cloudflare Workers (`wrangler deploy`)

**Advantages:**
- Automatic and safe
- Migrations run before new code is deployed
- No manual intervention needed
- Prevents deployment if migrations fail

### Solution 2: Manual Migration (Immediate Fix)

If you need to fix the production database right now without redeploying:

```bash
# Apply migrations to production database
pnpm run db:migrate:remote
```

For local development:

```bash
# Apply migrations to local database
pnpm run db:migrate:local
```

### Solution 3: Runtime Migration (Not Recommended)

Drizzle ORM supports running migrations at application startup, but this is **NOT recommended** for Cloudflare Workers because:

- Multiple worker instances may try to run migrations simultaneously
- D1 doesn't guarantee single-instance execution
- May cause race conditions and conflicts
- Deployment rollback becomes complicated

## Best Practices

### Development Workflow

1. **Create a migration:**
   ```bash
   pnpm run db:generate
   ```

2. **Test locally:**
   ```bash
   pnpm run db:migrate:local
   pnpm run dev
   ```

3. **Deploy to production:**
   ```bash
   pnpm run deploy  # Migrations are automatically applied
   ```

### Migration Workflow

```
┌─────────────────┐
│ Modify Schema   │
│ (schema.ts)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Generate        │
│ Migration       │
│ (db:generate)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Test Locally    │
│ (db:migrate:    │
│  local)         │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Deploy          │
│ (automatically  │
│  migrates &     │
│  deploys)       │
└─────────────────┘
```

## Available Scripts

| Script | Purpose | When to Use |
|--------|---------|-------------|
| `db:generate` | Generate migration files from schema | After changing `schema.ts` |
| `db:migrate:local` | Apply migrations to local D1 | Local development testing |
| `db:migrate:remote` | Apply migrations to production D1 | Manual production updates |
| `deploy` | Migrate + Build + Deploy | Normal deployment process |

## Cloudflare D1 Migration Features

Cloudflare automatically tracks which migrations have been applied:
- Migrations are idempotent (safe to run multiple times)
- Only unapplied migrations will be executed
- Migration history is stored in D1 metadata

## Troubleshooting

### Issue: "table already exists" error

This is normal if you've already run migrations. Cloudflare D1 tracks migration history and will skip already-applied migrations.

### Issue: Migration fails during deployment

1. Check migration SQL syntax
2. Verify database connection in Cloudflare dashboard
3. Check wrangler authentication: `wrangler whoami`
4. Manually apply migrations: `pnpm run db:migrate:remote`

### Issue: Local and remote databases are out of sync

```bash
# Reset local database
pnpm run db:migrate:local

# Or check migration status
wrangler d1 migrations list react-router-chakra-starter-kit-db --local
wrangler d1 migrations list react-router-chakra-starter-kit-db --remote
```

## Configuration

Database configuration is in `wrangler.jsonc`:

```jsonc
{
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "react-router-chakra-starter-kit-db",
      "database_id": "YOUR_DATABASE_ID",
      "migrations_dir": "drizzle/migrations"  // Migration directory
    }
  ]
}
```

## References

- [Drizzle ORM Migrations](https://orm.drizzle.team/kit-docs/overview)
- [Cloudflare D1 Migrations](https://developers.cloudflare.com/d1/platform/migrations/)
- [Wrangler D1 Commands](https://developers.cloudflare.com/workers/wrangler/commands/#d1)

