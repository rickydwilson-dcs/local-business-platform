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

| Client       | Document                         | Path                      |
| ------------ | -------------------------------- | ------------------------- |
| DPM Autobody | Why the DPM site looks like this | `/dpm-autobody/fdec4278/` |

**Deploy**

    npx tsx tools/publish-prototype.ts docs-site --project dcs-docs

Custom domain: `docs.digitalconsultingservices.co.uk`, added against the `dcs-docs`
Vercel project. It is a separate origin from the marketing site, so it shares no
sitemap, robots.txt or internal links with it.
