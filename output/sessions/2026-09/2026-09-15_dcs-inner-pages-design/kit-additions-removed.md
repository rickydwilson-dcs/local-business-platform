# The eight `kit-additions-*.css` files were deleted — 2026-09-25

Ricky's ruling: if they are not needed, delete them so they stop appearing as an open item.

## What was checked before deleting

- **All eight files (a–h), not five.** The 2026-09-15 `HANDOFF.md` and
  `bar-height-correction.md:77` both say "five wave 1" files; wave 2's `f`, `g` and `h` were
  never counted. There were eight.
- **Nothing loaded them.** All 15 `prototype/*.html` files link exactly one stylesheet,
  `../kit.css`. No `<link>`, no `@import`, anywhere in the repo.
- **No test consumed them.** `page-parity.test.ts` reads only `prototype/*.html`;
  `chrome-parity.test.ts` reads only `prototype/_chrome.html` and `kit.css`.
- **Their content had fully merged.** Every class selector in all eight files — 366 distinct
  tokens — is present in the shipped `sites/dcs/styles/inner-pages.css`. Nothing was lost.

## Note on the stale comments left behind in `inner-pages.css`

Three section headers there still read `Source: kit-additions-{f,g,h}.css (kept unmerged as the
per-agent record)`, which is no longer true. **They were deliberately left alone.**
`chrome-parity.test.ts` asserts `styles/inner-pages.css` is a verbatim copy of this folder's
`kit.css`, so editing a comment in one without the other fails that guard. The provenance
citations still describe correctly where the CSS came from during the port; only the
"kept unmerged" clause is stale, and this file is the correction.

## Correction to the port handoff's Trap #5

`2026-09-18_dcs-inner-pages-port/HANDOFF.md` Trap #5 says this folder's handoff claimed the
additions files were orphaned "with no page linking them" and that **two pages still linked
them**. That is wrong. `bar-height-correction.md` lists the orphaned-additions claim under
**"What still stands"** — i.e. it was confirmed, not disproved — and a link audit of all 15
prototypes finds zero references. The "two pages still linked them" disproof applies to the
stray `_*harness*` files, not to these.
