You are completing ARCH-010 part 2: removing the hardcoded COUNTY_PAGE_SLUGS array from
locations.ts and replacing it with a content-driven approach using the `countySlug` field
now present in all 37 location MDX files.

Do not auto-commit. Do not modify MDX files. Only modify the files listed below.

---

## Context

`sites/colossus-reference/lib/locations.ts` has:

1. `const COUNTY_PAGE_SLUGS = ["east-sussex", "west-sussex", "kent", "surrey"]` (line 36)
   - Used in `getAllTownLocations()` to filter out county overview pages
   - Used in `getAllCounties()` to iterate and build the county hierarchy

2. A hardcoded Hove→Brighton redirect inside `getAllCounties()` (lines 100–107):
   ```ts
   if (countySlug === "east-sussex") {
     countyTowns.push({ name: "Hove", slug: "hove", href: "/locations/brighton" });
   }
   ```

The MDX back-fill (part 1) has already added `countySlug` to all 37 location MDX files.
County overview pages (east-sussex.mdx, west-sussex.mdx, kent.mdx, surrey.mdx) have both
`county` and `countySlug` fields set.

The `ContentItem` type returned by `getContentItems()` is a generic record — all frontmatter
fields are accessible as properties.

---

## Step 1: Replace COUNTY_PAGE_SLUGS with a content-driven approach

**File:** `sites/colossus-reference/lib/locations.ts`

### 1a — Remove the hardcoded constant

Delete line 36:

```ts
const COUNTY_PAGE_SLUGS = ["east-sussex", "west-sussex", "kent", "surrey"];
```

### 1b — Update `getAllTownLocations()`

Currently filters out county pages using `!COUNTY_PAGE_SLUGS.includes(loc.slug)`.

Replace with: a page is a county overview page if it has a `countySlug` field AND its slug
equals its `countySlug`. That is: `loc.slug === loc.countySlug`.

```ts
cachedTowns = locations
  .filter(
    (loc) => loc.county && loc.coords && Array.isArray(loc.coords) && loc.slug !== loc.countySlug // exclude county overview pages
  )
  .map((loc) => ({
    name: loc.title,
    slug: loc.slug,
    coords: loc.coords as [number, number],
    county: loc.county as string,
    url: `/locations/${loc.slug}`,
    description: (loc.mapDescription as string) || loc.description || "",
  }));
```

### 1c — Update `getAllCounties()`

Currently iterates `COUNTY_PAGE_SLUGS` to find county pages.

Replace with: find all locations where `loc.slug === loc.countySlug` — these are the county
overview pages.

```ts
export async function getAllCounties(): Promise<CountyInfo[]> {
  if (cachedCounties) return cachedCounties;

  const locations = await getContentItems("locations");
  const allTowns = await getAllTownLocations();

  const counties: CountyInfo[] = [];

  // County pages are those where slug === countySlug (set during MDX back-fill)
  const countyPages = locations.filter((loc) => loc.countySlug && loc.slug === loc.countySlug);

  for (const countyData of countyPages) {
    const countyName = (countyData.county as string) || countyData.title;
    const countySlug = countyData.slug;

    // Get towns belonging to this county
    const countyTowns = allTowns
      .filter((t) => t.county === countyName)
      .map((t) => ({
        name: t.name,
        slug: t.slug,
        href: t.url,
      }));

    counties.push({
      name: countyData.title,
      slug: countySlug,
      href: `/locations/${countySlug}`,
      description: (countyData.countyDescription as string) || countyData.description || "",
      highlights: (countyData.countyHighlights as string[]) || [],
      towns: countyTowns,
    });
  }

  cachedCounties = counties;
  return counties;
}
```

Note: the Hove redirect block is intentionally removed — see Step 2.

---

## Step 2: Move the Hove redirect to MDX frontmatter

The Hove→Brighton redirect was hardcoded because Hove is part of Brighton & Hove unitary
authority and shares a page. Now that the county towns list is content-driven, this redirect
should live in content.

**File:** `sites/colossus-reference/content/locations/east-sussex.mdx`

In the `countyHighlights` or towns list, Hove appears as a well-known area but redirects to
the Brighton page. The cleanest approach: add Hove as an explicit entry in the county's town
list by adding a `redirectTowns` field to the east-sussex.mdx frontmatter:

```yaml
redirectTowns:
  - name: Hove
    slug: hove
    redirectTo: /locations/brighton
```

Then in `getAllCounties()`, after building `countyTowns`, check for `redirectTowns` in the
county frontmatter and append them:

```ts
// Append any redirect towns defined in frontmatter
const redirectTowns =
  (countyData.redirectTowns as Array<{ name: string; slug: string; redirectTo: string }>) || [];
for (const rt of redirectTowns) {
  countyTowns.push({ name: rt.name, slug: rt.slug, href: rt.redirectTo });
}
```

Add this block inside the `for (const countyData of countyPages)` loop, after building
`countyTowns` and before `counties.push(...)`.

---

## Step 3: Verify

Run from the project root:

```bash
pnpm type-check
```

Then run content validation:

```bash
cd sites/colossus-reference && npx tsx scripts/validate-content.ts locations
```

Then run:

```bash
pnpm build
```

All must pass.

---

## UPDATE REMEDIATION AUDIT

After verification passes, update `output/sessions/2026-02-07_code-review/remediation-audit.md`:

- Move ARCH-010 from the **Still Open** table to the **Fixed** table
- Evidence: `` `sites/colossus-reference/lib/locations.ts` — COUNTY_PAGE_SLUGS removed; getAllTownLocations() uses `loc.slug !== loc.countySlug`; getAllCounties() iterates content-driven county pages; Hove redirect moved to east-sussex.mdx `redirectTowns` field ``
- Update summary counts: Fixed +1, Still Open -1, Open by severity: 0 HIGH · 0 MEDIUM · 1 LOW
- Confirm in your final report
