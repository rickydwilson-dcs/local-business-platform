# Session: 2025-12-07_r2-reorganization

**Start Date:** 2025-12-07
**Status:** Completed
**Objective:** Reorganize R2 bucket structure to use site-specific folders

## Summary

Migrated certificate images in R2 from `/certificates/` to `/colossus-reference/certificates/` to establish site-specific folder organization pattern. Updated documentation with new R2 bucket structure standard.

## Key Decisions

- All R2 images must now be in site-specific folders (e.g., `colossus-reference/`, `another-site/`)
- R2 folder names match `sites/` directory names
- Added `shared/` folder option for truly platform-wide assets
- Documented standard in `docs/standards/images.md`

## Files Modified

- `docs/standards/images.md` - Added R2 bucket structure standard, AI image pipeline docs
- `sites/colossus-reference/components/ui/accreditation-section.tsx` - Updated certificate URLs
- `tools/upload-certificates.ts` - Updated upload paths for future uploads

## R2 Changes

Migrated 10 files:

```
certificates/full/*.webp → colossus-reference/certificates/full/*.webp
certificates/thumbs/*.webp → colossus-reference/certificates/thumbs/*.webp
```

## Next Steps

- [x] Migration complete
- [x] Documentation updated
- [x] Merged to main

## Notes

- Used one-time migration script that was deleted after use
- CI initially failed due to missing lockfile entry for `@google/generative-ai` - fixed with separate commit
