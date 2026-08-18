# Plan — R2-hosted prototype assets + deployed prototype URLs

**Status:** ✅ Built and verified 2026-08-18 — Phases 1–4 complete, staged but **not committed**

> **Outcome.** 67 assets (131.1MB) uploaded to `prototypes/2026-08-17_dcs-homepage-redesign/`,
> all verified 200 with correct content types. 311 references across 52/55 HTML files rewritten.
> Prototype folder 142MB → 19MB. Staged payload 4.8MB of blobs (was ~107MB). Prototypes live at
> **https://dcs-prototypes.vercel.app** — all 54 return 200, R2 assets load, `/nope` 404s.
> `output/.gitignore` deny-list verified with `git check-ignore`. `npm run type-check` passes.
>
> Two things went differently from the plan, both recorded in `docs/guides/prototype-hosting.md`:
> the session already had a hand-built `index.html` design library, so the tool uses it rather
> than generating one; and the first Vercel deploy served the root monorepo placeholder because
> the CLI resolves `vercel.json` against the process cwd, not `--cwd`. Fixed by running the CLI
> inside the prototype directory and pinning every build setting explicitly.
>
> Remaining: Phase 5 (commit → develop → staging → PR to main).
> **Date:** 2026-08-18
> **Branch:** `develop` @ `141f1a79` (identical to `origin/develop` — nothing pushed)
> **Supersedes:** the "Blocked: R2 migration before deploy" section of `HANDOFF.md`

## Goal

Two changes, one deploy:

1. **Prototype assets live in R2, not git.** Images, video and the logo move to the existing
   `local-business-platform` R2 bucket; the 55 prototype HTML files reference them by absolute
   URL. Same pattern already used for built sites.
2. **Prototypes get a URL.** The HTML deploys as a static Vercel project so the designs are
   reviewable from any machine — phone, client's laptop — instead of a `file://` path on one Mac.

Accepted consequence (Ricky, 2026-08-18): prototypes now require an internet connection to render.

## Verified state — measured 2026-08-18, not assumed

| Thing                                           | Measured                                                      |
| ----------------------------------------------- | ------------------------------------------------------------- |
| Prototype HTML                                  | 55 files, **4.7MB**                                           |
| `assets/img/*.png` (2048px masters)             | 29 files, **117MB**, **0 references**                         |
| `assets/img/web/*.jpg` (1600px)                 | 29 files, 8.6MB — **24 referenced**, 5 orphaned               |
| `assets/img/poster/*.jpg`                       | 2 files, both referenced                                      |
| `assets/video/`                                 | 4 × `.mp4` + 2 poster `.jpg` + a stray `vidcheck.html`, 5.4MB |
| `assets/logo.svg`                               | 188K, referenced 28×                                          |
| **Distinct referenced asset paths**             | **33**                                                        |
| **Total reference occurrences across the HTML** | **302** — every one delimited by `"` or `'`                   |
| `prototype/.impeccable/`                        | 6.2MB, 16 review screenshots (tooling artefact)               |
| Total `prototype/` on disk                      | **142MB**                                                     |

Orphaned web JPEGs: `laptop-store`, `sector-barber`, `texture-dark-grain`, `texture-paper`,
`workspace-desk`.

### Rewrite safety — pre-flight checks already run

- `grep -ohE '.{3}assets/' *.html | sort -u` → only `"assets/` and `'assets/`. No bare or
  whitespace-preceded occurrences.
- No `../assets`, no `"/assets`, no `url(/assets`. All references are root-relative from the
  prototype directory.

**Therefore the rewrite is one regex:** `(["'])assets/` → `$1<BASE>/assets/`. It is idempotent
(a rewritten file no longer matches) and reversible.

## Root cause of the 117MB problem — fix this or it recurs

The root `.gitignore` correctly ignores `**/*.png`, `**/*.jpg`, `**/*.webp`, `**/*.gif` with the
comment _"These go to Cloudflare R2, not Git"_. It was overridden:

```
$ git check-ignore --no-index -v .../prototype/assets/img/web/sector-cafe.jpg
output/.gitignore:8:!sessions/**    .../assets/img/web/sector-cafe.jpg
```

`output/.gitignore` line 8 (`!sessions/**`) un-ignores **everything** under `output/sessions/`,
including binaries the root file had deliberately excluded. That is why 45 PNGs and 33 JPEGs
became stageable without anyone forcing them. Fixing only this session's files leaves the trap
armed for the next one.

Also note `**/*.mp4`, `**/*.mov`, `**/*.webm` and `**/*.svg` are **not** in the root ignore list
at all — the 5.4MB of video would have gone into git on the general rule too.

## Decisions

| Decision                   | Choice                                             | Why                                                                                                                                                                                               |
| -------------------------- | -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Asset host                 | R2, existing bucket                                | Same credential and client as every built site; already proven                                                                                                                                    |
| HTML host                  | Ad-hoc static Vercel project per prototype session | Clean extensionless URLs, optional access protection, per-session isolation. **Not git-linked**, so no new connected project rebuilding on every monorepo push and no `ignoreCommand` to maintain |
| 117MB masters              | Upload to R2 under `_archive/`, delete locally     | Persist the regenerable source at ~£0.002/month rather than lose it                                                                                                                               |
| Orphaned web JPEGs         | Upload with the rest                               | They cost 1.5MB in R2 and may be picked up in a later round                                                                                                                                       |
| `.impeccable/` screenshots | Gitignore, do not upload                           | Tooling artefact, regenerable, not a design asset                                                                                                                                                 |
| Key layout                 | Mirror the local tree under a session prefix       | Makes the rewrite a pure prefix substitution and keeps R2 browsable                                                                                                                               |

### R2 key layout

```
prototypes/2026-08-17_dcs-homepage-redesign/assets/logo.svg
prototypes/2026-08-17_dcs-homepage-redesign/assets/img/web/sector-cafe.jpg
prototypes/2026-08-17_dcs-homepage-redesign/assets/img/poster/vid-ink.jpg
prototypes/2026-08-17_dcs-homepage-redesign/assets/img/_archive/sector-cafe.png
prototypes/2026-08-17_dcs-homepage-redesign/assets/video/vid-ink.mp4
```

Public base: `https://pub-a159d5c51e44442897e06986a53dda1d.r2.dev`
(from `NEXT_PUBLIC_R2_PUBLIC_URL` in `.env.local`.)

The `_archive/` segment is the one deviation from a pure mirror — local `assets/img/*.png`
maps to `assets/img/_archive/*.png` so cold storage is visibly separate from live assets.

### Cache-Control — a deliberate override

`tools/lib/r2-client.ts` defaults to `public, max-age=31536000, immutable`. Combined with the
known R2 behaviour that **overwriting a key does not bust the CDN cache** (see
`memory/feedback_r2_image_cache_busting.md`), that default is wrong for prototype assets, which
get regenerated mid-session — a re-uploaded image would keep serving the old bytes for a year.

- Live assets (`img/web`, `img/poster`, `video`, `logo.svg`): `public, max-age=300`
- `_archive/` masters: keep the immutable default — never fetched by a browser anyway

Bandwidth cost of the short TTL is trivial at 14MB of live assets.

## Phase 1 — `tools/upload-prototype-assets.ts`

New tool, built on the existing `R2Client` from `tools/lib/r2-client.ts` (do **not** hand-roll
another S3 client — `upload-djfox-to-r2.ts` did, and it is site-hardcoded).

```
npx tsx tools/upload-prototype-assets.ts <prototype-dir> [--dry-run] [--no-rewrite] [--force]
```

Behaviour:

1. Derive the session slug from the path (`.../2026-08-17_dcs-homepage-redesign/prototype`
   → `2026-08-17_dcs-homepage-redesign`); build the key prefix `prototypes/<slug>/`.
2. Walk `assets/`, skipping dotfiles and `vidcheck.html`. Map `img/*.png` → `img/_archive/*.png`.
3. Upload with correct content types — **explicitly verify `.svg` → `image/svg+xml` and
   `.mp4` → `video/mp4`**; the generic `mime-types` lookup handles both but assert it rather
   than trust it, because a wrong type on `.svg` renders as a download prompt.
4. Skip unchanged objects (`HeadObject` → compare `ContentLength`; `--force` overrides).
5. Rewrite the 55 HTML files in place: `(["'])assets/` → `$1<BASE>/prototypes/<slug>/assets/`.
   Skip `_archive` entirely (nothing references it).
6. Write `assets-manifest.json` in the prototype dir: local path → R2 key → public URL → bytes.
   This is the record of what was uploaded, and makes a future re-point or cleanup mechanical.
7. `--dry-run` prints the full plan (counts, bytes, sample keys) and writes nothing — run this
   first, per the live-operations rule.

**Gate before deleting anything local:**

```bash
# every referenced URL must return 200
grep -ohE 'https://pub-[^"'"'"']+' <prototype>/*.html | sort -u \
  | xargs -P4 -I{} sh -c 'printf "%s %s\n" "$(curl -s -o /dev/null -w %{http_code} {})" "{}"' \
  | grep -v '^200 ' || echo "all 200"

# no relative refs left
grep -c '"assets/\|'"'"'assets/' <prototype>/*.html | grep -v ':0' || echo "0 relative refs"
```

Only when both pass:

```bash
rm <prototype>/assets/img/*.png            # 117MB of masters, now in R2
rm -rf <prototype>/.impeccable             # regenerable review screenshots
rm <prototype>/assets/.media4 <prototype>/assets/img/.urls <prototype>/assets/img/.urls2
find output/sessions -name .DS_Store -delete
```

## Phase 2 — close the gitignore hole

`output/.gitignore` — replace the blanket `!sessions/**` with an allow-list that cannot
re-admit binaries:

```gitignore
# Ignore all output content (local only)
*

# But track these files and folders
!README.md
!.gitignore
!sessions/
!sessions/**
!archive/
!archive/**
!briefs/
!briefs/**
!migrations/
!migrations/**

# ...except binaries. Prototype assets live in R2 (see plan-r2-prototype-hosting.md),
# never in git. `!sessions/**` above would otherwise override the root .gitignore's
# image rules and let 100MB+ of PNGs into history.
sessions/**/*.png
sessions/**/*.jpg
sessions/**/*.jpeg
sessions/**/*.webp
sessions/**/*.gif
sessions/**/*.svg
sessions/**/*.mp4
sessions/**/*.mov
sessions/**/*.webm
sessions/**/.impeccable/
sessions/**/.DS_Store
```

Then verify the trap is actually shut:

```bash
git check-ignore --no-index -v output/sessions/x/prototype/assets/img/web/a.jpg  # expect a hit
git check-ignore --no-index -v output/sessions/x/prototype/assets/video/a.mp4    # expect a hit
```

Root `.gitignore` is left alone — `**/*.mp4` platform-wide is a broader change than this task
needs, and the scoped rule above covers the actual exposure.

## Phase 3 — `tools/publish-prototype.ts`

```
npx tsx tools/publish-prototype.ts <prototype-dir> [--project <name>] [--prod]
```

1. **Generate `index.html`** — a gallery of the 55 prototypes, grouped by the rounds already
   recorded in `build-spec*.md`, each a link plus a one-line description. This is the single
   URL that gets shared; without it the deploy is 55 unlinked pages.
2. **Write `vercel.json`** in the prototype dir with `"cleanUrls": true` so
   `/home-20-atelier` serves `home-20-atelier.html`.
   _To verify at first deploy:_ that a directory containing no `package.json` is detected as a
   static "Other" project needing no build command. Do not assume — check the first deploy's
   build log.
3. `vercel deploy --prod --yes` from the prototype dir. The CLI uploads the CWD only, so the
   payload is ~4.7MB of HTML — assets are already absolute R2 URLs and are not uploaded.
   `.vercel/` is already covered by root `.gitignore:43`.
4. Print the resulting URL and append it to the session `HANDOFF.md`.

_To verify, do not state as fact:_ whether Vercel Authentication (SSO) protection is available
on this account's plan for this project. Password protection is a paid tier. Check in the
project's Deployment Protection settings before treating the URL as private, and until then
treat `*.vercel.app` as public-but-unlisted. These are DCS's own homepage concepts, not client
confidential material, so this is a preference not a blocker.

**Known wrinkle:** `assets/video/vidcheck.html` is a stray scratch file inside `assets/`. Delete
it in Phase 1 rather than let it deploy as `/assets/video/vidcheck`.

## Phase 4 — make it the convention, not a one-off

- `docs/guides/prototype-hosting.md` — short guide: where prototype assets go, the two commands,
  the URL shapes, and why (the `output/.gitignore` hole and the 117MB near-miss).
- One line in root `CLAUDE.md` under the Output Folder section pointing at that guide.
- `CHANGELOG.md` entry for 2026-08-18 covering this alongside the two CSS gotchas already staged.
- Memory: add `feedback_prototype_assets_to_r2.md` and link it from `MEMORY.md`.

## Phase 5 — deploy

Only after Phases 1–4. Re-stage from scratch, because the current index still holds the 78
binaries from the undone commit:

```bash
git reset
git add output/sessions/2026-08/2026-08-17_dcs-homepage-redesign/ \
        output/.gitignore tools/ docs/guides/prototype-hosting.md \
        CLAUDE.md CHANGELOG.md
git diff --cached --stat | tail -1
git diff --cached --name-only | grep -iE '\.(png|jpg|jpeg|webp|gif|mp4|mov|svg)$' && echo "STOP — binaries staged" || echo "clean"
```

Expected staged payload: the 55 HTML files (~4.7MB, now with R2 URLs), the markdown specs, the
manifest, the two new tools, the guide. **If the diffstat is not in the low single-digit MB,
stop and find out why** — the previous attempt was 100,205 insertions / ~107MB pack.

Then `.claude/deploy.md` as already resolved: `develop` → `staging` → `main`, gates enforced by
the pre-push hook (type-check + lint), `main` protected so the last rung is
`gh pr create --base main --head staging --fill` and **stop** — a human owns the merge.

`sites/dcs` is untouched by this work, so no per-site lint is required.

## Risks and traps

| Risk                                                 | Mitigation                                                                                                 |
| ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Deleting local masters before R2 is confirmed good   | Explicit 200-check gate on every URL before any `rm`; `--dry-run` first                                    |
| Immutable cache serves stale bytes after a re-upload | `max-age=300` on live assets, overriding the client default                                                |
| `.svg` served with the wrong content type            | Assert `image/svg+xml` in the tool, verify with `curl -I`                                                  |
| Rewrite misses a reference form                      | Pre-flight grep already proved all 302 refs are quote-delimited; the post-rewrite grep gate re-proves it   |
| `output/.gitignore` hole reopens                     | Phase 2 rule + a `git check-ignore` assertion recorded in the guide                                        |
| Prototypes silently break if the bucket is emptied   | `assets-manifest.json` records every key; masters are in `_archive/`                                       |
| r2.dev is rate-limited by Cloudflare                 | Only 33 objects at 14MB serve the live prototypes; if it ever bites, front the bucket with a custom domain |

## Out of scope

- Migrating other sessions' prototype assets. The gitignore fix stops new ones; existing
  sessions are already committed and rewriting history is a separate, riskier decision.
- Any change to how built sites under `sites/` use R2 — that pattern already works.
- A custom domain in front of the R2 bucket.
- Retro-fixing the root `.gitignore` to cover video platform-wide.
