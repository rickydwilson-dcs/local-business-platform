# CLAUDE.md

Guidance for Claude Code when working with the Local Business Platform monorepo.

## CRITICAL: Git Workflow

**ALL changes MUST follow this branching workflow. NO EXCEPTIONS.**

```
develop → staging → main
```

1. **ALWAYS start on `develop`** when making changes
2. **NEVER push directly to `staging` or `main`**
3. **Flow:** develop → commit → push → merge to staging → push → merge to main → push
4. **Verify CI passes** after each push: `gh run watch`
5. **Use `/deploy.changes`** to execute the full workflow automatically

**If you break this rule:** Stop immediately, inform user, ask how to proceed.

See [docs/guides/git-workflow.md](docs/guides/git-workflow.md) for detailed workflow.

---

## Debugging Approach

- When diagnosing UI or runtime bugs, check whether a dev server is running (`lsof -i :3000`); if not, start one before speculating about causes
- Fetch the running dev server (`WebFetch http://localhost:3000` or `:3001`) and take a screenshot to capture the visual state and any console output — do not ask the user for a screenshot if you can retrieve it yourself
- Do not guess at hydration errors, RSC serialisation, or z-index issues without evidence
- Check CSP headers early when scripts fail silently (`unsafe-eval`, `unsafe-inline` policies block many third-party scripts)
- When evidence is still needed after fetching, ask for a specific console screenshot or error message — not a general "can you share what you see"

See [docs/guides/debugging.md](docs/guides/debugging.md) for common issue patterns.

---

## How This Platform Works

This is a **white-label website platform** for local service businesses. The business model: take a single gold-standard template, customize it per client (colors, content, business info), and deploy each as an independent website.

**Shared utilities use factory patterns** in `packages/core-components` (see its `CLAUDE.md` for the exported factories) — this means bug fixes and improvements to shared logic flow to all sites automatically on next build.

**The theme system** makes white-labeling work. Each site defines a `theme.config.ts` with brand colors, typography, and component tokens. The theme system's Tailwind plugin transforms this config into CSS custom properties (`:root { --color-brand-primary: #xxx }`) and extends Tailwind with utility classes that reference those variables (`bg-brand-primary` → `var(--color-brand-primary)`). Change the config, rebuild, and the entire site re-themes.

**Self-contained sites.** As of July 2026, every site in the monorepo — including `dj-fox-electrical` and `colossus-scaffolding` — is self-contained: each site owns its own `Header`, `Footer`, page layout components, and theme CSS/tokens inlined directly in its own `theme.config.ts`, with no imports from `@platform/themes/*`. (Confirmed by direct grep across all sites — an earlier version of this note claimed dj-fox-electrical and colossus-scaffolding still imported the named orion/vega packages; that's no longer true in practice.) The `packages/themes/*` packages (orion, vega, cygnus, solaris, lyra) still exist as reference/extraction records but are not consumed at runtime by any current site. See `MEMORY.md` → "Site self-containment migration" for the recipe and rationale.

**New sites** are created by copying `sites/base-template` and customizing the config files. The intake system (`packages/intake-system`) can automate this by collecting business info through chat, extracting brand colors from logos/websites, and generating a project file that `tools/create-site-from-project.ts` consumes.

For deep dives into each system, see:

- [How Dynamic Routing Works](docs/architecture/how-dynamic-routing-works.md)
- [How the Theme System Works](docs/architecture/how-theme-system-works.md)
- [How the Build Pipeline Works](docs/architecture/how-build-pipeline-works.md)
- [How Site Creation Works](docs/architecture/how-site-creation-works.md)

---

## Key Architecture Rules

### MDX-Only Content

All content is managed through MDX files. This is non-negotiable because it keeps content separate from code. **NEVER create:**

- Individual static page files (`app/services/specific-service/page.tsx`) — use dynamic `[slug]` routes instead
- Centralized TypeScript data files (`lib/locations.ts`) — frontmatter IS the data
- Content-specific loaders or data structures — `lib/content.ts` handles all content types generically

### Styling with Theme Tokens

The theme system exists so sites can be re-branded without touching component code. **Always use theme tokens:**

- `bg-brand-primary`, `text-surface-foreground`, `text-h1` — these resolve to CSS variables
- Never hardcode hex colors (`bg-[#005A9E]`) — they break white-labeling
- Every theme must satisfy the Theme Component Contract — see `docs/standards/theme-component-contract.md`. (The CI validation script was retired in April 2026 alongside the self-containment pivot; the contract remains the architectural rule.)
- Reusable classes go in `app/globals.css` with `@apply`
- No inline styles, no CSS-in-JS — Tailwind only

### Components

- Shared components in `packages/core-components` — used across all sites
- Site-specific components in `sites/[name]/components/ui/`
- TypeScript interfaces for all props, named exports only (no default exports)

### Theme Package File Conventions

- Theme `components/` files use **lowercase filenames** (`header.tsx`, `footer.tsx`) and **named exports** in the barrel (`export { LyraHeader } from './header'`). Never use PascalCase filenames or `export *` — jiti (Tailwind's config loader) can't resolve them.
- Theme `index.ts` must **NOT** re-export from `./components` or `./pages` — this forces jiti to load every file at Tailwind config evaluation time. Sites import components via the subpath (`@platform/themes/orion/components`), not the theme barrel.
- Theme `pages/` files use PascalCase (`HomePage.tsx`) — this is safe because pages are imported by Next.js bundler, not jiti.

### Change Philosophy

- Do NOT remove existing features, templates, or content unless explicitly asked
- When in doubt, ASK before deleting
- Never over-engineer fixes for known upstream bugs — note the issue and move on
- Prefer minimal, targeted changes over sweeping refactors

### Vercel Monorepo Configuration

- Root `vercel.json` produces a trivial static build. Each site deploys as its own Vercel project with `rootDirectory` set to `sites/<name>`.
- Site `vercel.json` must NOT set `outputDirectory` — Vercel resolves `.next` relative to `rootDirectory` automatically. Setting it causes double-pathing.
- Every site `vercel.json` MUST set `"ignoreCommand": "cd ../.. && npx turbo-ignore <package-name> --fallback=HEAD^1"` (the workspace name from that site's `package.json`, e.g. `@platform/dcs` for `sites/dcs`). **Vercel has no automatic skip-if-unaffected behaviour** — without an explicit `ignoreCommand`, every connected project rebuilds on every push, even one that only touched an unrelated site or a root-level doc. This was correctly set up, then removed platform-wide in April 2026 (commit `2ea58db7`) on the mistaken belief that Vercel's monorepo `rootDirectory` linking handles this natively — it doesn't; `rootDirectory` only scopes _where_ a project builds from, not _whether_ it builds. Verified against Vercel's own docs and live deployment timestamps in August 2026 before restoring it. `turbo-ignore` v2.10.8 (npm, published within days as of August 2026, no formal npm deprecation) is still what's wired up here and confirmed working (`npx turbo-ignore <name>` correctly exits 1/"build" when the workspace is affected, 0/"skip" when it isn't) — contrary to that April commit's premise that it was deprecated. Its own CLI output does print a soft-deprecation notice pointing at `turbo query affected` as Turborepo's newer built-in replacement; that's a future migration to evaluate deliberately, not a reason to drop the guard again. Every new site copied from `base-template` must carry this line — check for it explicitly, since a `vercel.json` missing it will build silently and just look like a slightly slower/wasteful deploy, not an error.
- The `--fallback=HEAD^1` flag (added August 2026, per Vercel's own documented example config) is load-bearing, not optional polish. Vercel does a shallow git clone per build; `turbo-ignore` diffs against the SHA of that _specific project's_ last successful deployment, which for an infrequently-deployed site (e.g. `mad-graphics`, `colossus-scaffolding`, `dj-fox-electrical`, `dch-automotive` — anything that isn't mid-active-development) can fall outside the shallow clone once enough commits land elsewhere in the monorepo since its last deploy. When that SHA is unreachable, `turbo-ignore` fails open — "Previous deployment ... is unreachable" / "✓ Proceeding with deployment" — and builds unconditionally regardless of relevance, silently burning build minutes on every subsequent push (confirmed live: one of these sites rebuilt on a literal zero-file empty commit). `--fallback=HEAD^1` makes it diff against the immediately-preceding commit instead of giving up, which is a real (if narrower) affected-check rather than an unconditional build. It isn't a perfect substitute for the true since-last-deploy diff — a change several commits back that never landed in the latest commit can still be missed — but every site here deploys via one accumulated merge/push per promotion (not commit-by-commit), so a real change is very unlikely to be buried behind an unrelated later commit in practice.
- **`.vercelignore` must never match a git-tracked file inside a workspace package.** Vercel applies `.vercelignore` to the build's working tree on _every_ build (git-push-triggered included) **before** `ignoreCommand` runs. `turbo-ignore`'s filter `<pkg>...[<sha>]` sets `include_uncommitted`, so turbo additionally runs `git ls-files --others --modified` — and a tracked file deleted from disk without `git rm` reports as **modified**. So any `.vercelignore` pattern matching a tracked file inside a package directory marks that package "affected" on every single build, forever. A bare `*.png` rule (added Aug 2026 for CLI upload size, removed Sept 2026) did exactly this to 17 tracked files, and colossus-scaffolding, dcs, npracing-v1 and npracing-v3 rebuilt on every push for eleven days — 24 confirmed needless builds across six commits — while dj-fox-electrical, dch-automotive and mad-graphics, which have no tracked PNG inside their own package dir, correctly skipped throughout. That split is what isolates this cause. The same rule also stripped the files from the **production build output**: DCS shipped an `og:image` pointing at a 404 (breaking every link preview) and the npracing sites shipped no `icon.png`/`apple-icon.png`, while sibling `.svg`/`.ico` files in the same directories served fine — no build error, nothing red. Root-level tracked paths (`output/`, `.claude/`, `.agents/`, `tasks/`) are **not** affected by this: they sit outside every `pnpm-workspace.yaml` glob and aren't in `turbo.json` `globalDependencies`, so turbo has no package to attribute them to and ignores them — which is why deleting `output/` locally reproduces nothing and makes this look unreproducible. Enforced by `tools/__tests__/vercel-ignore-tracked-files.test.ts`; check by hand with `git ls-files -ci --exclude-from=.vercelignore -- sites packages tools` (empty = healthy). Full RCA: `docs/rca/vercel-turbo-ignore-always-affected.md`.
- **Verifying a turbo-ignore fix on a clean working tree proves nothing.** Both prior fixes to this same class of bug were validated that way and both missed the live cause, because a clean tree is precisely the state that cannot reproduce it — the defect only exists once `.vercelignore` has deleted files. Reproduce by applying `.vercelignore` to a throwaway clone (`git ls-files -ci --exclude-from=.vercelignore | xargs rm -f`) and _then_ running the exact `--filter=<pkg>...[<sha>] --dry=json` command from the build log.
- **A client prototype's Vercel project must never be named after the eventual production site — always suffix it `-proto`.** Vercel project names are unique per team/account, so a prototype deployed under the production name (e.g. `dpm-autobody`) blocks the real site from ever claiming that name later. Worse, the collision fails silently: importing a new project under an already-taken name just no-ops (no error, no navigation — the Deploy button looks like it's submitting and does nothing), which is easy to mistake for success and, had it worked, would have repointed the prototype's live production deployment instead of creating a second project. Hit exactly this scaffolding `sites/dpm-autobody` (2026-09-11) — the discovery-phase prototype had already claimed `dpm-autobody` on Vercel back in August, so the real Next.js site's import had to go through a rename-and-swap afterward (`dpm-autobody` → `dpm-autobody-proto` on the old project, freeing the name for the new one) rather than just working on the first try. Name every prototype `<site-name>-proto` from its very first deploy so this never has to be untangled later.

### CSS Syntax

- Never use Tailwind's `theme()` function in plain CSS files — it causes CSS parser panics. Use CSS custom properties: `var(--color-brand-primary)` not `theme('colors.brand.primary')`.
- Never nest a `fixed inset-0` mobile-nav dialog inside a header (or any ancestor) that has `backdrop-blur-*`/`backdrop-filter`. Per spec, `backdrop-filter` (like `transform`) makes that ancestor the containing block for `position: fixed` descendants, so the "fullscreen" overlay gets confined to the header's own small box instead of the viewport, spilling its content over the page beneath it. Render the dialog as a sibling of the blurred header, or portal it to `document.body` with `createPortal` — see `sites/npracing-v1/components/site-nav-mobile.tsx`.
- The `transform` half of that rule bites independently, and catches floating navs in particular: a centred floating nav built with `transform: translateX(-50%)` establishes a containing block even with no `backdrop-filter` present, so a nav that carries **both** has two separate triggers and fixing only the blur leaves the overlay trapped. Centre with `left`/`right`/`margin-inline` instead of a transform, and verify by measuring the opened panel — a trapped overlay reports the nav's own box (e.g. 277×58) where a correct one reports the viewport (390×844).
- Never put `font-variant-numeric: tabular-nums` on a figure containing a thousands comma. Tabular figures give the comma a full digit advance, so **`£1,995` renders as `£1 , 995`** — invisible in markup, obvious on screen, and it corrupts a _price_. It inherits, so an ancestor carrying the property breaks a figure that looks clean itself: resolve `font-variant-numeric` up the ancestor chain when checking, and scope `tnum` to comma-free numerals rather than setting it on `body`. Confirmed in Schibsted Grotesk and Newsreader; assume it applies to any face with tabular figures. **`tabular-nums` is only one way in — a monospaced body face does the same damage on its own.** Every glyph in a mono face occupies one cell, so the comma gets a full digit advance whether or not `font-variant-numeric` is set anywhere; setting prices in DM Mono reproduced `£1 , 995` with no `tnum` in the stylesheet at all (round 7 prototypes, August 2026). Since DM Mono is the chosen DCS body face this is a live risk, not a hypothetical: keep comma'd figures on the grotesk and reserve the mono for labels, units and comma-free numerals. When checking, resolve **both** `font-variant-numeric` and `font-family` up the ancestor chain.
- `position: sticky` gets its room to pin **only from in-flow content after the element inside its containing block** — and the two things you would reach for first both give it nothing. A `margin-bottom` on the sticky element gives none, because the spec clamps the element's _margin box_ against the containing block, so its own margin is part of what is being constrained. `padding-bottom` on the container gives none either, because padding is outside the content box, and the content box is what the containing block resolves to. Both were tried on the DCS work-section stack and both measured **0px of pin** for the last panel against 840–3940px for its siblings, which get their room from the panels that follow them. The last item in any sticky stack is therefore the one that silently fails to pin. Fix it with real in-flow content — `.stack::after{content:"";display:block;height:100lvh}` — and verify by sampling `getBoundingClientRect().top` across the scroll range: a pinned element holds `top: 0`, an unpinned one moves 1:1 with scroll.
- **A sticky element reports its _pinned_ position, not its layout position — and that silently breaks in-page anchor links.** Both `getBoundingClientRect()` and `offsetTop` return where the element currently sits, so once you have scrolled past an unbounded `position: sticky` section it still reads as `top: 0`. Native anchor navigation therefore has nowhere to scroll and does nothing at all: on the DCS homepage every nav and footer link left the scroll on 14392, and `offsetTop` returned 14391 for every section. Nothing errors and the href is correct, so this reads as "the link is broken" rather than as a positioning bug, and it only reproduces when you are _below_ the target — testing from the top of the page passes. Read the layout position by neutralising sticky for one synchronous measurement (`el.style.position='static'`, read, restore — no paint happens in between) and scroll there yourself with `e.preventDefault()`. Only relevant where a section is sticky with no bound; a sticky element inside a short container releases normally.
- Use `lvh`, not `svh`, for a section that must always cover the viewport. `svh` is the **smallest** viewport height — the state with mobile browser chrome expanded — so a section sized `100svh` becomes shorter than the screen the moment the URL bar retracts, leaking a strip of the next section exactly when it is meant to be full-bleed. `lvh` is never shorter than the viewport. The distinction is untestable in a desktop browser or an iframe harness, where all four viewport units resolve identically, so this is a rule to apply by construction rather than one you will catch by looking.
- An arbitrary Tailwind breakpoint variant using `rem` (`min-[56rem]:flex`, `max-[60rem]:hidden`) silently emits **zero CSS** — no warning in normal usage — when the project's `tailwind.config.ts` `screens` are defined in `px` (the default). Tailwind treats a `rem` arbitrary value against a `px`-based `screens` config as "mixed units" and drops the variant entirely, so the unprefixed base class (often `hidden`) wins at every viewport width. Confirmed by isolated `npx tailwindcss` runs: `min-[56rem]:flex` compiles to 0 rules against this platform's config, `min-[896px]:flex` compiles to 1. This hid an entire primary nav site-wide on `sites/dpm-autobody` (build-out, September 2026) before being traced to this cause — the component code, the nav data, and every other class on the element were correct. Use a `px` arbitrary value (`min-[896px]:flex`) or a named `screens` entry instead of a `rem` arbitrary value; verify by grepping the compiled `.next/static/css/*.css` for the expected `@media (min-width:...)` rule rather than trusting that the class compiled just because the build succeeded.

### Performance

- A `<video autoPlay>` fetches real data the moment it mounts, **regardless of `preload="metadata"`** — the browser must start buffering to honour autoplay, so `preload` only controls behaviour when autoplay is absent. A page with several background-video panels below the fold (e.g. a portfolio/work-stack section) will eagerly download all of them on load even though the visitor may never scroll that far: DCS's homepage had 7 such videos totalling 9.7MB, all fetched immediately, which is what a Lighthouse mobile audit's throttled-4G simulation was measuring when it scored LCP at 4.3s despite the actual LCP element being server-rendered text with nothing to do with video. Gate loading behind an `IntersectionObserver` instead — render the `poster` only, set `src` and call `.play()` once the panel nears the viewport — see `sites/dcs/components/home/lazy-video.tsx`. This cut that page's payload from 10.5MB to ~700KB.
- A third-party `<link rel="stylesheet">` (e.g. a Google Fonts icon-font URL) placed in the root layout's `<head>` is render-blocking on **every route that layout covers**, even ones that never use it. DCS's Material Symbols stylesheet lived in `app/layout.tsx` and cost ~800ms of Lighthouse's estimated LCP/FCP savings on the homepage, which uses none of those icons — icon fonts elsewhere in the site do use it, but nothing above the fold needs it synchronously. Load it after mount from a small client component instead (insert the `<link>` via `document.head.appendChild` inside `useEffect`) — see `sites/dcs/components/material-symbols-font.tsx`. It still must be a real `<link>`, not a CSS `@import` — Tailwind's `@tailwind` expansion buries an `@import url()` mid-file and the browser silently ignores it per spec. The fix here is _when_ the link loads, not _how_.

### Fonts

- `next/font/google`'s `weight` accepts only a discrete literal, an array of them, or `'variable'`
  — there is no bounded-range syntax (`wght@200..600` from a raw Google Fonts URL has no
  equivalent), confirmed against the package's own `.d.ts`. A `weight: 'variable'` font downloads
  its _entire_ default weight axis regardless of which weights the site actually uses, which can
  make fonts the single largest asset category on a page — 229 KB across 3 families on
  `dpm-autobody`'s homepage, more than JS or images combined, found via a Lighthouse audit
  (September 2026). Fix by switching to the exact discrete weight list the site uses (grep every
  `font-(thin|extralight|light|normal|medium|semibold|bold|extrabold|black)` class across
  `.tsx`/`.mdx` first) — a missing weight doesn't error, it silently falls back to a synthetic
  (browser-faked) bold/thin instead of the true drawn one, so re-run the grep before adding any
  new weight class.
- `axes: [...]` on a `next/font/google` call (e.g. `['opsz']` for Fraunces/Newsreader's
  optical-size axis) can only be combined with `weight: 'variable'` — pairing it with a discrete
  `weight` throws a hard build error ("Axes can only be defined for variable fonts when the weight
  property is nonexistent or set to `variable`"). So converting a variable-weight font to a
  discrete list (see above) means giving up that axis too, not just narrowing the weight range.
  Confirmed by a failed `dpm-autobody` production build; spot-checking the site's real pages
  afterward found no visible regression from losing the opsz interpolation.

### Tailwind Content Globs

- Never use `packages/themes/**/*.{ext}` — the `**` descends into `node_modules/` causing 18+ minute builds. Use scoped globs: `packages/themes/*/*.{ext}` and `packages/themes/*/components/**/*.{ext}`.

### Build & CI

- Production builds use `next build --webpack`. Turbopack has PostCSS bugs in CI. Turbopack is still used for `next dev`.
- Every env var affecting build output must be in `turbo.json` `env` array — missing vars cause stale cache hits.
- E2E tests in CI use `next start` (pre-built), not `next dev`. New Relic is disabled in CI.
- Pre-push hook runs only `type-check` (~3s). Full build runs in CI.
- Every site's `next.config.ts` CSP `script-src` must gate `'unsafe-eval'` behind `process.env.NODE_ENV === 'development'` (see `docs/standards/security.md`'s CSP Notes) — omitting it entirely breaks `next dev`'s webpack HMR/React Refresh runtime, which evaluates code as strings, throwing an `EvalError` on load that silently kills all client-side interactivity (buttons, forms) while the page still renders and looks fine. Production correctly omits it. A site copied from `base-template` inherits this correctly; don't hand-roll a CSP header without it.
- A site copied from `base-template` inherits a CSP with **no `media-src` directive**. CSP falls back to `default-src 'self'` for `<video>`, so the first `<video>` element anyone adds is silently blocked — no console error visible until you check, just an empty box where the clip should be. Add `media-src 'self' https://*.r2.dev;` (or the site's actual media host) alongside the existing `img-src`. Verified against the real emitted header, not assumed: `sites/dcs/next.config.ts` was fixed this way in August 2026, and `sites/dcs/test/csp.test.ts` imports the real `headers()` array from `next.config.ts` and asserts the actual emitted CSP string in both `development` and `production` — a hand-written copy of the header would not have caught the gap.
- A site copied from `base-template` also inherits a CSP `frame-src` with **no video-embed allowance** (only `vercel.live *.vercel.live`). The first `<iframe>` embedding a YouTube credit — as opposed to a `<video>` served directly from R2 — is silently dropped the same way: page renders fine, empty box where the player should be, nothing in the console until you check. Add `https://www.youtube-nocookie.com` to `frame-src` the first time a site embeds a video this way. Fixed this way in `sites/dpm-autobody/next.config.ts`, September 2026 — see `docs/standards/security.md`'s CSP Notes.
- **A remote image host needs allow-listing in two separate places — CSP `img-src` and `next/image`'s own `images.remotePatterns`** — and they fail in opposite ways: missing from CSP is silent (empty box, no error); missing from `remotePatterns` throws a loud build/runtime error naming the exact hostname. Hit both fixing one after the other adding YouTube thumbnails (`i.ytimg.com`) to `sites/dpm-autobody`, September 2026 — see `docs/standards/security.md`'s CSP Notes.

---

## Essential Commands

```bash
# Session verification — MANDATORY at the end of every coding session, use `pnpm --filter <site> run lint` per modified site

# Content validation — checks MDX frontmatter against Zod schemas
npx tsx ../../scripts/validate-content.ts services   # Service files only
npx tsx ../../scripts/validate-content.ts locations  # Location files only

# Theme validation — WCAG contrast checking (run from packages/theme-system/)
pnpm --filter @platform/theme-system validate --config ../../sites/[site-name]/theme.config.ts

# Site creation
npx tsx tools/create-site-from-project.ts --project [project-file.json]
```

---

## Dev Server Management

- Before starting a dev server, run `lsof -i :3000` (or the target port) to check for existing processes
- If the port is occupied, identify which site/project owns it — do NOT kill the process without confirmation
- If Turbopack causes PostCSS or worker errors in dev, retry with `--webpack` flag: `npm run dev -- --webpack`
- Confirm the server is reachable with `curl -s http://localhost:3000` before reporting it as running
- When restarting a server to pick up a rebuild (e.g. before re-verifying a fix), check that `pnpm run start`/`dev` actually bound the port — a stale process from earlier in the session can still hold it, in which case the new command fails with `EADDRINUSE` and exits immediately while the old build keeps quietly answering every request. `curl` alone won't catch this (the old server still returns 200); check the log output for the `EADDRINUSE` error, or confirm the listening PID changed (`lsof -i :<port> -sTCP:LISTEN`) after restart. Hit exactly this on `dpm-autobody` (September 2026): a background `pnpm run start` failed silently, and every "verification" screenshot and Lighthouse run afterward was unknowingly testing the pre-fix build.

---

## When Things Break

### TypeScript Errors During Push

```bash
npm run type-check  # See errors with file:line references
# Fix the errors
npm run type-check  # Verify fix before pushing
```

### Build Failures

```bash
npm run build       # See exact error
# Common causes: import/export mismatches, missing deps, MDX syntax errors
```

### Content Validation Failures

```bash
npm run validate:content  # Shows which MDX files fail and why
# Common: description length (50-200 chars), FAQ count (3-15), missing required fields
```

### Vercel Deployment Failures

- **"No Output Directory found"** — Check that site `vercel.json` does NOT set `outputDirectory`. Vercel resolves paths relative to `rootDirectory`, so setting it causes double-pathing.
- **CSS parser panic, stale builds after an env var, or 18+ minute Tailwind builds** — see the CSS Syntax / Build & CI / Tailwind Content Globs rules under "Key Architecture Rules" above.
- **CI scan gate fails with missing token** — `SNYK_TOKEN` must be set in the Vercel project environment variables before security scan gates will pass.

---

## Parallel Sessions & Git Worktrees

Default to a single feature branch off `develop` — worktrees are only for 2+ concurrent long-running sessions on independent work. See the `worktree-strategy` skill for the decision rule and mechanics.

---

## Documentation

### Architecture (How It Works)

| Document                                                                                      | Teaches                                                              |
| --------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| [How Dynamic Routing Works](docs/architecture/how-dynamic-routing-works.md)                   | MDX file → static page via `[slug]` routes                           |
| [How the Theme System Works](docs/architecture/how-theme-system-works.md)                     | Config → CSS variables → Tailwind classes                            |
| [How the Build Pipeline Works](docs/architecture/how-build-pipeline-works.md)                 | Turborepo, packages, workspace linking                               |
| [How Site Creation Works](docs/architecture/how-site-creation-works.md)                       | Intake → project file → new site → deploy                            |
| [How the Ingestion Pipeline Works](docs/architecture/how-ingestion-pipeline-works.md)         | Screenshot → analysis → components → theme package                   |
| [How the Stitch Design Pipeline Works](docs/architecture/how-stitch-design-pipeline-works.md) | Stitch AI design → tokens → theme package → test site                |
| [Clone Package Format](docs/pipeline/CLONE_PACKAGE_FORMAT.md)                                 | CPF spec: the intermediate format between clone and theme extraction |
| [Architecture Overview](docs/architecture/architecture.md)                                    | High-level system overview                                           |
| [Content Validation](docs/architecture/content-validation.md)                                 | Zod schemas for MDX frontmatter validation                           |
| [Monitoring Dashboard](docs/architecture/monitoring-dashboard.md)                             | Dashboard design for site registry and monitoring                    |
| [Component Composition System](docs/architecture/component-composition-system.md)             | Config-driven page composition engine and two-pass AI pipeline       |

### Standards (How to Do It Right)

| Standard                                         | Covers                                |
| ------------------------------------------------ | ------------------------------------- |
| [Styling](docs/standards/styling.md)             | Tailwind CSS, theme tokens            |
| [Components](docs/standards/components.md)       | Component architecture, TypeScript    |
| [Content](docs/standards/content.md)             | MDX architecture, frontmatter schemas |
| [SEO](docs/standards/seo.md)                     | Meta data, keywords, local SEO        |
| [Images](docs/standards/images.md)               | R2 storage, optimization, naming      |
| [Schema](docs/standards/schema.md)               | JSON-LD structured data               |
| [Testing](docs/standards/testing.md)             | Unit tests, E2E tests                 |
| [Security](docs/standards/security.md)           | Rate limiting, API security, GDPR     |
| [Analytics](docs/standards/analytics.md)         | Consent management, GA4               |
| [Deployment](docs/standards/deployment.md)       | CI/CD, monitoring, rollback           |
| [Quality](docs/standards/quality.md)             | Quality gates, checklists             |
| [Documentation](docs/standards/documentation.md) | Documentation maintenance guidelines  |

### Guides (How to Do Common Tasks)

| Guide                                                             | Purpose                                           |
| ----------------------------------------------------------------- | ------------------------------------------------- |
| [Adding a New Site](docs/guides/adding-new-site.md)               | Create a new client site                          |
| [Creating a New Theme](docs/guides/creating-new-theme.md)         | Create a theme via ingest or Stitch pipeline      |
| [Theming](docs/guides/theming.md)                                 | Configure site theme tokens and overlays          |
| [Adding a Service](docs/guides/adding-service.md)                 | Add service MDX content                           |
| [Adding a Location](docs/guides/adding-location.md)               | Add location MDX content                          |
| [Git Workflow](docs/guides/git-workflow.md)                       | Branch workflow details                           |
| [Deploying a Site](docs/guides/deploying-site.md)                 | Deployment procedures                             |
| [Orchestration Patterns](docs/guides/orchestration-patterns.md)   | Skill patterns: sequential, parallel, hybrid      |
| [GitHub Actions](docs/guides/github-actions.md)                   | CI/CD workflow configuration                      |
| [Monitoring Setup](docs/guides/monitoring-setup.md)               | NewRelic and Vercel monitoring setup              |
| [Adding a Content Section](docs/guides/adding-content-section.md) | Add new MDX content type with dynamic route       |
| [Registry Setup](docs/guides/registry-setup.md)                   | Supabase site registry and monitoring setup       |
| [End-to-End Workflow](docs/guides/end-to-end-workflow.md)         | Full site creation workflow from intake to deploy |
| [Component Versioning](docs/guides/component-versioning.md)       | Versioning shared components in core-components   |
| [Debugging](docs/guides/debugging.md)                             | Diagnosing UI, runtime, build, and CSP issues     |
| [Prototype Hosting](docs/guides/prototype-hosting.md)             | Prototype assets to R2, prototype HTML to Vercel  |
| [Project History](docs/project-history.md)                        | Platform changelog and development phases         |

---

## Documentation Maintenance

Run `/update.docs` before deploying. This verifies documentation accuracy against the actual codebase — checking that architecture docs describe current patterns, links resolve to real files, and instructional content matches how the system actually works.

The `/deploy.changes` skill runs `/update.docs` automatically as its first step.

---

## Output Folder

The `/output/` folder stores session context and working notes for complex tasks. The `sessions/` subfolder is tracked in git.

Use sessions for: research tasks, feature implementation notes, bug investigations, architecture decisions.

**Naming:** `YYYY-MM/YYYY-MM-DD_topic-description`

**Prototype assets never go in git.** Images and video under
`output/sessions/**/prototype/assets/` are uploaded to R2 and the HTML rewritten to absolute
URLs; the prototypes then deploy to Vercel so they are reviewable from a URL rather than a
`file://` path. Two commands, in order — `tools/upload-prototype-assets.ts` then
`tools/publish-prototype.ts`. `output/.gitignore`'s `!sessions/**` line had been overriding the
root `.gitignore`'s image rules, which let 117MB of unreferenced PNGs become stageable in August
2026; an explicit binary deny-list now sits below it. A later rule ignores
`sessions/**/screenshots/` outright rather than just its binaries — a capture dump also contains a
machine-generated `report.json` describing screenshots nobody else can see, so the whole directory
goes and the conclusions live in the teardown markdown instead. See
[docs/guides/prototype-hosting.md](docs/guides/prototype-hosting.md).

See [output/README.md](output/README.md) for details.

## Session Wrap-Up Standard

Every session ends with a `session-wrap-up.md` in the session folder:

- **YOLO sessions:** The brief's final phase runs `/wrap-up-session` automatically.
- **Interactive sessions:** Run `/wrap-up-session` before closing.
- **Fallback:** The SessionEnd hook writes a minimal placeholder if the command was skipped.

The wrap-up captures: goal, what was done, key decisions, commits, significant files changed, and what was learned.
