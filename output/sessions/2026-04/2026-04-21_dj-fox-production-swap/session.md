# Session: Replace dj-fox-electrical with dj-fox-electrical-test as live production site

**Date:** 2026-04-21
**Status:** Completed
**Branch:** develop

---

## Goal

Swap `sites/dj-fox-electrical-test` (composition-based refactor) into the live production slot by renaming it to `sites/dj-fox-electrical`. Reuse the existing Vercel project — no dashboard changes, no DNS changes, no env var changes.

---

## Context

`sites/dj-fox-electrical-test` is a complete refactor of the live DJ Fox Electrical site using the composition system. It has:

- Identical page coverage (15 pages)
- Same production content in `site.config.ts`
- Same contact API routes

Each site is a separate Vercel project with `rootDirectory` set to `sites/<name>` in Vercel's dashboard. By renaming the test site to take over the `dj-fox-electrical` directory slot, the Vercel project picks up the new code automatically on next push — all env vars carry over at the project level.

---

## Steps

### 1. Archive the old production site

```bash
mv sites/dj-fox-electrical sites/dj-fox-electrical-legacy
```

### 2. Rename the test site to the production slot

```bash
mv sites/dj-fox-electrical-test sites/dj-fox-electrical
```

### 3. Update package name in the renamed site

In `sites/dj-fox-electrical/package.json`, change:

```json
"name": "dj-fox-electrical-test"
```

to:

```json
"name": "dj-fox-electrical"
```

### 4. Add vercel.json to the renamed site

Create `sites/dj-fox-electrical/vercel.json`:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "buildCommand": "cd ../.. && pnpm turbo run build --filter=dj-fox-electrical",
  "installCommand": "cd ../.. && pnpm install --frozen-lockfile",
  "framework": "nextjs"
}
```

### 5. Update composition.json siteId

In `sites/dj-fox-electrical/composition.json`, change:

```json
"siteId": "dj-fox-electrical-test"
```

to:

```json
"siteId": "dj-fox-electrical"
```

### 6. Update site.config.ts slug

In `sites/dj-fox-electrical/site.config.ts`, if `slug` is set to `"dj-fox-electrical-test"`, change it to `"dj-fox-electrical"`. (Check first — may already be correct.)

### 7. Update .env.local port

In `sites/dj-fox-electrical/.env.local`, change:

```
NEXT_PUBLIC_SITE_URL=http://localhost:3001
```

to:

```
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 8. Check pnpm-workspace.yaml

If sites are globbed (`sites/*`), no change needed. The legacy `dj-fox-electrical-legacy` will be picked up as a workspace package but won't be deployed. If it causes build issues, delete it or add to `.pnpmignore`.

### 9. Verify locally

```bash
cd sites/dj-fox-electrical
npm run build
```

### 10. Commit and deploy

```bash
# On develop branch
git add sites/dj-fox-electrical sites/dj-fox-electrical-legacy
git commit -m "feat: replace dj-fox-electrical with composition-based site"
# Then run /deploy.changes
```

---

## Files Changed

| File                                       | Change                                             |
| ------------------------------------------ | -------------------------------------------------- |
| `sites/dj-fox-electrical/`                 | Entire directory (was dj-fox-electrical-test)      |
| `sites/dj-fox-electrical/package.json`     | `name`: dj-fox-electrical-test → dj-fox-electrical |
| `sites/dj-fox-electrical/vercel.json`      | New file (copied from old production pattern)      |
| `sites/dj-fox-electrical/composition.json` | `siteId` field updated                             |
| `sites/dj-fox-electrical/site.config.ts`   | `slug` field if needed                             |
| `sites/dj-fox-electrical/.env.local`       | Port 3001 → 3000                                   |
| `sites/dj-fox-electrical-legacy/`          | Renamed from old dj-fox-electrical (archived)      |

---

## What is NOT required

- No new Vercel project
- No DNS changes
- No Vercel env var changes (they live at the project level, not the directory level)
- No changes to `pnpm-workspace.yaml` (glob picks up both)

---

## Verification Checklist

- [ ] `npm run build` in `sites/dj-fox-electrical` succeeds locally
- [ ] Push to develop → Vercel preview build succeeds
- [ ] Deploy to staging → main via `/deploy.changes`
- [ ] Live site at djfoxelectrical.com loads composition-based pages correctly
- [ ] Submit contact form to verify Resend email still works (env vars carry over automatically)

---

## What Was Learned

The rename approach (mv + package.json name update) works cleanly — no Vercel dashboard changes needed. Two blockers to watch for in future migrations:

1. **Duplicate workspace name:** The legacy site's `package.json` still carries the old `"name"` value. pnpm sees two packages with the same name and refuses to install. Fix: rename the legacy `package.json` name to `<site>-legacy` immediately after `mv`.

2. **Stale lockfile:** Adding a new package name to the workspace (even an archived one) invalidates `pnpm-lock.yaml`. CI runs `--frozen-lockfile` and fails at install. Fix: run `pnpm install` locally after the rename and commit the updated lockfile in the same PR.

## Reusable Recipe: Production Swap (test → live slot)

For future migrations (e.g. colossus-scaffolding-test → colossus-scaffolding):

```bash
# 1. Archive old production site
mv sites/<name> sites/<name>-legacy

# 2. Move test site into production slot
mv sites/<name>-test sites/<name>

# 3. Fix legacy package name (prevents duplicate workspace error)
# In sites/<name>-legacy/package.json: "name": "<name>-legacy"

# 4. Update new site's package.json name
# In sites/<name>/package.json: "name": "<name>"

# 5. Add/verify vercel.json (copy from legacy, filter already correct)
# buildCommand filter must match the new "name" field

# 6. Update composition.json siteId (if present)
# "siteId": "<name>"

# 7. Update .env.local port if test site was on :3001
# NEXT_PUBLIC_SITE_URL=http://localhost:3000

# 8. Check site.config.ts slug (often already correct)

# 9. Update pnpm lockfile
pnpm install

# 10. Build verify
cd sites/<name> && npm run build

# 11. Commit both directories + lockfile together
git add sites/<name> sites/<name>-legacy pnpm-lock.yaml
git commit -m "feat: replace <name> with composition-based site"

# 12. Deploy
# /deploy.changes
```

**What does NOT need to change:** Vercel project settings, DNS, env vars in Vercel dashboard (all scoped to the project, not the directory).
