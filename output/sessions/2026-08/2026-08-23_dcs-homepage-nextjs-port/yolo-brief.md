# YOLO Implementation Brief: Port the r9 DCS homepage prototype into `sites/dcs` as Next.js, verify pixel parity in Chrome, deploy to production

**Branch:** `feature/dcs-homepage-nextjs-port` (created from `develop` — the repo's integration branch per `CLAUDE.md`; the remote default is `main` but this project mandates `develop → staging → main`)
**Session spec:** `output/sessions/2026-08/2026-08-23_dcs-homepage-nextjs-port/yolo-brief.md`
**Mode:** Autonomous execution — coordinate all phases, delegate implementation to sub-agents, verify after each, STOP on error
**Orchestrator model:** sonnet — coordinator only; per-phase `**Model:**` tiers attach to delegated sub-agents and are independent of this
**Run ID (session observability):** `2026-08-23_dcs-homepage-nextjs-port`
**Total phases:** 14 (Phase 0 through Phase 13)

---

## Context

**Plan source:** Claude independent plan (no `synthesis.md`, no Codex peer review — generated directly from `output/sessions/2026-08/2026-08-17_dcs-homepage-redesign/HANDOFF.md` and a direct read of the prototype and the target site). Hold to the gates all the more.

Nine rounds of art direction produced `output/sessions/2026-08/2026-08-17_dcs-homepage-redesign/prototype/r9-kota-level.html` — a 1,235-line standalone HTML homepage (≈735 lines of hand-tuned CSS, ≈180 lines of vanilla JS) built to the craft level of `kota.co.uk`. It is deployed and reviewable at https://2026-08-17-dcs-homepage-redesign.vercel.app/r9-kota-level. It has never been ported to React.

This brief ports it into `sites/dcs` (an existing Next.js 16 site, currently on the solaris theme) as the homepage, verifies it against the prototype in Chrome by measurement rather than by eye, and deploys it to the existing Vercel project `dcs`.

Implement the plan exactly as specified below.

### Scope — decided by Ricky, 2026-08-23

**In scope**

- The homepage (`/`) only, ported to pixel parity with `r9-kota-level.html`.
- Homepage nav stays **in-page anchors only** (`#work`, `#services`, `#pricing`, `#faq`, `#end`), exactly as prototyped. Ricky: _"for now start with 3. when we build the other pages we will create links in pages."_
- A new **Terms & Conditions** page, created but not linked.
- The 14 existing inner routes keep working and keep their current solaris furniture. They are **not** restyled and **not** linked from the homepage.
- **Only `/` is indexable.** Every other route gets `noindex` and comes out of the sitemaps until the inner pages are built. Ricky: _"initially lets just have the homepage crawlable until we build the others."_ Reversing it later is one line per section, by design.
- Production deploy to the Vercel project `dcs` (`prj_ysC3rXNhzTD4oyZbrkXK51BZykYX`) via the Vercel CLI.

**Explicitly out of scope — do NOT do these**

- **Old-URL → new-URL redirects.** Ricky has a separate session tracking this. Do not write a redirect map, do not touch `next.config.ts` `redirects()`, do not touch `proxy.ts`.
- **The DNS / domain cutover.** `output/sessions/2026-08/2026-08-23_dcs-site-cutover/cutover-plan.md` owns it. The `dcs` Vercel project has no custom domain and this brief does not attach one. Ricky sets the root domain himself.
- **Restyling any inner page.** `/about`, `/services`, `/locations`, `/projects`, `/blog`, `/pricing`, `/reviews`, `/contact`, `/privacy-policy`, `/cookie-policy` keep the solaris look for now.
- **Regenerating any video.** All five client clips and the two Higgsfield timelapses already exist in R2 and cost real credits. Re-rolling one is 10 credits. Copy, never regenerate.
- **Deleting the dead CSS** (`.worksec`, `.cards`, `.card`, `.cards--2`, `.work`, `.row`, `.svcs`, `.svc`, `.slot`). A greedy regex wiped the prototype stylesheet once already. Port it verbatim, dead rules included. A deliberate removal pass is a separate job.

### Decisions deferred to Ricky — surface, do NOT act on

Report these in the Final Report. Do not implement any of them.

1. **The canonical host is unsettled.** `site.config.ts:165` declares the **apex** canonical; the live WordPress site canonicalises to `www`, and all its backlinks and Search Console history are on `www` (measured in `cutover-plan.md`). Phase 8 makes `/` the one indexable URL, which makes this matter more, not less — but the canonical host is a cutover decision and this brief does not touch it. Report it; do not change it.
2. **Legal pages are unlinked but the cookie banner links to them.** `app/layout.tsx` renders `ConsentManager` with `privacyPolicyUrl: '/privacy-policy'` and `cookiePolicyUrl: '/cookie-policy'`. With no footer link, the banner is the only route in. Report; do not change.
3. Everything under "Open questions" in `HANDOFF.md` (pricing anchor collision, page length, missing client URLs, loop seams) is still open and is not this brief's business.

---

## Model Tiers

| Tier   | Alias    | Relative cost | Use for                                                                                             |
| ------ | -------- | ------------- | --------------------------------------------------------------------------------------------------- |
| Opus   | `opus`   | highest       | Phases with >5 interdependent files, architectural rewrites, judgment calls not covered by the spec |
| Sonnet | `sonnet` | mid           | Standard implementation — file edits, feature wiring, most phases                                   |
| Haiku  | `haiku`  | lowest        | Mechanical tasks: find-replace, import additions, grep checks, content validation                   |

Default orchestrator: **sonnet**. Default sub-agent: **sonnet** unless the task is clearly mechanical (→ haiku) or requires deep cross-file reasoning (→ opus).

> Per-MTok rates are deliberately not quoted here — they are a vendor fact that changes and must not be asserted from memory. The Cost Estimate below states its assumed rates inline and flags them as unverified. Exact spend: console.anthropic.com.

## Delegation Model

The orchestrator is a **coordinator, not an implementer**. Its job is: read this brief,
sequence the phases, dispatch sub-agents, run verification gates, make commits, and write
the final report. It does **not** implement phase work inline by default.

**Every phase's implementation work is delegated to one or more `Task` sub-agents**, each
spawned at the phase's `**Model:**` tier. The model annotation _is_ the sub-agent's model —
it is meaningless unless the work is delegated, because the orchestrator cannot change its
own running model. A `**Model:** haiku` phase executed inline runs at full orchestrator
cost and consumes orchestrator context; delegating it keeps that work in the sub-agent and
returns only a short summary.

**Inline exception.** The orchestrator may implement a phase inline ONLY when the work is
tightly cross-coupled and correctness-critical — e.g. a deterministic engine spanning many
interdependent files with exact golden vectors — where round-tripping through a sub-agent
would lose essential context. When taken, the phase MUST declare
`**Execution:** inline (exception) — <one-line rationale>`. This is the exception, not the
default; prefer delegation whenever the work is separable.

The orchestrator's own model (set by the launch command) is **independent** of the phase
tiers. Opus orchestrating while individual phases delegate to haiku/sonnet sub-agents is
expected and correct — the orchestrator coordinates; the tiers attach to sub-agents.

---

## Traps — read before Phase 0, they are carried from nine rounds of prototype work

These are measured, not theoretical. Six of them cost real time and four of them caused wrong diagnoses that only measurement caught.

1. **`requestAnimationFrame` is frozen in a backgrounded tab**, which is the state during `javascript_tool` evaluation. Everything rAF-driven reads stale: the nav's `data-ground`, the `.res` reveals, smooth scrolling, transitions mid-flight. This produced five false readings in the prototype session, including a "settled" poll that was a frozen value repeating. **Compute what the function would return; never read the live result.** Never `await` inside a rAF callback — it hangs until the 45s CDP timeout.
2. **Screenshots can be stale compositor frames.** Repeatedly showed mismatched state where the DOM was provably correct. Trust `getComputedStyle` / `getBoundingClientRect`, not pixels. Screenshots are for the human, measurement is for the gate.
3. **`elementFromPoint` measures hit-testing, not visibility.** `.svcstack` spans its area with `z-index:1` and no background, so it intercepts the point while showing what is behind it.
4. **Sticky elements lie about their position.** Both `getBoundingClientRect()` and `offsetTop` report the _pinned_ position, not the layout one — from the page bottom every section reads `14391`. This is exactly why the prototype intercepts in-page links. The only reliable read is neutralising `position` for one synchronous measurement (`layoutTop()` in the prototype script).
5. **`position: sticky` room comes only from in-flow content after the element.** A bottom margin gives none (the margin box is what gets clamped); container padding gives none (it is outside the content box). Both measured 0px of pin. `.wstack::after{height:100lvh}` is load-bearing — delete it and the last work panel silently stops pinning.
6. **`python3 -m http.server` honours `If-Modified-Since`** and serves a stale file after an edit. Any harness must cache-bust.
7. **`resize_window` returns success but does not change the viewport.** Use an iframe harness with an explicit width/height.
8. **Every image and video under `output/sessions/` is gitignored.** The mp4s and posters exist on disk and in R2 but not in git. Do not try to commit them.
9. **Port 3000 is `npracing-v1`, not dcs.** Check `lsof -i :<port>` before starting anything. This brief uses **3100** for the dcs build and **4321** for the prototype reference server.
10. **Comma'd prices must stay in Archivo, never a mono face and never with `tabular-nums`.** `£1,995` renders as `£1 , 995` otherwise. Resolve both `font-variant-numeric` and `font-family` up the ancestor chain when checking.
11. **A `fixed inset-0` overlay must never be nested inside a `backdrop-filter` or `transform` ancestor** — it gets trapped in that ancestor's box. The prototype's `.menu` is a **sibling** of `.bar` for this reason. Keep it a sibling in React; do not let the component tree nest it.
12. **The hero must render its headline visible without JS.** The prototype's own thesis names this as the thing the reference site gets wrong. The per-character split must happen during React render, not in a `useEffect`.

---

## Pre-flight

```bash
cd /Users/rickywilson/Sites/local-business-platform

# Base branch for this repo is develop (CLAUDE.md: develop → staging → main, NON-NEGOTIABLE)
git checkout develop && git pull
git checkout -b feature/dcs-homepage-nextjs-port

# Session observability run-init — the skill is present via $SESSION_OBSERVABILITY_SKILL_PATH
python3 "$SESSION_OBSERVABILITY_SKILL_PATH/session_observability.py" phase \
  --run-id 2026-08-23_dcs-homepage-nextjs-port \
  --phase-id phase-0 --phase-name "Pre-flight" --event start --total-phases 14

# Sanity gate — must be clean before starting
pnpm --filter @platform/dcs run type-check
```

**Toolchain, detected — use exactly these, do not substitute:**

| Gate               | Command                                                                                             |
| ------------------ | --------------------------------------------------------------------------------------------------- |
| Package manager    | `pnpm` 10.18.2 (`pnpm-lock.yaml`)                                                                   |
| Type-check         | `pnpm --filter @platform/dcs run type-check`                                                        |
| Lint               | `pnpm --filter @platform/dcs run lint`                                                              |
| Build              | `pnpm --filter @platform/dcs run build` (`next build --webpack` — Turbopack has PostCSS bugs in CI) |
| Unit tests         | `pnpm --filter @platform/dcs run test` (vitest)                                                     |
| E2E smoke          | `pnpm --filter @platform/dcs run test:e2e:smoke` (Playwright, chromium)                             |
| Content validation | `pnpm --filter @platform/dcs run validate:content`                                                  |

**Untracked items that are NOT ours — they must stay out of every commit:**
`supabase/`, `output/sessions/codex-peer-review/2026-08/2026-08-01_npracing-site-build/openrouter-response.json`, `output/sessions/2026-08/2026-08-23_dcs-site-cutover/` (that last one is Ricky's cutover plan; leave it untracked and untouched).

---

## Phase 1 — Copy the homepage assets to a production R2 prefix

**Goal:** The prototype references 17 objects under `prototypes/2026-08-17_dcs-homepage-redesign/assets/`, plus one production object already at `npracing-v1/videos/`. A production homepage must not depend on a prototype-scoped path that a future prototype cleanup could sweep. **Copy** (never move, never regenerate) the 17 prototype-scoped objects to `dcs/home/` on the same bucket, and emit a manifest mapping every old URL to its new one.

**Model:** sonnet — one new tool script, real credentials, real network verification
**Execution:** delegate to 1 sonnet sub-agent
**Failure contract:**

- **Fail fast.** Any uncaught exception aborts the phase immediately — do not swallow it, retry blindly, or continue to the next step.
- **Show the evidence.** On failure, print the full traceback AND the offending record (the exact input/row/item being processed when it threw). No bare error messages.
- **No partial passes.** A phase that processed only some of its records has FAILED, not passed. Never report success on partial data — surface the shortfall.
- **Verdict line, always.** End the phase with exactly one line: `PASS — <n>/<total> records, 0 errors` or `FAIL — <n>/<total> records, <e> errors: <first offending record>`. The counts are mandatory, on both PASS and FAIL.
- _Orchestrator:_ immediately after the verdict line, forward it: `python3 "$SESSION_OBSERVABILITY_SKILL_PATH/session_observability.py" phase --run-id 2026-08-23_dcs-homepage-nextjs-port --phase-id 1 --event verdict --verdict PASS|FAIL --note '<verdict line>'`

**Gate contract:**

- **(a) Golden-fixture test:** `sites/dcs/test/home-assets.test.ts` asserts against the **real recorded** `assets-manifest.json` produced by this phase (a real HTTP HEAD response per object, captured live — not hand-written). Offline after capture, <5s.
- **(b) Invariant on real data:** every one of the 18 URLs referenced by the ported homepage returns HTTP 200 with a `content-type` of `video/mp4` for `.mp4` and `image/jpeg` for `.jpg`; count of verified URLs == count of URLs referenced in the component tree; zero URLs still containing the substring `prototypes/`.
- **(c) Rollback:** `git revert` this phase's commit. The R2 copies are additive — the prototype originals are untouched, so nothing to undo on the bucket. If the copies must go, delete the `dcs/home/` prefix; no other prefix is written.
- **(d) Hard fail:** any object copies to a different byte length than its source, OR any new URL returns non-200, OR 0 objects copied.

**Detail:**

- Credentials are in `.env.local`: `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`, `NEXT_PUBLIC_R2_PUBLIC_URL`. Public base is `https://pub-a159d5c51e44442897e06986a53dda1d.r2.dev`.
- Reuse the S3 client construction in `tools/upload-prototype-assets.ts`. Write a new `tools/copy-dcs-home-assets.ts`; do not modify the prototype tool.
- Objects to copy (source prefix `prototypes/2026-08-17_dcs-homepage-redesign/assets/` → target prefix `dcs/home/`):
  - `video/the-clothing-kings.mp4` + `.jpg`
  - `video/cuddle-plush-fabrics.mp4` + `.jpg`
  - `video/np-racing.jpg`
  - `video/sm-commercial.mp4` + `.jpg`
  - `video/colossus-scaffolding.mp4` + `.jpg`
  - `video/vid-ink.mp4`, `video/poster-ink.jpg`
  - `video/ecommerce-packing.mp4` + `.jpg`
  - `img/web/phone-on-site.jpg`, `img/web/laptop-store.jpg`, `img/web/abstract-mesh.jpg`, `img/web/sector-office.jpg`
- `npracing-v1/videos/rider-spotlight-2026-08.mp4` is **already** a production path (it is the live NP Racing site's own asset). Leave it exactly as it is — do not copy it into `dcs/home/`. It is the one URL that legitimately keeps a non-`dcs/` prefix.
- `vid-fabric.mp4` / `poster-fabric.jpg` are unreferenced. Do not copy them.
- Write `sites/dcs/lib/home-assets.ts` exporting a typed const map of logical name → absolute R2 URL, and have every component in Phase 5 import from it. No raw URL literals in JSX.

```bash
# Verification gate — STOP if this fails
cd /Users/rickywilson/Sites/local-business-platform
npx tsx tools/copy-dcs-home-assets.ts --verify
pnpm --filter @platform/dcs run test -- home-assets
```

```bash
git add -A && git commit -m "feat(dcs): copy homepage media to a production R2 prefix

17 objects copied from the prototype prefix to dcs/home/. The prototype
originals are untouched. lib/home-assets.ts is now the single source of
URLs so no component carries a raw literal."
```

---

## Phase 2 — Design tokens, fonts, and the CSP fix

**Goal:** Make the r9 palette and typefaces available to the site, and unblock R2 video — which the current CSP silently forbids.

**Model:** sonnet — three small config files, one of them a live security header
**Execution:** delegate to 1 sonnet sub-agent
**Failure contract:**

- **Fail fast.** Any uncaught exception aborts the phase immediately — do not swallow it, retry blindly, or continue to the next step.
- **Show the evidence.** On failure, print the full traceback AND the offending record (the exact input/row/item being processed when it threw). No bare error messages.
- **No partial passes.** A phase that processed only some of its records has FAILED, not passed. Never report success on partial data — surface the shortfall.
- **Verdict line, always.** End the phase with exactly one line: `PASS — <n>/<total> records, 0 errors` or `FAIL — <n>/<total> records, <e> errors: <first offending record>`. The counts are mandatory, on both PASS and FAIL.
- _Orchestrator:_ forward the verdict as in Phase 1, with `--phase-id 2`.

**Gate contract:**

- **(a) Golden-fixture test:** `sites/dcs/test/csp.test.ts` imports the real `headers()` array from `next.config.ts` and asserts the actual emitted CSP string — not a hand-written copy of it — in both `NODE_ENV=development` and `production`.
- **(b) Invariant on real data:** the emitted CSP contains a `media-src` directive listing `*.r2.dev`; `script-src` contains `'unsafe-eval'` **only** when `NODE_ENV === 'development'`; all seven r9 colour custom properties resolve to a non-empty value on `:root` in the built CSS.
- **(c) Rollback:** `git revert` this phase's commit (code-only).
- **(d) Hard fail:** `media-src` absent from the production CSP, OR `'unsafe-eval'` present in production, OR fewer than 7 palette variables resolved.

**Detail:**

**2a. CSP — this is the bug that would otherwise sink the whole build.** `sites/dcs/next.config.ts` currently emits `default-src 'self'` with **no `media-src` directive**. CSP falls back to `default-src` for `<video>`, so every R2 clip on the new homepage would be blocked and the five work panels and two service wells would render as empty black boxes with a console error. Add:

```
media-src 'self' https://*.r2.dev;
```

Leave `img-src 'self' data: *.r2.dev placehold.co` alone — it already covers the posters. Change nothing else in the header block; in particular do not touch the `'unsafe-eval'` dev gate, which exists on purpose (removing it breaks `next dev`'s React Refresh runtime and silently kills all client interactivity).

**2b. Fonts.** The prototype loads Archivo (400,500,600,700,800,900) and Poppins (300) from a Google Fonts `<link>`. Use `next/font/google` instead — self-hosted, no CSP dependency, no layout shift:

```ts
const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});
const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
  weight: ["300"],
});
```

Add both variables to the `<html>` className alongside the existing `spaceGrotesk`/`inter` — **do not remove those two**, the 14 inner pages still use them. Keep the Material Symbols `<link>` for the same reason.

**2c. Palette.** Add the r9 colours to `sites/dcs/theme.config.ts` so they are theme tokens rather than hex literals scattered through CSS (the platform's white-labelling rule). The seven values, taken verbatim from the prototype `:root`:

| Token   | Value     |
| ------- | --------- |
| ink     | `#0E0E12` |
| paper   | `#ECEBE9` |
| white   | `#ffffff` |
| magenta | `#D6006B` |
| aqua    | `#00D2D8` |
| navy    | `#17265E` |
| grey    | `#70707B` |

Map them into the theme system's colour slots so the plugin emits them as CSS custom properties. The Phase 3 stylesheet then references those emitted variables rather than re-declaring hex.

```bash
# Verification gate — STOP if this fails
pnpm --filter @platform/dcs run type-check
pnpm --filter @platform/dcs run test -- csp
```

```bash
git add -A && git commit -m "feat(dcs): r9 palette, Archivo/Poppins, and a media-src CSP directive

The CSP had no media-src, so default-src 'self' silently blocked every
R2 video. Adds media-src 'self' https://*.r2.dev with a test that reads
the real emitted header rather than a copy of it."
```

---

## Phase 3 — Port the r9 stylesheet verbatim

**Goal:** Move lines 10–744 of `r9-kota-level.html` (the entire `<style>` block) into `sites/dcs/styles/home-r9.css` with **exactly two** classes of edit, and prove by machine comparison that nothing else changed.

**Model:** sonnet — a large but mechanical transcription with a machine-checkable gate
**Execution:** delegate to 1 sonnet sub-agent
**Failure contract:**

- **Fail fast.** Any uncaught exception aborts the phase immediately — do not swallow it, retry blindly, or continue to the next step.
- **Show the evidence.** On failure, print the full traceback AND the offending record (the exact input/row/item being processed when it threw). No bare error messages.
- **No partial passes.** A phase that processed only some of its records has FAILED, not passed. Never report success on partial data — surface the shortfall.
- **Verdict line, always.** End the phase with exactly one line: `PASS — <n>/<total> records, 0 errors` or `FAIL — <n>/<total> records, <e> errors: <first offending record>`. The counts are mandatory, on both PASS and FAIL.
- _Orchestrator:_ forward the verdict as in Phase 1, with `--phase-id 3`.

**Gate contract:**

- **(a) Golden-fixture test:** `sites/dcs/test/home-css-parity.test.ts` reads the **real** prototype file at `output/sessions/2026-08/2026-08-17_dcs-homepage-redesign/prototype/r9-kota-level.html`, extracts its `<style>` block, normalises whitespace, and compares the rule set against `styles/home-r9.css` selector-by-selector and declaration-by-declaration. Offline, <5s.
- **(b) Invariant on real data:** every selector present in the prototype is present in the port and vice versa; every declaration matches byte-for-byte after whitespace normalisation, **except** those on the documented allow-list (font-family values and the seven palette values, which now reference CSS variables). The allow-list is an explicit array in the test — an undocumented difference fails.
- **(c) Rollback:** `git revert` this phase's commit (code-only).
- **(d) Hard fail:** any selector missing from either side, OR any non-allow-listed declaration difference, OR 0 selectors compared.

**Detail:**

- The **only** permitted edits are:
  1. `--f:'Archivo',...` → `--f: var(--font-archivo), system-ui, -apple-system, sans-serif` and `--f-logo:'Poppins',var(--f)` → `--f-logo: var(--font-poppins), var(--f)`.
  2. The seven palette declarations in `:root` point at the Phase 2 theme variables instead of hex literals.
- **Everything else is transcribed exactly**, including: the header comment block, all 22 media queries, all 8 keyframe blocks, all the dead rules listed in the out-of-scope section, the `100svh` on desktop `.hero`/`.panel` and the `100lvh` mobile overrides at lines 618/639, and `.wstack::after{height:100lvh}`. Do not "improve", deduplicate, reorder, or reformat anything.
- Import it from the homepage component only — **not** from `app/globals.css`. It must not leak onto the 14 inner pages, which are still solaris.
- Note for the record, do not act: desktop uses `svh` for `.hero`/`.panel` while the mobile overrides correctly use `lvh`. `CLAUDE.md` prefers `lvh` for full-bleed sections. The mobile override already covers the case where the distinction is observable, and changing the desktop value would break pixel parity — which is this brief's acceptance criterion. Report it as an observation.

```bash
# Verification gate — STOP if this fails
pnpm --filter @platform/dcs run test -- home-css-parity
```

```bash
git add -A && git commit -m "feat(dcs): port the r9 stylesheet verbatim

735 lines transcribed with two documented edits: font stacks now point at
the next/font variables and the palette at theme variables. A parity test
diffs the port against the prototype's own <style> block, selector by
selector, so drift cannot land silently."
```

---

## Phase 4 — Extract the homepage content to typed data

**Goal:** Lift every piece of copy and every structured value out of the prototype's markup and script into `sites/dcs/components/home/home-data.ts`, so Phase 5's components are pure presentation.

**Model:** sonnet — transcription, but the pricing figures are money and must be exact
**Execution:** delegate to 1 sonnet sub-agent
**Failure contract:**

- **Fail fast.** Any uncaught exception aborts the phase immediately — do not swallow it, retry blindly, or continue to the next step.
- **Show the evidence.** On failure, print the full traceback AND the offending record (the exact input/row/item being processed when it threw). No bare error messages.
- **No partial passes.** A phase that processed only some of its records has FAILED, not passed. Never report success on partial data — surface the shortfall.
- **Verdict line, always.** End the phase with exactly one line: `PASS — <n>/<total> records, 0 errors` or `FAIL — <n>/<total> records, <e> errors: <first offending record>`. The counts are mandatory, on both PASS and FAIL.
- _Orchestrator:_ forward the verdict as in Phase 1, with `--phase-id 4`.

**Gate contract:**

- **(a) Golden-fixture test:** `sites/dcs/test/home-data.test.ts` parses the **real** prototype HTML file and asserts that every string in `home-data.ts` appears in it (after HTML-entity decoding). The fixture is the prototype itself — not a transcription of it.
- **(b) Invariant on real data:** 5 work items, 6 service cards, 4 process steps, 6 FAQs, 4 pricing tiers × 2 pay modes = 8 price states; every tier figure and sub-line matches the prototype's `TIERS` object exactly; **no price string is absent from the prototype**.
- **(c) Rollback:** `git revert` this phase's commit (code-only).
- **(d) Hard fail:** any string in `home-data.ts` not found in the prototype source, OR any count above short of its target, OR 0 records compared.

**Detail — what to extract:**

- `WORK[]` — 5 items: index label (`01 / 05`…), name, description, chip, optional outbound link, video + poster keys into `lib/home-assets.ts`. Only NP Racing and SM Commercial have outbound links; The Clothing Kings, Cuddle Plush and Colossus deliberately have none. Do not invent URLs for them.
- `SERVICES[]` — 6 cards: index label, title, description, link label, colour modifier (`ink`/`magenta`/`white`/`navy`/`aqua`/`white`), media (video or image).
- `STEPS[]` — 4 process steps: key, title, body.
- `FAQS[]` — 6 items: question, answer. The first is `open` by default.
- `TIERS` — transcribe the prototype's object exactly, including `£750 / £45`, `£1,495 / £85`, `£2,995 / £150`, `From £2,995` with `upfrontOnly: true` on `ecom`, and the three-bullet lists. **The comma'd figures must never be rendered in a mono face or with `tabular-nums`** — see Trap 10.
- `QUOTE` — the Martin / The Clothing Kings testimonial.
- `CONTACT` — `mail@digitalconsultingservices.co.uk`, `07395 063764`, and the Chaucer Business Park address. Cross-check against `sites/dcs/lib/contact-info.ts` and reuse those exports if they already match; report any mismatch rather than silently forking a second source of truth.

```bash
# Verification gate — STOP if this fails
pnpm --filter @platform/dcs run type-check
pnpm --filter @platform/dcs run test -- home-data
```

```bash
git add -A && git commit -m "feat(dcs): extract r9 homepage copy and pricing to typed data

Every string is asserted present in the prototype source by test, so a
typo in a price cannot land."
```

---

## Phase 5 — Build the homepage components

**Goal:** Port the prototype markup to React, class name for class name. Server Components except where interactivity genuinely requires a client boundary.

**Model:** sonnet — three independent component groups, each a faithful markup port
**Execution:** delegate to 3 sonnet sub-agents in one message
**Failure contract:**

- **Fail fast.** Any uncaught exception aborts the phase immediately — do not swallow it, retry blindly, or continue to the next step.
- **Show the evidence.** On failure, print the full traceback AND the offending record (the exact input/row/item being processed when it threw). No bare error messages.
- **No partial passes.** A phase that processed only some of its records has FAILED, not passed. Never report success on partial data — surface the shortfall.
- **Verdict line, always.** End the phase with exactly one line: `PASS — <n>/<total> records, 0 errors` or `FAIL — <n>/<total> records, <e> errors: <first offending record>`. The counts are mandatory, on both PASS and FAIL.
- _Orchestrator:_ forward the verdict as in Phase 1, with `--phase-id 5`.

**Gate contract:**

- **(a) Golden-fixture test:** `sites/dcs/test/home-markup-parity.test.ts` renders the composed homepage with `@testing-library/react` and compares its class-name inventory and element structure against the **real** prototype HTML parsed with the same tooling. Offline, <5s.
- **(b) Invariant on real data:** every class name used in `styles/home-r9.css` that the prototype applies to a live element is applied by some component; the six `data-ground` values (`ink`, `white`, `magenta`, `navy`, `aqua`, plus the default `paper`) all appear; the section id set is exactly `{top, work, work-1..5, services, pricing, faq, end}`; the `.menu` element is a **sibling** of `.bar`, not a descendant.
- **(c) Rollback:** `git revert` this phase's commit (code-only).
- **(d) Hard fail:** `.menu` nested inside `.bar`, OR any expected id missing, OR any live prototype class absent from the render, OR 0 elements compared.

**Detail — file layout under `sites/dcs/components/home/`:**

Spawn three agents in parallel (single Task-tool message). All three read `home-data.ts` and `lib/home-assets.ts`; none of them writes a file another one writes.

**Task: Build the furniture — bar, menu, hero**
`model: sonnet`
Files: `site-bar.tsx` (client), `mobile-menu.tsx` (client), `hero.tsx` (server).

- `site-bar.tsx` carries the inline DCS logo SVG **exactly** as in the prototype (`viewBox="0 0 530 254"`, `fill="currentColor"` — the geometry is Ricky's `logo_black_vector_cropped.svg` unchanged; do not re-trace, re-optimise or substitute it), the `.mark__type` two-line lockup, the `.hire` pill and the `.burger` button. `data-ground` starts at `"ink"` to match the prototype's server-rendered default.
- `mobile-menu.tsx` renders `.menu` as a **sibling** of the bar — see Trap 11. Both are returned from one parent fragment; the menu must not be a child of `<header>`.
- `hero.tsx` splits the headline into `<span class="ch">` **during render**, computing `animation-delay` with the prototype's formula `((li * 0.14) + (i * 0.028)).toFixed(3)`, and substituting `&nbsp;` for spaces. See Trap 12 — a `useEffect` split is wrong. Includes `.hero__m` (mobile-only action pair) and the `.plate` span on "Websites".

**Task: Build work and services**
`model: sonnet`
Files: `work-stack.tsx` (server), `services-stack.tsx` (server), `chapter-panel.tsx` (server, the shared `.panel` + `.cornerfill` opener used by both).

- `work-stack.tsx`: `.wstack` containing 5 `.wpanel` articles. **The `.wstack::after` tail is CSS, already ported — do not add a DOM element for it, and do not remove the CSS rule.** Videos carry `muted loop playsinline autoplay preload="metadata"` and a `poster`; in React that is `muted loop playsInline autoPlay preload="metadata"`.
- `services-stack.tsx`: `.svcstack` containing 6 `.svccard` articles, each with `style={{ '--i': n }}` — the CSS uses `--i` to compute the sticky offset, so the index must be emitted as a custom property, not a class.
- `chapter-panel.tsx`: the `.cornerfill` divs are `aria-hidden` and carry the colour of the pane **above** (`cf--ink`, `cf--magenta`, `cf--white`, `cf--aqua`). Get the pairing right — this is what makes the section curves read correctly, and it was verified at all eight boundaries.

**Task: Build pricing, questions, quote, end**
`model: sonnet`
Files: `pricing.tsx` (client), `questions.tsx` (server), `quote.tsx` (server), `end-section.tsx` (server).

- `pricing.tsx` holds `mode` and `tier` in React state, replacing the prototype's imperative `paint()`. It renders **both** the desktop two-pane tablist (`.tiers` + `.detail`) and the mobile `.tiercards` — the CSS decides which is visible, exactly as the prototype does. Preserve the two behaviours that were specifically art-directed: selecting `ecom` while on `monthly` **switches the mode to `upfront`** (there is no monthly store price, and a dead `N/A` panel reads as broken); and the `.detail` pane replays the `swap` animation on change unless `prefers-reduced-motion`. The pane measured 372px in all seven states with the CTA at 332px and range 0 — do not introduce anything that varies its height.
- `questions.tsx`: 6 native `<details>` elements, the first with `open`. Keep them native — the CSS animates `.qa__a > div` and the `summary::after` chevron.
- `end-section.tsx`: `.end__main` with the two `.big` contact links and the CTA, plus `.end__foot` with the four in-page nav anchors, the copyright and the address. **Per Ricky's nav decision, this footer nav stays as in-page anchors — do not add links to `/services`, `/pricing`, `/blog` or any other route.**

```bash
# Verification gate — STOP if this fails
pnpm --filter @platform/dcs run type-check
pnpm --filter @platform/dcs run test -- home-markup-parity
```

```bash
git add -A && git commit -m "feat(dcs): port the r9 homepage markup to React components

Class names, ids and data-ground values match the prototype one for one,
asserted by a parity test that parses the prototype itself. The mobile
menu is a sibling of the bar so the fixed overlay is not trapped."
```

---

## Phase 6 — Port the client behaviour

**Goal:** Reproduce the prototype's five scroll/interaction behaviours in React without regressing any of them. This is the phase every trap in the list is about.

**Model:** opus — cross-cutting, timing-sensitive, and the phase where a plausible-looking wrong answer is easiest to produce
**Execution:** delegate to 1 opus sub-agent
**Failure contract:**

- **Fail fast.** Any uncaught exception aborts the phase immediately — do not swallow it, retry blindly, or continue to the next step.
- **Show the evidence.** On failure, print the full traceback AND the offending record (the exact input/row/item being processed when it threw). No bare error messages.
- **No partial passes.** A phase that processed only some of its records has FAILED, not passed. Never report success on partial data — surface the shortfall.
- **Verdict line, always.** End the phase with exactly one line: `PASS — <n>/<total> records, 0 errors` or `FAIL — <n>/<total> records, <e> errors: <first offending record>`. The counts are mandatory, on both PASS and FAIL.
- _Orchestrator:_ forward the verdict as in Phase 1, with `--phase-id 6`.

**Gate contract:**

- **(a) Golden-fixture test:** `sites/dcs/test/home-behaviour.test.ts` unit-tests the two pure functions extracted from the behaviour module — `layoutTop(el)` and `groundFor(scrollY, rects)` — against **recorded real rects** captured from the running prototype in Phase 10's harness and committed as a JSON fixture. If the fixture does not exist yet, capturing it from the live prototype is this phase's first task; do not hand-write rect values.
- **(b) Invariant on real data:** for every recorded scroll position in the fixture, `groundFor` returns the same ground the prototype's `ground()` would return; `layoutTop` on a pinned sticky element returns its layout position, not `0`.
- **(c) Rollback:** `git revert` this phase's commit (code-only).
- **(d) Hard fail:** any recorded position producing a different ground, OR `layoutTop` returning the pinned value for a pinned element, OR 0 positions exercised.

**Detail — `sites/dcs/components/home/home-behaviour.tsx`, a client component:**

1. **Ground tracking.** Probe at `bar.getBoundingClientRect().height * 0.62`; walk `main [data-ground]`; set `bar.dataset.ground`. Default `paper`. Extract the decision as a pure `groundFor()` so it is testable — Trap 1 means you can never read the live rAF result during verification, so the gate has to test the computation instead.
2. **In-page link interception.** Port `layoutTop()` exactly: set `position: 'static'`, read `getBoundingClientRect().top + window.scrollY`, restore. There is no paint between, so nothing flickers. Intercept every `a[href^="#"]` click with `preventDefault()`, `window.scrollTo({top, behavior})` and `history.replaceState`. **This is not optional polish** — Trap 4: without it every menu and footer link is a no-op once you are below the target, and it tests clean from the top of the page, so it will look fine right up until Ricky scrolls down.
3. **Latched reveals.** `IntersectionObserver` at `threshold: .16` adding `.in` to each `.panel`, unobserving on first hit.
4. **Services intro fade.** `--intro` on `#services` from `(svcstackTop - vh*0.45) / (vh*0.55)`, clamped 0–1.
5. **Burger menu.** `hidden` toggle, `aria-expanded`, `aria-label` swap, `body.style.overflow`, focus capture and restore, Escape to close, close on any link click. State lives in React; the DOM effects mirror it.
6. **Reduced motion.** Read `prefers-reduced-motion` once and thread it through: smooth scroll becomes `auto`, and the `.detail` swap animation does not replay.

Scroll and resize handlers go through `requestAnimationFrame`, `{passive:true}`, and must clean up on unmount.

```bash
# Verification gate — STOP if this fails
pnpm --filter @platform/dcs run type-check
pnpm --filter @platform/dcs run test -- home-behaviour
```

```bash
git add -A && git commit -m "feat(dcs): port the r9 scroll and interaction behaviour

Ground tracking, latched reveals, the services intro fade, the burger
menu, and the layoutTop() anchor interception that unbreaks in-page links
under unbounded sticky sections. The ground decision is a pure function
tested against rects recorded from the running prototype."
```

---

## Phase 7 — Route group split and homepage wiring

**Goal:** Give the homepage bare furniture (its own bar and end-section) while the 14 inner routes keep the solaris `PageShell`, without changing a single URL.

**Model:** sonnet — a mechanical `git mv` plus two layout files, but a mistake here 404s the whole site
**Execution:** delegate to 1 sonnet sub-agent
**Failure contract:**

- **Fail fast.** Any uncaught exception aborts the phase immediately — do not swallow it, retry blindly, or continue to the next step.
- **Show the evidence.** On failure, print the full traceback AND the offending record (the exact input/row/item being processed when it threw). No bare error messages.
- **No partial passes.** A phase that processed only some of its records has FAILED, not passed. Never report success on partial data — surface the shortfall.
- **Verdict line, always.** End the phase with exactly one line: `PASS — <n>/<total> records, 0 errors` or `FAIL — <n>/<total> records, <e> errors: <first offending record>`. The counts are mandatory, on both PASS and FAIL.
- _Orchestrator:_ forward the verdict as in Phase 1, with `--phase-id 7`.

**Gate contract:**

- **(a) Golden-fixture test:** the existing `sites/dcs/e2e/navigation.spec.ts` and `smoke.spec.ts` run against the **real** built site and assert real HTTP responses.
- **(b) Invariant on real data:** the built route manifest contains exactly the same URL set as before this phase, plus nothing and minus nothing — capture `.next/routes-manifest.json` before and after and diff it; every URL returns 200.
- **(c) Rollback:** `git revert` this phase's commit (code-only; route groups are directory moves, fully reversible).
- **(d) Hard fail:** any URL present before and absent after, OR any route returning non-200, OR 0 routes compared.

**Detail:**

- Capture the baseline first: build, then save `.next/routes-manifest.json` to the session folder as `routes-before.json`.
- `git mv` these 14 route directories/files into a new `app/(site)/` route group — route groups are parenthesised and do **not** appear in the URL, so every path is unchanged:
  `about`, `blog`, `contact`, `cookie-policy`, `locations`, `pricing`, `privacy-policy`, `projects`, `reviews`, `services`.
  Leave `app/page.tsx`, `app/layout.tsx`, `app/globals.css`, `app/not-found.tsx`, `app/api/`, `app/robots.ts`, `app/sitemap.ts`, `app/sitemap-index.xml/` and the three `sitemap.ts` files that live under the moved dirs where Next expects them — check each one and report anything ambiguous rather than guessing.
- `app/layout.tsx` (root) keeps `<html>`, fonts, metadata, `ConsentManager`, `Analytics`, `SiteScrollReveal`, and the geo meta. It **stops** rendering `PageShell`/`SiteHeader`/`SiteFooter`.
- New `app/(site)/layout.tsx` renders `PageShell` with the existing `SiteHeader` and `SiteFooter` and their current props, moved across verbatim.
- `app/page.tsx` composes the Phase 5 components, imports `styles/home-r9.css`, and keeps its JSON-LD schema nodes. Update its metadata: title `Digital Consulting Services — Websites as professional as you`, and a description drawn from the hero sub-line. **Broaden the positioning off trades-only** — the current copy says "electricians, plumbers, scaffolders, and builders" and the r9 brief is explicitly small owner-run businesses of every sector. Also fix `site.config.ts`'s `tagline` (`"Websites that get local tradespeople more jobs"`) for the same reason.
- The homepage's `<main id="top">` and `.stack` wrapper come from the prototype; the root layout's `<body className="min-h-screen flex flex-col">` must not fight it — verify the hero still fills the viewport after the change.

```bash
# Verification gate — STOP if this fails
pnpm --filter @platform/dcs run build
node -e "const a=require('./output/sessions/2026-08/2026-08-23_dcs-homepage-nextjs-port/routes-before.json'),b=require('./sites/dcs/.next/routes-manifest.json');/* diff static+dynamic route sets, exit 1 on any difference */"
pnpm --filter @platform/dcs run test:e2e:smoke
```

```bash
git add -A && git commit -m "refactor(dcs): move inner routes into an (site) route group

The homepage now carries the r9 bar and end-section as its own furniture
while the 14 inner routes keep the solaris PageShell. Route groups are
parenthesised so no URL changes; the routes manifest is diffed before and
after to prove it."
```

---

## Phase 8 — Homepage crawlable, everything else noindex

**Goal:** Until the inner pages are built out, `/` is the only URL search engines may index. Every other route stays reachable, stays crawlable (so the directive can actually be read), and is excluded from the sitemaps.

**Model:** sonnet — small change set, but it is a live SEO control and the sitemap wiring is easy to get subtly wrong
**Execution:** delegate to 1 sonnet sub-agent
**Failure contract:**

- **Fail fast.** Any uncaught exception aborts the phase immediately — do not swallow it, retry blindly, or continue to the next step.
- **Show the evidence.** On failure, print the full traceback AND the offending record (the exact input/row/item being processed when it threw). No bare error messages.
- **No partial passes.** A phase that processed only some of its records has FAILED, not passed. Never report success on partial data — surface the shortfall.
- **Verdict line, always.** End the phase with exactly one line: `PASS — <n>/<total> records, 0 errors` or `FAIL — <n>/<total> records, <e> errors: <first offending record>`. The counts are mandatory, on both PASS and FAIL.
- _Orchestrator:_ forward the verdict as in Phase 1, with `--phase-id 8`.

**Gate contract:**

- **(a) Golden-fixture test:** `sites/dcs/test/indexability.test.ts` runs against the **real built site** — it crawls the real route manifest, fetches each URL over HTTP, and parses the actual `<meta name="robots">` emitted in the response body. It also fetches the real `/sitemap-index.xml`, follows each listed sitemap, and reads the real XML. No hand-written HTML, no assumed metadata shape.
- **(b) Invariant on real data:** exactly **one** URL in the built route manifest emits no `noindex` — `/`. Every other page URL emits `noindex`. The union of all `<loc>` entries across every sitemap reachable from `/sitemap-index.xml` is exactly `{<baseUrl>/}` — one entry, no more. Counts are asserted, not just presence.
- **(c) Rollback:** `git revert` this phase's commit. The change is three files and is designed to be reversed in one line per section when the inner pages ship.
- **(d) Hard fail:** any URL other than `/` missing `noindex`; OR `/` itself carrying `noindex`; OR any sitemap containing a URL other than `/`; OR 0 URLs crawled.

**Detail:**

**8a. One declaration, not fourteen.** Next.js merges metadata field-by-field down the segment tree, and a child that does not set `robots` inherits the parent's. Verified: **no page or `generateMetadata` in `sites/dcs/app` currently sets `robots`** — grep is clean. So a single declaration in the Phase 7 route-group layout covers all 14 inner routes, including the four dynamic `[slug]` segments:

```ts
// app/(site)/layout.tsx
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};
```

Do **not** add a per-page `robots` export to any of the 14 routes. If the test in (b) shows a route escaping the inherited value, find out why rather than patching that one page — an escape means something else is overriding metadata and that is worth knowing.

`app/page.tsx` must **not** set `robots` at all. It sits outside `(site)`, inherits nothing, and stays indexable by default. Assert this rather than assuming it.

**8b. Do not reach for `Disallow`.** `app/robots.ts` already returns `allow: "/"` with `disallow: ["/api/", "/admin/", "/_next/"]` on production, and blanket-blocks everything on non-production via `VERCEL_ENV`. **Leave it exactly as it is.** Adding `Disallow` lines for the parked routes would be actively counterproductive: a blocked URL cannot be fetched, so the `noindex` on it is never read, and Google can still index a blocked URL from an external link. Crawlable + `noindex` is the combination that actually removes a page from the index. Note this reasoning in the commit message so nobody "fixes" it later.

**8c. Sitemaps down to one URL.** Three edits:

- `app/sitemap.ts` — currently returns 8 static URLs (`/`, `/services`, `/locations`, `/about`, `/contact`, `/reviews`, `/privacy-policy`, `/cookie-policy`). Reduce to the single homepage entry. Keep the file's structure and the removed entries in a commented block directly above, so restoring them later is uncommenting rather than rewriting.
- `app/sitemap-index.xml/route.ts` — reduce `SITEMAP_PATHS` to `['/sitemap.xml']`. Leave the other four paths in a comment on the same lines.
- Leave `app/(site)/{services,locations,blog,projects}/sitemap.ts` **in place and unmodified**. They are no longer listed in the index, so nothing submits them; deleting them would throw away working code that gets switched back on route by route. A noindex page listed in a sitemap is a Search Console warning, which is why they come out of the index rather than staying and being ignored.

**8d. Two things to check and report, not fix.**

- After Phase 7's move, the dev-only filesystem scan in `discoverSitemaps()` reads top-level `app/` directories looking for `sitemap.ts`. It will now find `(site)` and not descend into it, so the scan silently finds nothing extra. It is development-only and falls back to the static list, so it is harmless today — but report it, because it will quietly stop discovering new section sitemaps.
- `site.config.ts` declares the **apex** as canonical while the live WordPress site canonicalises to `www` (recorded in `cutover-plan.md`). This phase does not touch it — the canonical host is a cutover decision — but with the homepage now the one indexable URL it matters more, so restate it in the Final Report.

```bash
# Verification gate — STOP if this fails
pnpm --filter @platform/dcs run type-check
pnpm --filter @platform/dcs run build
pnpm --filter @platform/dcs run test -- indexability
```

```bash
git add -A && git commit -m "feat(dcs): index the homepage only until the inner pages ship

robots: { index: false, follow: false } on the (site) route group layout
covers all 14 inner routes by metadata inheritance — no page sets robots
itself, so one declaration does it. Sitemaps reduced to the homepage.

robots.txt is deliberately left permissive: a Disallow would stop the
crawler fetching the page, so the noindex would never be read and the URL
could still be indexed from an external link. Crawlable + noindex is what
actually keeps a page out of the index."
```

---

## Phase 9 — Terms & Conditions page

**Goal:** Create `/terms-and-conditions`, matching the existing legal pages, and leave it unlinked per Ricky.

**Model:** haiku — one page file modelled directly on an existing sibling
**Execution:** delegate to 1 haiku sub-agent
**Failure contract:**

- **Fail fast.** Any uncaught exception aborts the phase immediately — do not swallow it, retry blindly, or continue to the next step.
- **Show the evidence.** On failure, print the full traceback AND the offending record (the exact input/row/item being processed when it threw). No bare error messages.
- **No partial passes.** A phase that processed only some of its records has FAILED, not passed. Never report success on partial data — surface the shortfall.
- **Verdict line, always.** End the phase with exactly one line: `PASS — <n>/<total> records, 0 errors` or `FAIL — <n>/<total> records, <e> errors: <first offending record>`. The counts are mandatory, on both PASS and FAIL.
- _Orchestrator:_ forward the verdict as in Phase 1, with `--phase-id 9`.

**Gate contract:**

- **(a) Golden-fixture test:** n/a — no external-data surface. Covered by the build and the route-manifest check.
- **(b) Invariant on real data:** `/terms-and-conditions` returns 200 on the built site and appears in the route manifest; it is referenced by **zero** internal links (grep the component tree).
- **(c) Rollback:** `git revert` this phase's commit (code-only).
- **(d) Hard fail:** route returns non-200, OR any internal link to it exists.

**Detail:**

- Read `app/(site)/privacy-policy/page.tsx` first and mirror its structure, metadata shape and prose components exactly.
- Content: standard UK terms for a website design and hosting business — services, quotes and payment (both the upfront and the 24-month pay-monthly model, matching the pricing data from Phase 4), ownership and IP, hosting and support, cancellation with 30 days' notice after the minimum term, liability, governing law England and Wales. Company details: Digital Consulting Services Ltd, Unit H3, Chaucer Business Park, Polegate, East Sussex BN26 6QH.
- Keep every commercial term consistent with `home-data.ts` — the FAQ answers already state the 24-month minimum, the 30 days' notice and the ownership position, and the two must not contradict each other.
- **This is not legal advice and must not read as reviewed by a solicitor.** Add a `{/* TODO */}` comment at the top of the file noting the content is a draft for Ricky's review, and flag it in the Final Report.
- Do **not** add it to the footer, the menu, the sitemap, or any nav.

```bash
# Verification gate — STOP if this fails
pnpm --filter @platform/dcs run type-check
pnpm --filter @platform/dcs run lint
grep -rn "terms-and-conditions" sites/dcs/components sites/dcs/app --include=*.tsx | grep -v "app/(site)/terms-and-conditions" && echo "FAIL: internal link found" && exit 1 || echo "OK: unlinked"
```

```bash
git add -A && git commit -m "feat(dcs): add an unlinked terms and conditions page

Draft content pending Ricky's review; commercial terms mirror the pricing
data and the homepage FAQ. Deliberately absent from every nav."
```

---

## Phase 10 — Chrome verification against the prototype

**Goal:** Prove parity by measurement, at two viewports, for both layout and behaviour. This is the phase Ricky asked for by name and it is the one that decides whether the port is done.

**Model:** opus — the highest-judgment phase in the brief, and the one where four of the eleven traps produce confidently wrong answers
**Execution:** delegate to 1 opus sub-agent
**Failure contract:**

- **Fail fast.** Any uncaught exception aborts the phase immediately — do not swallow it, retry blindly, or continue to the next step.
- **Show the evidence.** On failure, print the full traceback AND the offending record (the exact input/row/item being processed when it threw). No bare error messages.
- **No partial passes.** A phase that processed only some of its records has FAILED, not passed. Never report success on partial data — surface the shortfall.
- **Verdict line, always.** End the phase with exactly one line: `PASS — <n>/<total> records, 0 errors` or `FAIL — <n>/<total> records, <e> errors: <first offending record>`. The counts are mandatory, on both PASS and FAIL.
- _Orchestrator:_ forward the verdict as in Phase 1, with `--phase-id 10`.

**Gate contract:**

- **(a) Golden-fixture test:** the comparison runs against the **real** prototype file served from the same origin as the real built Next.js site — no synthetic reference, no remembered values. The measurement run writes `parity-report.json` to the session folder as the recorded evidence.
- **(b) Invariant on real data:** for every selector in the curated list, at both 1440×900 and 390×844, the computed-style and bounding-box deltas are within tolerance (0px for layout box, exact string match for colour and font); every behavioural assertion below passes; zero CSP violations and zero non-200 network responses in the console/network log.
- **(c) Rollback:** none needed — this phase is read-only measurement. It writes only `parity-report.json`, screenshots and the temporary reference copy, and commits only the report.
- **(d) Hard fail:** any selector outside tolerance, OR any behavioural assertion failing, OR any CSP violation, OR any asset request not returning 200, OR 0 selectors compared.

**Setup — same-origin is the whole trick:**

```bash
lsof -i :3100 -i :4321   # confirm both free; port 3000 is npracing-v1, leave it alone
pnpm --filter @platform/dcs run build
pnpm --filter @platform/dcs run start -- -p 3100 &
# Copy the prototype into the built site's public dir so BOTH are on :3100.
# Cross-origin iframes cannot be measured, and this is the only reason for the copy.
cp output/sessions/2026-08/2026-08-17_dcs-homepage-redesign/prototype/r9-kota-level.html \
   sites/dcs/public/__parity__/r9-kota-level.html
```

The reference copy is **temporary**. Delete `sites/dcs/public/__parity__/` before the phase's commit and assert it is gone — a prototype HTML file shipping in `public/` would be served publicly on production.

**Method — and the traps that govern it:**

- Build a harness page with two same-origin iframes, one at `/` and one at `/__parity__/r9-kota-level.html`, each sized explicitly. **Use the iframe, not `resize_window`** — Trap 7, it reports success and does nothing.
- **Cache-bust every harness fetch** — Trap 6.
- **Measure with `getComputedStyle` and `getBoundingClientRect`, never from screenshots** — Trap 2. Take screenshots at both viewports for Ricky to look at, but no gate depends on a pixel.
- **Never read a live rAF-driven value** — Trap 1. For anything rAF-driven (`data-ground`, `.in` reveals, `--intro`), set the scroll position, then compute what the function should return and compare against the computed input, rather than polling the attribute. Never `await` inside a rAF callback.
- **Do not use `elementFromPoint` for visibility** — Trap 3. `.svcstack` intercepts hits while showing what is behind it.
- **Measure sticky elements via the `position: static` neutralisation trick** — Trap 4.

**Curated selector list (measure all of these, both viewports):**
`.bar`, `.mark__svg`, `.mark__type`, `.hire`, `.burger`, `.hero`, `.hero__head h1`, `.hero__head h1 .ln`, `.hero__sub`, `.hero__m`, `.panel`, `.cornerfill`, `.wstack`, `.wpanel`, `.wpanel__ix`, `.wpanel__n`, `.wpanel__d`, `.wchip`, `.svcstack`, `.svccard`, `.svccard__t`, `.svccard__well`, `.steps`, `.step`, `.paytoggle`, `.tiers`, `.tier`, `.tier__f`, `.detail`, `.tiercards`, `.tcard`, `.qa summary`, `.quote`, `.end__main`, `.big`, `.end__foot`, `.btn`.

For each: `width`, `height`, `top` relative to its section, `font-family`, `font-size`, `font-weight`, `letter-spacing`, `line-height`, `color`, `background-color`, `border-radius`, `padding`.

**Behavioural assertions — all must pass:**

1. **Nav ground** takes the correct colour at each of the six grounds, and holds fuchsia across all six service cards before cutting to ink at the process section.
2. **In-page links**: all 5 menu links and all 4 footer links land their target at `top: 0`, **tested from the page bottom** — the only position where the sticky bug reproduces.
3. **Pricing pane** is the same height in all seven reachable tier/mode states (372px, CTA at 332px, range 0), and tier figures are right-aligned in all eight combinations.
4. **Selecting eCommerce while on monthly switches the mode to upfront.**
5. **Work panels pin**: sample `getBoundingClientRect().top` across the scroll range — a pinned panel holds `top: 0`, an unpinned one moves 1:1 with scroll. At 390px the five panels pinned 4800/3760/2720/1680/880 with **zero gap** at the handover. **The last panel is the one that silently fails** if `.wstack::after` is missing.
6. **Burger menu opens to the viewport**, not the bar's box — measure the opened `.menu`; at 390×844 it must report ≈390×844, not the bar's ≈277×58. This is the trapped-overlay signature.
7. **Section curves** read the colour of the pane above at all eight boundaries, both viewports.
8. **390px and 320px**: no horizontal overflow, no touch target under 44px, 16px prose floor.
9. **Hero headline is present in the server HTML** — `curl -s localhost:3100/ | grep` for the headline text. It must be there before any JS runs.
10. **Prices**: resolve `font-variant-numeric` **and** `font-family` up the ancestor chain for `£1,495` and `£2,995`. Neither may be mono, neither may inherit `tabular-nums`.
11. **Console and network**: zero CSP violations, zero errors, and all 18 R2 URLs returning 200.

If any assertion fails, fix it and re-measure. Do not proceed to Phase 11 with a known delta.

```bash
# Verification gate — STOP if this fails
rm -rf sites/dcs/public/__parity__
test ! -d sites/dcs/public/__parity__ || (echo "FAIL: parity copy still present" && exit 1)
node -e "const r=require('./output/sessions/2026-08/2026-08-23_dcs-homepage-nextjs-port/parity-report.json'); if(!r.selectorsCompared||r.failures.length){console.error(JSON.stringify(r.failures,null,2));process.exit(1)}"
```

```bash
git add -A && git commit -m "test(dcs): record r9 parity measurements at 1440x900 and 390x844

Same-origin iframe harness comparing the built homepage against the
prototype by computed style and bounding box, plus eleven behavioural
assertions. Measurement only — screenshots are for the human, no gate
depends on a pixel."
```

---

## Phase 11 — Full gate run

**Goal:** Run every gate this repo defines for the packages this brief touched, before anything is deployed.

**Model:** sonnet — running gates and triaging what they surface
**Execution:** delegate to 1 sonnet sub-agent
**Failure contract:**

- **Fail fast.** Any uncaught exception aborts the phase immediately — do not swallow it, retry blindly, or continue to the next step.
- **Show the evidence.** On failure, print the full traceback AND the offending record (the exact input/row/item being processed when it threw). No bare error messages.
- **No partial passes.** A phase that processed only some of its records has FAILED, not passed. Never report success on partial data — surface the shortfall.
- **Verdict line, always.** End the phase with exactly one line: `PASS — <n>/<total> records, 0 errors` or `FAIL — <n>/<total> records, <e> errors: <first offending record>`. The counts are mandatory, on both PASS and FAIL.
- _Orchestrator:_ forward the verdict as in Phase 1, with `--phase-id 11`.

**Gate contract:**

- **(a) Golden-fixture test:** the whole vitest suite plus the Playwright chromium smoke run against the **real** built site.
- **(b) Invariant on real data:** every gate exits 0; the vitest suite reports more tests than it did on `develop` (this brief adds six test files) and zero regressions in pre-existing tests.
- **(c) Rollback:** `git revert` any fix commits this phase makes (code-only).
- **(d) Hard fail:** any gate non-zero, OR any pre-existing test newly failing, OR 0 tests run.

```bash
# Verification gate — STOP if this fails. Run in this order.
pnpm --filter @platform/dcs run type-check
pnpm --filter @platform/dcs run lint
pnpm --filter @platform/dcs run build
pnpm --filter @platform/dcs run test
pnpm --filter @platform/dcs run validate:content
pnpm --filter @platform/dcs run test:e2e:smoke
```

Only `sites/dcs` is touched by this brief, so scope every gate to `@platform/dcs`; do not run repo-wide. `type-check` and `lint` are read-only and independent — run them together. `build` must run alone; it writes `.next/` and races with anything reading it.

```bash
git add -A && git commit -m "chore(dcs): green across type-check, lint, build, unit, content and e2e smoke"
```

---

## Phase 12 — Deploy to production on the `dcs` Vercel project

**Goal:** Ship it. Ricky's call: _"Straight to production on the dcs project."_

**Model:** sonnet — a live, outward-facing action with a verification pass behind it
**Execution:** delegate to 1 sonnet sub-agent
**Failure contract:**

- **Fail fast.** Any uncaught exception aborts the phase immediately — do not swallow it, retry blindly, or continue to the next step.
- **Show the evidence.** On failure, print the full traceback AND the offending record (the exact input/row/item being processed when it threw). No bare error messages.
- **No partial passes.** A phase that processed only some of its records has FAILED, not passed. Never report success on partial data — surface the shortfall.
- **Verdict line, always.** End the phase with exactly one line: `PASS — <n>/<total> records, 0 errors` or `FAIL — <n>/<total> records, <e> errors: <first offending record>`. The counts are mandatory, on both PASS and FAIL.
- _Orchestrator:_ forward the verdict as in Phase 1, with `--phase-id 12`.

**Gate contract:**

- **(a) Golden-fixture test:** the deployed production URL is fetched live in Chrome and re-measured against the **same curated selector list** from Phase 10 at both viewports — a real HTTP response from the real deployment, not a local build.
- **(b) Invariant on real data:** the production URL returns 200; the hero headline is in the server HTML; all 18 R2 assets return 200 over the production origin; zero CSP violations in the console; the eleven behavioural assertions from Phase 10 all still pass; **and the Phase 8 indexing invariant holds on the real deployment** — `/` carries no `noindex`, every other page URL does, `/robots.txt` returns the production `allow: /` rules (not the `VERCEL_ENV`-gated blanket block), and `/sitemap-index.xml` resolves to exactly one URL.
- **(c) Rollback:** `vercel rollback <previous-deployment-url> --token $VERCEL_TOKEN`, or promote the prior deployment from the Vercel dashboard. Capture the current production deployment ID **before** deploying and record it in the Final Report — that is the rollback target.
- **(d) Hard fail:** production returns non-200, OR any CSP violation, OR any R2 asset non-200, OR any Phase 10 behavioural assertion regressing, OR the indexing invariant failing on the live origin.

**Detail — read all of this before running anything:**

- **This deliberately bypasses the repo's `develop → staging → main` promotion rule**, which `CLAUDE.md` marks NON-NEGOTIABLE. Ricky chose it explicitly when asked. Therefore: **commit everything to `feature/dcs-homepage-nextjs-port` first, deploy from that branch, and do NOT merge, do NOT push to `develop`, `staging` or `main`.** State this deviation prominently in the Final Report.
- **Capture the rollback target first:**
  ```bash
  cd sites/dcs
  vercel ls dcs --token "$VERCEL_TOKEN" | head -20   # record the current production deployment
  ```
  Note: `cutover-plan.md` records the last production deploy on this project as **CANCELED**, so there may be no healthy deployment to roll back to. If that is the case, say so explicitly rather than implying a rollback path exists.
- **Deploy:**
  ```bash
  cd /Users/rickywilson/Sites/local-business-platform/sites/dcs
  vercel deploy --prod --token "$VERCEL_TOKEN"
  ```
  The directory is already linked (`.vercel/project.json` → `prj_ysC3rXNhzTD4oyZbrkXK51BZykYX`, org `team_wr412hUEEmAULurOOD1ZPXfm`). **Do not pass `--name` or re-link** — that creates a second project.
- **Do not attach a domain.** The project has no custom domain and Ricky is setting the root domain himself. If `vercel domains` is run at all, it is read-only.
- **Check the environment variables** the build needs are set on the Vercel project before deploying — at minimum `NEXT_PUBLIC_SITE_URL` and `NEXT_PUBLIC_R2_PUBLIC_URL`. `CLAUDE.md` warns that every env var affecting build output must also be in `turbo.json`'s `env` array or stale cache hits follow. Report any that are missing rather than inventing values.
- **Re-check indexing against production specifically.** `app/robots.ts` branches on `VERCEL_ENV === 'production'`; a `--prod` deploy sets it, so `/robots.txt` should flip from the blanket `disallow: /` to the production rules. That branch has never been exercised on this project, so read the real `/robots.txt` rather than assuming which way it went — and if it is still blanket-blocking, the whole Phase 8 arrangement is moot and must be reported as such, not quietly passed.
- After the deploy, verify the live URL in Chrome as specified in the gate contract. Screenshot both viewports for Ricky.

```bash
# Verification gate — STOP if this fails
curl -sSf -o /dev/null -w '%{http_code}\n' "<production-url>" | grep -q 200
curl -s "<production-url>" | grep -q "Websites"                      # hero headline present pre-JS
curl -s "<production-url>" | grep -q 'name="robots"[^>]*noindex' && echo "FAIL: homepage is noindex" && exit 1
curl -s "<production-url>/about" | grep -q 'name="robots"[^>]*noindex' || (echo "FAIL: /about is indexable" && exit 1)
curl -s "<production-url>/robots.txt"                                # read it, do not assume the VERCEL_ENV branch
curl -s "<production-url>/sitemap-index.xml"                         # must resolve to exactly one URL
```

```bash
git add -A && git commit -m "chore(dcs): record the production deployment

Deployed from feature/dcs-homepage-nextjs-port straight to the dcs Vercel
project at Ricky's explicit direction, bypassing develop → staging → main.
No custom domain attached; the root domain is Ricky's to set."
```

---

## Phase 13 — Docs, session file, wrap-up

**Goal:** Leave the repo describing what is now true.

**Model:** haiku — documentation updates against a known change set
**Execution:** delegate to 1 haiku sub-agent
**Failure contract:**

- **Fail fast.** Any uncaught exception aborts the phase immediately — do not swallow it, retry blindly, or continue to the next step.
- **Show the evidence.** On failure, print the full traceback AND the offending record (the exact input/row/item being processed when it threw). No bare error messages.
- **No partial passes.** A phase that processed only some of its records has FAILED, not passed. Never report success on partial data — surface the shortfall.
- **Verdict line, always.** End the phase with exactly one line: `PASS — <n>/<total> records, 0 errors` or `FAIL — <n>/<total> records, <e> errors: <first offending record>`. The counts are mandatory, on both PASS and FAIL.
- _Orchestrator:_ forward the verdict as in Phase 1, with `--phase-id 13`.

**Gate contract:**

- **(a) Golden-fixture test:** n/a — documentation only.
- **(b) Invariant on real data:** every file path and command quoted in the new docs resolves / runs; no doc claims a gate ran that did not.
- **(c) Rollback:** `git revert` this phase's commit.
- **(d) Hard fail:** any quoted path missing, OR the session file not updated.

**Detail:**

- Update `output/sessions/2026-08/2026-08-17_dcs-homepage-redesign/HANDOFF.md`: open question 6 ("Port to React in `sites/dcs`, or keep iterating in HTML?") is now answered — record the answer and link to this session.
- Add a short section to `sites/dcs/PRODUCT.md` describing the new homepage and the `(site)` route group split.
- Add the CSP `media-src` finding to the root `CLAUDE.md` under "Key Architecture Rules" — it is a platform-wide trap: a site copied from `base-template` inherits a CSP with no `media-src`, so the first `<video>` anyone adds is silently blocked by `default-src 'self'`. Keep it to a few sentences and state that it was verified against the real emitted header, not assumed.
- Record the homepage-only indexing decision in `sites/dcs/PRODUCT.md`: what is noindexed, why `robots.txt` stays permissive (a `Disallow` would prevent the `noindex` being read), and the exact one-line-per-section change that re-enables a section. This is the note that stops someone "fixing" it later.
- Set `output/sessions/.current-session` to this session (it is stale, pointing at `2026-07/2026-07-18_deploy-hardening`).
- Do **not** run `/update.docs` repo-wide — this brief touched one site.

```bash
# Verification gate — STOP if this fails
pnpm --filter @platform/dcs run lint
```

```bash
git add -A && git commit -m "docs(dcs): record the r9 port, the route group split and the media-src trap"
```

---

## Parallel execution groups

This section lists work units that can run concurrently. Each group lists items that MUST be launched in a single Task-tool message. Items across groups run sequentially in the order listed. Groups are named `G1`, `G2`, … for reference.

### Intra-phase groups

| Group | Phase    | Items                                                                                                                                                                                                                          | File overlap                                                                                                     | Model     | Rationale                                                                                                 |
| ----- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------- | --------- | --------------------------------------------------------------------------------------------------------- |
| G1    | Phase 1  | 1 sub-agent, sequential                                                                                                                                                                                                        | —                                                                                                                | sonnet    | Single script + single verification run                                                                   |
| G2    | Phase 2  | 1 sub-agent, sequential                                                                                                                                                                                                        | `next.config.ts`, `app/layout.tsx`, `theme.config.ts` all interact via the font variables                        | sonnet    | Three files, but the font variable names must agree across all three                                      |
| G3    | Phase 3  | 1 sub-agent, sequential                                                                                                                                                                                                        | —                                                                                                                | sonnet    | One file, one transcription                                                                               |
| G4    | Phase 4  | 1 sub-agent, sequential                                                                                                                                                                                                        | —                                                                                                                | sonnet    | One file; splitting it would fork the price data                                                          |
| G5    | Phase 5  | **3 sub-agents in one message**: (a) `site-bar.tsx` + `mobile-menu.tsx` + `hero.tsx`; (b) `work-stack.tsx` + `services-stack.tsx` + `chapter-panel.tsx`; (c) `pricing.tsx` + `questions.tsx` + `quote.tsx` + `end-section.tsx` | none — ten distinct files, three disjoint sets; all three read `home-data.ts` and `lib/home-assets.ts` read-only | sonnet ×3 | Independent markup ports over a data file frozen in Phase 4                                               |
| G6    | Phase 6  | 1 sub-agent, sequential                                                                                                                                                                                                        | —                                                                                                                | opus      | Single cross-cutting behaviour module                                                                     |
| G7    | Phase 7  | 1 sub-agent, sequential                                                                                                                                                                                                        | —                                                                                                                | sonnet    | A directory move plus two layouts — must be one atomic change or routes break mid-flight                  |
| G8    | Phase 8  | 1 sub-agent, sequential                                                                                                                                                                                                        | `app/(site)/layout.tsx`, `app/sitemap.ts`, `app/sitemap-index.xml/route.ts`                                      | sonnet    | Three files that together define one invariant; splitting them would let a half-applied state pass a gate |
| G9    | Phase 9  | 1 sub-agent, sequential                                                                                                                                                                                                        | —                                                                                                                | haiku     | One page file                                                                                             |
| G10   | Phase 10 | 1 sub-agent, sequential                                                                                                                                                                                                        | —                                                                                                                | opus      | One measurement run; parallel browser sessions would contend for the same two ports                       |
| G11   | Phase 11 | Run `type-check` and `lint` in one message; then `build` alone; then `test`, `validate:content`, `test:e2e:smoke`                                                                                                              | `build` writes `.next/`                                                                                          | sonnet    | type-check and lint are read-only and independent; build writes generated output and must not race        |
| G12   | Phase 12 | 1 sub-agent, sequential                                                                                                                                                                                                        | —                                                                                                                | sonnet    | A live deploy is never parallelised                                                                       |
| G13   | Phase 13 | 1 sub-agent, sequential                                                                                                                                                                                                        | —                                                                                                                | haiku     | Small doc set, cross-referencing                                                                          |

Reads within any phase (opening the prototype, the target files, existing siblings) should always be batched into one message.

### Cross-phase groups

Every phase depends on its predecessor's output — Phase 5 needs Phase 4's data and Phase 3's classes, Phase 10 needs a built site, Phase 12 needs green gates. No cross-phase parallelism.

| Group  | Phases | Items | Rationale                            |
| ------ | ------ | ----- | ------------------------------------ |
| (none) |        |       | Strictly sequential dependency chain |

### Sequential points — MUST NOT parallelise

| Item                                    | Reason                                                                     |
| --------------------------------------- | -------------------------------------------------------------------------- |
| Verification gates between phases       | Each phase's output gates the next. Gates are the synchronisation barrier. |
| Git commits                             | One commit per phase, in order. Commits are never batched.                 |
| `pnpm --filter @platform/dcs run build` | Writes `.next/`; races with anything reading or writing there.             |
| Phase 10 and Phase 12 browser runs      | Both drive Chrome and bind ports 3100/4321.                                |
| Phase 7's route-group move              | Must be atomic — a half-moved `app/` tree 404s every URL.                  |
| Any file edited by two or more items    | Same-file edits always serialise.                                          |

---

## Cost Estimate

Sized from: the prototype is 1,235 lines (76KB); the ported CSS is ~735 lines; the component tree is ~10 files at ~80 lines each; seven new test files; 14 directory moves.

| Phase                        | Model     | Est. input tokens | Est. output tokens | Est. cost  |
| ---------------------------- | --------- | ----------------- | ------------------ | ---------- |
| 1 — R2 production assets     | sonnet    | ~14k              | ~3k                | ~$0.09     |
| 2 — Tokens, fonts, CSP       | sonnet    | ~16k              | ~3k                | ~$0.09     |
| 3 — Port the stylesheet      | sonnet    | ~28k              | ~12k               | ~$0.27     |
| 4 — Extract page data        | sonnet    | ~26k              | ~6k                | ~$0.17     |
| 5 — Components (×3 parallel) | sonnet ×3 | ~54k              | ~14k               | ~$0.37     |
| 6 — Client behaviour         | opus      | ~24k              | ~7k                | ~$0.88     |
| 7 — Route group + wiring     | sonnet    | ~20k              | ~5k                | ~$0.14     |
| 8 — Homepage-only indexing   | sonnet    | ~15k              | ~4k                | ~$0.11     |
| 9 — Terms & Conditions       | haiku     | ~9k               | ~3k                | ~$0.02     |
| 10 — Chrome verification     | opus      | ~40k              | ~16k               | ~$1.60     |
| 11 — Full gate run           | sonnet    | ~14k              | ~3k                | ~$0.09     |
| 12 — Production deploy       | sonnet    | ~15k              | ~4k                | ~$0.11     |
| 13 — Docs and wrap-up        | haiku     | ~11k              | ~4k                | ~$0.02     |
| Orchestrator overhead        | sonnet    | ~64k              | ~11k               | ~$0.36     |
| **Total**                    |           | **~350k**         | **~95k**           | **~$4.37** |

> **Assumed rates, unverified:** Opus $15/$75, Sonnet $3/$15, Haiku $1/$5 per MTok. These are assumptions stated so the arithmetic is checkable — they are not confirmed against current pricing. Treat the total as an order-of-magnitude figure and check console.anthropic.com for actual spend.
> Estimation basis: ~5 tokens per line of code; input = files read + brief (~9k) + system prompt (~3k); output = code written + ~500 per verification gate. Phase 10 is the largest single line because browser measurement returns bulky JSON.

---

## Final Report

After all phases complete, output:

1. **Phases completed** — each with its commit SHA and one-line summary.
2. **Build status** — confirm `type-check`, `lint`, `build`, `test`, `validate:content` and `test:e2e:smoke` all pass, with the actual counts.
3. **Parity result** — the Phase 10 selector count, the delta summary at both viewports, and each of the eleven behavioural assertions with its pass/fail. Paste the screenshot paths.
4. **Production deployment** — the live URL, the deployment ID, and the rollback target ID (or an explicit statement that the previous production deploy was CANCELED and there is no healthy rollback target).
5. **The workflow deviation, stated plainly** — this shipped to production from a feature branch, bypassing `develop → staging → main` and the CI gates that run on those pushes, at Ricky's explicit direction. Nothing was merged or pushed to any protected branch.
6. **Indexing state as deployed** — the live `/robots.txt` body verbatim, the full list of URLs carrying `noindex`, and the complete set of `<loc>` entries reachable from `/sitemap-index.xml`. State plainly that `/` is the only indexable URL and name the one-line-per-section change that reverses it when the inner pages ship.
7. **Decisions deferred to Ricky** — the three items from the Context section, restated, none of them applied.
8. **The Terms & Conditions draft** flagged as unreviewed by a solicitor.
9. **Anything left undone or deviated from the plan**, with the reason.
10. **Token usage and cost:**

| Model     | Est. input tokens | Est. output tokens | Est. cost |
| --------- | ----------------- | ------------------ | --------- |
| sonnet    |                   |                    | $X.XX     |
| haiku     |                   |                    | $X.XX     |
| opus      |                   |                    | $X.XX     |
| **Total** |                   |                    | **$X.XX** |

Estimate from files read (lines × 5) and written (lines × 5). Compare against the pre-flight estimate above and note the variance. Exact figures: console.anthropic.com.

---

## Update Session File

After completing all phases, append to `output/sessions/2026-08/2026-08-23_dcs-homepage-nextjs-port/yolo-brief.md`:

```markdown
## Completed

**Date:** [today]
**Status:** All phases executed successfully

[1-paragraph summary: what was implemented, any surprises]

### Commits

[list each commit SHA and message]
```

Confirm this was done in the final report.

---

## Run Wrap-Up

After completing all phases and updating the session file, run:

/wrap-up-session

This writes a wrap-up summary to the session folder. **Do not skip it.**

---

## Rules

- STOP on any failed verification gate — do not continue to the next phase.
- **Honour every phase's `**Failure contract:**`.** Fail fast on any uncaught exception (never swallow, blind-retry, or press on), print the full traceback and the offending record, and never report a phase as passed on partial data. Each phase MUST end with its one-line PASS/FAIL verdict including counts. A FAIL verdict is a failed gate — STOP.
- **Honour every phase's `**Gate contract:**`.** A phase passes only when its golden-fixture test (a) is green against a **real recorded** shape, its real-data invariant (b) holds, and the type-check is clean. These must be **executed**, not merely declared. Have the phase's rollback (c) to hand before starting it.
- **Read the Traps section before Phase 0 and re-read it before Phase 10.** Four of the eleven traps produce confidently wrong measurements, not obvious errors.
- Read every file before editing it.
- **Never push, never merge.** All work stays on `feature/dcs-homepage-nextjs-port`. The only outward action authorised is the Phase 12 Vercel deploy.
- **Delegate every phase's implementation to sub-agents by default.** The orchestrator coordinates, gates, and commits — it does NOT write phase code inline.
- **The `**Model:**` tier names the sub-agent's model, not the orchestrator's.** The orchestrator cannot change its own running model, so a tier is only honoured by spawning a sub-agent at that tier.
- **Consult `## Parallel execution groups` before launching any work.** Every item in a group MUST be launched in a single Task-tool message.
- **Items not in any group run sequentially — but still as delegated sub-agents.** "Sequential" means one sub-agent at a time, not the orchestrator doing it inline.
- **If the groups table and the phase prose disagree, the groups table wins.**
- Minimal changes only — implement what this brief says, nothing more. The out-of-scope list is binding: no redirects, no DNS, no inner-page restyling, no video regeneration, no dead-CSS removal.
- **Do not stage `supabase/`, `output/sessions/2026-08/2026-08-23_dcs-site-cutover/`, or the codex-peer-review `openrouter-response.json`.** They are not ours. Prefer `git add` on specific paths over `git add -A` if any of them are ever in the way.
- **Real-data rule.** Every fixture in this brief is captured from something real — the prototype file, a live R2 HEAD response, the actual emitted CSP header, rects recorded from the running prototype. Never hand-write a fixture. An invented fixture can encode the wrong shape and produce green tests over code that cannot read reality.
- The Co-Authored-By line in commits must reflect the **orchestrator** model, not the per-phase sub-agent tier.
- All writes are inside `/Users/rickywilson/Sites/local-business-platform`, so no `--additionalDirectories` is required.
