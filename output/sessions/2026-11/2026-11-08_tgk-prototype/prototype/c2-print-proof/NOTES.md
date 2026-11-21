# C2 Print-shop proof: notes (round 2)

## Concept

- The homepage is a press proof sheet. The picture is the proof: each mock-up sits in a frame with a job-ticket strip (Job S-01, "Proof"), crop marks and a registration target.
- Sections are numbered "Sheets" with slug lines. Red is the single spot colour against ink on white paper.
- Round 2: the text ledger became image-led proof cards, and every section now fits one desktop viewport. The copy is much shorter.

## Tokens (all in :root, --tgk- prefix)

red #DD201B, ink #160E0B, paper #FFFFFF, stock #FBFAF8, grey #5C5450, rule #CFC9C4, ink-soft #D9D3CE.

## Fonts

Archivo 500-800 for display and body. IBM Plex Mono 500 for slug lines and labels only. No thousands-comma figure appears anywhere.

## Images

Referenced from `../_shared/img/web/`: van (hero), fleet, shopfront, banner, window, stickers, print, design, signs.

- `van.jpg` has `fetchpriority="high"`. All others are `loading="lazy"` with width and height set.
- The mock-up disclaimer "Illustrative mock-ups: real project photos to come" is shown under the hero image and in the services header.
- The "Recent work" frames stay honest placeholders.

## Section-height check (Playwright; every header, section and footer, height must be <= viewport)

| Element     | 1440x900 | 1280x720 | Result                                           |
| ----------- | -------- | -------- | ------------------------------------------------ |
| header      | 84       | 84       | pass                                             |
| hero        | 783      | 603      | pass (strip 32 + header 84 + hero = 899 and 719) |
| services    | 900      | 720      | pass                                             |
| why-us      | 900      | 720      | pass                                             |
| recent work | 900      | 720      | pass                                             |
| areas       | 900      | 720      | pass                                             |
| quote       | 900      | 720      | pass                                             |
| footer      | 306      | 306      | pass                                             |

- No section's scrollHeight exceeds its clientHeight (nothing clipped).
- The hero headline, CTA, image and mock-up tag all end inside the first viewport at both sizes.
- At 390px: no horizontal overflow (390/390). The header is now logo plus Menu only. The quote CTA moved into the open menu, and the open menu was measured at 298px high.

## Contrast

- ink on paper: 19.06
- red on paper: 4.89
- red on stock: 4.69
- white on red: 4.89
- grey on paper: 7.40
- grey on stock: about 6.9
- white on ink: 19.06
- ink-soft on ink: 12.85
- **Below 4.5:** red on ink is 3.90. It is never used as text, only as borders and fills.

## Not verified

- Heights were measured at 1440x900 and 1280x720 only. Other viewport heights are untested.
- Hover and keyboard focus states were not tested.
- The mobile menu opens and closes (checked by script), but there was no real-device test.

## Next

- Swap the mock-ups for real project photos.
- Confirm "Est. 2004" with the client.
- A print stylesheet.
