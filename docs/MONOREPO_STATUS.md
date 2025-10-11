# Local Business Platform - Monorepo Status

**Date:** 2025-10-11
**Milestone:** Week 1 - Monorepo Foundation
**Status:** In Progress

---

## ✅ Completed

### Repository Setup
- ✅ Separate repositories established:
  - `colossus-scaffolding` → Original Colossus Scaffolding website (preserved)
  - `local-business-platform` → White-label platform monorepo
- ✅ Both repos have correct GitHub remotes
- ✅ colossus-scaffolding clean and deployable

### Monorepo Structure
- ✅ pnpm workspaces configured ([pnpm-workspace.yaml](../pnpm-workspace.yaml))
- ✅ Turborepo configured ([turbo.json](../turbo.json))
- ✅ Directory structure created:
  ```
  local-business-platform/
  ├── packages/core-components/  ✅ Created with components
  ├── sites/                     ⚠️  test-site-internal removed (broken imports)
  ├── tools/                     ✅ Directory created
  ├── assets/                    ✅ Directory created with README
  ├── app/                       ✅ Original Colossus app code
  ├── components/                ✅ Original Colossus components
  ├── lib/                       ✅ Original Colossus utilities
  └── content/                   ✅ Original Colossus MDX content
  ```

### Documentation
- ✅ [WHITE_LABEL_PLATFORM_DESIGN.md](WHITE_LABEL_PLATFORM_DESIGN.md) - Complete 8-week plan
- ✅ [assets/README.md](../assets/README.md) - Cloudflare R2 strategy
- ✅ This status document

---

## ⚠️ In Progress / Issues

### 1. Root Site Build Configuration
**Issue:** Root package.json was converted to monorepo coordinator but lost Next.js dependencies

**Current State:**
- Root has all original Colossus code (app/, components/, lib/, content/)
- Root next.config.ts exists and is configured
- Root package.json has scripts but missing dependencies

**Solution Needed:**
- Restore dependencies from colossus-scaffolding package.json
- OR: Keep root minimal and move everything to packages/colossus-site/
- Decide on architecture: Root as reference site vs. root as coordinator only

### 2. Test Sites
**Issue:** test-site-internal was created but has import path issues

**What Happened:**
- Full Colossus codebase was copied to sites/test-site-internal/
- Import paths still use `@/components/*` expecting local files
- Should import from `@platform/core-components` instead

**Solution Needed:**
- Option A: Fix test-site-internal imports to use @platform/core-components
- Option B: Remove test-site-internal and create minimal test sites from scratch
- Recommendation: Option B - start fresh with minimal structure

### 3. Component Extraction
**Issue:** Components exist in two places

**Current State:**
- Original components: `/components/`, `/lib/`
- Extracted components: `/packages/core-components/src/components/`, `/packages/core-components/src/lib/`
- Both copies exist, causing confusion

**Solution Needed:**
- Decision: Keep dual structure or consolidate?
- If dual: Root serves as reference, package for sharing
- If consolidate: Root imports from package (breaks if developing both)

---

## 🎯 Week 1 Goals (From Design Doc)

| Task | Status | Notes |
|------|--------|-------|
| Set up Vercel Pro team | ❌ Not started | Need account setup |
| Initialize Turborepo + pnpm workspaces | ✅ Complete | Configured and working |
| Extract Colossus into core-components | ⚠️  Partial | Extracted but dual copies exist |
| Deploy 2 test sites | ❌ Not started | Need working site first |
| Measure build times | ❌ Not started | Depends on working builds |

---

## 📋 Recommended Next Steps

### Immediate (To unblock Week 1)

1. **Decide on Architecture Pattern**
   - **Option A:** Root as reference site
     - Restore dependencies to root package.json
     - Keep root as working Colossus site
     - Use it as template for new sites
   - **Option B:** Root as coordinator only
     - Move all code to packages/colossus-reference/
     - Keep root minimal with just turbo/pnpm config
     - All sites in sites/ directory

2. **Get One Site Building**
   - Fix whichever approach chosen above
   - Run successful `npm run build` or `turbo build`
   - Verify all pages generate correctly

3. **Create Minimal Test Site**
   - Create sites/test-plumbing/
   - Minimal structure:
     ```
     sites/test-plumbing/
     ├── package.json (imports @platform/core-components)
     ├── next.config.ts
     ├── site.config.ts (business details)
     ├── app/ (minimal pages, import from package)
     └── content/ (MDX content only)
     ```

4. **Deploy to Vercel**
   - Set up Vercel Pro team
   - Deploy reference site
   - Deploy test site
   - Verify both work independently

5. **Measure Build Times**
   - Time single site build
   - Time turbo build with both sites
   - Document in performance baseline

---

## 🤔 Architecture Decision Needed

**Question:** Should the root of the monorepo be a working site or just a coordinator?

### Option A: Root as Working Site (Simpler)
```
local-business-platform/
├── app/              # Colossus site code
├── components/       # Colossus components
├── lib/              # Colossus utilities
├── package.json      # Has Next.js + all dependencies
├── packages/
│   └── core-components/  # Extracted shared components
└── sites/
    └── test-plumbing/    # New minimal test site
```

**Pros:**
- Simpler initial setup
- Root is working Colossus site
- Easy to develop and test
- Clear reference implementation

**Cons:**
- Mixes coordinator and site code
- Root package.json has many dependencies
- Less "pure" monorepo structure

### Option B: Root as Coordinator (Cleaner)
```
local-business-platform/
├── package.json      # Minimal, just turbo/pnpm
├── packages/
│   └── core-components/  # Shared components
└── sites/
    ├── colossus-reference/  # Original site moved here
    └── test-plumbing/       # New test site
```

**Pros:**
- Clean separation
- Pure monorepo pattern
- All sites treated equally
- Easier to add more sites

**Cons:**
- More refactoring needed now
- Colossus site moves from root
- Extra nesting level

### Recommendation: Option A for now

Start with Option A to get something working quickly. We can refactor to Option B later if needed. Week 1 goal is to prove the concept works, not to have perfect structure.

---

## 📝 Notes

- Colossus-scaffolding repo is safe and preserved
- No data loss - all original code exists
- Just need to decide on structure and fix configs
- WHITE_LABEL_PLATFORM_DESIGN.md has full 8-week plan

---

**Last Updated:** 2025-10-11
**Next Review:** After architecture decision made
