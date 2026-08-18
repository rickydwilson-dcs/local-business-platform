# Shared image set — DCS homepage prototypes (round 1b)

Generated for this project with Higgsfield (GPT Image 2), 2026-08-17. All are 2K PNGs.
These are **illustrative photography of the trades DCS serves** — they are not photographs
of DCS, of Ricky Wilson, or of any named client.

## USE `web/` — NOT THE ROOT PNGs

Two copies of every image exist:

- **`assets/img/web/<name>.jpg`** — 1600px JPEG, 100–600KB. **Use these.**
- `assets/img/<name>.png` — 2048px original, 3–7MB. Archive only.

Direction 18 tried to build duotone plates from the root PNGs and a
`feComponentTransfer` separation **froze the renderer for 45 seconds**; even the cheap CSS
fallback left plates blank for seconds because the lazy load never began fetching. The
`web/` variants exist precisely so that cannot happen again. Reach for a root PNG only if
you genuinely need 2048px, and never apply an SVG filter to one.

## VERIFY BEFORE USE

Generation runs in batches and a file may not exist yet, or may have failed. **Run
`ls assets/img/` and use only files that are actually present.** If an image you wanted is
missing, build that section with CSS/SVG instead — do not reference a file that isn't
there, and do not wait for it.

## The set

| File                     | Ratio | Subject                                                                                                                           | Good for                                       |
| ------------------------ | ----- | --------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| `trade-electrician.png`  | 3:2   | Electrician fitting a consumer unit in a domestic hallway, natural light, candid                                                  | Hero, trades served, service pages             |
| `trade-scaffolder.png`   | 3:2   | Scaffolder in hi-vis assembling scaffolding on a terraced house, shot from below                                                  | Hero, bold full-bleed bands                    |
| `trade-plumber.png`      | 3:2   | Plumber working on pipework under a kitchen sink, warm interior light                                                             | Trades served, service cards                   |
| `trade-van.png`          | 3:2   | Unbranded white trade van on a British residential street, doors open, tidy racking                                               | "Your business" framing, about, local sections |
| `workspace-desk.png`     | 3:2   | Over-shoulder view of a desk, laptop showing an out-of-focus layout. **Depicts a long-haired woman from behind; no face visible** | Craft/process texture only — see rule 2        |
| `hands-sketching.png`    | 3:2   | Hands sketching a wireframe in pencil. No face visible                                                                            | Process step 2, craft framing                  |
| `phone-on-site.png`      | 3:2   | Work-worn hand holding a phone on a building site, screen content abstract                                                        | Mobile-first argument, "found on Google"       |
| `tools-flatlay.png`      | 3:2   | Overhead flat-lay of used British trade tools on a workbench, generous negative space                                             | Section dividers, quiet texture behind type    |
| `locale-south-downs.png` | 16:9  | South Downs and East Sussex coast near Eastbourne, overcast, no people                                                            | Service areas, footer band                     |
| `texture-paper.png`      | 3:2   | Warm off-white cotton paper, visible fibre, raking light                                                                          | Paper-toned grounds, letterpress treatments    |
| `texture-dark-grain.png` | 16:9  | Near-black surface with fine film grain and one soft directional light                                                            | Dark grounds, atmospheric overlays             |
| `abstract-mesh.png`      | 16:9  | Soft gradient mesh — deep ink blue into amber and teal, dark overall                                                              | Abstract hero backdrops, glow beds             |

## Rules

1. **Never caption one as a real client.** No "Colossus Scaffolding's site", no "DJ Fox's
   van". Attaching a real business's name to a generated image fabricates a record.
   Portfolio entries stay CSS-drawn mocks, outcome text, or typography.
2. **No image may be presented as Ricky Wilson, "our team", or "the person who builds your
   site".** There is no photograph of him, and inventing one misrepresents a real person.
   This applies hardest to `workspace-desk.png`: it shows a long-haired woman at a laptop,
   photographed from behind. Captioning it as Ricky, or floating it beside first-person
   copy so a reader infers it is him, is a misrepresentation even though no face is shown.
   Use it as generic craft texture with neutral alt text, or don't use it. Same for
   `hands-sketching.png` — hands at work, not _his_ hands.
3. **Earn each one.** Two images used well beat ten used decoratively.
4. Every `<img>` needs real `alt` text, `width`/`height` or `aspect-ratio` set to prevent
   layout shift, and `loading="lazy"` below the fold.
5. Constrain with CSS; never ship one as a tiny icon. Use the `web/` JPEGs (see top).
