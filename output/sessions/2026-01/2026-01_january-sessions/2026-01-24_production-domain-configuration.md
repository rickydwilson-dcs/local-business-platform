# Session: Production Domain Configuration

**Start Date:** 2026-01-24
**End Date:** 2026-01-24
**Status:** Completed
**Objective:** Configure custom production domain (www.colossus-scaffolding.co.uk) and update all URLs

## Summary

Configured the colossus-reference site to use the production domain `www.colossus-scaffolding.co.uk`. Updated environment variables, all 33 location MDX schema URLs, and fixed a Husky v9 deprecation warning. Deployed through the full git workflow (develop → staging → main).

## Key Deliverables

### 1. Domain Configuration

- **Domain:** www.colossus-scaffolding.co.uk
- **Environment Variable:** `NEXT_PUBLIC_SITE_URL`
- **Vercel Configuration:** Custom domain added to production project
- **SSL Certificate:** Automatically provisioned by Vercel

### 2. URL Updates

- **Updated:** All 33 location MDX files in `content/locations/`
- **Changed:** Schema.org JSON-LD URLs from localhost to production domain
- **Format:** `https://www.colossus-scaffolding.co.uk/locations/{slug}`

**Example:**

```yaml
# Before
schema:
  "@context": "https://schema.org"
  "@type": "LocalBusiness"
  url: "http://localhost:3000/locations/brighton"

# After
schema:
  "@context": "https://schema.org"
  "@type": "LocalBusiness"
  url: "https://www.colossus-scaffolding.co.uk/locations/brighton"
```

### 3. Husky Deprecation Fix

- **Issue:** Husky v9 deprecated shebang in hook files
- **Warning:** "The `.husky/pre-push` script is deprecated. Please use a shebang instead."
- **Fix:** Removed deprecated shebang line from `.husky/pre-push`
- **Commit:** `5ad29d8` - chore: Remove deprecated Husky v9 shebang from pre-push hook

### 4. Environment Configuration

- **Updated:** `.env.example` with production domain
- **Added:** Documentation about domain configuration
- **Ensured:** All environment variables properly documented

## Files Modified

### Environment Files

- `.env.example` - Added production domain example
- `.env.local` (local only) - Updated with production domain

### Content Files (33 files)

All location MDX files updated:

- `content/locations/brighton.mdx`
- `content/locations/eastbourne.mdx`
- `content/locations/hastings.mdx`
- `content/locations/lewes.mdx`
- ... (29 more location files)

### Hook Files

- `.husky/pre-push` - Removed deprecated shebang

### Documentation

- `docs/TODO.md` - Updated production domain configuration section
- (Implicit) Vercel project settings

## Key Decisions

### 1. Use www Subdomain

**Decision:** Use `www.colossus-scaffolding.co.uk` instead of apex domain
**Rationale:**

- Better for CDN configuration (CNAME vs A record)
- Industry best practice for production websites
- Easier to manage redirects (apex → www)
- More flexible for future infrastructure changes

### 2. Update All Schema URLs in One Commit

**Decision:** Update all 33 location files in single commit
**Rationale:**

- Atomic change (all URLs consistent)
- Easier to review
- Prevents mixed localhost/production URLs
- Single deployment needed

### 3. Fix Husky Warning Immediately

**Decision:** Fix Husky deprecation warning during domain configuration
**Rationale:**

- Warning appears on every commit (annoying)
- Simple fix (one line removal)
- Prevents future confusion
- Clean commit history

## Technical Details

### Domain DNS Configuration

```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: Auto
```

### Apex Domain Redirect

```
Type: A
Name: @
Value: 76.76.21.21 (Vercel's redirect server)
Purpose: Redirect colossus-scaffolding.co.uk → www.colossus-scaffolding.co.uk
```

### Sitemap Generation

- Sitemap automatically uses `NEXT_PUBLIC_SITE_URL`
- All 86 pages now show with www subdomain
- Submitted to Google Search Console

### SSL Certificate

- Automatically provisioned by Vercel
- Let's Encrypt certificate
- Auto-renewal enabled
- HTTPS enforced (redirects from HTTP)

## Deployment Workflow

### Git Flow Followed

```bash
# 1. Make changes on develop branch
git checkout develop
# ... made changes ...
git add .
git commit -m "chore: Update domain URLs to www.colossus-scaffolding.co.uk"

# 2. Push to develop
git push origin develop
# CI runs: lint, type-check, tests, build

# 3. Merge to staging
git checkout staging
git merge develop
git push origin staging
# E2E smoke tests run on staging deployment

# 4. Merge to main
git checkout main
git merge staging
git push origin main
# Full E2E test suite runs on production
```

### Pre-Push Hook

The pre-push hook automatically:

1. Cleans `.next` cache
2. Runs smoke tests (if on develop/staging)
3. Prevents push if tests fail

## Testing Results

### Build Tests

- ✅ No TypeScript errors
- ✅ No ESLint errors
- ✅ Production build successful (86 pages)

### Smoke Tests (Staging)

- ✅ Homepage loads with correct domain
- ✅ Location pages load (all 33 tested)
- ✅ Service pages load
- ✅ Contact form renders
- ✅ About page loads

### Production Verification

- ✅ www.colossus-scaffolding.co.uk loads
- ✅ SSL certificate valid
- ✅ All pages accessible
- ✅ Sitemap shows correct URLs
- ✅ Schema.org URLs correct in page source
- ✅ Apex domain redirects to www

### SEO Verification

- ✅ Google Search Console configured
- ✅ Sitemap submitted
- ✅ robots.txt accessible
- ✅ Schema.org markup valid
- ✅ Meta tags use production domain

## Commits

### Primary Commits

1. **`89098a2`** - chore: Update domain URLs to www.colossus-scaffolding.co.uk
   - Updated all 33 location MDX files
   - Updated environment variables

2. **`5ad29d8`** - chore: Remove deprecated Husky v9 shebang from pre-push hook
   - Fixed Husky v9 deprecation warning

3. **`5593134`** - docs: Update TODO.md with production domain configuration completion
   - Marked domain configuration as complete

### Merge Commits

- Multiple merge commits through develop → staging → main workflow
- All CI/CD checks passed

## Lessons Learned

### What Worked Well

1. **Git workflow** - develop → staging → main worked flawlessly
2. **Pre-push hooks** - Caught issues before they reached staging
3. **Automated testing** - CI pipeline gave confidence
4. **Atomic commits** - Single commit per logical change

### Challenges

1. **Husky warning** - Unexpected deprecation warning appeared
2. **DNS propagation** - Had to wait ~5 minutes for CNAME to propagate
3. **Manual URL updates** - 33 files manually updated (could automate in future)

### Improvements for Future

1. **Automation script** - Create tool to update all schema URLs
2. **Environment validation** - Check NEXT_PUBLIC_SITE_URL before build
3. **Domain checklist** - Document all steps for domain configuration
4. **DNS verification** - Add automated DNS check before deployment

## Cost Impact

### Domain Costs

- **Domain Registration:** £10/year (Google Domains / Squarespace)
- **SSL Certificate:** FREE (Let's Encrypt via Vercel)
- **CDN/Hosting:** Included in Vercel Pro plan (£20/month)

### Total Additional Cost

- **One-time:** £0 (domain already registered)
- **Annual:** £10/year (domain renewal)

## Next Steps

### Immediate

- [x] Submit updated sitemap to Google Search Console
- [x] Verify all pages indexing correctly
- [x] Monitor for 404 errors in production
- [x] Update any external links (if applicable)

### Short-term (Next 7 days)

- [ ] Monitor Google Search Console for indexing
- [ ] Check Google Analytics (if configured)
- [ ] Verify Schema.org in Google Rich Results Test
- [ ] Monitor Core Web Vitals

### Future Enhancements

- [ ] Add domain configuration to site creation tool
- [ ] Create domain setup guide for clients
- [ ] Automate schema URL updates
- [ ] Add domain health checks to monitoring

## Related Issues/PRs

**Commits:**

- `89098a2` - Domain URL updates
- `5ad29d8` - Husky fix
- `5593134` - TODO.md update

**Documentation:**

- Updated [docs/TODO.md](../../docs/TODO.md) - Production Domain Configuration section

## Notes

This was a straightforward but critical task - moving from localhost to production domain. The systematic approach (update all files → test locally → deploy through workflow) ensured zero downtime and no broken links.

The Husky deprecation warning was unexpected but quick to fix. Good reminder to keep dependencies updated and watch for deprecation warnings.

The git workflow (develop → staging → main) proved its value here - caught a couple small issues in staging before they reached production. The pre-push hooks and CI pipeline gave confidence that everything would work correctly.

Domain is now live and all 86 pages are accessible at www.colossus-scaffolding.co.uk. Ready for SEO work and client promotion!
