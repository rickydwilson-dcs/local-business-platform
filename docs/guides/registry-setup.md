# Site Registry Setup Guide

Complete guide for setting up the Supabase-based site registry and monitoring system (Week 7).

## Prerequisites

- Existing Supabase Pro account (paid tier)
- Supabase project created (or create new one)
- Access to Supabase SQL Editor
- NewRelic account with API access
- Vercel API token

---

## Step 1: Create Supabase Database Schema

### 1.1 Access Supabase SQL Editor

1. Log into your Supabase dashboard: https://supabase.com/dashboard
2. Select your project (or create new: "local-business-registry")
3. Navigate to **SQL Editor** in the left sidebar
4. Click **New Query**

### 1.2 Execute Schema Creation Script

1. Open `/tools/supabase-schema.sql` in your local repository
2. Copy the entire contents
3. Paste into the Supabase SQL Editor
4. Click **Run** (or press Cmd/Ctrl + Enter)

### 1.3 Verify Setup

Run these verification queries in SQL Editor:

```sql
-- Check all tables exist
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN (
    'sites', 'deployments', 'builds', 'metrics',
    'alerts', 'content_generations', 'rate_limits'
  )
ORDER BY table_name;

-- Should return 7 rows
```

Expected output:

```
alerts
builds
content_generations
deployments
metrics
rate_limits
sites
```

---

## Step 2: Get Supabase Credentials

### 2.1 Get Project URL and Service Role Key

1. Go to **Project Settings** → **API**
2. Copy the following values:
   - **URL** (starts with `https://`)
   - **Service Role Key** (starts with `eyJ...`)
   - **Project Reference ID** (short alphanumeric code)

⚠️ **IMPORTANT:** Use the **service_role** key, NOT the anon key. The service role bypasses RLS policies.

### 2.2 Add to Local Environment

Create or update `.env.local` in your project root:

```bash
# ===== SUPABASE (SITE REGISTRY & RATE LIMITING) =====
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlvd...
SUPABASE_PROJECT_REF=your-project-id

# ===== NEWRELIC API (METRICS & MONITORING) =====
NEW_RELIC_API_KEY=NRAK-your-api-key-here
NEW_RELIC_ACCOUNT_ID=1234567

# ===== ALERT NOTIFICATIONS =====
ALERT_EMAIL=your-email@example.com
```

### 2.3 Add to GitHub Secrets

For CI/CD workflows:

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add each of these:

| Secret Name            | Value                         |
| ---------------------- | ----------------------------- |
| `SUPABASE_URL`         | Your Supabase project URL     |
| `SUPABASE_SERVICE_KEY` | Your service role key         |
| `SUPABASE_PROJECT_REF` | Your project reference ID     |
| `NEW_RELIC_API_KEY`    | Your NewRelic User API key    |
| `NEW_RELIC_ACCOUNT_ID` | Your NewRelic account ID      |
| `ALERT_EMAIL`          | Email for alert notifications |
| `VERCEL_TOKEN`         | (Already exists from Week 4)  |
| `VERCEL_TEAM_ID`       | (Already exists from Week 4)  |
| `RESEND_API_KEY`       | (Already exists from Week 4)  |

---

## Step 3: Get NewRelic API Credentials

### 3.1 Create User API Key

1. Log into NewRelic: https://one.newrelic.com
2. Click user menu (bottom left) → **API Keys**
3. Click **Create a key**
4. Key type: **User key**
5. Name: `local-business-platform-registry`
6. Copy the key (starts with `NRAK-`)

### 3.2 Get Account ID

1. In NewRelic, go to **Account Settings** (user menu)
2. Copy your **Account ID** (numeric)

---

## Step 4: Install Dependencies

```bash
# From project root
pnpm add @supabase/supabase-js commander
```

---

## Step 5: Test Connection

Once you've implemented the Supabase client (tools/lib/supabase-client.ts), test the connection:

```bash
# Create a test script
pnpm tsx tools/test-registry.ts
```

Expected output:

```
✅ Connected to Supabase
✅ Database tables verified
✅ CRUD operations successful
```

---

## Step 6: Initial Site Sync

Sync your existing sites to the registry:

```bash
# Sync all sites from sites/ directory
pnpm sites:sync-all
```

This will:

- Read `site.config.ts` from each site
- Count MDX files (services, locations, blog, projects)
- Create site records in the `sites` table
- Output summary of synced sites

---

## Troubleshooting

### "Service role key required"

**Problem:** Using anon key instead of service role key.

**Solution:** Get the service_role key from Project Settings → API. It bypasses RLS policies.

### "permission denied for table"

**Problem:** RLS policies blocking access.

**Solution:** Verify you're using service_role key and that RLS policies were created correctly:

```sql
SELECT tablename, policyname
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

Should show policies like `"Service role has full access to sites"` for each table.

### "relation does not exist"

**Problem:** Tables not created.

**Solution:** Re-run the schema creation script from `/tools/supabase-schema.sql`.

### Rate limiting not working

**Problem:** rate_limits table not accessible or cleanup not running.

**Solution:**

1. Verify table exists: `SELECT COUNT(*) FROM rate_limits;`
2. Check RLS policies (see above)
3. Manually run cleanup: `SELECT cleanup_expired_rate_limits();`

---

## Database Maintenance

### Manual Cleanup of Old Data

```sql
-- Delete rate limit records older than 24 hours
DELETE FROM rate_limits WHERE window_end < NOW() - INTERVAL '24 hours';

-- Delete old metrics (keep last 90 days)
DELETE FROM metrics WHERE date < CURRENT_DATE - INTERVAL '90 days';

-- Delete resolved alerts older than 30 days
DELETE FROM alerts
WHERE status = 'resolved'
  AND resolved_at < NOW() - INTERVAL '30 days';
```

### View Database Size

```sql
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Check Rate Limit Activity

```sql
-- Current rate limits
SELECT
  site_slug,
  endpoint,
  COUNT(*) as active_limits,
  MAX(window_end) as latest_expiry
FROM rate_limits
WHERE window_end > NOW()
GROUP BY site_slug, endpoint
ORDER BY site_slug, endpoint;
```

---

## Supabase Studio Tips

### Table Editor

- **View data:** SQL Editor → Table Editor → Select table
- **Filter rows:** Use the filter bar at top
- **Sort:** Click column headers
- **Export:** Click **Download** for CSV export

### SQL Editor Shortcuts

- **Run query:** Cmd/Ctrl + Enter
- **New query:** Cmd/Ctrl + N
- **Save query:** Cmd/Ctrl + S
- **Format SQL:** Shift + Alt + F

### Monitoring

- **Database health:** Project Settings → Database → Health
- **Disk usage:** Project Settings → Database → Disk
- **Connection pool:** Project Settings → Database → Connection Pooler

---

## Backup Strategy

Your paid Supabase tier includes **daily automatic backups**:

- **Retention:** Last 7 days
- **Restore:** Project Settings → Database → Backups
- **Point-in-time:** Available for Pro tier

### Manual Backup

Export all data:

```bash
# Using Supabase CLI (install: npm i -g supabase)
supabase db dump -p [your-db-password] > backup.sql
```

---

## Next Steps

After setup is complete:

1. ✅ Implement Supabase client (`tools/lib/supabase-client.ts`)
2. ✅ Build management CLI (`tools/manage-sites.ts`)
3. ✅ Create sync scripts (Vercel, NewRelic, GitHub)
4. ✅ Implement alert system
5. ✅ Migrate rate limiting from Redis
6. ✅ Test end-to-end workflows

---

## Support Resources

- **Supabase Docs:** https://supabase.com/docs
- **SQL Reference:** https://supabase.com/docs/guides/database
- **RLS Policies:** https://supabase.com/docs/guides/auth/row-level-security
- **Community:** https://github.com/supabase/supabase/discussions

---

**Last Updated:** 2026-01-26
**Week 7 Implementation Guide**
