# capture-site.mts

Headless Playwright capture of a reference site: screenshots + a machine-readable design report.
Written for the DPM Autobody discovery session so every teardown argues from the same evidence.

## Run it

**Must be run from the monorepo root** — `@playwright/test` only resolves there under pnpm.

```bash
cd /Users/rickywilson/Sites/local-business-platform
S=output/sessions/2026-08/2026-08-26_dpm-autobody-discovery
npx tsx $S/research/tools/capture-site.mts \
  --url https://www.example.com \
  --label example \
  --frames 10 \
  --out $PWD/$S/research/screenshots
```

`--out` must be **absolute**. `--frames` caps the scroll frames (one per 900px of page).

## Output — `research/screenshots/<label>/`

| File                                  | What                                                                                                                         |
| ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `desktop-hero.png`                    | 1440×900 @2x, above the fold, after cookie dismissal                                                                         |
| `desktop-00..N.png`                   | one frame per viewport of scroll, 1.6s settle — **this is what catches scroll-triggered reveals**, a full-page shot does not |
| `desktop-full.png`                    | whole page stitched                                                                                                          |
| `mobile-hero.png` / `mobile-full.png` | iPhone 13                                                                                                                    |
| `report.json`                         | see below                                                                                                                    |

`report.json` carries: `fonts` / `textColors` / `bgColors` / `typeScale` (tallied over leaf text nodes,
most-used first), `headings` (h1–h3 with computed size/weight/transform/letter-spacing), `videos`
(src, autoplay/loop/muted, poster, rendered box), `iframes`, `scripts`, `libs` (GSAP, ScrollTrigger,
Lenis, Locomotive, Swiper, Three, Framer Motion, React, Webflow, Squarespace, Wix, AOS…),
`animated` (counts of reveal/parallax-instrumented selectors), `stickyOrFixedCount`, `navText`,
plus `mediaRequests` and `fontRequests` from the network.

## Gotchas already hit and fixed — do not re-fix

- **`.mts`, not `.ts`.** tsx compiles `.ts` as CJS here and top-level `await` fails.
- **Import from `@playwright/test`,** not `playwright` — the bare package isn't at the root.
- **`__name is not defined`.** esbuild's keepNames wraps inner helpers; the identifier doesn't exist
  in the page. The script shims `globalThis.__name` before serialising `collect()` across. Keep it.
- `mediaRequests` over-matches — Wix/CDN image URLs contain the string "media". Filter by eye.

## Screenshots are not committed

`output/.gitignore` denies png/jpg/webm/mp4 across `sessions/**` by design — see
`docs/guides/prototype-hosting.md`. They are local reference. Don't try to add them.
