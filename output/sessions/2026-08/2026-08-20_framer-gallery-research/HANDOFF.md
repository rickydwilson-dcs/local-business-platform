# Framer research → round 7 → **round 8 reset** — handoff

**Status:** blocked-on-rethink. Round 7 (twelve prototypes, `home-57`…`home-68`) is **built,
committed, merged to `main` and deployed** — and it **fails its own objective**. The prototypes are
essentially static. Round 8 must be re-specified before anything is built.
**Branch:** `develop`, clean and level with `origin/develop`.
**Everything is merged.** `main` == `staging` == `develop`. PR #58 merged as `0019d11e`.
**Live:** https://2026-08-17-dcs-homepage-redesign.vercel.app (all 13 URLs verified 200)

---

## THE HEADLINE — read this before doing anything else

Ricky's verdict on round 7, verbatim:

> "none of these have any real animation yet the reason for using framer as inspo is because they
> all do. animation and movement shows tech craft and expertise (to the simple tradesperson they
> think wow) and for those who just like pretty things it scratches that itch. so this all feels
> like a dead end."

**He is right, and it is measurable.** Motion content across all twelve:

| Metric                                                                | Result                                                |
| --------------------------------------------------------------------- | ----------------------------------------------------- |
| `@keyframes` blocks per file                                          | 0–4 (most have 1)                                     |
| `transition:` declarations per file                                   | 3–14 (a static brochure has this many on links alone) |
| **Scroll-linked JS** (`scrollY` / `useScroll` / `animation-timeline`) | **zero in eleven of twelve** — only `home-67` has any |
| `IntersectionObserver` uses                                           | 2–7, and all of them are entrance fades               |

So: hover states and a few fade-ups. That is not what the research was for.

### Why it happened — this was a specification failure, not an execution failure

The agents built exactly what `prototype-brief.md` and `build-spec-round7.md` asked for. Three
concrete errors in those documents:

1. **Part 1 of the brief is a ban list, not a craft spec.** Six rules, seven vividly
   evidence-backed banned patterns, and an "allowed" table that reads as grudging exceptions.
   Anything framed as prohibition gets treated as prohibition.
2. **The acceptance test selected for static pages.** "The page must be a complete, readable
   document with JavaScript disabled" was the single stated pass/fail criterion. The safest way to
   pass it is to build nothing that needs JavaScript. The absence of motion was the winning
   strategy — I made it so.
3. **The hard rule measured the wrong thing.** "No section may be text and colour alone" was
   satisfiable with **static** SVG, and was. 42–77 drawn devices per page, none of them moving.
   It counted visual elements, not movement.

Root cause under all three: the research surfaced broken reveals everywhere (blank heroes, dead
preloaders, ghosted headlines), so the brief was written to prevent breakage — and lost the reason
we looked at Framer at all. **Motion is the product demo.** For a trades audience it is the proof
that DCS can actually build things; for everyone else it is the thing that makes a page feel
expensive. It is not decoration to be minimised.

### The correction for round 8

The JS-off rule was not wrong, it was **wrongly weighted**. Keep it as a floor, not as the goal:

- **Floor (unchanged):** content is readable with JS off. Never gate content visibility on JS.
  No preloaders, no scroll-jacking, no count-ups, no ghosted-at-rest text.
- **New primary requirement:** _every_ prototype must ship **real, continuous motion**, specified
  as a quota rather than a permission. Suggested minimum per page, and make it a
  definition-of-done item that gets **counted**, not asserted:
  - **1 scroll-linked hero behaviour** (parallax at differing rates, z-interleave, a pinned
    element that transforms as you pass it)
  - **≥3 scroll-driven section behaviours** that carry information (scroll-spy rail, self-drawing
    rule, reading-position highlight, progress in the nav)
  - **≥1 continuous ambient motion** that never stops (marquee, rotating badge, drifting plate,
    live clock)
  - **≥5 distinct hover/interaction states** that change more than a colour
  - **A stated "moment"** — the one thing you would screen-record to show a client
- **Change the measurement.** Round 7 was verified by counting `<svg>` tags. Round 8 must be
  verified by **recording motion**: scroll the page with real wheel events, capture paired
  before/after frames, and confirm the page is visibly different between them. A prototype that
  looks identical in two frames taken two seconds apart has failed.
- **Give agents a motion budget, not a motion ban.** Name the techniques as _required equipment_:
  `animation-timeline: view()`, scroll-linked CSS custom properties, `IntersectionObserver` +
  staggered `transition-delay`, SVG `stroke-dashoffset`, CSS `@keyframes` marquees, and small
  Framer Motion components. All of these degrade safely if authored from a visible resting state.

### Also dropped by Ricky

> "plus i really dont see the need for hero-meta"

The corner-metadata device (`(©2018 – ©2026)` left, `Based in East Sussex` right) came from Sylven.
It is a design-studio affectation and says nothing to someone deciding whether to request a quote.
**Remove it from the component vocabulary** (`prototype-brief.md` §2.7) and from any round-8 spec.

---

## What exists right now

### Round 7 — built, merged, deployed, and superseded in intent

Twelve prototypes at `output/sessions/2026-08/2026-08-17_dcs-homepage-redesign/prototype/`,
registered in that folder's `index.html` (`DIRECTIONS` array, 68 entries, 12 tagged `Round 7`):

`home-57-spec-sheet` · `home-58-poster` · `home-59-quiet` · `home-60-trade-blocks` ·
`home-61-masthead` · `home-62-workbench` · `home-63-index-rail` · `home-64-swiss-grid` ·
`home-65-warm-local` · `home-66-chamfer` · `home-67-dock` · `home-68-selector`

**They are not worthless** — the layouts, component vocabulary, copy and 390px treatments are sound
and were verified. They are a **static component library**. Round 8 should treat them as a parts
bin rather than starting from a blank page: pick two or three layouts and make them _move_, rather
than generating twelve more still images.

Notable: `home-67` is the only mobile-first one and the only one with any scroll-linked JS.
`home-64` is the only one using real R2 photography (five images, all verified 200); the rest are
self-contained and work offline.

### The research — still good, still valid

`prototype-brief.md` (Parts 2 and 3 especially) came out of ~150 gallery sites and 85 template
demos and is sound. **Part 1 (motion policy) is the part that needs rewriting** per the correction
above. Eleven findings files sit alongside it. `shots/` holds 175 screenshots and is **gitignored**
(`output/.gitignore:21`, `sessions/**/*.jpg`) — the evidence is local-only.

Three published artifacts (private, Ricky's account):

- Prototype brief — `https://claude.ai/code/artifact/2c1c3327-cac1-41f5-899f-f262887f2c0d`
- Gallery shortlist — `https://claude.ai/code/artifact/a48eb574-f61a-4e4f-97a9-c55babf92d95`
- Templates sweep — `https://claude.ai/code/artifact/2a34c706-d7cb-4c34-b42e-4d30549bbbf5`

### Verified style inputs (grep-confirmed, not recalled)

From `home-52-poster-indigo.html` — **a starting point, not a lock**, per Ricky:

```
--ink #101014  --graphite #1B1B20  --paper/--chalk #F3F3F1  --bone #E3E3E0
--ash #55555E  --smoke #A6A6B0
--acid #00D2D8  --ultra #D6006B  --lilac #FF9BC8  --plum #17265E
```

Fonts: `Schibsted Grotesk` (headings — Ricky is happy with them), `DM Mono` (labels, figures,
prices), `Poppins 300` (logotype).

⚠ **Two agents independently found DM Mono unusable for body prose at 390px** — it yields ~36
characters at full width against a ~35-character floor. Keep it for labels and figures; set prose in
the grotesk.

---

## Live-data / infrastructure changes already applied

**Do not re-apply these.**

| Change                                                                      | Where                                      | SHA        |
| --------------------------------------------------------------------------- | ------------------------------------------ | ---------- |
| Round 7 prototypes + research committed                                     | `develop`                                  | `b2fa1c75` |
| **CI fix — `e2e-tests.yml` `paths-ignore` removed from the `push` trigger** | `develop`                                  | `03ef16d6` |
| Merged to staging                                                           | `staging`                                  | `4a27499b` |
| Merged to main via PR #58                                                   | `main`                                     | `0019d11e` |
| Prototypes deployed to Vercel                                               | project `2026-08-17-dcs-homepage-redesign` | —          |

**The CI fix matters and is worth understanding.** `e2e-tests.yml` used to carry
`paths-ignore: output/**, docs/**, **/*.md` on its `push` trigger, so a docs-or-prototypes-only
commit produced **no workflow run at all**. `scripts/verify-staging-e2e.ts` requires a
_push-triggered_ `e2e-tests.yml` run concluding `success` for the exact promoted commit, and fails
closed with **no override flag** (it deliberately closed three earlier bypass holes). The two
policies deadlocked: any docs-only change could reach `staging` but never `main`. Removing
`paths-ignore` from `push` only (leaving `pull_request` filtered) fixes it — the jobs already scope
themselves by branch with `if:`, so the cost is one smoke run on a docs push and the promoted commit
is genuinely tested. Recorded in `CHANGELOG.md` and in a comment on the trigger.

`CLAUDE.md` was also widened: the comma'd-price rule warned only about
`font-variant-numeric: tabular-nums`, but **a monospaced face does the same damage on its own** —
DM Mono rendered `£1 , 995` with no `tnum` anywhere. Since DM Mono is the chosen body face this is
live, not hypothetical.

---

## Traps

1. **Subagent file writes are blocked by a harness rule**, and agents have reported success anyway —
   one agent's detail was lost that way. **Have every agent return its document in its final
   response** and write the file yourself. `ls` it before believing it exists.
2. **`resize_window` does not work.** The screenshot tool pins a viewport override and reports
   success while `innerWidth` stays at desktop. For a true 390px render, inject the page into a
   same-origin `<iframe width="390">` and screenshot that.
3. **Scroll reveals do not fire on programmatic scroll.** `window.scrollTo` leaves pages blank. Use
   the `computer` tool's `scroll` action (real wheel events).
4. **`git merge --ff-only` into `staging` always fails** — staging carries 40+ historical
   `Merge branch 'develop' into staging` commits and can never fast-forward. Use a plain merge.
5. **The promotion gate races the E2E run.** On the first attempt the gate ran ~2 minutes before E2E
   finished and reported FAILURE. It is not a real failure — re-run the gate
   (`gh run rerun <id> --failed`) once E2E is green.
6. **Do not commit `supabase/`** (CLI temp state incl. `linked-project.json` and a project ref) or
   `output/sessions/codex-peer-review/.../openrouter-response.json`. Both are pre-existing, unrelated
   and still untracked.
7. **Never click "Use for Free" / "Remix" / "Buy"** on a Framer template — it writes to Ricky's
   account, and he has said he is not buying any of them.
8. `display: grid` on an `<li>` splits inline children into separate grid items — it shipped three
   broken artifacts this session before being caught by _looking at the rendered page_.

---

## Next step

**Do not build anything yet.** Ricky's instruction:

> "lets /handoff and then start again next time with you telling me how i should brief better"

So the next session opens with a **briefing conversation**, not a build. Bring to it:

1. **An honest account of the round-7 failure** — it was a specification error (see THE HEADLINE),
   not Ricky's brief being unclear. His brief said "engaging yet functional animation" and that was
   clear enough; it got translated into a safety policy. Do not put the blame on his side.
2. **A rewritten Part 1** for `prototype-brief.md` — motion as a _quota with named techniques_,
   with the JS-off rule demoted to a floor. Draft it before the conversation so there is something
   concrete to react to.
3. **A proposed round-8 shape.** Recommended: pick **two or three** round-7 layouts he likes and
   build motion into them properly, rather than generating twelve more. Twelve still images taught
   us the layouts; the open question is movement, and that is better answered deeply than widely.
4. **A concrete way for him to steer** — what to say to get what he wants. Specifically: name the
   _feeling_, name a _reference moment_ ("the thing I'd screen-record"), and say whether motion is
   decoration or proof. He already did the third one well; we should ask for the second up front.
5. **hero-meta removed** from the vocabulary.

Nothing needs committing or deploying to start that conversation. The tree is clean and everything
is on `main`.

## Open questions for Ricky

1. **Which round-7 layouts are worth keeping** as the base for motion work? (`67 Dock`, `58 Poster`
   and `62 Workbench` are the most motion-ready by construction.)
2. **How much motion is too much?** The research found scroll-jacking and preloaders genuinely
   hostile — is there an upper bound, or should round 8 go as far as it can and pull back?
3. **Is the palette still open?** He said it is a starting point; round 7 mostly stayed near it.
