# docs-site

Client-facing documents from DCS, served from their own Vercel project so they never
touch `sites/dcs` or any client site.

**Deliberately outside the pnpm workspaces.** Nothing here is a workspace package, so it
does not appear in `pnpm-workspace.yaml`, does not affect the lockfile, and cannot mark a
client package "affected" for `turbo-ignore`. It deploys on its own, by CLI.

**Every document is unlisted.** `robots.txt` disallows everything, `vercel.json` sends
`X-Robots-Tag: noindex`, and each page carries a `noindex` meta tag as well. Paths carry a
random token so the URL cannot be guessed. The root page lists nothing.

**Live documents**

| Client       | Document             | Path                      |
| ------------ | -------------------- | ------------------------- |
| DPM Autobody | Your new site design | `/dpm-autobody/fdec4278/` |

**Deploy**

    node build-page.mjs <artifact-source.html> <client>/<token>   # regenerate a page
    vercel deploy --prod --yes                                     # from docs-site/

Custom domain: `docs.digitalconsultingservices.co.uk`, added against the `dcs-docs`
Vercel project. It is a separate origin from the marketing site, so it shares no
sitemap, robots.txt or internal links with it.

**Fonts are self-hosted, deliberately.** The Google Fonts stylesheet is render-blocking and
chains to a second origin for the files — Lighthouse measured ~1,680ms of savings on this page.
The DCS Next.js sites never hit this because `next/font/google` self-hosts at build time; a
hand-built static page has to do it explicitly. `build-page.mjs` strips the Google `<link>` and
preconnects and substitutes preloads plus `@font-face` against `/fonts/`. Archivo is a variable
font, so one file covers every weight. Filenames are Google's content hashes, so `/fonts/*` is
served `immutable` for a year.
