# Sector-spanning image set — round 2 (elevated positioning)

Generated 2026-08-17 with Higgsfield (GPT Image 2) for the **revised brief**: DCS builds
websites for any small business, and the site should feel like an elevated design studio.

Shot in a deliberately refined register — natural light, muted palettes, generous negative
space, calm composition. They are **illustrative photography of the kinds of business DCS
works with**. They are not photographs of DCS, of Ricky Wilson, or of any named client.

## USE `web/` — NOT THE ROOT PNGs

- **`assets/img/web/<name>.jpg`** — 1600px JPEG, 100–600KB. **Use these.**
- `assets/img/<name>.png` — 2048px original, 3–7MB. Archive only.

In round 1 an SVG `feComponentTransfer` over a root PNG **froze the renderer for 45
seconds**. Never apply a filter to one.

## VERIFY BEFORE USE

Generation runs in batches. **Run `ls assets/img/web/` and use only files that exist.** If
one is missing, build that section with CSS/SVG instead — do not reference an absent file.

## The round 2 set

| File              | Ratio | Subject                                                                     | Sector it speaks for          |
| ----------------- | ----- | --------------------------------------------------------------------------- | ----------------------------- |
| `sector-boutique` | 3:2   | Small independent clothing boutique interior, no people                     | Retail                        |
| `sector-maker`    | 3:2   | Hands folding fabric in a textile studio, no face                           | Makers, eCommerce             |
| `sector-studio`   | 3:2   | Empty yoga studio, rolled mats, tall windows, no people                     | Studios, practitioners        |
| `sector-salon`    | 3:2   | Small modern hair salon, one chair and mirror, no people                    | Salons, personal services     |
| `sector-office`   | 3:2   | Two people talking across a table in a small office, faces not identifiable | Professional services         |
| `sector-cafe`     | 3:2   | Independent cafe counter, coffee machine, morning light, no people          | Hospitality, food             |
| `still-products`  | 3:2   | Still life — ceramic vase, folded linen, candle on plaster                  | eCommerce, product businesses |
| `laptop-store`    | 3:2   | Hands at a laptop showing a soft out-of-focus shop layout, no face          | The online-store argument     |
| `interior-light`  | 16:9  | Raking light across plaster and pale timber, no objects                     | Section grounds, quiet bands  |
| `texture-linen`   | 3:2   | Undyed linen weave, raking light, material study                            | Texture, paper-toned grounds  |
| `abstract-wash`   | 16:9  | Muted gradient wash — ink blue, warm stone, faded terracotta                | Abstract hero backdrops       |

## Round 1 trade images still available

`trade-electrician`, `trade-plumber`, `trade-scaffolder`, `trade-van`, `phone-on-site`,
`tools-flatlay`, `locale-south-downs`, `texture-paper`, `texture-dark-grain`, `abstract-mesh`.

**Use them only as one sector among several** — never as the hero framing, never as the only
sector shown. Leading with them is precisely what the revised brief moved away from.

`workspace-desk` and `hands-sketching` remain available but carry the rule-2 trap below.

## Rules

1. **Never caption a generated image as a real named client.** No "Sanctuary Ida's studio",
   no "Cuddle Plush's workshop". Attaching a real business's name to a generated photo
   fabricates a record about that business. Portfolio entries stay CSS-drawn site mocks,
   outcome text, or typography.
2. **No image may be presented as Ricky Wilson, "our team", or "the person who builds your
   site".** There is no photograph of him. This binds on `sector-office`, `laptop-store`,
   `sector-maker`, `workspace-desk` and `hands-sketching` — any frame containing a person or
   their hands. Caption them as the _client's_ world or as generic craft, never as his.

   **The specific trap: `sector-office`.** It shows two people at a table, one at a laptop,
   both from behind. Placed beside process step 1 ("A conversation") or beside first-person
   copy, a reader will reasonably infer one of them is Ricky — and no caption disclaiming it
   undoes that inference. It is safe as a _professional-services sector_ image and unsafe as
   a _process_ or _about_ image. If you want to illustrate the conversation step, use type,
   or CSS, or nothing.

3. **Show the range.** If you show three sector images, do not make all three trades — and
   do not make all three boutique-and-yoga either. The point is breadth.
4. **Earn each one.** Two used well beat ten used decoratively. Using none is legitimate.
5. Every `<img>` needs real `alt` text, `width`/`height` matching the actual file (the web
   variants are 1600px wide), and `loading="lazy"` below the fold.
