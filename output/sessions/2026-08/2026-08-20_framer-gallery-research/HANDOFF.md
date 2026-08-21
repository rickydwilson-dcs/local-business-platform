# Framer research → next prototype round — handoff

**Status:** ready-to-resume — research is **complete and written up**; **zero prototypes have been
built from it.** The next session's whole job is to build them.
**Branch:** `develop`. One unpushed commit (`75d6a445`) unrelated to this work.
**Commits:** **none for this session.** Every file in this folder is **untracked**
(`?? output/sessions/2026-08/2026-08-20_framer-gallery-research/`). Nothing here survives a fresh
clone until it is committed.
**Working tree:** dirty. Besides this folder: `M .../2026-08-17_dcs-homepage-redesign/prototype/index.html`,
eight untracked `home-52-m*/home-5[56]-*/mobile-lab.html` prototypes in that older folder, plus
pre-existing unrelated `supabase/` and a codex `openrouter-response.json`.

## What this is trying to resolve

DCS needs a new homepage. An earlier session produced ~56 static HTML prototypes and Ricky rejected
the lot, in his words:

> "I find that we are stuck on the correct design and whilst I liked the colours and fonts, the
> actual components weren't making it look elevated and the mobile responsiveness was dreadful."

So this session did **no design work at all**. It ran two research sweeps of the Framer ecosystem to
answer those two complaints, and distilled the result into a brief. Explicit constraints Ricky set
during the session, all of which bind the next one:

- **Keep an open mind** — "you should not presume that what we have prototyped is of any use." Do not
  filter ideas by whether they fit the existing direction.
- **No count-up numbers, ever** — "i dont want to buy any of these... i dont like counts that count up
  to a number though." This is now a standing rule, recorded in memory
  (`feedback_animated_counters_show_false_figures`). Static authored figures only.
- **Not buying templates** — "i want best practice and inspiration to brief our ux skills to prototype
  others." Nothing is to be purchased or remixed from Framer.
- **The next round must not be text-and-colour only** (his brief for the next session, verbatim):
  _"dont allow ay to just be text and colour"_ — every prototype must carry imagery or wireframe
  placeholders. Placeholder/wireframe imagery is explicitly acceptable.

## Actions taken

No commits. Work product only, all in this folder.

| Phase        | What ran                                                                                                                 | Output                                                                                                                                                       |
| ------------ | ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Round 1      | 6 parallel agents across the Framer community **gallery** (agency, business, SaaS+AI, landing page, featured, portfolio) | `findings-agency.md`, `findings-business.md`, `findings-saas-ai.md`, `findings-landing-page.md`, `findings-featured.md`, `findings-portfolio.md`, `BRIEF.md` |
| Mobile pass  | Orchestrator measured 4 sites at a true 390px viewport                                                                   | recorded in `shortlist.html`                                                                                                                                 |
| Round 2      | 5 parallel agents across all 159 **agency templates** in the marketplace                                                 | `findings-tpl-batch-a.md` … `-e.md`, `BRIEF-templates.md`, `agency-template-slugs.md`                                                                        |
| Distillation | Both rounds combined into one prototype brief                                                                            | **`prototype-brief.md`** ← the deliverable                                                                                                                   |
| Presentation | Three published artifacts                                                                                                | `brief.html`, `shortlist.html`, `templates-shortlist.html`                                                                                                   |

## Current state — verified 2026-08-20

**The canonical deliverable is `prototype-brief.md`** (23KB). It is written to be **fed to a design
skill as a brief**. It contains:

- **Part 1 — motion policy**: 6 rules, 6 banned patterns (each with observed evidence), 10 effects
  that carry information with their mechanism.
- **Part 2 — component vocabulary**: in-card mock recipe, 4 alternatives to the service card grid,
  audience segmentation, process, pricing, proof-without-a-stats-bar, nav/status, contact, section
  furniture.
- **Part 3 — mobile rules**, verified vs inferred separated.
- **Part 4 — three paste-ready direction briefs** (Spec sheet / Poster / Quiet) + a shared constraints
  block. **These have never been run through any skill.**

**Published artifacts** (live, private to Ricky's account; all three were republished after a CSS fix):

- Prototype brief — `https://claude.ai/code/artifact/2c1c3327-cac1-41f5-899f-f262887f2c0d`
- Gallery shortlist — `https://claude.ai/code/artifact/a48eb574-f61a-4e4f-97a9-c55babf92d95`
- Templates sweep — `https://claude.ai/code/artifact/2a34c706-d7cb-4c34-b42e-4d30549bbbf5`

**Style guidance from the previous session — verified by grep against
`../2026-08-17_dcs-homepage-redesign/prototype/home-52-poster-indigo.html`, not recalled:**

```
--ink      #101014      --graphite #1B1B20     --paper/--chalk #F3F3F1
--bone     #E3E3E0      --ash      #55555E     --smoke         #A6A6B0
--acid     #00D2D8      --ultra    #D6006B     --lilac         #FF9BC8
--plum     #17265E   ← the navy Ricky chose from /colour-lab over the original indigo
```

Fonts, from the Google Fonts `<link>` in the same file:
`Schibsted Grotesk` (400;500;700;800;900 — headings, Ricky said explicitly he is happy with them),
`DM Mono` (400;500 — body, chosen over five alternatives at `/type-lab`), `Poppins` (300;400 —
lowercase two-line logotype).

Ricky also said, of the Bold Design template, that its near-black + chartreuse + indigo + bone palette
"might work with previous art direction we had" — so the palette above is a starting point, **not a
lock**.

**Nothing live was written.** No deploys, no R2 uploads, no pushes, no purchases. The only
side-effects outside this repo are the three private artifact pages and one updated memory file.

## What was NOT done

- **No prototypes exist.** Not one. The brief is the entire output of this session.
- **The three Part 4 direction briefs have never been executed** through `ui-ux-pro-max`,
  `impeccable`, `design-taste-frontend`, `high-end-visual-design` or any other skill.
- **~60 Featured-shelf agency templates were never opened.** The Featured shelf holds 99+ templates,
  Trending-ordered — i.e. the ones Framer itself promotes — and the partition sent agents down the
  alphabetical tail instead. Slug list is in `findings-tpl-batch-e.md` under "Featured shelf sweep".
- **No mobile assessment in round 2 at all** (desktop only, deliberately). Only **4 sites total**
  across both rounds were measured at 390px. Every other mobile claim is inference from construction
  and is labelled as such.
- **No hover-state or mobile-menu pass in either round.** Behaviour was half the original brief and is
  the weakest part of the research.
- **`findings-landing-page.md` is a summary only** (2.6KB vs ~20KB for its siblings) — that agent's
  detail was lost to a blocked write and only its returned summary survives. It is labelled at the top
  of the file.
- **Nothing committed, nothing pushed, nothing merged.** No `staging`/`main` involvement.

## Traps

1. **Subagent file writes are blocked by a harness rule.** Four of eleven agents had their
   `Write` to `findings-*.md` refused, and **two of them reported success anyway** — one agent's
   detail was lost that way before it was noticed. **Instruct every subagent to return its full
   document in its final response**, and have the orchestrator write the file. Do not trust an agent's
   claim that it wrote a file; `ls` it.
2. **`mcp__claude-in-chrome__resize_window` does not work** — the screenshot tool pins a fixed
   viewport override, so resize reports success while `window.innerWidth` stays at desktop (measured:
   `outer 728 / inner 1390`). To get a true 390px render, replace the document with a same-origin
   `<iframe width="390" height="818" src="<same url>">` and screenshot that. Working recipe is in
   `prototype-brief.md` Part 3.
3. **Framer-style scroll reveals do not fire on programmatic scroll.** `window.scrollTo` leaves pages
   blank. Drive with the `computer` tool's `scroll` action (real wheel events), 5–8 ticks with a 1–2s
   wait, paired before/after screenshots.
4. **`shots/` is gitignored and will not be committed.** Confirmed:
   `git check-ignore` → `output/.gitignore:21:sessions/**/*.jpg`. 175 files, 12MB. The findings files
   reference these paths — if the evidence needs to survive, it must go to R2, not git.
5. **Framer demo URLs are unreliable** — three hostnames (`.framer.website`, `.framer.media`,
   `.framer.ai`) and ~⅓ of slugs don't match their demo. One template (`bold-design-portfoli`) was
   **wrongly reported dead** by an agent that only tried the guessed URL; its real demo is live at
   `bolddesign.framer.website`. Treat any "Site Not Found" in the findings files as unverified.
6. **Do not click "Use for Free" / "Remix" / "Buy"** on any Framer template — it writes to Ricky's
   Framer account, and he has said he is not buying any of these.
7. **`display: grid` on an `<li>` splits inline children into separate grid items.** This shipped
   broken in all three artifacts (a `<strong>` took the content column and the following text wrapped
   into the 34px marker column). Fixed by `position: relative` + `padding-left` with an
   absolutely-positioned `::before`. Worth remembering when building prototype markup.
8. Two `CLAUDE.md` rules bite directly on the patterns in the brief: the
   `transform`/`backdrop-filter` **containing-block trap** on any centred floating nav, and
   **never `font-variant-numeric: tabular-nums`** on a price containing a thousands comma
   (`£1,995` renders as `£1 , 995`).

## Next step

Build the next range of prototypes. Ricky's instruction for this round:

> "the next session needs to take these insights and create another range of prototypes using our
> various ux skills but guided by these and some previous style guidance eg colours, fonts.
> placeholder imagery is fine (or wireframe placeholders). dont allow any to just be text and colour"

**The hard constraint:** _no prototype may be text-and-colour only._ Every one must carry imagery —
real placeholder photography, duotone-treated placeholders, wireframe blocks, or the abstract in-card
UI mocks specified in `prototype-brief.md` §2.1. The previous 56 failed partly because they were
typography and colour fields with nothing in them; do not repeat that.

Suggested sequence:

1. Read `prototype-brief.md` end to end. It is the brief — do not re-derive it from the findings files.
2. Read the verified palette/type block under "Current state" above, and
   `../2026-08-17_dcs-homepage-redesign/content-brief.md` + `PRODUCT.md` for the real copy and the
   24-month PAYG offer structure.
3. Run **each** of the three Part 4 directions (Spec sheet / Poster / Quiet) through a different
   design skill so the outputs genuinely diverge — e.g. `impeccable`, `ui-ux-pro-max`,
   `high-end-visual-design`. Append the shared constraints block to every one.
4. Add the imagery requirement to each prompt explicitly, e.g.:
   `Every section must contain a visual element — placeholder photography, a duotone-treated image, a wireframe block, or an abstract UI mock built from divs (tinted canvas + grey skeleton bars + exactly one full-colour element). No section may be type and colour alone.`
5. Write prototypes to `output/sessions/2026-08/2026-08-17_dcs-homepage-redesign/prototype/` to sit
   alongside the existing numbered set (next free index is **57**), or start a fresh session folder —
   ask Ricky which he wants before scattering files.
6. Verify each one **rendered**, not just written: open it and screenshot. Three artifacts shipped
   visibly broken this session because markup was trusted without looking.
7. Commit. This folder is entirely untracked:
   ```bash
   git add output/sessions/2026-08/2026-08-20_framer-gallery-research
   git commit -m "docs(dcs): Framer gallery + templates research and prototype brief"
   ```

## Decisions — answered by Ricky 2026-08-20

All four open questions are now closed:

1. **Location:** continue the existing run — `output/sessions/2026-08/2026-08-17_dcs-homepage-redesign/prototype/`,
   starting at **`home-57`**. New entries must also be registered in that folder's `index.html`
   (a JS array of `{ n, file, name, kicker, desc, fonts, moment, tags, tone, sw }` objects, ending
   around line 707 — see the `n:"56"` entry for the shape).
2. **Count: 12 options** (`home-57` … `home-68`).
3. **Palette/type are a starting point, not a constraint.** Directions may move off
   `--plum #17265E` and the existing chord entirely. Schibsted Grotesk / DM Mono / Poppins are the
   inherited defaults, not a lock.
4. **Do not sweep the remaining ~60 Featured templates.** Ricky: "not sure what seeing will do or help
   with." Agreed and dropped — the last two batches were already returning the same devices, so the
   vocabulary had saturated. More inspiration is not the bottleneck; prototypes are.

The build spec derived from these is `../2026-08-17_dcs-homepage-redesign/build-spec-round7.md`.
