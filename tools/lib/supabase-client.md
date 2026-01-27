# Supabase Registry Client

Comprehensive TypeScript client for the site registry database system.

## File Location

`tools/lib/supabase-client.ts` (1,132 lines)

## Overview

The RegistryClient provides type-safe access to all 7 registry tables:

- **sites** - Core site data and configuration
- **deployments** - Vercel deployment tracking
- **builds** - GitHub Actions build status
- **metrics** - Performance and usage metrics
- **alerts** - Monitoring alerts and incidents
- **content_generations** - AI content generation logs
- **rate_limits** - API rate limiting data

## Architecture

### TypeScript Types (400+ lines)

- Comprehensive type definitions for all database tables
- JSONB field interfaces (BusinessInfo, ThemeConfig, SiteStats, etc.)
- Enums for status fields (SiteStatus, DeploymentStatus, BuildStatus, etc.)
- Create/Update input types for all operations

### Error Handling

- Try-catch blocks on all methods
- Descriptive error messages with context
- Not found returns null (doesn't throw)
- Console logging for debugging

### Foreign Key Resolution

- All methods accept `site_slug` (user-friendly)
- Automatically looks up `site_id` for foreign key relationships
- Validates site exists before inserting related records

## API Methods

### Sites (5 methods)

```typescript
getSite(slug: string): Promise<Site | null>
listSites(filters?: SiteFilters): Promise<Site[]>
createSite(data: SiteCreate): Promise<Site>
updateSite(slug: string, data: SiteUpdate): Promise<Site>
deleteSite(slug: string): Promise<boolean>
```

### Deployments (3 methods)

```typescript
getRecentDeployments(siteSlug: string, limit = 10): Promise<Deployment[]>
createDeployment(data: DeploymentCreate): Promise<Deployment>
updateDeployment(deploymentId: string, data: DeploymentUpdate): Promise<Deployment>
```

### Builds (3 methods)

```typescript
getRecentBuilds(siteSlug: string, limit = 10): Promise<Build[]>
createBuild(data: BuildCreate): Promise<Build>
updateBuild(runId: string, data: BuildUpdate): Promise<Build>
```

### Metrics (2 methods)

```typescript
getMetrics(siteSlug: string, days = 30): Promise<Metrics[]>
upsertMetrics(data: MetricsUpsert): Promise<Metrics>
```

### Alerts (4 methods)

```typescript
getActiveAlerts(siteSlug?: string): Promise<Alert[]>
createAlert(data: AlertCreate): Promise<Alert>
acknowledgeAlert(alertId: string): Promise<Alert>
resolveAlert(alertId: string): Promise<Alert>
```

### Content Generations (2 methods)

```typescript
logContentGeneration(data: ContentGenerationLog): Promise<ContentGeneration>
getContentGenerationStats(siteSlug: string): Promise<ContentGenerationStats>
```

### Utilities (1 method)

```typescript
testConnection(): Promise<boolean>
```

## Usage

### Import

```typescript
import { registry } from "./tools/lib/supabase-client";
```

### Examples

**Get a site:**

```typescript
const site = await registry.getSite("colossus-reference");
console.log(site.name, site.industry, site.status);
```

**List active sites:**

```typescript
const activeSites = await registry.listSites({ status: "active" });
```

**Create a site:**

```typescript
const newSite = await registry.createSite({
  slug: "plumber-denver",
  name: "Denver Plumbing Co",
  industry: "plumbing",
  business_info: {
    name: "Denver Plumbing Co",
    phone: "303-555-1234",
    address: { city: "Denver", state: "CO" },
  },
});
```

**Log deployment:**

```typescript
await registry.createDeployment({
  site_slug: "plumber-denver",
  deployment_id: "dpl_abc123",
  url: "https://plumber-denver.vercel.app",
  status: "ready",
  build_time_ms: 45000,
  git_branch: "main",
  git_commit_sha: "abc123",
  environment: "production",
});
```

**Upsert daily metrics:**

```typescript
await registry.upsertMetrics({
  site_slug: "plumber-denver",
  date: "2026-01-26",
  response_time_avg_ms: 250,
  response_time_p95_ms: 450,
  error_rate_percent: 0.12,
  page_views: 1234,
  unique_visitors: 456,
});
```

**Create alert:**

```typescript
await registry.createAlert({
  site_slug: "plumber-denver",
  type: "error_rate",
  severity: "high",
  message: "Error rate exceeded 1% threshold",
  metadata: { current_rate: 1.2, threshold: 1.0 },
});
```

**Log content generation:**

```typescript
await registry.logContentGeneration({
  site_slug: "plumber-denver",
  content_type: "service",
  provider: "claude",
  model: "claude-sonnet-3.5",
  tokens_used: 1500,
  cost_usd: 0.0075,
  quality_scores: { readability: 0.95, seo: 0.88 },
});
```

**Get content stats:**

```typescript
const stats = await registry.getContentGenerationStats("plumber-denver");
console.log(`Total cost: $${stats.total_cost_usd}`);
console.log(`Total tokens: ${stats.total_tokens}`);
console.log(`By type:`, stats.by_type);
```

## Environment Variables

Required in `.env.local`:

```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-key
```

## Testing

Run the test script:

```bash
tsx tools/test-registry-client.ts
```

Tests connection, lists sites, and exercises all major API endpoints.

## Dependencies

- `@supabase/supabase-js` ^2.93.1
- `dotenv` (already installed)
- `typescript` (already installed)

## Type Safety

- All methods are fully typed
- Return types match database schema
- Optional fields properly handled
- JSONB fields have proper interfaces

## Notes

- Singleton instance exported as `registry`
- Auto-loads env vars from `.env.local`
- Returns `null` for not found (not error)
- Throws descriptive errors for failures
- Automatic foreign key resolution via site slug
