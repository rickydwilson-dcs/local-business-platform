# DCS — SiteGround → Vercel cutover plan

**Scope:** move website hosting only. **Email stays exactly where it is** (SiteGround), and the
SiteGround hosting account stays open to serve it. Nameservers stay at SiteGround. The only DNS
change is the `www` and apex website records.

**Status:** plan, not started. Written 2026-08-23.

---

## Verified starting state (measured 2026-08-23, not assumed)

| Thing                | Finding                                                                                                          |
| -------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Live site            | WordPress + Yoast on SiteGround                                                                                  |
| Delivery             | Behind SiteGround's own CDN — response carries `x-sg-cdn: 1`, `x-cdn-c: static`                                  |
| Origin server        | `35.214.38.130` (same box as `mail`, `webmail`, `ftp`)                                                           |
| Canonical host       | `www` — apex 301s to `https://www.digitalconsultingservices.co.uk/`                                              |
| Nameservers          | `ns1.siteground.net`, `ns2.siteground.net`                                                                       |
| Sitemap URLs         | 29 across 5 sub-sitemaps                                                                                         |
| MX                   | `mx10/20/30.antispam.mailspamprotection.com` (SiteGround Spam Experts)                                           |
| SPF                  | `v=spf1 +a +ip4:35.214.38.130 include:…dnssmarthost.net ~all`                                                    |
| Other TXT            | `google-site-verification=otGFOXy6XDnVvDQGV3pIJ3cZK3FyH43uaXunfz-M5bA`                                           |
| Website record TTL   | **30s**, authoritative — set by the SiteGround CDN, not the zone default                                         |
| MX record TTL        | 86400 (24h) — untouched by this cutover                                                                          |
| SOA minimum          | 86400 — this is the _zone_ minimum, **not** the website record TTL                                               |
| Vercel project       | `dcs` / `prj_ysC3rXNhzTD4oyZbrkXK51BZykYX` already exists, **no custom domain**, last production deploy CANCELED |
| `sites/dcs`          | Already a full Next.js site — blog, services, locations, projects, pricing, contact, privacy, cookie policy      |
| `next.config.ts`     | `trailingSlash: false`                                                                                           |
| `site.config.ts:165` | Declares the **apex** as canonical — contradicts the live site's `www`                                           |

---

## Phase 0 — Decisions (blocking; settle before building)

1. **Canonical host: `www` or apex?** All existing backlinks and Search Console history are on
   `www`. Choosing `www` avoids an extra redirect hop on every inbound link. Whichever is chosen,
   `site.config.ts:165` must be made to match.
2. **What happens to the ~40 routes already in `sites/dcs`?** Blog, services, locations, pricing and
   projects all currently build and would go live on cutover. Decide per section: ship, `noindex`,
   or drop from the build. This decision determines half the redirect map.

Email is **not** a decision here — nameservers stay at SiteGround, MX and mail records are not
touched, so there is no email risk in this cutover.

---

## Phase 1 — Capture before touching anything

3. Full WordPress backup + database export, stored off SiteGround.
4. **Crawl the live site properly.** The 29 sitemap URLs are not the full inventory — they exclude
   attachment pages, paginated archives, `/feed/`, and anything Yoast omitted. Also export Search
   Console's Pages report for the last 16 months; that is the real list of what has traffic and
   links, and it is what the redirect map should be built from.
5. Confirm access to Search Console, GA4 and the Google Business Profile before anything moves.

---

## Phase 2 — Build

6. Build the homepage in `sites/dcs` per repo standards — the r9 prototype converted to real
   components.
7. Build Privacy, Cookies and T&Cs. Note `/privacy-policy` and `/cookie-policy` already exist as
   routes in `sites/dcs/app/`.
8. Write the redirect map into `sites/dcs/next.config.ts` `redirects()`.
   - **No catch-all.** Next.js evaluates redirects before routing, so a `/(.*)` source swallows the
     real pages too. Use an explicit source list.
   - `trailingSlash: false` and every old URL ends in `/` — cover both forms explicitly rather than
     relying on normalisation.
   - Anything not listed falls through to a 404, which is the correct outcome for genuinely dead URLs.

### Redirect map (from the verified sitemap)

| Old (WordPress)                                                                           | New               | Note                                                                                                               |
| ----------------------------------------------------------------------------------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------ |
| `/privacy-policy/`                                                                        | `/privacy-policy` | real page                                                                                                          |
| `/contact-us/`                                                                            | `/#contact`       | anchor on the new homepage                                                                                         |
| `/our-work/` and its 11 children                                                          | `/` for now       | 8 of the 11 have matching MDX in `sites/dcs/content/projects/` — re-point to `/projects/<slug>` when the hub ships |
| `/news/`, `/blog/what-you-need-to-know-about-seo/`, `/blog/why-are-fast-sites-important/` | `/`               |                                                                                                                    |
| `/blog/featured_item/` + 6 children                                                       | `/`               |                                                                                                                    |
| `/blog/category/tips/`, `/blog/featured_item_category/ecommerce/`                         | `/`               |                                                                                                                    |
| `/examples/`                                                                              | `/`               |                                                                                                                    |
| everything else                                                                           | 404               |                                                                                                                    |

`/our-work/` children with a counterpart: cuddle-plush-fabrics, silvero-homes, nicola-noble-tuition,
dch-automotive, luna-landings, sanctuary-ida, the-clothing-kings, bexhill-removals.
Without one: mad-group-marketing, absorbent-mats, curtain-drop, bunnies-bunches-and-bows.

**Expectation to set:** Google treats a 301 from an unrelated page to the homepage as a soft 404 —
it does not pass link equity and the URL is dropped regardless. Do it for humans; map the 8 pages
that have genuine counterparts properly rather than dumping them on the homepage.

9. Add `sitemap.xml` and `robots.txt` for the new route set. Carry the `google-site-verification`
   TXT value across unchanged.

---

## Phase 3 — Verify before DNS moves

10. Deploy to Vercel production and test on `dcs-ricky-wilsons-projects.vercel.app`.
11. Test every redirect against that URL — assert both status code and destination.
12. Check whether the old site sends `Strict-Transport-Security` with a long `max-age`. If it does,
    the new host must serve valid HTTPS from the first request — Vercel does, once the domain
    resolves and the certificate issues.

---

## Phase 4 — Cutover

13. Add both `digitalconsultingservices.co.uk` and `www.digitalconsultingservices.co.uk` to the
    Vercel `dcs` project; set the non-canonical one to redirect to the canonical. They will show as
    unverified until step 16 — expected.
14. **Disable SiteGround's CDN for the domain.** While it is enabled, SiteGround manages the website
    A records and can override a manual edit. Confirm the site serves direct from origin before
    proceeding.
15. **Then — and only then — check the TTL.** The website records are currently on a **30 second**
    TTL, set by the CDN (`dig @ns1.siteground.net www.digitalconsultingservices.co.uk A`). Nothing
    needs lowering while that holds. But disabling the CDN hands those records back to the zone,
    where SiteGround's manual default is typically 3600. Re-run the `dig` immediately after step 14:
    - still ~30s → change the record straight away, propagation is seconds;
    - jumped to 3600+ → set it to 300 and **wait out the old value** before changing the record
      itself. Lowering a TTL only takes effect once the previously-cached longer value expires.
16. Change **only** these records:
    - apex `A` → `76.76.21.21`
    - `www` `CNAME` → `cname.vercel-dns.com`

    Leave everything else untouched: all three MX records, the `mail` / `webmail` / `ftp` A records,
    the SPF TXT, the Google verification TXT, and any DKIM record.

17. Wait for Vercel to issue the certificate. Confirm both hosts serve HTTPS.

---

## Phase 5 — Post-cutover

18. **Fix SPF.** This is the one email-adjacent item, and it bites precisely _because_ email is not
    moving. The record starts `v=spf1 +a` — the `+a` mechanism authorises whatever the domain's A
    record currently resolves to. Once the A record points at Vercel, `+a` authorises Vercel's IP to
    send mail as this domain. Sending still works (`ip4:35.214.38.130` is explicit), but the record
    now carries an authorisation nobody intended. Replace `+a` with the explicit
    `ip4:35.214.38.130`.
19. Send and receive a test email in both directions to confirm nothing else drifted.
20. Re-run the full redirect test against the live domain. Confirm `www` and apex resolve to one
    canonical in a single hop.
21. Submit the new sitemap in Search Console. Raise the website record TTL back to 3600 once the
    cutover is confirmed stable.

---

## Phase 6 — Wind down the old site (weeks, not days)

22. Watch Search Console coverage and 404 reports for 2–4 weeks; patch redirect gaps the real crawl
    surfaces.
23. **The SiteGround hosting account stays open** — it is what serves email. Do not cancel it.
    Retire the WordPress install itself (take it offline or remove the files), leaving the account
    and its mail service running.
24. Keep the WordPress backup archived.

---

## Traps

1. **SiteGround's CDN can override your DNS edit.** It is active right now (`x-sg-cdn: 1`). Disable
   it for the domain before changing the A/CNAME, or the change may not take effect.
2. **`+a` in the SPF record silently follows the A record to Vercel** even though you are not
   touching email. See step 18.
3. **A catch-all `redirects()` source swallows the real pages** — Next.js runs redirects before
   routing. Explicit sources only.
4. **The sitemap is not the URL inventory.** 29 URLs there; Search Console will show more.
5. **`site.config.ts:165` says apex, the live site says `www`.** One of them has to move.
6. **The 86400 figure is a decoy.** It is the SOA minimum and the MX TTL. The website A records are
   on 30s. Do not plan a 24-hour TTL wait around the wrong number — but do re-check after disabling
   the CDN, because that is the moment the TTL can jump.
