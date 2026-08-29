# Session: DPM Autobody — discovery, research and homepage options

**Status:** In progress — discovery
**Opened:** 2026-08-26
**Client:** DPM Autobody (David Pearce-Martin), Berwick, East Sussex
**Goal:** Research the client and their market, then produce 2–3 distinct homepage design options as
static prototypes for David to choose between, before any monorepo build starts.

---

## Folder map

| Path                              | Holds                                                                                                                         |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `client-brief.md`                 | The client email verbatim, parsed requirements, asset status, platform constraints                                            |
| `research/existing-site-audit.md` | What's on dpmautobody.co.uk now, what to keep, what to fix                                                                    |
| `BACKLOG.md`                      | Queued work — top item is the client-facing rationale document                                                                |
| `synthesis.md`                    | **START HERE** — what the research tells us to build, and the three directions                                                |
| `positioning.md`                  | **The governing principle** — project the customer's world, not the shop's personality                                        |
| `research/reference-teardown.md`  | First-pass Eagle / Thornton / Halcyon read (text extraction only — superseded by the teardowns below)                         |
| `research/teardown-halcyon.md`    | Deep teardown: structure, type, palette, motion, media, where it's beatable                                                   |
| `research/teardown-eagle.md`      | As above, plus their third-party-proof machine                                                                                |
| `research/teardown-thornton.md`   | As above, plus service IA and the restoration-story pattern                                                                   |
| `research/asset-audit-dpm.md`     | What imagery DPM actually has, honestly assessed, plus the shot list                                                          |
| `research/elevated-references.md` | The layer above the reference set — luxury craft, auction catalogues, technique menu, art directions                          |
| `tools/plate-redact/`             | Number-plate redaction: propose → confirm → apply. Condition of the owners' consent                                           |
| `research/tools/capture-site.mts` | Headless Playwright capture — screenshots + design report. See its README                                                     |
| `research/screenshots/`           | Captured reference imagery. Gitignored by design                                                                              |
| `open-questions.md`               | Everything blocked on David or on Ricky — ask before designing round 2                                                        |
| `inbox/`                          | Client-supplied material as it arrives (logo, photos, video, copy). Not for git — see note below                              |
| `prototype/`                      | Static HTML design options; `prototype/assets/` is R2-bound, never committed                                                  |
| `prototype/assets/art-direction/` | **AI-generated** art-direction plates + 3 motion clips. Read its `MANIFEST.md` — these are not DPM's cars and must never ship |

**Prototype assets never go in git.** Images and video under `prototype/assets/` upload to R2 via
`tools/upload-prototype-assets.ts`, then `tools/publish-prototype.ts` deploys the HTML to Vercel so
David reviews from a URL, not a `file://` path. See `docs/guides/prototype-hosting.md`.

---

## Phases

### Phase 1 — Discovery (done)

- [x] Audit the existing Wix site
- [x] Tear down the three reference sites David named
- [x] Capture the brief and the constraints
- [x] Build a shared headless capture tool so all teardowns argue from the same evidence
- [x] Deep teardowns of the three references, with visual capture (5 research agents, 2026-08-26)
- [x] Audit DPM's own Instagram/Facebook/YouTube imagery
- [x] Research the layer above the reference set — luxury craft, auction catalogues, technique menu
- [x] Synthesise into a design brief → `synthesis.md`
- [ ] Get the full-resolution image library from David — Instagram is not publicly fetchable

### Phase 2 — Direction (next)

- [ ] **Brief David's video shoot before it happens** — time-critical, see `synthesis.md` §6
- [ ] **Ask whether the original camera files exist** — everything reachable is 1080px; this answer
      changes the design and decides whether Direction B is viable at all
- [ ] Answer the rest of `open-questions.md` with David
- [ ] Sitemap + content model: services, projects/portfolio, about/workshop, process, contact
- [ ] Write the positioning and homepage copy against the concours framing
- [ ] Pick 2–3 design directions to prototype (working hypotheses below)

### Phase 3 — Prototypes

- [x] Generate art-direction plates to stand in for the commission (Higgsfield, 75 credits, 2026-08-27)
- [x] Build each direction as a static HTML page (2026-08-27) — `ui-ux-pro-max` paired with
      `minimalist-ui` (A), `high-end-visual-design` (B), `design-taste-frontend` (C)
- [x] `prototype/index.html` chooser page tying the three together
- [ ] Upload assets to R2 and publish to Vercel so David reviews from a URL — **not yet done, needs
      Ricky's go-ahead** (`tools/upload-prototype-assets.ts` then `tools/publish-prototype.ts`)
- [x] Review the three with Ricky — A rejected, B+C merged into D "The Register" (2026-08-27)
- [x] Retrieve real DPM photography — the Candy Red P1800 carousel, 14 slides (2026-08-27)
- [x] Build the merged D prototype — `prototype/direction-d-register.html` (2026-08-28)
- [x] Build plate-redaction tooling — `tools/plate-redact/` (2026-08-28)
- [ ] Write the client rationale (`BACKLOG.md` item 1)
- [ ] Replace every AI plate with commissioned photography before anything ships
- [ ] Upload assets to R2, publish to Vercel, send David the URLs

### Phase 4 — Build (only after David picks)

- [ ] `sites/dpm-autobody` from `base-template`, self-contained theme
- [ ] CSP `media-src` for video; `IntersectionObserver`-gated below-fold video
- [ ] `vercel.json` `ignoreCommand` present

---

## Client verdict — Ricky, 2026-08-27

- **A "The Catalogue" — REJECTED.** "I really don't like A."
- **B "Wet Coat" — imagery and interactions liked.** The scroll-moved highlight survives.
- **C "The Green Room" — the full article, the log, the register liked.**
- **Direction D "The Register"** is the merge: B's near-black ground, scroll-moved highlight and
  paint-code re-skin, carrying C's bylined log, stage set, materials index and register discipline.
  Built 2026-08-28 as `prototype/direction-d-register.html`.

## The three original directions

Superseded the earlier guesses. Full specs in `research/elevated-references.md` §7, summarised in
`synthesis.md` §5.

1. **A — The Catalogue.** Paper ground. The auction lot page built properly, for the first time in this
   trade. No hero image; opens on an index of lots. **Buildable from today's library.**
2. **B — Wet Coat.** Near-black. The site _is_ a painted surface; scroll moves a specular highlight
   across it; the accent is the car's actual paint code. The bravest, and the only one that sells what
   DPM actually sells. **Gated on imagery we do not yet have.**
3. **C — The Green Room.** Deep olive-green. A maker's journal — Dave, Ellis and Paul byline their own
   posts. No photograph above the fold. **Buildable from today's library.**

## The P1800 — the worked example

One real project now anchors the prototype, and everything in it is DPM's own and checkable:

|                |                                                                                                   |
| -------------- | ------------------------------------------------------------------------------------------------- |
| Car            | Volvo P1800, Candy Red, chassis **26282** (from the riveted "Restored By DPM AUTOBODY" plaque)    |
| Duration       | A year. **1,300 hours of labour**                                                                 |
| Client changes | Candy Red · wire wheel conversion · power steering conversion · smoothed chrome bumpers · lowered |
| Documentation  | "a full restoration portfolio with **over 2000 photos**"                                          |
| Film           | "The Volvo P1800 Restoration", 37:32, **57k views**, on DPM TV                                    |
| Stills         | 14 at 1280×853                                                                                    |

**None of it is on their current website.** That single gap is the clearest argument we have for the
whole project. Source and per-slide notes: `prototype/assets/dpm-instagram/DU2rgo5DXqC/README.md`.

## Verified early findings

All measured from live capture on 2026-08-26.

- **Halcyon** — Wix (Thunderbolt/React), the same platform David is on now. **30.7 MB / 240 requests**,
  86% of it one **26.9 MB** hero video (1392×782 upscaled to 1440, 119.88 fps, 200 kbps audio on a
  `muted` element, no poster, no 1080p rendition). Motion is six elements on Wix stock presets. Nothing
  above 46px on a 1440×900 viewport; H1 31.6px < H2 34px < H3 40px, three H1s per page. Typeface is
  **Riviera Nights (Swiss Typefaces)**, Rolls-Royce's corporate face, verified from the font binaries.
  Mobile serves a diverged DOM still describing the product as electric-only. `/cars` has **no
  individual car page at all**.
- **Eagle** — largest type on the entire site is **26px**; 90 requests / 6.70 MB; 2.57 MB of hero JPEGs
  on load; 28 JPEG / 0 WebP; no lazy-loading; no sticky nav on a 7,175px page; heroes are CSS
  backgrounds so there is no alt text. But **41% of the homepage is other people's voices**.
- **Thornton** — Squarespace 7.1; body ground is flat `#636363`; body copy at **94–151 characters per
  line**, 139 cpl centred on `/restore`; 21 type styles from one family; image masters capped at
  1500px; the red accent is baked into JPEGs; a live 404 in the homepage service grid; zero
  before/after anywhere.

**Every one of the three has superb photography inside an ordinary website.** What David is responding
to is art direction, not web craft. The art direction we must commission; the web craft we can simply
outbuild.

## Decisions so far

- **Keep the existing tagline** "Artists of Automotive Restoration" as a candidate — it is stronger
  than anything on the three reference sites and it is already theirs.
- **Design the hero to work without video.** David's video doesn't exist yet; a poster-first hero that
  accepts a clip later is the only safe order of work.
- **Insurance/accident repair is an open question, not a decision.** It's off-positioning for concours
  but may be real revenue. Ask before cutting.
- **Project the customer's world, not the shop's personality** — see `positioning.md`. This governs
  photography, copy register and art direction, and it is the reason the shot list matters more than
  the layout.
- **Clear Halcyon, don't match it.** It is the bar David has in mind and it is beatable.

## What was learned

_(fill at wrap-up)_
