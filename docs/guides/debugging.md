# Debugging Guide

**Scope:** All sites in local-business-platform

---

## General Approach

Before speculating about a bug's cause:

1. **Check whether a dev server is running** — `lsof -i :3000` (or the target port). If nothing is running, start one with `npm run dev` from the site directory.
2. **Fetch the page** — `WebFetch http://localhost:3000` (or `:3001` for test sites). Read the response for visible errors or unexpected HTML.
3. **Take a screenshot** — capture the visual state and browser console output before forming a hypothesis.
4. **Check the terminal output** — the dev server logs RSC errors, hydration mismatches, and import failures as they happen.

Only ask the user for a screenshot or console log if you cannot retrieve it yourself.

---

## Common Next.js Issues

### Hydration Errors

**Symptom:** `Warning: Text content did not match. Server: "X" Client: "Y"` or similar in the browser console.

**Causes and fixes:**

- Date/time rendered differently on server vs client — use a consistent format or `suppressHydrationWarning` where unavoidable
- Conditional rendering based on `typeof window` or `navigator` — gate with `useEffect` + state instead
- Browser extensions injecting DOM nodes — not a code bug, safe to ignore in development

### RSC Serialisation Errors

**Symptom:** `Error: Only plain objects, and a few built-ins, can be passed to Client Components from Server Components.`

**Causes and fixes:**

- Passing a class instance, Date object, or function as a prop across the server/client boundary — serialise to a plain value first
- Passing a React component as a prop — use a slot pattern or move the component to the server side

### Dynamic Import Failures

**Symptom:** Component renders nothing or throws on the client; no error in the terminal.

**Causes and fixes:**

- `dynamic(() => import(...))` with `ssr: false` used for a Server Component — remove `ssr: false`
- Import path typo — check that the resolved path exists with `ls`

---

## CSS and Styling Issues

### Tailwind Token Not Resolving

**Symptom:** Class is present in the DOM but has no effect; computed style shows no value.

**Causes and fixes:**

- Using a theme token class (`bg-brand-primary`) on a site whose theme doesn't define `--color-brand-primary` — check `theme.config.ts` and the CSS output in `app/globals.css`
- The class isn't in any scanned file at build time — check `tailwind.config.ts` content globs include the file

### CSS Variable Fallback Missing

**Symptom:** Component looks unstyled in some themes.

**Fix:** Always use theme tokens, never raw hex values. If a token is missing from a theme, add it to that theme's `theme.config.ts` rather than hardcoding.

### PostCSS Failures in Dev

**Symptom:** Dev server starts but CSS is broken or absent; terminal shows a PostCSS worker error.

**Fix:** Restart dev with `--webpack` flag: `npm run dev -- --webpack`. Turbopack has known PostCSS bugs.

---

## CSP Issues

**Symptom:** Script loads in development but silently fails in production; third-party widget or analytics doesn't run; console shows `Refused to execute script`.

**Steps:**

1. Open DevTools → Network tab → find the page response headers → look for `Content-Security-Policy`
2. Check which directives are set for `script-src`, `connect-src`, `frame-src`
3. Common culprits: `unsafe-eval` blocked (breaks some analytics/chat widgets), `unsafe-inline` blocked (breaks inline scripts), missing domain in `connect-src` (breaks API calls)
4. Fix: add the required source to the CSP in `next.config.ts` headers configuration — do not add `unsafe-eval` without justification

---

## Build vs Runtime Errors

| Error type              | Where it appears                 | How to reproduce                 |
| ----------------------- | -------------------------------- | -------------------------------- |
| TypeScript error        | `pnpm type-check` output         | `pnpm type-check`                |
| Import/export mismatch  | `npm run build` output           | `npm run build`                  |
| MDX frontmatter invalid | `npm run validate:content`       | `npm run validate:content`       |
| Hydration mismatch      | Browser console, dev only        | `npm run dev` + open page        |
| RSC serialisation       | Terminal (dev server)            | `npm run dev` + navigate to page |
| CSS token missing       | Browser DevTools computed styles | `npm run dev` + inspect element  |
| CSP violation           | Browser console, production      | Check Vercel deployment headers  |

---

## Escalating to the User

If you cannot resolve an issue after fetching the page and checking logs, ask for:

- **Specific error text** — the exact message from the console, not a description of it
- **Which page/route** is affected
- **When it started** — last working commit, recent config change, etc.

Do not ask "can you share what you see" — be specific about what information you need.

---

## Related

- [Deployment](../standards/deployment.md) — required env vars, Vercel config
- [Testing](../standards/testing.md) — unit and E2E test setup
- [GitHub Actions](./github-actions.md) — CI workflow configuration
