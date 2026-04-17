# Session Wrap-Up: Stitch HTML to React Fidelity Fix

**Date:** 2026-04-12
**Session folder:** output/sessions/2026-04-12_stitch-html-to-react/
**Branch:** feature/stitch-html-to-react
**Status:** Completed

## Goal

Translate the Stitch-generated HTML designs into faithful React/Tailwind page templates for all 4 underscore sites (castor, cygnus, lyra, nova), wire missing fonts and icons, and document the conversion step in the pipeline.

## What Was Done

- Wired Newsreader + Work Sans via `next/font/google` in all 4 underscore site layouts, registered `font-headline`/`font-body` in each tailwind config, added `pages/**` content glob
- Added Material Symbols Outlined CSS import and `.material-symbols-outlined` utility class to all 4 theme globals.css files
- Rewrote 20 page templates (home, services, service-detail, about, contact x 4 themes) from generic base-template copies to faithful translations of each theme's Stitch HTML -- preserving section structure, micro-interactions, icon names, and colour palettes mapped to theme tokens
- Fixed castor header nav from uppercase/tracking-widest to font-body/text-sm to match its Stitch design
- Added "Step 4b: HTML to React Conversion" to pipeline architecture docs and creating-new-theme guide with an origin-agnostic checklist

## Key Decisions

- Used CSS-only `<details>`/`<summary>` for FAQ accordions across all themes to avoid `'use client'` -- keeps page templates as Server Components
- Hero overlay colours use inline `style={{ background: 'rgba(...)' }}` because Tailwind opacity modifiers don't work with CSS custom properties
- Added `pages/**` tailwind content glob (not in original brief) -- necessary for Tailwind to scan classes used in theme page templates
- Each theme rewrite was delegated to a separate opus agent for deep HTML-to-TSX translation with full Stitch HTML context

## Commits

- `74c7a19` -- feat(themes): wire Newsreader + Work Sans fonts in all 4 underscore sites
- `a03240b` -- feat(themes): add Material Symbols Outlined to castor/cygnus/lyra/nova globals
- `58e9c26` -- feat(castor): rewrite page templates from Stitch HTML -- faithful HTML-to-React conversion
- `b17d604` -- feat(nova): rewrite page templates from Stitch HTML -- faithful HTML-to-React conversion
- `5118361` -- feat(cygnus): rewrite page templates from Stitch HTML -- dark theme MD3 HTML-to-React
- `e416dbf` -- feat(lyra): rewrite page templates from Stitch HTML -- garden theme HTML-to-React
- `929ff16` -- docs(pipeline): add Step 4b HTML-to-React conversion -- origin-agnostic checklist

## Files Changed

- `packages/themes/{castor,cygnus,lyra,nova}/pages/*.tsx` -- 20 page template rewrites (the core of this session)
- `packages/themes/{castor,cygnus,lyra,nova}/globals.css` -- Material Symbols import + utility class
- `packages/themes/castor/components/header.tsx` -- nav styling fix
- `sites/_{castor-plumbing,cygnus-graphics,lyra-garden,nova-print}/app/layout.tsx` -- font wiring
- `sites/_{castor-plumbing,cygnus-graphics,lyra-garden,nova-print}/tailwind.config.ts` -- fontFamily + pages glob
- `docs/architecture/how-stitch-design-pipeline-works.md` -- Step 4b added
- `docs/guides/creating-new-theme.md` -- Step 4b cross-reference added

## What Was Learned / Why It Matters

The Stitch pipeline's original gap was clear: it extracted tokens correctly but never converted the HTML designs into React components, leaving all 4 underscore sites looking like generic base-template copies. This session closed that gap for the existing themes and -- critically -- documented it as an explicit pipeline step so future theme creation won't repeat the mistake. The pattern of delegating each theme's 5-page rewrite to a separate opus agent with full Stitch HTML context worked well; each agent could focus on one design language without cross-contamination. The cygnus dark theme required the most care since its token semantics are inverted (light text on dark backgrounds).

## Follow-On Tasks

- Wire hero images to actual R2 assets or `heroImage` props (all templates currently have TODO placeholders)
- Visual QA each site in the browser to verify the templates render correctly against the Stitch designs
- Consider adding the HTML-to-React conversion as an automated step in the `/pipeline.stitch-design` skill itself
