# DPM Autobody prototype — how this folder works

Two audiences, two builds, one source.

| Path               | What it is                                                                                            |
| ------------------ | ----------------------------------------------------------------------------------------------------- |
| **`src/`**         | **The only files to edit.** `home.html` and `volvo-p1800.html`.                                       |
| `client/`          | Generated. Clean. **This is what David sees.**                                                        |
| `annotated/`       | Generated. Same page plus the working notes. Ricky's talk-track. Carries a yellow flag in the corner. |
| `build.mjs`        | Generates both from `src/`.                                                                           |
| `type-study.html`  | Standalone. The headline-face question, with DPM's mark in the frame.                                 |
| `index.html`       | Chooser. Hand-edited, not generated.                                                                  |
| `direction-*.html` | Superseded. Kept for the record. Do not edit.                                                         |

```bash
node prototype/build.mjs
```

**Never edit `client/` or `annotated/` directly.** They are overwritten on every build, and the
whole point of the split is that the two cannot drift.

## Marking a note

Two attributes, applied in `src/`:

- `data-note` — annotated build only. Provenance, open questions, anything not for the client.
- `data-client` — client build only. Use where the client page needs a **shorter** version of a
  sentence rather than none of it.

Anything unmarked appears in both. That default is deliberate: forgetting to mark something makes
the client page too honest, never the working page too thin. The build throws if a marker attribute
survives into either output, and refuses `data-note` on a void element (there is nothing to strip
inside an `<img>` — put it on a wrapper).

## Assets are not in git

`output/.gitignore` denies binaries across `sessions/**` by design — prototype assets belong in R2.
A fresh clone therefore gets working HTML and 404ing images. Two scripts rebuild everything:

```bash
./prototype/assets/dpm-work/make-plates.zsh     # the Bentley, the Jaguar, the workshop
node tools/trace-logo.mjs <alpha.raw> 1158 577 prototype/assets/brand/dpm-logo.svg
```

`make-plates.zsh` documents every source and every crop. It re-downloads the Jaguar film from
YouTube if it is not cached — only the `web_safari` player client offers 1080p without a PO token;
`android` silently falls back to 640×360.

The DPM mark is **inlined into the generated HTML** as an SVG `<symbol>`, so unlike the photographs
it survives a fresh clone. `trace-logo.mjs` only needs re-running to change the trace tolerance.

## What is real, and what is not

**Every photograph in `client/` and `annotated/` is DPM Autobody's own, of DPM Autobody's own
work.** Nothing on those two pages is AI. The AI art-direction plates survive only in
`direction-a/b/c` and the superseded `direction-d-register.html`.

- **Volvo P1800, Candy Red** — 14 frames from DPM's own Instagram post. Every figure (a year,
  1,300 hours, 2,000 photographs, chassis 26282, the 37:32 film) is DPM's own published record.
- **Bentley S3 Continental, 1963** — three crops of the single 4032×3024 photograph DPM publish on
  their own site. No hours, chassis or coat count are claimed, because DPM have never published any.
- **Jaguar, Aston Martin Sea Green** — frames from DPM's own film, lens-corrected. The colour name
  is theirs, captioned on their video. **The model is deliberately not named**: DPM never state it.

**The copy is a first pass at customer-facing wording, not signed off.** Three blocks in particular
are ours and not DPM's: the four log entries on the P1800 page, the nine stage names and their
durations, and the notes beside the owner's specification and the paint. The log entries put
first-person words in the mouths of three real, named men. The client build carries no label saying
so — say it out loud when walking David through it.

## The hero's vertical fit is measured, not eyeballed

The hero stacks four things into one viewport height: the masthead, the copy block, a foot pinned
near the bottom, and a caption pinned below that. Three gaps have to stay positive, and every clamp
that controls one of them moves the other two. Tuning any of these by looking at one window size
will break another — the collisions only appear on short-and-wide viewports, which is exactly what a
13" laptop with the browser not maximised gives you.

```bash
python3 -m http.server 8899 --bind 127.0.0.1     # from prototype/
# then, from the MONOREPO ROOT:
npx tsx output/sessions/2026-08/2026-08-26_dpm-autobody-discovery/prototype/measure-hero.mts
```

It prints logo→label, lede→foot and foot→caption across 20 viewports on both pages and exits
non-zero if any goes negative. Run it after touching any of:

- `.hero__inner` `padding-top` / `padding-bottom`
- `.hero__foot` `bottom`, or the `min-height: 44rem` on the rule that pins it
- `.h-hero` `font-size`
- the masthead logo height

Four things it caught that were not visible at one window size: a `@media (min-width: 60rem)` rule
was zeroing `.hero__inner`'s top padding, so the headline drifted up under the masthead on every
wide screen; plain `align-content: end` spills past the padding edge when content overflows, so it
has to be `safe end`; below about 704px tall the pinned foot cannot clear a three-line headline and
has to go back into flow as it does on a phone; and the headline needed a `min(7.6vw, 12vh)` cap so
a wide-but-short window does not set it at 104px and push the lede through the foot.

## Traps

- **A serif decision in `type-study.html` is two lines here.** `--font-display` and `--font-text` in
  `:root` in both `src/` files. Changing the face also means changing the Google Fonts `<link>`.
- **No tabular or monospaced face, anywhere.** Both pages carry `1,300`, `2,000` and `57,000`, and a
  tabular comma gets a full digit advance — `£1,995` sets as `£1 , 995`. Both files declare
  `font-variant-numeric: normal` explicitly for that reason. See the root `CLAUDE.md`.
- **The mark is traced, not redrawn.** 1.9% different from the source raster: invisible on screen,
  wrong for a signwriter. Real vector artwork from DPM is still an open item.
- **Nothing has been published.** No R2 upload, no Vercel deploy, no `r2.dev` or `vercel.app` URL in
  any page. David has not seen any of this.
