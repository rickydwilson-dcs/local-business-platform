# Site Registry CLI - Quick Reference

> **One-page reference for daily operations**

## Setup (First Time Only)

```bash
# 1. Add Supabase credentials to .env.local
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# 2. Test connection
pnpm tsx tools/test-registry-client.ts

# 3. Initial sync
pnpm registry:sync
```

## Common Commands

```bash
# List all sites (table view)
pnpm registry:list

# List active sites only
pnpm tsx tools/manage-sites.ts list --status active

# Show site details (deployments, metrics, alerts)
pnpm tsx tools/manage-sites.ts show colossus-reference

# Sync all sites from filesystem
pnpm registry:sync

# Sync single site
pnpm tsx tools/manage-sites.ts sync colossus-reference

# Update site status
pnpm tsx tools/manage-sites.ts set-status my-site inactive
```

## Output Formats

```bash
# Table (default) - human-readable
pnpm registry:list

# JSON - for scripts/APIs
pnpm tsx tools/manage-sites.ts list --format json

# CSV - for Excel/Sheets
pnpm tsx tools/manage-sites.ts list --format csv > sites.csv
```

## Status Values

- `active` ✅ - Live production site
- `inactive` / `paused` ⏸️ - Temporarily offline
- `archived` 📦 - Permanently offline

## Filters

```bash
# By status
pnpm tsx tools/manage-sites.ts list --status active

# By industry
pnpm tsx tools/manage-sites.ts list --industry construction

# Combined
pnpm tsx tools/manage-sites.ts list --status active --industry plumbing
```

## Weekly Maintenance Checklist

```bash
# 1. Sync all sites
pnpm registry:sync

# 2. Review active sites
pnpm registry:list

# 3. Check for issues
pnpm tsx tools/manage-sites.ts show <slug>  # For each site with alerts

# 4. Export backup
pnpm tsx tools/manage-sites.ts list --format json > backups/registry-$(date +%Y-%m-%d).json
```

## Troubleshooting

### "SUPABASE_URL environment variable is required"

→ Add credentials to `.env.local` (see Setup above)

### "Site not found: <slug>"

→ Run `pnpm tsx tools/manage-sites.ts sync <slug>`

### "Site directory not found"

→ Check spelling: `ls sites/` to see available slugs

## Need Help?

```bash
# General help
pnpm tsx tools/manage-sites.ts --help

# Command-specific help
pnpm tsx tools/manage-sites.ts list --help
pnpm tsx tools/manage-sites.ts show --help
```

📖 **Full Documentation:** [REGISTRY_CLI.md](./REGISTRY_CLI.md)
