# Content style guide and schema (The Graphic Kings prototype)

Files are `.mdx`, but the frontmatter is a single JSON object between `---` lines (valid YAML, parsed by `build_inner.py` with `json`). No body text. Output must be strict JSON: double quotes, no trailing commas, no comments. Escape quotes inside strings.

## Reference files — read both first

- `content/services/van-graphics.mdx` — service page
- `content/locations/eastbourne.mdx` — location page

## Voice

British English. Plain, short, direct sentences. A trade business talking to a busy owner. "We" = The Graphic Kings. Second person ("you", "your van").
No marketing fluff ("elevate", "unlock", "seamless", "tailored solutions", "world-class", "cutting-edge", "journey", "passionate"). No em dashes. No rhetorical triplets everywhere. Concrete over abstract: say what the thing is, where it goes, what it is made from.

## Hard bans — never write these (all unverified or not offered)

- Any price, "from £", cost range, discount, "free delivery" or delivery radius.
- Any duration or turnaround ("3-5 days", "same day", "24 hours", "lasts 12 months", "5 year life").
- "Est. 2004", "20+ years", "since 2004", "decades", years of experience, "established".
- Insurance claims ("public liability insured", "fully insured"), accreditations, awards, compliance guarantees, "approved".
- Testimonials, review counts, star ratings, client names, statistics, "hundreds of".
- Full vehicle wraps. We do NOT do them. Lettering, partial graphics and livery only.
- Workwear, hi-vis clothing, embroidered uniforms, merchandise, gifts, canvas prints. Not offered. Never link or mention them (the only exception is the site-wide Clothing Kings link, which the build adds).
- "Mad Graphics" (old name). Only "The Graphic Kings" / "we".
- Brighton, Hove, Portslade, Rottingdean, Saltdean as places we cover.
- Brand names of products/suppliers (Avery, 3M, Oracal, Mimaki, etc.).
- Phone numbers other than 01323 589 700; addresses other than Unit H2, Chaucer Business Park, Dittons Road, Polegate BN26.
  Generic material names are allowed (vinyl, PVC, mesh, Correx, foam board, aluminium, laminate, eyelets, UV-rated) but any specific performance claim ("weatherproof for outdoors", "stands up to the weather") must be hedged or put in reviewFlags. In-house design and UV-rated materials are the two agreed claims.

Specific numbers are allowed only for physical sizes that are standard and checkable (A0, A1, A2, A3, A4, A5, DL, 85x55mm business card, roll-up banner standard widths if you are sure). When unsure, leave it out.

## Reuse

Source material for each service is at `sites/mad-graphics/content/services/<slug>.mdx` (and `locations/<slug>.mdx`). Reuse its substance (what the product is, when people need it, what it achieves, sensible FAQs), but REWRITE every sentence in the voice above and strip every banned item. The old text is padded, repetitive and full of bans. Do not copy sentences. Locations in the old content are low-quality templates; write them fresh.

## Service schema

```
{
 "slug": "banners",                    // must equal filename
 "title": "Banners",                   // page H1, sentence case
 "category": "banners",                // one of the category slugs in content/categories.json
 "hub": true,                          // true only for the category hub page
 "description": "…",                   // meta description, 110-155 chars, no bans
 "image": "banner",                    // one of: banner design fleet floor hoarding magnetic print rollerbanners shopfront signs stickers van wall window
 "imageAlt": "Illustrative mock-up: …",
 "lead": "…",                          // 1-2 sentences, 25-45 words. What it is and who it is for.
 "intro": "…",                         // one paragraph, 50-90 words, concrete detail about the product and materials
 "whenNeeded": ["…" x6],               // short phrases, 5-12 words each
 "whatYouGet": [ {"title":"…","text":"…"} x4 ],   // title 2-4 words, text one sentence
 "steps": [ {"title":"…","text":"…"} x5 ],         // generic process, no durations
 "faqs": [ {"q":"…","a":"…"} x6 ],     // answers 1-3 sentences; hubs: 4 faqs
 "related": ["slug","slug","slug"],    // other service slugs from content/categories.json, same category first
 "reviewFlags": ["…"]                  // every claim the client should confirm (materials, processes, capabilities). Never empty.
}
```

Each service must be genuinely different: different materials, uses, FAQs, steps where the product differs. Steps for a design service differ from steps for a print service. Do not reuse the same five steps across pages.

Hub pages: `intro` should explain how the products in the category differ so a reader can choose; one FAQ should help pick between children. Build adds a grid of child pages automatically.

## Location schema

```
{
 "slug": "hailsham",
 "name": "Hailsham",
 "description": "…",                   // meta, 110-155 chars
 "image": "shopfront",                 // same image keys as services
 "imageAlt": "Illustrative mock-up: …",
 "lead": "…",                          // 25-40 words
 "local": "…",                         // one paragraph 60-100 words: working with businesses in this place. Only well-known, verifiable geography (named high street, well-known industrial estate, seafront, market town character). If you are not sure a detail is true, leave it out. Do not invent clients, jobs, or distances.
 "popular": ["slug" x5],               // service slugs most relevant to the kind of businesses there
 "nearby": ["slug" x4],                // other location slugs, geographically sensible
 "faqs": [ {"q":"…","a":"…"} x3 ],     // location-specific: do you come to X, can I visit, what areas do you cover. No prices, times.
 "reviewFlags": ["…"]                  // local details used that the client should confirm
}
```

Location copy must not read as a find-and-replace of another town. Vary the angle by what the place really is.

## When finished

Reply with one line per file written and a count. Do not paste the content back. Do not edit any other file.
