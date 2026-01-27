# Site Registry Management CLI

> **Daily operations tool for managing 50+ local business sites in the Supabase registry.**

## Quick Start

```bash
# List all sites
pnpm registry:list

# Show details for a specific site
pnpm tsx tools/manage-sites.ts show colossus-reference

# Sync all sites from filesystem
pnpm registry:sync

# Sync single site
pnpm tsx tools/manage-sites.ts sync colossus-reference

# Update site status
pnpm tsx tools/manage-sites.ts set-status colossus-reference paused
```

## Commands

### `list` - List all sites

Lists all sites in the registry with their metadata and content statistics.

**Usage:**

```bash
pnpm tsx tools/manage-sites.ts list [options]
```

**Options:**

- `-s, --status <status>` - Filter by status: `active`, `paused`, or `archived`
- `-i, --industry <industry>` - Filter by industry (e.g., `construction`, `plumbing`)
- `-f, --format <format>` - Output format: `table` (default), `json`, or `csv`

**Examples:**

```bash
# List all sites (table format)
pnpm registry:list

# List only active sites
pnpm tsx tools/manage-sites.ts list --status active

# List sites in construction industry
pnpm tsx tools/manage-sites.ts list --industry construction

# Export all sites to JSON
pnpm tsx tools/manage-sites.ts list --format json > sites.json

# Export to CSV for spreadsheet analysis
pnpm tsx tools/manage-sites.ts list --format csv > sites.csv
```

**Table Output:**

```
Sites (2 total):

┌─────────────────────────┬──────────────────────┬────────┬──────────────────────────────────┬──────────┬───────────┐
│ Status                  │ Slug                 │ Name   │ Domain                           │ Services │ Locations │
├─────────────────────────┼──────────────────────┼────────┼──────────────────────────────────┼──────────┼───────────┤
│ ✅ active               │ colossus-reference   │ Colo...│ www.colossus-scaffolding.co.uk   │ 22       │ 37        │
│ ✅ active               │ joes-plumbing-can... │ Joe's..│ joes-plumbing.vercel.app         │ 3        │ 3         │
└─────────────────────────┴──────────────────────┴────────┴──────────────────────────────────┴──────────┴───────────┘
```

---

### `show <slug>` - Show site details

Displays comprehensive information about a single site including metadata, content stats, recent deployments, active alerts, and 7-day metrics.

**Usage:**

```bash
pnpm tsx tools/manage-sites.ts show <slug>
```

**Example:**

```bash
pnpm tsx tools/manage-sites.ts show colossus-reference
```

**Output:**

```
🔍 Fetching site: colossus-reference...

Site Information:
  Slug: colossus-reference
  Name: Colossus Scaffolding
  Status: ✅ active
  Domain: www.colossus-scaffolding.co.uk
  Industry: construction
  Vercel Project: prj_abc123
  New Relic App: 987654321

Content Statistics:
  Services: 22
  Locations: 37
  Blog Posts: 7
  Projects: 2
  Testimonials: 5

Recent Deployments (last 5):
  ✅ dpl_abc12345 - main - ready (15.3s) 2026-01-26 10:23
  ✅ dpl_def67890 - main - ready (14.8s) 2026-01-25 14:15
  ❌ dpl_ghi54321 - develop - error (3.2s) 2026-01-24 09:45
  ✅ dpl_jkl98765 - main - ready (16.1s) 2026-01-23 16:30
  ✅ dpl_mno13579 - main - ready (15.7s) 2026-01-22 11:20

Active Alerts:
  ✅ No active alerts

Metrics (last 7 days):
  Avg Response Time: 234ms
  Avg Error Rate: 0.3%
  Total Page Views: 12,847
```

---

### `sync <slug>` - Sync single site

Syncs a single site from the filesystem to the registry. Reads `package.json` and counts MDX files in `content/` directories. Creates a new site record if it doesn't exist, or updates the existing record.

**Usage:**

```bash
pnpm tsx tools/manage-sites.ts sync <slug>
```

**Example:**

```bash
pnpm tsx tools/manage-sites.ts sync colossus-reference
```

**Output:**

```
🔄 Syncing site: colossus-reference...

⚡ Updating existing site: Colossus Scaffolding

✅ Synced Colossus Scaffolding
   22 services, 37 locations, 7 blog posts, 2 projects, 5 testimonials
```

**What it does:**

1. Reads `sites/<slug>/package.json` for site name and metadata
2. Counts MDX files in:
   - `content/services/*.mdx`
   - `content/locations/*.mdx`
   - `content/blog/*.mdx`
   - `content/projects/*.mdx`
   - `content/testimonials/*.mdx`
3. Checks if site exists in registry
4. Updates existing site or creates new site record
5. Updates `stats.last_synced_at` timestamp

---

### `sync-all` - Sync all sites

Syncs all sites from the `sites/` directory to the registry. Excludes `base-template` and hidden directories.

**Usage:**

```bash
pnpm registry:sync
# or
pnpm tsx tools/manage-sites.ts sync-all
```

**Example:**

```bash
pnpm registry:sync
```

**Output:**

```
🔄 Syncing all sites from filesystem...

Found 3 sites to sync

  ✅ Colossus Scaffolding - Updated (73 total content files)
  ✨ Joe's Plumbing - Created (9 total content files)
  ✅ Elite Electrical - Updated (45 total content files)

📊 Sync Summary:
  ✅ Success: 3
```

**When to use:**

- After creating new sites with `pnpm create:site`
- After bulk content updates
- Weekly maintenance to ensure registry is up-to-date
- Initial setup when connecting to a new Supabase project

---

### `set-status <slug> <status>` - Update site status

Changes the status of a site in the registry. Useful for pausing sites during maintenance or archiving old sites.

**Usage:**

```bash
pnpm tsx tools/manage-sites.ts set-status <slug> <status>
```

**Valid statuses:**

- `active` - ✅ Site is live and operational
- `paused` - ⏸️ Site temporarily offline (maintenance, payment issues)
- `archived` - 📦 Site permanently offline (client left, replaced)

**Examples:**

```bash
# Pause site for maintenance
pnpm tsx tools/manage-sites.ts set-status colossus-reference paused

# Reactivate site after maintenance
pnpm tsx tools/manage-sites.ts set-status colossus-reference active

# Archive old client site
pnpm tsx tools/manage-sites.ts set-status old-client-site archived
```

**Output:**

```
🔄 Updating status for colossus-reference to paused...

✅ Updated Colossus Scaffolding status to ⏸️ paused
```

---

## Environment Setup

The CLI requires Supabase credentials to connect to the registry database.

### Required Environment Variables

Add these to `.env.local`:

```bash
# Supabase credentials
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Get credentials from:

1. Log into [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Project Settings → API**
4. Copy **URL** and **service_role key** (NOT anon key!)

### Testing Connection

Test the Supabase connection:

```bash
pnpm tsx tools/test-registry-client.ts
```

---

## Site Data Structure

The CLI reads and syncs data from your site directories:

### Directory Structure

```
sites/
├── colossus-reference/
│   ├── package.json          # Site name, description
│   ├── theme.config.ts       # Theme colors (noted but not parsed)
│   └── content/
│       ├── services/*.mdx    # Service pages
│       ├── locations/*.mdx   # Location pages
│       ├── blog/*.mdx        # Blog posts
│       ├── projects/*.mdx    # Portfolio projects
│       └── testimonials/*.mdx # Customer testimonials
├── joes-plumbing-canterbury/
│   └── ...
└── base-template/           # Excluded from sync
```

### package.json Format

```json
{
  "name": "colossus-reference",
  "version": "1.0.0",
  "description": "Reference implementation - Colossus Scaffolding site",
  ...
}
```

The CLI extracts:

- **Site name**: From description (e.g., "Colossus Scaffolding")
- **Slug**: From directory name (e.g., "colossus-reference")
- **Industry**: Inferred from slug patterns:
  - Contains "plumbing" → `plumbing`
  - Contains "scaffold" → `construction`
  - Contains "electric" → `electrical`
  - Contains "hvac" → `hvac`
  - Default → `service`

---

## Common Workflows

### 1. Weekly Registry Maintenance

Keep registry in sync with filesystem:

```bash
# Sync all sites
pnpm registry:sync

# Review sites
pnpm registry:list
```

### 2. Onboarding New Site

After creating a new site:

```bash
# Create site from base-template
pnpm create:site new-client-site "New Client Business" "https://newclient.com"

# Sync to registry
pnpm tsx tools/manage-sites.ts sync new-client-site

# Verify
pnpm tsx tools/manage-sites.ts show new-client-site
```

### 3. Site Maintenance Mode

Temporarily pause a site:

```bash
# Pause site
pnpm tsx tools/manage-sites.ts set-status client-site paused

# Do maintenance work...

# Reactivate
pnpm tsx tools/manage-sites.ts set-status client-site active
```

### 4. Generate Reports

Export data for analysis:

```bash
# Export to CSV
pnpm tsx tools/manage-sites.ts list --format csv > reports/sites-$(date +%Y-%m-%d).csv

# Export active sites only
pnpm tsx tools/manage-sites.ts list --status active --format csv > reports/active-sites.csv

# Export JSON for scripts
pnpm tsx tools/manage-sites.ts list --format json > reports/sites.json
```

### 5. Audit Content

Check content counts across all sites:

```bash
# Table view shows content counts
pnpm registry:list

# CSV export for spreadsheet analysis
pnpm tsx tools/manage-sites.ts list --format csv | column -t -s,
```

---

## Output Formats

### Table Format (Default)

Human-readable table with site metadata and stats.

```bash
pnpm registry:list
```

**Features:**

- Status emoji (✅ active, ⏸️ paused, 📦 archived)
- Sorted by name
- Shows key metrics at a glance

### JSON Format

Machine-readable JSON for scripts and integrations.

```bash
pnpm tsx tools/manage-sites.ts list --format json
```

**Features:**

- Complete site records
- All JSONB fields included
- Nested objects preserved

**Use cases:**

- Input for other scripts
- API integrations
- Data backups

### CSV Format

Spreadsheet-compatible CSV for analysis.

```bash
pnpm tsx tools/manage-sites.ts list --format csv
```

**Features:**

- Header row
- Quoted strings
- Flat structure

**Use cases:**

- Excel/Google Sheets analysis
- Data visualization
- Reporting to stakeholders

---

## Troubleshooting

### "SUPABASE_URL environment variable is required"

**Problem:** `.env.local` is missing or doesn't have Supabase credentials.

**Solution:**

1. Copy `.env.example` to `.env.local`
2. Add your Supabase credentials:
   ```bash
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
3. Test connection: `pnpm tsx tools/test-registry-client.ts`

---

### "Site not found: <slug>"

**Problem:** Site doesn't exist in registry yet.

**Solution:**

1. Sync the site: `pnpm tsx tools/manage-sites.ts sync <slug>`
2. Verify: `pnpm tsx tools/manage-sites.ts show <slug>`

---

### "Site directory not found"

**Problem:** Site slug doesn't match a directory in `sites/`.

**Solution:**

1. Check slug spelling: `ls sites/`
2. Use exact directory name (case-sensitive)

---

### "Failed to read site configuration"

**Problem:** Site directory missing `package.json`.

**Solution:**

1. Verify `sites/<slug>/package.json` exists
2. Check JSON syntax is valid
3. Ensure `name` and `description` fields exist

---

## Integration with Other Tools

### Deployment Pipeline

```bash
# 1. Sync sites to registry
pnpm registry:sync

# 2. Deploy all sites
pnpm deploy:batch

# 3. Verify deployments
pnpm tsx tools/manage-sites.ts list
```

### Monitoring Setup

After setting up monitoring (NewRelic, Vercel):

```bash
# Update site with monitoring IDs
pnpm tsx tools/manage-sites.ts show colossus-reference

# Add IDs manually via Supabase dashboard or update script
```

### Content Generation Pipeline

After generating content:

```bash
# 1. Generate content
pnpm content:generate:services
pnpm content:generate:locations

# 2. Sync updated content counts
pnpm registry:sync

# 3. Verify counts
pnpm tsx tools/manage-sites.ts show <slug>
```

---

## Best Practices

### 1. Run sync-all weekly

Keep registry in sync with filesystem:

```bash
# Add to weekly maintenance checklist
pnpm registry:sync
```

### 2. Use status updates

Track site lifecycle:

- `active` - Live production sites
- `paused` - Temporary issues (payment, maintenance)
- `archived` - Permanently offline

### 3. Export backups monthly

Archive registry data:

```bash
mkdir -p backups
pnpm tsx tools/manage-sites.ts list --format json > backups/registry-$(date +%Y-%m-%d).json
```

### 4. Review metrics regularly

Monitor site performance:

```bash
# Check individual sites
pnpm tsx tools/manage-sites.ts show colossus-reference

# Look for:
# - High error rates (>1%)
# - Slow response times (>500ms)
# - Active alerts
```

---

## Future Enhancements

Planned features for future versions:

### v1.1

- [ ] `import` command - Import sites from CSV/JSON
- [ ] `export` command - Enhanced export with filters
- [ ] `search` command - Full-text search across sites

### v1.2

- [ ] `deploy` command - Deploy site from CLI
- [ ] `metrics` command - Detailed metrics analysis
- [ ] `alerts` command - Manage alerts from CLI

### v1.3

- [ ] Interactive mode with prompts
- [ ] Bulk operations (bulk status updates)
- [ ] Site health checks

---

## Related Documentation

- [Supabase Client API](./supabase-client.md) - Full client documentation
- [Registry Schema](../supabase-schema.sql) - Database schema
- [Site Registry Setup Guide](../../docs/guides/registry-setup.md) - Initial setup

---

## Support

For issues or questions:

1. Check troubleshooting section above
2. Review logs: `pnpm tsx tools/manage-sites.ts list --verbose`
3. Verify Supabase connection: `pnpm tsx tools/test-registry-client.ts`
4. Check [CLAUDE.md](../../CLAUDE.md) for project context
