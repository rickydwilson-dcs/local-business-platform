# Round 1b — Impeccable directions (13–18)

Addendum to `build-spec.md`. **Everything in that file still applies** (self-contained single
HTML file, full page, working header and mobile nav, responsive at 1440/1024/768/390,
semantic landmarks, AA body contrast, motion with `prefers-reduced-motion` handling, real
content from `content-brief.md`, no placeholders). This file records only what changes.

---

## 1. Impeccable drives these six

The `impeccable` skill is now installed. Invoke it with the Skill tool (`impeccable`) and
follow it properly — it is the point of this round, not a garnish. Its files are readable
at `~/.claude/skills/impeccable/` if you want a playbook it does not load for you.

The surface is a **Persuade** surface: an agency's own homepage, where the visitor decides
and acts and the design _is_ the product.

## 2. The key difference from directions 01–12

The first twelve were each handed a prescribed art direction — palette, typeface, layout
device, signature motion. **These six are not.** You get a command emphasis and a strategic
angle, and impeccable's own process chooses the visual world.

That is deliberate: the point of this round is to see what the skill produces when trusted,
so it can be compared against twelve human-directed briefs. Do not copy the look of any
existing direction. If your process lands somewhere near one of them, push it somewhere
else — the value of an eighteenth option is that it is not the fourth.

Skip anything in impeccable's workflow that would write project-level artefacts. Do **not**
create `PRODUCT.md`, `DESIGN.md`, surface briefs, config, or hooks anywhere in this repo,
and do not run `impeccable hooks` or `impeccable doctor`. Hold the design decisions in your
own head and express them in the HTML. Your only output is your one prototype file.

## 3. Imagery — this round has real images

The first twelve had no photography, so everything was drawn in CSS/SVG. **This round has a
shared image set** at `assets/img/`, generated for this project. A manifest listing every
file with its subject and best use is at `assets/img/MANIFEST.md` — read it before writing
markup, and use only files that actually exist in that directory.

Rules for using them:

- **Use them where they earn their place.** Impeccable's Persuade guidance is to ship real
  imagery when the brief needs it. It does not say to fill the page with photographs. A
  direction that uses two images well beats one that uses ten decoratively.
- **Never caption a generated image as a real client's premises, van, job or team.** These
  are illustrative photography of the trades DCS serves, not documentation of Colossus
  Scaffolding, DJ Fox Electrical or any other named client. Attaching a real client's name
  to one would be fabricating a record. Portfolio entries stay as CSS-drawn site mocks,
  outcome text, or plain typography.
- **No portrait may be presented as Ricky Wilson.** He is a real person and there is no
  photograph of him. Do not generate, imply, or caption one.
- Combine with CSS-drawn visuals freely — the miniature-site-in-a-browser-frame device from
  the first twelve is available to you and works well.
- Every `<img>` needs real `alt` text, explicit `width`/`height` or an `aspect-ratio` to
  stop layout shift, and `loading="lazy"` below the fold.

## 4. The six directions

Each gets one impeccable command emphasis and one strategic angle. The visual world is
yours.

| #   | File                                | Emphasis               | Strategic angle                                                                                                                                                                    |
| --- | ----------------------------------- | ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 13  | `home-13-impeccable-shape.html`     | `shape` then build     | The baseline. Impeccable's own unforced judgement of what this homepage should be. No stunt, no gimmick — just the best version of the obvious thing, executed to its craft floor. |
| 14  | `home-14-impeccable-overdrive.html` | `overdrive`            | Push past conventional limits. An agency that can build something technically extraordinary should prove it above the fold. Ambition is the argument.                              |
| 15  | `home-15-impeccable-delight.html`   | `delight`              | Personality and memorable touches. The page a tradesperson would mention to someone else because a bit of it made them smile.                                                      |
| 16  | `home-16-impeccable-distill.html`   | `distill`              | Strip to essence. How little can this page contain and still convert a plumber who has been putting it off for years? Reduction as the whole idea.                                 |
| 17  | `home-17-impeccable-animate.html`   | `animate`              | Motion under impeccable's doctrine rather than a prescribed effect list. Every movement must be justifiable; anything decorative gets cut.                                         |
| 18  | `home-18-impeccable-typeset.html`   | `typeset` + `colorize` | Typography and colour carry the entire page. Treat type as the primary structural material and colour as a deliberate, defensible system.                                          |

## 5. Report back

Same as the base spec — filename, direction name, one-line pitch, palette hex, fonts,
signature motion. Add two things:

1. **Which impeccable playbooks you actually loaded**, and one concrete decision each one
   changed. Be specific and honest: if a playbook did not change anything, say so.
2. **Which images you used and why**, or why you used none.
