# YOLO Implementation Brief: DCS — Logo, Scroll Animations & Hero Bounce

**Branch:** feature/dcs-logo-icons-animations (created from develop)
**Session spec:** output/sessions/2026-04-12_dcs-logo-icons-animations/yolo-brief.md
**Mode:** Autonomous execution — implement all phases, verify after each, STOP on error
**Orchestrator model:** sonnet

---

## Context

The DCS site (Solaris theme) has three issues: (1) the logo SVG exists at `sites/dcs/public/logo.svg` but the header/footer only accept text — it's never rendered; (2) scroll animations are defined in CSS (`.solaris-reveal`, `.solaris-heading`) but no JavaScript wires up the IntersectionObserver, so sections appear statically; (3) the hero geometric shapes need more float amplitude for a bouncier feel, as requested. Icons (Material Symbols) appear to be a font-loading timing issue — the code is correct, but the float animation amplitude change and scroll wiring may incidentally help.

The plan was reviewed and approved. Implement it exactly as specified below.

---

## Model Tiers

| Tier   | Alias    | Cost (in/out per MTok) | Use for                                                                                             |
| ------ | -------- | ---------------------- | --------------------------------------------------------------------------------------------------- |
| Opus   | `opus`   | $15 / $75              | Phases with >5 interdependent files, architectural rewrites, judgment calls not covered by the spec |
| Sonnet | `sonnet` | $3 / $15               | Standard implementation — file edits, feature wiring, most phases                                   |
| Haiku  | `haiku`  | $0.25 / $1.25          | Mechanical tasks: find-replace, import additions, grep checks, content validation                   |

Default orchestrator: **sonnet**. Default sub-agent: **sonnet** unless the task is clearly mechanical (→ haiku) or requires deep cross-file reasoning (→ opus).

---

## Pre-flight

```bash
git checkout develop && git pull
git checkout -b feature/dcs-logo-icons-animations
pnpm type-check   # must be clean before starting
```

---

## Phase 1: Add logo support to SolarisHeader and SolarisFooter

**Goal:** Add `logoSrc` and `logoAlt` optional props to both components. When `logoSrc` is provided, render an `<img>` tag instead of the text string. Apply to all logo render sites (desktop header, mobile overlay, footer brand column).
**Model:** sonnet

### Files to read first (parallel)

Read these in a single message before editing:

- `packages/themes/solaris/components/header.tsx`
- `packages/themes/solaris/components/footer.tsx`

### Changes

**`packages/themes/solaris/components/header.tsx`**

1. Add to `SolarisHeaderProps`:
   ```ts
   logoSrc?: string;
   logoAlt?: string;
   ```
2. Destructure `logoSrc` and `logoAlt` in the function signature.
3. Replace all three `{logoText}` render sites (desktop header logo link, mobile overlay logo link) with a conditional:
   ```tsx
   {
     logoSrc ? (
       // eslint-disable-next-line @next/next/no-img-element
       <img
         src={logoSrc}
         alt={logoAlt ?? logoText}
         width={140}
         height={48}
         style={{ height: "40px", width: "auto", objectFit: "contain" }}
       />
     ) : (
       logoText
     );
   }
   ```
   Use a plain `<img>` tag (not `next/image`) — SVGs don't benefit from Next.js optimisation and it avoids needing `unoptimized` prop.

**`packages/themes/solaris/components/footer.tsx`**

1. Add to `SolarisFooterProps`:
   ```ts
   logoSrc?: string;
   logoAlt?: string;
   ```
2. Destructure in function signature.
3. Replace the `<span>` brand column logo text with:
   ```tsx
   {
     logoSrc ? (
       // eslint-disable-next-line @next/next/no-img-element
       <img
         src={logoSrc}
         alt={logoAlt ?? logoText}
         width={140}
         height={48}
         style={{
           height: "36px",
           width: "auto",
           objectFit: "contain",
           filter: "brightness(0) invert(1)",
         }}
       />
     ) : (
       <span className="block font-heading text-xl font-bold text-white mb-3">{logoText}</span>
     );
   }
   ```
   Note: `filter: brightness(0) invert(1)` makes the logo white on the dark footer background. This is correct for a coloured SVG logo on a `#2a2e20` footer.

**`packages/themes/solaris/components/index.ts`**

No change needed — types are already exported via the component files.

**`sites/dcs/app/layout.tsx`**

Pass `logoSrc` and `logoAlt` to both header and footer:

```tsx
<SolarisHeader
  logoSrc="/logo.svg"
  logoAlt="DCS Gardening & Landscaping"
  logoText="DCS"
  navItems={siteConfig.navigation.main}
  // ... rest unchanged
/>
```

```tsx
<SolarisFooter
  logoSrc="/logo.svg"
  logoAlt="DCS Gardening & Landscaping"
  logoText="DCS"
  // ... rest unchanged
/>
```

### Verification gate

```bash
# Verification gate — STOP if this fails
cd /Users/rickywilson/Sites/local-business-platform
pnpm type-check
```

### Commit

```bash
git add packages/themes/solaris/components/header.tsx packages/themes/solaris/components/footer.tsx sites/dcs/app/layout.tsx
git commit -m "$(cat <<'EOF'
feat(solaris): add logoSrc/logoAlt props to header and footer; wire up DCS logo SVG

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 2: Wire scroll animations with inline IntersectionObserver script

**Goal:** Create a `SolarisScrollReveal` Server Component that emits an inline `<script>` with an IntersectionObserver. Add it to the DCS layout. Add `.solaris-reveal` and `.solaris-heading` classes to sections in `home.tsx`.
**Model:** sonnet

### Step 2a — Create the scroll reveal component

Create new file `packages/themes/solaris/components/scroll-reveal-script.tsx`:

```tsx
/**
 * SolarisScrollReveal
 *
 * Server Component that emits a tiny inline script to wire up
 * IntersectionObserver for .solaris-reveal and .solaris-heading elements.
 * CSS for these classes is in packages/themes/solaris/globals.css.
 */
export function SolarisScrollReveal() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
(function(){
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var els = document.querySelectorAll('.solaris-reveal, .solaris-heading');
  if (reduceMotion) {
    els.forEach(function(el){ el.classList.add('visible'); });
    return;
  }
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){ e.target.classList.add('visible'); io.unobserve(e.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  els.forEach(function(el){ io.observe(el); });
})();
`,
      }}
    />
  );
}
```

### Step 2b — Export from components index

Edit `packages/themes/solaris/components/index.ts` — add:

```ts
export { SolarisScrollReveal } from "./scroll-reveal-script";
```

### Step 2c — Add to DCS layout

Edit `sites/dcs/app/layout.tsx`:

1. Add import:
   ```tsx
   import {
     SolarisHeader,
     SolarisFooter,
     SolarisScrollReveal,
   } from "@platform/themes/solaris/components";
   ```
2. Place `<SolarisScrollReveal />` immediately before the closing `</body>` tag (after `<AnalyticsDebugPanel />`).

### Step 2d — Add reveal classes to home.tsx sections

Read `packages/themes/solaris/pages/home.tsx` in full before editing.

Add `.solaris-reveal` and stagger classes to the following elements in `home.tsx`:

1. **Stats bar items** — each `<div>` in the stats grid: add `solaris-reveal solaris-stagger-{1,2,3}` to the three stat items
2. **Services section heading** — add `solaris-heading` to the `<h2>` "What We Do"
3. **Service cards** — each `<Link>` card in the grid: add `solaris-reveal solaris-stagger-{1,2,3,4,5,6}` (up to 6)
4. **Why Us section heading** — add `solaris-heading` to the `<h2>` "Why choose..."
5. **Why Us feature cards** — each `<div>` card: add `solaris-reveal solaris-stagger-{1,2,3}`
6. **Testimonials section heading** — add `solaris-heading` to the `<h2>` "What our clients say"
7. **Testimonial cards** — each `<div>` card: add `solaris-reveal solaris-stagger-{1,2,3}`
8. **CTA banner heading** — add `solaris-heading` to the `<h2>` "Ready to get more enquiries?"

**Important:** Do NOT add reveal classes to the hero section — it renders above the fold and should be visible immediately.

### Verification gate

```bash
# Verification gate — STOP if this fails
pnpm type-check
```

### Commit

```bash
git add packages/themes/solaris/components/scroll-reveal-script.tsx packages/themes/solaris/components/index.ts packages/themes/solaris/pages/home.tsx sites/dcs/app/layout.tsx
git commit -m "$(cat <<'EOF'
feat(solaris): add scroll reveal script + apply reveal classes to home sections

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 3: Increase hero shape float amplitude

**Goal:** Make the hero geometric shapes bounce more by increasing the float `translateY` amplitude and slightly increasing rotation range in the float keyframes.
**Model:** haiku — mechanical CSS value changes in one file

Read `packages/themes/solaris/globals.css` before editing.

Edit the four float keyframes in `packages/themes/solaris/globals.css` (lines 32–47):

**Before → After:**

```css
/* solarisFloatA */
/* BEFORE */
50% {
  transform: translateY(-12px) rotate(1.5deg);
}
/* AFTER  */
50% {
  transform: translateY(-22px) rotate(3deg);
}

/* solarisFloatB */
/* BEFORE */
50% {
  transform: rotate(16deg) translateY(-8px);
}
/* AFTER  */
50% {
  transform: rotate(18deg) translateY(-16px);
}

/* solarisFloatC */
/* BEFORE */
50% {
  transform: rotate(-11deg) translateY(-10px);
}
/* AFTER  */
50% {
  transform: rotate(-13deg) translateY(-18px);
}

/* solarisFloatD */
/* BEFORE */
50% {
  transform: rotate(20deg) translateY(-6px);
}
/* AFTER  */
50% {
  transform: rotate(18deg) translateY(-12px);
}
```

Also slightly speed up the animations for more energy:

Edit `.solaris-geo-1` through `.solaris-geo-4` animation durations:

- `solarisFloatA 6s` → `solarisFloatA 4.5s`
- `solarisFloatB 7s` → `solarisFloatB 5.5s`
- `solarisFloatC 8s` → `solarisFloatC 6s`
- `solarisFloatD 5.5s` → `solarisFloatD 4s`

### Verification gate

```bash
# Verification gate — STOP if this fails
pnpm type-check
```

### Commit

```bash
git add packages/themes/solaris/globals.css
git commit -m "$(cat <<'EOF'
feat(solaris): increase hero shape float amplitude and speed for more bounce

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Phase 4: Add animations.css import to solaris globals

**Goal:** Import `core-components/src/styles/animations.css` into `solaris/globals.css` so that `RevealOnScroll` animation classes are available if used in future.
**Model:** haiku — single import line addition

Edit `packages/themes/solaris/globals.css` — add after the existing `@import` lines at the top:

```css
@import "../../core-components/src/styles/animations.css";
```

Verify the relative path: from `packages/themes/solaris/globals.css` to `packages/core-components/src/styles/animations.css` = `../../core-components/src/styles/animations.css`. Confirm this is correct before editing.

### Verification gate

```bash
# Verification gate — STOP if this fails
pnpm type-check
cd sites/dcs && npm run build 2>&1 | tail -20
cd ../..
```

### Commit

```bash
git add packages/themes/solaris/globals.css
git commit -m "$(cat <<'EOF'
chore(solaris): import animations.css from core-components for RevealOnScroll keyframes

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Parallel execution groups

This section lists work units that can run concurrently. Each group lists items that MUST be launched in a single Task-tool message. Items across groups run sequentially.

### Intra-phase groups

| Group | Phase   | Items                                              | File overlap     | Model  | Rationale                                |
| ----- | ------- | -------------------------------------------------- | ---------------- | ------ | ---------------------------------------- |
| G1    | Phase 1 | Read `header.tsx`, Read `footer.tsx`               | none (reads)     | n/a    | Independent reads — batch in one message |
| G2    | Phase 2 | Create `scroll-reveal-script.tsx`, Read `home.tsx` | none             | sonnet | Independent: new file + read             |
| G3    | Phase 4 | `pnpm type-check`, `npm run build` (sites/dcs)     | none (read-only) | n/a    | Independent verification commands        |

### Cross-phase groups

| Group  | Phases | Items | Rationale |
| ------ | ------ | ----- | --------- |
| (none) |        |       |           |

### Sequential points — MUST NOT parallelise

| Item                                            | Reason                                                                     |
| ----------------------------------------------- | -------------------------------------------------------------------------- |
| Verification gates between phases               | Each phase's output gates the next. Gates are the synchronisation barrier. |
| Git commits                                     | One commit per phase, in order.                                            |
| Phase 2b (index.ts) after Phase 2a (new file)   | Must create file before exporting it.                                      |
| Phase 2c (layout.tsx) after Phase 2b (index.ts) | Must export before importing in layout.                                    |

---

## Cost Estimate

| Phase                          | Model  | Est. input tokens | Est. output tokens | Est. cost  |
| ------------------------------ | ------ | ----------------- | ------------------ | ---------- |
| Phase 1: Logo props            | sonnet | ~8k               | ~1.5k              | ~$0.05     |
| Phase 2: Scroll animations     | sonnet | ~12k              | ~2k                | ~$0.07     |
| Phase 3: Float amplitude       | haiku  | ~3k               | ~0.5k              | ~$0.01     |
| Phase 4: animations.css import | haiku  | ~2k               | ~0.2k              | ~$0.003    |
| **Total**                      |        | **~25k**          | **~4.2k**          | **~$0.14** |

Rates: Sonnet $3/$15 per MTok; Haiku $0.25/$1.25 per MTok.

---

## Final Report

After all phases complete, output:

1. Phases completed — list each with commit SHA
2. Build status — confirm `pnpm type-check` passes and `cd sites/dcs && npm run build` passes
3. Any exceptions or intentional deviations from the plan
4. Token usage and cost estimate:

   | Model     | Est. input tokens     | Est. output tokens | Est. cost |
   | --------- | --------------------- | ------------------ | --------- |
   | sonnet    | [total across phases] |                    | $X.XX     |
   | haiku     | [if used]             |                    | $X.XX     |
   | **Total** |                       |                    | **$X.XX** |

---

## Update Session File

After completing all phases, append to `output/sessions/2026-04-12_dcs-logo-icons-animations/yolo-brief.md`:

```markdown
## Completed

**Date:** 2026-04-12
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

This writes `session-wrap-up.md` to the session folder. **This is a required final step — do not skip it.**

---

## Rules

- STOP on any failed verification gate — do not continue to next phase
- Read every file before editing it
- Never push — leave all changes on the feature branch
- **Consult the `## Parallel execution groups` section before launching any work.** Every item listed in a group MUST be launched in a single Task-tool message.
- **Items NOT listed in any group run sequentially.**
- **Never parallelise across phase boundaries unless the Cross-phase groups table explicitly lists the phases.**
- **If the groups table and the phase prose disagree, the groups table wins.**
- Minimal changes only — implement what the plan says, nothing more
- Use `model: haiku` for Task agents doing mechanical work; `model: sonnet` for standard edits
- The Co-Authored-By line in commits must reflect the orchestrator model: `Claude Sonnet 4.6`

## Completed

**Date:** 2026-04-12
**Status:** All phases executed successfully

Implemented all four phases cleanly. Phase 1 added `logoSrc`/`logoAlt` optional props to `SolarisHeader` and `SolarisFooter`, rendering an `<img>` tag in place of text when provided, and wired up `/logo.svg` in the DCS layout — the footer variant applies `filter: brightness(0) invert(1)` so the SVG appears white on the dark background. Phase 2 created `SolarisScrollReveal` (a Server Component emitting an inline IntersectionObserver script), exported it, added it to the DCS layout, and applied `.solaris-reveal`/`.solaris-heading` classes with per-index stagger to stats, service cards, Why Us cards, testimonial cards, and section headings — hero section intentionally excluded. Phase 3 increased the four `solarisFloat` keyframe amplitudes (translateY roughly doubled, rotation slightly expanded) and sped up animation durations by ~25%. Phase 4 added the `animations.css` import from core-components to the solaris globals. All verification gates (type-check and DCS full build) passed at each phase. No deviations from the plan.

### Commits

- `1bce304` — feat(solaris): add logoSrc/logoAlt props to header and footer; wire up DCS logo SVG
- `1104746` — feat(solaris): add scroll reveal script + apply reveal classes to home sections
- `0ba2268` — feat(solaris): increase hero shape float amplitude and speed for more bounce
- `dbc6b76` — chore(solaris): import animations.css from core-components for RevealOnScroll keyframes
