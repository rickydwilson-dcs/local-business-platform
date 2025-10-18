# Corrupted Build Cache Troubleshooting

## Issue: Smoke Tests Failing with 404/500 Errors

### Symptoms

When running E2E smoke tests, you see failures like:

```
✗ /about → 404 (expected 200)
✗ /locations → 500 (expected 200)
✗ /locations/brighton → 404 (expected 200)
```

Production builds complete successfully, but the Playwright test server (running on port 3002) serves error pages.

### Root Cause

The `.next` build directory can become corrupted, resulting in missing webpack chunks and broken page manifests. This typically happens when:

- Build processes are interrupted (Ctrl+C during build)
- Multiple builds run concurrently
- File system issues during incremental builds
- Switching branches with different dependencies

### Error Messages in Console

You may see errors like:

```
⨯ Error: Cannot find module './871.js'
⨯ Error: ENOENT: no such file or directory, open '.next/server/app-paths-manifest.json'
⨯ Module not found: Can't resolve 'lucide-react/dist/esm/icons/...'
```

### Solution

Clear the corrupted `.next` directory and rebuild:

```bash
# Navigate to the affected site
cd sites/colossus-reference

# Remove the corrupted build cache
rm -rf .next

# Rebuild the project
npm run build

# Run smoke tests to verify
npm run test:e2e:smoke
```

### When This Happens

This issue typically occurs:

1. **After git operations** - Merging branches or switching between branches
2. **During development** - When running multiple dev servers or builds simultaneously
3. **After dependency changes** - When package.json or node_modules change
4. **Pre-push hook failures** - The build cache may be corrupted if tests fail during push

### Prevention

To minimize the likelihood of this issue:

1. **Stop dev servers before git operations:**

   ```bash
   # Find and kill dev servers
   lsof -ti:3000 | xargs kill -9
   ```

2. **Clean before important builds:**

   ```bash
   # Before pushing to staging/main
   rm -rf .next && npm run build
   ```

3. **Use Turborepo cache clearing when needed:**
   ```bash
   # Clear all Turborepo caches
   pnpm turbo clean
   ```

### Related Issues

- Next.js incremental build cache issues
- Webpack chunk loading failures
- Playwright test server using stale build artifacts

### References

- [Next.js Build Cache Documentation](https://nextjs.org/docs/architecture/nextjs-compiler)
- [E2E Testing Strategy](../testing/E2E_TESTING_STRATEGY.md)
- [smoke.spec.ts](../../sites/colossus-reference/e2e/smoke.spec.ts)

---

**Last Updated:** 2025-10-18
**Affected Sites:** colossus-reference
**Severity:** Medium (quick fix, but blocks deployments)
