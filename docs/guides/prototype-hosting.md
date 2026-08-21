# Prototype Hosting

How design prototypes in `output/sessions/**/prototype/` get their assets and their URL.

**The rule: prototype assets go to Cloudflare R2, never into git. The HTML deploys to Vercel.**

---

## Why

Design sessions generate a lot of weight. The August 2026 DCS homepage session produced 142MB
in one prototype folder — 117MB of it 2048px PNG masters that nothing referenced.

The root `.gitignore` already excluded images with the comment _"These go to Cloudflare R2, not
Git"_. It was silently overridden:

```
$ git check-ignore --no-index -v output/sessions/.../assets/img/web/sector-cafe.jpg
output/.gitignore:8:!sessions/**    output/sessions/.../sector-cafe.jpg
```

`output/.gitignore`'s `!sessions/**` un-ignored everything under `sessions/`, binaries included.
A commit of 100,205 insertions and a ~107MB pack was created before anyone noticed, and undone
before it was pushed. `output/.gitignore` now carries an explicit binary deny-list after that
line. If you add a new allow rule there, re-check that the deny-list still wins:

```bash
git check-ignore --no-index -v output/sessions/x/prototype/assets/img/a.jpg   # expect a hit
```

A second reason: a prototype on `file://` can only be reviewed on the machine that built it.
On a URL it can be opened on a phone, or sent to a client.

---

## The two commands

Run them in order. The second refuses to run if the first has not.

```bash
# 1. Assets -> R2, and rewrite the HTML to point at them
npx tsx tools/upload-prototype-assets.ts <prototype-dir> --dry-run   # always dry-run first
npx tsx tools/upload-prototype-assets.ts <prototype-dir>

# 2. HTML -> Vercel
npx tsx tools/publish-prototype.ts <prototype-dir> [--project <name>]
```

### What `upload-prototype-assets.ts` does

- Uploads everything under `assets/` to `prototypes/<session-slug>/assets/…`, mirroring the
  local tree so the rewrite is a pure prefix substitution.
- Routes unreferenced masters sitting directly in `assets/img/` to `assets/img/_archive/`, so
  cold storage is visibly separate from what the prototypes load.
- Rewrites `(["'])assets/` → `$1<R2 base>/prototypes/<slug>/assets/` across the top-level HTML.
  Idempotent — a rewritten file no longer matches, so re-running is safe.
- **Verifies every uploaded object returns 200 with the expected content type before it
  rewrites anything.** A failed upload can therefore never orphan a reference.
- Writes `assets-manifest.json` recording local path → key → URL → bytes.

Only after that gate passes should you delete the local masters.

### What `publish-prototype.ts` does

- Refuses to deploy if `assets-manifest.json` is missing or any relative `assets/` reference
  survives — both would 404, because assets are deliberately excluded from the upload.
- Uses the session's own `index.html` if one exists; generates a plain listing only if none does.
- Pins `vercel.json` to a static, no-build deployment and runs `vercel deploy --prod`.

---

## Traps this encodes

**Cache-Control is overridden on purpose.** `R2Client` defaults to
`public, max-age=31536000, immutable`. Overwriting an R2 key does not bust the CDN cache, so a
regenerated asset would serve stale bytes for a year. Live assets get `max-age=300`; only
`_archive/` keeps the long TTL.

**Content types are explicit, not inferred.** `R2Client.getContentType()` has no video entry,
and a wrong type on `.svg` makes the browser offer a download instead of rendering. The tool
maps every extension itself and fails loudly on an unknown one.

**Run the Vercel CLI from inside the prototype directory.** It resolves `vercel.json` against
the process working directory, so invoking it from the repo root pulls in the monorepo's root
config — the first deploy of `dcs-prototypes` served _"Root monorepo - sites deploy via their
own Vercel projects."_ instead of the prototypes. `publish-prototype.ts` sets `cwd` rather than
passing `--cwd`, and pins `framework`, `buildCommand`, `installCommand` and `outputDirectory`
explicitly. Left to auto-detection Vercel resolves output as _"`public` if it exists, or `.`"_.

**These projects are deliberately not git-linked.** A connected Vercel project rebuilds on every
monorepo push unless it carries an `ignoreCommand`. Ad-hoc `vercel deploy` avoids that entirely.

**`.svg` inside a session folder is gitignored, and it is easy to miss.** `output/.gitignore`
carries `sessions/**/*.svg` alongside the PNG/JPEG/video rules added in August 2026. SVG is a
text format, so it does not read as part of an image deny-list — a vector written into
`output/sessions/**/` will be silently absent from a commit that looks like it included it. This
is correct for prototype artwork, which belongs on R2. But if the SVG is a brand asset rather
than a prototype asset, put it in the site's `public/` directory, which is tracked normally.
Hit in August 2026 with the DCS mark: the copy under `prototype/assets/` never committed, and
`sites/dcs/public/dcs-mark.svg` is the tracked source of truth. Check with
`git check-ignore -v <path>` rather than trusting `git status`, which simply says nothing.

---

## Access

Per-deployment URLs (`<project>-<hash>-<scope>.vercel.app`) are gated by Vercel Authentication
and 302 to a login. The project alias (`<project>.vercel.app`) is **public** — treat it as
shareable-but-unlisted, and check the project's Deployment Protection settings before putting
anything sensitive behind it.

---

## Live prototype sites

| Session                            | Project          | URL                               |
| ---------------------------------- | ---------------- | --------------------------------- |
| `2026-08-17_dcs-homepage-redesign` | `dcs-prototypes` | https://dcs-prototypes.vercel.app |

The project name defaults to the sanitised session slug; the DCS session pins `dcs-prototypes`
via `--project`. Use a distinct name per session so they do not overwrite each other.
