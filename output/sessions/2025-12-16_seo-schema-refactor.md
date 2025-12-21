# SEO Schema Refactoring - Phase 1 Complete

**Date:** 2025-12-16  
**Objective:** Refactor core-components schema utilities to be reusable across all sites  
**Status:** ✅ COMPLETE

## Changes Implemented

### 1. Created Schema Types File ✅

**File:** `packages/core-components/src/lib/schema-types.ts` (NEW)

Created comprehensive TypeScript interfaces for configurable schema generation:

- `BusinessConfig` - Complete business configuration with all Schema.org fields
  - Basic info: name, legalName, description, slogan
  - Contact: email, telephone, address, geo coordinates
  - Operations: opening hours, areas served
  - Optional: credentials, social profiles, ratings, services catalog
- `LocalBusinessSchemaOptions` - Factory options for LocalBusiness schema
  - Supports multiple business types: LocalBusiness, HomeAndConstructionBusiness, ProfessionalService, etc.
  - Takes BusinessConfig
- `ServiceAreaSchemaOptions` - Factory options for location-specific schemas
  - Location name and parent business reference
  - Areas served and services offered

### 2. Extended Schema.ts ✅

**File:** `packages/core-components/src/lib/schema.ts` (MODIFIED)

Added two new factory functions while keeping existing functions for backward compatibility:

#### `getLocalBusinessSchema(options: LocalBusinessSchemaOptions)`

Configurable LocalBusiness schema generator that:

- Accepts businessType and BusinessConfig
- Generates complete Schema.org LocalBusiness markup
- Conditionally includes optional fields (slogan, ratings, credentials, etc.)
- Supports opening hours specification
- Includes offer catalog for services

**Example Usage:**

```typescript
const schema = getLocalBusinessSchema({
  businessType: 'HomeAndConstructionBusiness',
  config: {
    name: 'Acme Plumbing',
    description: 'Professional plumbing services',
    email: 'info@acme.com',
    telephone: '+1234567890',
    address: { ... },
    geo: { latitude: '51.5074', longitude: '-0.1278' },
    openingHours: [
      { dayOfWeek: ['Monday', 'Tuesday'], opens: '09:00', closes: '17:00' }
    ],
    areaServed: ['London', 'Surrey'],
  }
});
```

#### `getServiceAreaSchema(options: ServiceAreaSchemaOptions)`

Location-specific schema generator that:

- Creates LocalBusiness schema for service area pages
- References parent organization via @id
- Maps areas served as City entities
- Optionally includes services offered in that location

**Example Usage:**

```typescript
const schema = getServiceAreaSchema({
  locationName: "Brighton",
  parentBusinessId: absUrl("/#organization"),
  areaServed: ["Brighton", "Hove", "Worthing"],
  services: ["Plumbing", "Heating", "Boiler Installation"],
});
```

**Backward Compatibility:**

- Kept `getOrganizationSchema()` - marked as @deprecated
- Kept `getWebSiteSchema()` - marked for future refactoring
- Universal utilities unchanged: `getBreadcrumbSchema()`, `getFAQSchema()`

### 3. Added Alt Text Support ✅

**File:** `packages/core-components/src/lib/content-schemas.ts` (MODIFIED)

Enhanced both Service and Location schemas with accessibility fields:

**ServiceFrontmatterSchema:**

- `hero.alt` - Alt text for hero image (20-125 chars, optional)
- `heroImageAlt` - Alt text for root-level hero image (20-125 chars, optional)

**LocationFrontmatterSchema:**

- `hero.alt` - Alt text for hero image (20-125 chars, optional)
- `heroImageAlt` - Alt text for root-level hero image (20-125 chars, optional)

All alt text fields:

- Minimum 20 characters for meaningful descriptions
- Maximum 125 characters (accessibility best practice)
- Optional to maintain backward compatibility
- Zod validation ensures quality when provided

### 4. Updated Package Exports ✅

**File:** `packages/core-components/src/index.ts` (MODIFIED)

Added export for new schema types:

```typescript
export * from "./lib/schema-types";
```

This makes `BusinessConfig`, `LocalBusinessSchemaOptions`, and `ServiceAreaSchemaOptions` available to consuming sites.

## Verification

✅ Type-check passed on core-components package  
✅ Type-check passed on colossus-reference site  
✅ Build succeeded for colossus-reference (76 pages generated)  
✅ All existing schema functions preserved for backward compatibility

## Next Steps (Phase 2)

1. **Update Colossus Site** to use new configurable schema:
   - Create site-specific business config
   - Replace `getOrganizationSchema()` calls with `getLocalBusinessSchema()`
   - Add location-specific schemas using `getServiceAreaSchema()`

2. **Add Alt Text to Content Files**:
   - Update service MDX files with `hero.alt` or `heroImageAlt`
   - Update location MDX files with alt text
   - Run content validation to ensure quality

3. **Additional SEO Enhancements**:
   - Add OpenGraph image alt text support
   - Implement Service schema for individual service pages
   - Add Product/Service schema for pricing pages

## Technical Notes

- **Package Structure:** Core-components exports TypeScript directly (no build step)
- **Type Safety:** All new functions are fully typed with comprehensive interfaces
- **Validation:** Alt text fields have Zod validation for length requirements
- **Documentation:** All new functions include JSDoc comments with examples

## Files Modified

1. `packages/core-components/src/lib/schema-types.ts` (NEW)
2. `packages/core-components/src/lib/schema.ts` (MODIFIED - added 2 functions)
3. `packages/core-components/src/lib/content-schemas.ts` (MODIFIED - added alt fields)
4. `packages/core-components/src/index.ts` (MODIFIED - added export)

## Impact

- **Zero Breaking Changes** - All existing code continues to work
- **New Capabilities** - Sites can now use configurable schema generation
- **Better Accessibility** - Alt text validation in place
- **Scalable** - Easy to add new sites with different business configurations

---

**Implementation Time:** ~30 minutes  
**Lines Changed:** ~350 lines added, 4 files modified  
**Test Status:** All builds passing
