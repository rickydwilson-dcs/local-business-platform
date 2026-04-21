# Session: Replace dj-fox-electrical with dj-fox-electrical-test as live production site

**Date:** 2026-04-21
**Status:** Ready to execute
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

_(Fill in after execution)_
