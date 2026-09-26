# Estate-wide dead-code sweep

**Status:** Spec — ready to run in a fresh session
**Created:** 2026-09-26, from the DCS cleanup
**Branch:** start from `develop`

## Why this exists

DCS was redesigned in place twice (solaris → r9: homepage August 2026, the 15 inner routes in the
September port). Each phase left the superseded components "out of scope" rather than deleting
them. **Nothing ever failed** — `type-check` passes on an unimported file, `lint` does not flag it,
no test imports it, and Tailwind's purge only removes utilities it generated, never hand-authored
rules. So a whole retired design system kept shipping to every visitor for months, entirely green
in CI.

Cleaned from DCS on 2026-09-25/26:

| Removed                                                                                                                     | Size                           |
| --------------------------------------------------------------------------------------------------------------------------- | ------------------------------ |
| 11 orphaned components (7 solaris pages, the solaris header + footer, a dead scroll-reveal script, a dead icon-font loader) | 1,596 lines                    |
| `globals.css` — 27 authored classes, 6 keyframes, 5 custom properties                                                       | 314 → 69 lines                 |
| A cross-origin Google Fonts request for Material Symbols                                                                    | every page, 0 icons used       |
| Homepage CSS                                                                                                                | 126,991 → 114,299 bytes (−10%) |

The job now is to check whether the other nine sites carry the same debt. **The DCS work is done —
do not redo it.**

## The tool

```bash
npx tsx tools/find-dead-code.ts --site sites/<name>   # one site
npx tsx tools/find-dead-code.ts --all                 # everything
npx tsx tools/find-dead-code.ts --all --json          # machine-readable
```

Read `docs/standards/quality.md` § "Dead code from an in-place redesign" before acting on output.
**Output is candidates, not findings.**

## Sweep as of 2026-09-26 — verify before trusting, the estate moves

| Site                   | Unreachable        | Dead CSS classes | Notes                                                                                                                                                                                                                                                      |
| ---------------------- | ------------------ | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `mad-graphics`         | 2 files, 330 lines | **26**           | **Biggest offender.** Same solaris-era block as DCS (`.btn-*`, `.section-dark-accent`, `.noise-overlay`, `.location-pill*`, `.stat-value`) plus its own `.mobile-menu*` and `.lightbox-*`. `lib/performance-tracker.ts` is 328 of those lines. Start here. |
| `dj-fox-electrical`    | 2 files, 153 lines | 3                | `lib/locations.ts` (64 lines) is **also an architecture violation** — root `CLAUDE.md` forbids centralised TS data files by name: "NEVER create ... `lib/locations.ts` — frontmatter IS the data". Removing it closes both issues.                         |
| `colossus-scaffolding` | 2 files, 147 lines | 1                | `components/ui/accreditation-section.tsx` (142) — a real component, so confirm with the client/content owner that the section is genuinely retired before deleting.                                                                                        |
| `showcase`             | 5 files, 136 lines | 0                | All `lib/` shims. Low value, low risk.                                                                                                                                                                                                                     |
| `npracing-v1`          | 4 files, 109 lines | 1                | `lib/content.ts`, `lib/locations-config.ts`, `lib/mdx.tsx`.                                                                                                                                                                                                |
| `dch-automotive`       | 2 files, 170 lines | 0                | `components/pages/home-page.tsx` (168) — the same orphaned-after-redesign pattern as DCS.                                                                                                                                                                  |
| `npracing-v3`          | 2 files, 34 lines  | 1                | **Frozen site** (see `MEMORY.md`) — kept as a design reference. Probably leave alone; confirm first.                                                                                                                                                       |
| `dpm-autobody`         | 2 files, 23 lines  | 0                | Active client build.                                                                                                                                                                                                                                       |
| `base-template`        | 1 file, 2 lines    | 0                | See the systemic item below.                                                                                                                                                                                                                               |
| `dcs`                  | 1 file, 2 lines    | 5                | **Already cleaned.** The 5 remaining are in verbatim-guarded stylesheets — see Traps.                                                                                                                                                                      |

### Two systemic items, worth one decision each

1. **`lib/analytics/types.ts` is unreachable in 8 of 10 sites.** A 2-line re-export shim
   (`export * from "@platform/core-components/lib/analytics/types"`) that every consumer bypasses
   by importing the package path directly. It comes from `base-template`, so every new site
   inherits it. Decide once: delete it everywhere **and** from `base-template`, or keep it as the
   intended shim and fix the call sites to use it. Note `MEMORY.md` records that site `lib/` shims
   must import via **subpath not barrel** to avoid a vitest circular dependency — check that
   reasoning still applies before deleting the pattern wholesale.
2. **`.text-balance` is dead in 4 sites** (`colossus-scaffolding`, `dj-fox-electrical`,
   `npracing-v1`, `npracing-v3`) and also inherited from `base-template`. Same one-off decision.

## Traps — each of these has already produced a wrong answer

1. **A name-based grep will lie to you.** The r9 replacements frequently export the _same symbol_
   from a new path — `components/pages/LocationDetailPage.tsx` and
   `components/locations/location-detail-page.tsx` both export `SiteLocationDetailPage`. Grepping
   the symbol showed "3 references" for a file nothing imported. **Search for the import PATH.**
2. **Runtime-built class names are not dead.** ``className={`svccard svccard--${color}`}`` means
   the literal never appears in source. The tool buckets these under "probably fine" — never delete
   from that bucket without checking.
3. **Verbatim-guarded stylesheets must not be edited.** DCS's `home-r9.css` and `inner-pages.css`
   are asserted byte-for-byte against frozen sources by `home-css-parity.test.ts` and
   `chrome-parity.test.ts`. The 5 classes still reported dead in DCS live there and **stay**.
   Check whether the site you are cleaning has equivalent guards before touching any `.css`.
4. **Reachability cannot flag a dead thing that IS imported.** DCS's `SiteScrollReveal` was
   imported by the root layout and ran on every page — observing `.solaris-reveal` elements that no
   longer existed. Same for the Material Symbols font loader. **Read what root-layout components
   actually act on**, and check those targets still exist. The tool will never tell you this.
5. **A shell one-liner with `grep -c` and a `||` fallback will silently lie.** This exact pattern
   produced two wrong conclusions during the DCS work (a zsh glob error whose fallback printed
   "referenced nowhere", and a quoting error that printed `0` for every file). Write a script file
   and read its output.
6. **jsdom applies no stylesheet.** Removing CSS cannot be validated by the unit suite — it will
   stay green whatever you delete. Build and look at the page. See
   `docs/standards/testing.md` § "jsdom applies no stylesheet".

## Method per site

1. `npx tsx tools/find-dead-code.ts --site sites/<name>`
2. For each unreachable file, confirm nothing imports its **path**; check it is not referenced from
   MDX or a dynamic import.
3. For each dead class, confirm it is not runtime-built and its stylesheet is not verbatim-guarded.
4. Check the root layout for components that are imported but act on nothing.
5. Delete, then: `type-check`, `lint`, full test suite, **`build`**, and load the site and look at
   it — including the footer and any consent banner, which are the things a CSS deletion breaks
   most quietly.
6. Commit per site, so a regression is bisectable to one site.

## Acceptance

- Every site either cleaned or explicitly recorded as "checked, nothing to remove" / "deliberately
  left, because X".
- The two systemic items decided once and applied to `base-template`, so new sites stop inheriting
  them.
- No site's gates regress; every cleaned site builds and renders.

## Do not

- Do not remove a shared base layer (`globals.css`) from a route to win an "unused CSS" metric.
  Lighthouse measures one page, not a session; a shared cached stylesheet is correct architecture,
  and on DCS the root layout's Tailwind-styled consent banner depends on it. See
  `sites/dcs/PRODUCT.md`.
- Do not touch `sites/npracing-v3` without asking — it is a frozen design reference.
- Do not delete a client-facing component (e.g. colossus's accreditation section) on the tool's
  say-so; that is a content decision.
