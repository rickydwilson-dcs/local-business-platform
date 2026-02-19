You are back-filling `countySlug` frontmatter into all 37 colossus location MDX files.
This is a pure content change — no code files are modified. Do not auto-commit.

Context: `countySlug` was added to `LocationFrontmatterSchema` in ARCH-006. The field is optional
and URL-safe (lowercase, hyphens only). It is the slug form of the human-readable `county` field.
This back-fill is step 1 of ARCH-010; the code change (removing the hardcoded array) comes after.

---

## The mapping

| county value | countySlug to add |
|---|---|
| East Sussex | east-sussex |
| West Sussex | west-sussex |
| Kent | kent |
| Surrey | surrey |

---

## Files to update

Add `countySlug: <value>` immediately after the `county:` line in each file's YAML frontmatter.

| File | county | countySlug |
|---|---|---|
| sites/colossus-reference/content/locations/ashford.mdx | Kent | kent |
| sites/colossus-reference/content/locations/battle.mdx | East Sussex | east-sussex |
| sites/colossus-reference/content/locations/bognor-regis.mdx | West Sussex | west-sussex |
| sites/colossus-reference/content/locations/brighton.mdx | East Sussex | east-sussex |
| sites/colossus-reference/content/locations/burgess-hill.mdx | West Sussex | west-sussex |
| sites/colossus-reference/content/locations/camberley.mdx | Surrey | surrey |
| sites/colossus-reference/content/locations/canterbury.mdx | Kent | kent |
| sites/colossus-reference/content/locations/chichester.mdx | West Sussex | west-sussex |
| sites/colossus-reference/content/locations/crawley.mdx | West Sussex | west-sussex |
| sites/colossus-reference/content/locations/crowborough.mdx | East Sussex | east-sussex |
| sites/colossus-reference/content/locations/dartford.mdx | Kent | kent |
| sites/colossus-reference/content/locations/dover.mdx | Kent | kent |
| sites/colossus-reference/content/locations/east-sussex.mdx | East Sussex | east-sussex |
| sites/colossus-reference/content/locations/eastbourne.mdx | East Sussex | east-sussex |
| sites/colossus-reference/content/locations/epsom.mdx | Surrey | surrey |
| sites/colossus-reference/content/locations/folkestone.mdx | Kent | kent |
| sites/colossus-reference/content/locations/guildford.mdx | Surrey | surrey |
| sites/colossus-reference/content/locations/hailsham.mdx | East Sussex | east-sussex |
| sites/colossus-reference/content/locations/hastings.mdx | East Sussex | east-sussex |
| sites/colossus-reference/content/locations/haywards-heath.mdx | West Sussex | west-sussex |
| sites/colossus-reference/content/locations/horsham.mdx | West Sussex | west-sussex |
| sites/colossus-reference/content/locations/kent.mdx | Kent | kent |
| sites/colossus-reference/content/locations/kingston-upon-thames.mdx | Surrey | surrey |
| sites/colossus-reference/content/locations/lewes.mdx | East Sussex | east-sussex |
| sites/colossus-reference/content/locations/littlehampton.mdx | West Sussex | west-sussex |
| sites/colossus-reference/content/locations/maidstone.mdx | Kent | kent |
| sites/colossus-reference/content/locations/margate.mdx | Kent | kent |
| sites/colossus-reference/content/locations/newhaven.mdx | East Sussex | east-sussex |
| sites/colossus-reference/content/locations/redhill.mdx | Surrey | surrey |
| sites/colossus-reference/content/locations/seaford.mdx | East Sussex | east-sussex |
| sites/colossus-reference/content/locations/sevenoaks.mdx | Kent | kent |
| sites/colossus-reference/content/locations/surrey.mdx | Surrey | surrey |
| sites/colossus-reference/content/locations/tunbridge-wells.mdx | Kent | kent |
| sites/colossus-reference/content/locations/uckfield.mdx | East Sussex | east-sussex |
| sites/colossus-reference/content/locations/west-sussex.mdx | West Sussex | west-sussex |
| sites/colossus-reference/content/locations/woking.mdx | Surrey | surrey |
| sites/colossus-reference/content/locations/worthing.mdx | West Sussex | west-sussex |

---

## How to apply each edit

For every file, find the `county:` line and insert `countySlug:` immediately after it. Example:

Before:
```yaml
county: East Sussex
```

After:
```yaml
county: East Sussex
countySlug: east-sussex
```

---

## Verification

After all 37 files are updated, run:
```bash
cd sites/colossus-reference && npx tsx scripts/validate-content.ts locations
```

All 37 files must pass. Then run from the repo root:
```bash
pnpm type-check
```

Both must pass before reporting done.

---

## UPDATE REMEDIATION AUDIT

After verification passes, update `output/sessions/2026-02-07_code-review/remediation-audit.md`:

ARCH-010 is only partially resolved by this change — the code change (removing the hardcoded
`COUNTY_PAGE_SLUGS` array) is a separate step. Update the ARCH-010 row in the **Still Open** table
to reflect the new state:

Change the Issue column to:
`MDX back-fill complete (countySlug added to all 37 files). Code change pending: remove hardcoded COUNTY_PAGE_SLUGS array and Hove redirect from locations.ts`

Do not move it to Fixed yet — the code half is still open.

Then report:
- How many files were updated
- Validation result (PASS or FAIL)
- Type-check result (PASS or FAIL)
- Confirmation that the audit was updated
