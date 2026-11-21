# C1 Sticker sheet (round 2)

**Concept.** The logo is a die-cut sticker, so the site is a sticker sheet on concrete. In round 2 the photo itself is the sticker: every mock-up image has a heavy black outline, white halo, peel corner and drop shadow, tilted 1 degree or less. A small white label sticker carries the category name and one short line. Red is the spot colour only.
**Swap for sister sites.** Change `--tgk-accent` / `--tgk-on-accent` (Tape Kings blue, Clothing Kings yellow; yellow needs ink as on-accent).

## Layout

Hero (van mock-up + logo sticker + one CTA), 7 image cards plus a dashed Clothing Kings cross-link tile in a 4x2 grid (fills the Vehicle graphics card, no empty space), Why (image + 4 chips + no-full-wraps line), Recent work (5 mock-ups + project-photo slot + reviews slot), Areas, quote band, footer. Mock-up honesty tags: hero, services heading, recent work heading.

## Tokens

accent #DD201B, ink #160E0B, ink-soft #4B433E, ground #D8D4CB, paper #EDEBE5, white #FFFFFF, line #8A8378.

## Fonts

Archivo 400/600/800 for everything; Kaushan Script for accents only (hero line, "East Sussex", quote lead-in, cross-link tile), all 24px+.

## Contrast (WCAG)

ink/paper 15.99, ink/ground 12.89, ink/white 19.06, ink-soft/paper 8.11, ink-soft/ground 6.54, white/red 4.89, white/ink 19.06.
Below 4.5: red/ground 3.3 (hero + areas script, large, passes 3:1); red/ink 3.9 (quote script, large, passes 3:1); red/paper 4.1 (4px rule only, no text); dashed line #8A8378 on ground 2.54 (decorative placeholder borders only). Red never carries small text.

## Viewport-fit measurement (Playwright, desktop >= 901px)

Section heights from getBoundingClientRect; content bottom checked separately (nothing overflows its section).

| Section     | 1440x900                | 1280x720    | Result |
| ----------- | ----------------------- | ----------- | ------ |
| header      | 76                      | 76          | pass   |
| hero        | 824 (header+hero = 900) | 644 (= 720) | pass   |
| services    | 900                     | 720         | pass   |
| why         | 900                     | 720         | pass   |
| recent work | 900                     | 720         | pass   |
| areas       | 900                     | 720         | pass   |
| quote band  | 258                     | 237         | pass   |
| footer      | 294                     | 285         | pass   |

Mobile 390x844: stacks as intended (sections exceed viewport, not required); no horizontal overflow at 1440, 1280 or 390.

## Not verified / next

Mobile menu opened state, keyboard walkthrough, Safari (`color-mix`, `svh`), viewports shorter than 720 or between 901 and 1000px wide (4-col card grid is tight there). Services and Recent work labels hang about 12px into the section padding at 720 tall. Why and Areas are airy at 900 tall; could take a larger image or a coverage graphic. Confirm Est. 2004.
