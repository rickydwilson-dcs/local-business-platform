# C3 Hoarding poster (round 2)

## Concept

Street-poster homepage. Anton at billboard scale; hard blocks of red, black, white and newsprint paper; tilted pasted-up phone card over the hero image. Services are image-led poster panels with oversized red numerals over the picture. Every desktop section is one viewport tall (minus the 76px sticky header), so the page reads as a stack of posters.

## Tokens (:root, --tgk-)

red #DD201B, black #160E0B, white #FFFFFF, paper #EDE8DD, paper-deep #DCD5C6, ink-soft #4A413C.

## Fonts

Anton (display) + Public Sans 400/600/700. No tabular-nums or mono.

## Contrast (WCAG, computed)

- black/white 19.06; black/paper 15.6; white/black 19.06; white/red 4.89 (pass)
- ink-soft/paper 8.14 (footer fine print); paper-deep watermark numerals are decorative only
- BELOW 4.5:1: red/black 3.9; red/paper 4.0; black/red 3.9. Used only for large display type and numerals (3:1 large threshold met): section numerals, "BIG?", alternate black area names on red, red arrows on black.
- Card numerals are white on red (4.89). Small text on red is white (4.89).

## Section-height measurements (Playwright, desktop)

| Section  | 1440x900 | 1280x720 | Result |
| -------- | -------- | -------- | ------ |
| header   | 76       | 76       | PASS   |
| hero     | 824      | 644      | PASS   |
| services | 824      | 644      | PASS   |
| why      | 824      | 644      | PASS   |
| work     | 824      | 644      | PASS   |
| reviews  | 147      | 147      | PASS   |
| areas    | 824      | 644      | PASS   |
| cta      | 824      | 644      | PASS   |
| footer   | 264      | 275      | PASS   |

Sections use height: calc(100svh - header) with overflow hidden. No section reported clipped content (scrollHeight <= clientHeight), except reviews (decorative quote-glyph line box, 166 vs 147; visually fine). Page total 5432px at 1440x900 and 4363px at 1280x720 (round 1 was about 7900). 390x844: no horizontal overflow (scrollWidth 390); stacks to 6140px.

## Images

Mock-ups from ../\_shared/img/web referenced directly (van hero with fetchpriority high, rest lazy, explicit width/height). Honest tag "Illustrative mock-ups — real project photos to come" on the hero and the services opener.

## Next / unverified

Service-card pictures are cropped small (about 150px tall at 1280x720); a horizontal scroller with larger cards would give more picture. Mobile menu not click-tested; keyboard focus not hand-tested. Est. 2004 flagged on page for client confirmation. Last tweak (hero image object-position) was not re-screenshotted, though heights were re-measured and unchanged.
