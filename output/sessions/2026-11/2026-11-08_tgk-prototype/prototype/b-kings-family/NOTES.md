# Direction B: Kings family (round 2)

## Concept

- TTK skeleton (black header with red rule, paper body, black footer, Barlow Condensed/Barlow), now image-led and short on words.
- Hero is the real van mock-up beside one headline and one primary CTA. Services are 7 image cards plus a red "ask us" tile, in one viewport. Then why-us (shopfront image), a 5-image "Made to be seen" mosaic, areas, reviews placeholder, quote band.
- Every mock-up carries an "Illustrative mock-up" tag; the hero tag also says "Real project photos to come".

## Tokens (`--tgk-`, one `:root` block)

black #0b0d10, black-2 #16191e, black-3 #22262d, red #DD201B (exact), red-deep #B3150F, red-tint #FDECEB, paper #f5f6f7, white #ffffff, line #dfe2e6, text #15181c, muted #5b636d, on-dark #c9ced5, on-dark-2 #aeb5bd, line-dark #2c3138, warn-bg #fff6db, warn-line #e6c65c, warn-text #5c4700. Wrap 1240px, radius 6px.

## Fonts

Barlow Condensed 600/700, Barlow 400/500/600/700 via Google Fonts link. No tabular-nums or mono.

## Contrast (WCAG)

white on red 4.89; white on red-deep 6.93; red-deep on white 6.93, paper 6.40, tint 6.06; red on white 4.89; red on paper 4.52 (dots only); on-dark on black 12.30 and on black-2 11.14; on-dark-2 on black 9.40; white on black 19.46; muted on white 6.09, on paper 5.62; text on tint 15.58; warn-text on warn-bg 8.26.
**Below 4.5:1:** red #DD201B on black 3.98 (hero h1 second line, large display type only, passes the 3:1 large-text bar); black on red 3.98 (quote-band phone hover, large). No small text is below 4.5:1.

## Viewport-fit measurement (Playwright, Chromium, desktop; height <= viewport; no internal overflow)

| Section                    | 1440x900 | 1280x720 | Result |
| -------------------------- | -------- | -------- | ------ |
| header                     | 80       | 80       | pass   |
| hero (header+hero wrapper) | 900      | 720      | pass   |
| hero alone                 | 820      | 640      | pass   |
| services                   | 900      | 720      | pass   |
| why us                     | 900      | 720      | pass   |
| work mosaic                | 900      | 720      | pass   |
| areas                      | 558      | 446      | pass   |
| reviews                    | 306      | 245      | pass   |
| quote band                 | 630      | 504      | pass   |
| footer                     | 253      | 240      | pass   |

Hero at 1440x900: image 116-864px, h1 bottom 567, CTA bottom 726 (all inside 900). At 1280x720: image 109-691, h1 463, CTA 616 (inside 720). Sections fill the viewport with svh heights; the desktop rule applies at min-width 961px and min-height 540px, below which sections stack naturally.
Mobile 390x844: scrollWidth 390 (no horizontal overflow); menu toggle opens the nav.

## Not verified / next

- Only Chromium; no Safari/Firefox, no screen reader, no keyboard tab-through by hand. Not measured at heights under 540px or at tablet widths.
- Est. 2004 still flagged [confirm]. Service-card arrows and area chips link to `#`.
- Next: swap mock-ups for real project photos, consider a sticky header now the first screen is tight, decide if the hero text column should be larger at 1280.
