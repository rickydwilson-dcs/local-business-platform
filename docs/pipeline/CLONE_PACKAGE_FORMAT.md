# Clone Package Format (CPF) v0.1

The Clone Package Format is the intermediate representation produced by Stage 1 (Clone) and consumed by Stage 2 (Extract Theme). Every pipeline entry point — live URL ingest, Stitch MCP, or design skill — must produce a valid CPF directory before Stage 2 runs.

## Folder Structure

```
output/clones/<name>/
├── meta.json                    # Job provenance (see schema below)
├── assets/
│   ├── images/                  # Downloaded images (may be empty)
│   ├── fonts/                   # Downloaded font files
│   └── css/                     # Downloaded stylesheet files
├── html/
│   └── pages/
│       ├── home.html            # Raw fetched HTML, one file per page
│       └── about.html
├── jsx/
│   └── pages/
│       ├── HomPage.tsx          # Mechanically converted JSX (no AI)
│       └── AboutPage.tsx
├── styles/
│   └── computed-styles.json     # Playwright computed style extraction output
├── reference-screenshots/
│   ├── home.png                 # 1440×900 Playwright screenshots
│   └── about.png
└── reports/                     # QA loop results (created during Stage 1 QA)
    └── iteration-1/
        ├── home-diff.png
        └── home-results.json
```

## meta.json Schema

```json
{
  "jobId": "uuid",
  "sourceType": "url" | "stitch" | "design-skill",
  "sourceRef": "https://colorcode.events",
  "capturedAt": "2026-04-13T10:00:00Z",
  "cpfVersion": "0.1"
}
```

The authoritative Zod schema lives in `tools/lib/cpf-validator.ts` (`CpfMetaSchema`). The full directory structure is validated by `validateCPF()` in the same file.

## Subdirectory Purpose

| Directory                     | Purpose                                                                                                                                                               |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `assets/images/`              | All `<img>` sources, `<source>` srcsets, and CSS `url()` background images downloaded from the reference site. May be empty if the source had no downloadable images. |
| `assets/fonts/`               | `@font-face` src files.                                                                                                                                               |
| `assets/css/`                 | External stylesheets.                                                                                                                                                 |
| `html/pages/`                 | One `.html` file per crawled page, saved verbatim after script/tracking element removal.                                                                              |
| `jsx/pages/`                  | Mechanically converted JSX — attribute mapping, style object conversion, void element self-closing, URL rewriting. No AI interpretation.                              |
| `styles/computed-styles.json` | Output of `extractComputedStyles()` and `extractAllSectionStyles()` run during the clone step. Used by the token mapper in Stage 2.                                   |
| `reference-screenshots/`      | 1440×900 Playwright screenshots of the reference site. Used as the baseline for the visual QA loop.                                                                   |
| `reports/`                    | Per-iteration QA loop outputs. Each `iteration-N/` subfolder contains diff images and a `{page}-results.json` with diff percentages.                                  |

## Validation

Run the standalone validator:

```bash
npx tsx tools/lib/cpf-validator.ts output/clones/corvus/
```

Or import programmatically:

```typescript
import { validateCPF } from "./tools/lib/cpf-validator";
const { valid, errors } = validateCPF("output/clones/corvus");
```

## Version History

- `0.1` — initial spec (April 2026)
