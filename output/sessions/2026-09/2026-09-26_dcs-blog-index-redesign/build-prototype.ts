/**
 * Generates `prototype/blog-list.html` for the /blog restructure.
 *
 * Content is REAL: every title, date, reading time and category below is read
 * from `sites/dcs/content/blog/*.mdx` frontmatter at build time, so the
 * prototype cannot drift from the library it is designing for.
 *
 * Chrome is SPLICED, not retyped, from the approved Phase 3b prototype
 * (`2026-09-15_dcs-inner-pages-design/prototype/blog-list.html`) by line
 * range — head, bar, overlay, footer and the three behaviour scripts come
 * across byte-identical, so they cannot have drifted either. Only the page
 * body and the filter script are new.
 *
 * Run:  npx tsx build-prototype.ts
 */

import fs from "node:fs";
import path from "node:path";

const HERE = __dirname;
const REPO = path.resolve(HERE, "../../../..");
const SRC = path.join(
  REPO,
  "output/sessions/2026-09/2026-09-15_dcs-inner-pages-design/prototype/blog-list.html"
);
const CONTENT = path.join(REPO, "sites/dcs/content/blog");
const OUT = path.join(HERE, "prototype/blog-list.html");

/* ------------------------------------------------------------------ *
 * 1. Real content
 * ------------------------------------------------------------------ */

interface Post {
  slug: string;
  title: string;
  date: string;
  readingTime?: number;
  category: string;
  featured: boolean;
  excerpt?: string;
}

function frontmatter(src: string): Record<string, string> {
  const block = src.split(/^---$/m)[1] ?? "";
  const out: Record<string, string> = {};
  for (const line of block.split("\n")) {
    const m = line.match(/^([a-zA-Z]+):\s*(.+)$/);
    if (m) out[m[1]] = m[2].trim().replace(/^"|"$/g, "");
  }
  return out;
}

const posts: Post[] = fs
  .readdirSync(CONTENT)
  .filter((f) => f.endsWith(".mdx"))
  .map((f) => {
    const fm = frontmatter(fs.readFileSync(path.join(CONTENT, f), "utf8"));
    return {
      slug: f.replace(/\.mdx$/, ""),
      title: fm.title,
      date: fm.date,
      readingTime: fm.readingTime ? Number(fm.readingTime) : undefined,
      category: fm.category,
      featured: fm.featured === "true",
      excerpt: fm.excerpt,
    };
  })
  .sort((a, b) => b.date.localeCompare(a.date));

/** The seven `category` values that actually exist, in the order
 *  `lib/blog-topics.ts` (TOPIC_ORDER) puts them. */
const TOPIC_LABELS: Record<string, string> = {
  "local-seo": "Local search",
  "getting-found-online": "Getting found",
  "costs-and-value": "Costs and value",
  "website-content": "Site content",
  "industry-guides": "Sector guides",
  "website-design": "Design and speed",
  "business-tools": "Tools and email",
};
const TOPIC_ORDER = Object.keys(TOPIC_LABELS);

for (const p of posts) {
  if (!TOPIC_LABELS[p.category]) throw new Error(`Unknown category "${p.category}" (${p.slug})`);
}

/** TITLES ARE CONVERTED TO SENTENCE CASE in the live port already — the
 *  frontmatter here is authored that way, so nothing is rewritten. */

const CAP = 12; // rows visible at rest; see session.md "Open question 1"

const fmtMonth = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { month: "long", year: "numeric" });
const fmtShort = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { month: "short", year: "numeric" });

const esc = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/'/g, "&rsquo;")
    .replace(/ — /g, " &mdash; ");

/* ------------------------------------------------------------------ *
 * 2. Spliced chrome
 * ------------------------------------------------------------------ */

const srcLines = fs.readFileSync(SRC, "utf8").split("\n");
const slice = (from: number, to: number) => srcLines.slice(from - 1, to).join("\n");

const HEAD_AND_BAR = slice(1, 90); // <!doctype> … <main id="top">
const FOOTER = slice(496, 574); // page footer … </main>
const CHROME_SCRIPTS = slice(576, 645); // ground probe, .in observer, overlay

/* ------------------------------------------------------------------ *
 * 3. The new body
 * ------------------------------------------------------------------ */

const featured = posts.find((p) => p.featured) ?? posts[0];

/* THE FEATURED POST IS IN THE LIST TOO, and that is deliberate.
 *
 * The first cut excluded it, to make the index and the magenta band disjoint.
 * That broke the filter: pressing "Design and speed" returned 1 result when
 * the library holds 2, with the missing one sitting in a band 900px above and
 * no longer visibly part of that result set.
 *
 * So the model is: THE MAGENTA BAND IS A SPOTLIGHT, THE LIST IS THE COMPLETE
 * LIBRARY. One post appears twice instead of five — and that one is the one
 * being deliberately pointed at, which is what a spotlight is for. */
const rest = posts;

const arrow = (w = "1.9") =>
  `<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M2 8h11M9 4l4 4-4 4" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

const rows = rest
  .map((p, i) => {
    const meta = [
      `<b class="row__t">${TOPIC_LABELS[p.category]}</b>`,
      p.readingTime ? `<span>${p.readingTime} min read</span>` : null,
      `<em>${fmtMonth(p.date)}</em>`,
    ]
      .filter(Boolean)
      .join("\n          ");
    return `      <a class="row" href="blog-post.html" data-topic="${p.category}" data-cap="${i >= CAP}"${i >= CAP ? " hidden" : ""}>
        <span class="row__n">${esc(p.title)}</span>
        <span class="row__m">
          ${meta}
        </span>
      </a>`;
  })
  .join("\n");

const topicLinks = TOPIC_ORDER.map(
  (t) => `      <a href="blog-category.html">${TOPIC_LABELS[t]}</a>`
).join("\n");

const chips = [
  `        <button type="button" aria-pressed="true" data-topic="all">All <span aria-hidden="true">${posts.length}</span></button>`,
  ...TOPIC_ORDER.map(
    (t) =>
      `        <button type="button" aria-pressed="false" data-topic="${t}">${TOPIC_LABELS[t]}</button>`
  ),
].join("\n");

const BODY = `
<!-- ===== 1. BREADCRUMB + MASTHEAD — ink ==============================
     TRIMMED against the shipped page. The lead was two sentences and
     .mast__meta carried four stats; "7 topics / Grouped by problem"
     duplicated the chip row 600px below it, and "5–7 min / Typical read"
     restated a figure that is on every row. Two stats left.
     ================================================================== -->
<div class="crumb p--ink" data-ground="ink">
  <nav aria-label="Breadcrumb">
    <ol>
      <li><a href="#">Home</a></li>
      <li><span aria-current="page">Blog</span></li>
    </ol>
  </nav>
</div>

<header class="mast p--ink" data-ground="ink">
  <p class="eyeless">Blog</p>
  <h1>The questions I get asked most.</h1>
  <p class="lead">${posts.length} plain-English guides on getting a small business found online.</p>
  <div class="mast__meta">
    <div><b>${posts.length}</b><span>Guides in the library</span></div>
    <div><b>${fmtShort(posts[0].date)}</b><span>Latest guide</span></div>
  </div>
</header>

<!-- ===== 2. LATEST — magenta ==========================================
     THE .svcs "four behind it" LIST IS GONE. Every post in it reappeared in
     the library below — 26 links for 21 posts on the shipped page. The card
     is the whole band now, and the band's own h2 + lead go with the list:
     the eyebrow plus the card says "latest" without a third voice saying it.
     ================================================================== -->
<section class="sec p--magenta" data-ground="magenta">
  <p class="eyeless">Latest</p>

  <div class="svcgrid">
    <a class="svccard svccard--ink svccard--wide" href="blog-post.html">
      <div class="svccard__body">
        <p class="svccard__ix">Featured &middot; ${TOPIC_LABELS[featured.category]}</p>
        <h3 class="svccard__t">${esc(featured.title)}</h3>
        <p class="svccard__d">${esc(featured.excerpt ?? "")}</p>
      </div>
      <div class="svccard__body">
        <div class="mast__meta">
          ${featured.readingTime ? `<div><b>${featured.readingTime} min</b><span>Read time</span></div>` : ""}
          <div><b>${fmtMonth(featured.date)}</b><span>Published</span></div>
        </div>
        <span class="svccard__l">Read the guide ${arrow()}</span>
      </div>
    </a>
  </div>
</section>

<!-- ===== 3. THE LIBRARY — white =======================================
     ONE LIST, NOT SEVEN SECTIONS. The shipped page opened seven .topic
     blocks, each a 35px h3 plus a 62ch description — ~120 words restarting
     the eye seven times before anything could be picked. The chips already
     are the topic affordance, and they are better at it: you press one
     rather than scrolling past seven.

     THE SCALE CONSTRAINT SURVIVES (notes-f.md §0: height must be a function
     of topics, not posts). It is now carried by CAP + "show all" rather than
     by four-per-topic: ${CAP} rows at rest whatever the library holds, and the
     cap lifts when a chip narrows the list.

     The seven descriptions are not deleted — they move to
     /blog/category/[slug], where they are the page's own intro rather than
     one of seven competing for the same screen.
     ================================================================== -->
<section class="sec p--white" data-ground="white" id="library">
  <p class="eyeless">The library</p>
  <h2 class="res">Start with the problem,<br>not the sector.</h2>
  <p class="lead">Seven topics, each one a problem rather than an industry. Pick one, or read
    straight down.</p>

  <div class="filterset" id="filterset">
    <div class="filterax">
      <p class="eyeless" id="lbl-topic">Topic</p>
      <div class="paytoggle" id="f-topic" role="group" aria-labelledby="lbl-topic">
${chips}
      </div>
    </div>
    <span class="count" id="count" role="status" aria-live="polite">Showing ${CAP} of ${posts.length} guides</span>
  </div>

  <!-- R2-01 .libr — the measure and the vertical room. On the shipped page
       .row's title cell measured 1,337px holding ~500px of text with .row__m
       pinned to the far right, at 13.2px vertical padding: a 700px dead
       gutter on every row, and no air above or below. .libr caps the list at
       a real measure and moves the meta under the title. -->
  <div class="work libr" id="libr">
${rows}
  </div>

  <!-- R2-05 .libr__topics — THE SEVEN CATEGORY PAGES' ONLY WAY IN.
       The shipped index linked /blog/category/<slug> seven times, from each
       topic block's "N guides" link. Dropping the topic blocks dropped every
       one of those links — and those pages are robots:{index:true} and are
       NOT in app/(site)/blog/sitemap.ts, which lists only /blog and
       /blog/<slug>. Removing the links would have orphaned seven indexable
       pages with no other route in. One line, seven real anchors, in the
       static HTML so a crawler sees them without pressing a chip. -->
  <nav class="libr__topics" aria-label="Topic pages">
    <span>Topic pages</span>
${topicLinks}
  </nav>

  <div class="libr__more" id="more">
    <button class="btn btn--ghost" type="button" id="showall">Show all ${posts.length} guides ${arrow("2")}</button>
  </div>

  <div class="empty" id="empty" data-show="false">
    <h3>Nothing under that topic yet.</h3>
    <p>The library is still filling out &mdash; or
      <a href="mailto:mail@digitalconsultingservices.co.uk">ask me the question directly</a>.</p>
  </div>
</section>

<!-- ===== 4. WHO IT'S FOR — aqua — REMOVED 2026-09-26 =================
     Was an h2 plus a paragraph about what has NOT been written yet, sitting
     between the reader and the footer. Ricky's call: cut it.

     TWO CONSEQUENCES, both checked below rather than assumed:
       - GROUND SEQUENCE is now ink -> magenta -> white -> navy. Still no two
         adjacent panels sharing a ground, and navy still closes
         (design-kit.md §1.2). Aqua no longer appears on this page at all.
       - THE SECTOR AXIS NOW HAS NO SURFACE HERE. lib/blog-sectors.ts's derived
         data was read by this band and nowhere else on the index. It still
         backs the per-post and category badges; on /blog it is now unused.
     ================================================================== -->
`;

/* ------------------------------------------------------------------ *
 * 4. The filter script
 * ------------------------------------------------------------------ */

const FILTER_SCRIPT = `<script>
/* ---------------------------------------------------------------------
   THE TOPIC FILTER — one axis, one flat list.

   Same contract as the shipped two-axis version
   (components/blog/blog-filter-section.tsx): hides with the \`hidden\`
   ATTRIBUTE so kit.css's global [hidden]{display:none !important} wins over
   .row{display:grid}, and announces through .count's role="status".

   WHAT CHANGED: the cap is now a flat ${CAP}-row cap on the whole list with an
   explicit "show all" control, instead of four-per-topic across seven
   headed blocks. Pressing a topic chip lifts the cap for that topic, exactly
   as before. Height at rest stays a function of the cap, not of the library.
   --------------------------------------------------------------------- */
(function(){
  var btns  = [].slice.call(document.querySelectorAll('#f-topic button'));
  var rows  = [].slice.call(document.querySelectorAll('#libr .row'));
  var count = document.getElementById('count');
  var empty = document.getElementById('empty');
  var more  = document.getElementById('more');
  var showall = document.getElementById('showall');

  var TOTAL = ${posts.length};
  var state = { topic: 'all', expanded: false };

  function labelOf(btn){
    var c = btn.cloneNode(true); var s = c.querySelector('span');
    if (s) s.remove();
    return c.textContent.trim();
  }

  function apply(){
    var wide = state.topic === 'all';
    var shown = 0, matches = 0;

    rows.forEach(function(r){
      var hit = wide || r.dataset.topic === state.topic;
      if (hit) matches++;
      /* the cap only bites in the unfiltered, unexpanded view */
      var capped = wide && !state.expanded && r.dataset.cap === 'true';
      var vis = hit && !capped;
      r.hidden = !vis;
      if (vis) shown++;
    });

    if (wide){
      count.textContent = state.expanded
        ? 'Showing all ' + TOTAL + ' guides'
        : 'Showing ' + shown + ' of ' + TOTAL + ' guides';
    } else {
      var label = labelOf(current());
      count.textContent = matches === 0
        ? 'Nothing under ' + label
        : 'Showing ' + shown + ' of ' + TOTAL + ' — ' + label;
    }

    more.hidden = !(wide && !state.expanded);
    empty.dataset.show = matches === 0 ? 'true' : 'false';
  }

  function current(){
    for (var i = 0; i < btns.length; i++){
      if (btns[i].getAttribute('aria-pressed') === 'true') return btns[i];
    }
    return btns[0];
  }

  btns.forEach(function(btn){
    btn.addEventListener('click', function(){
      btns.forEach(function(b){ b.setAttribute('aria-pressed','false'); });
      btn.setAttribute('aria-pressed','true');
      state.topic = btn.dataset.topic;
      state.expanded = false;
      apply();
    });
  });

  showall.addEventListener('click', function(){
    state.expanded = true;
    apply();
    /* NO documentElement.scrollTop here — it is a silent no-op on this design
       (html{overflow-x:clip} computes to \`clip visible\`). Nothing needs to
       scroll anyway: the list grows downward from where the button was. */
  });

  apply();
})();
</script>`;

/* ------------------------------------------------------------------ *
 * 5. Emit
 * ------------------------------------------------------------------ */

const html = [
  HEAD_AND_BAR.replace(
    '<link rel="stylesheet" href="../kit.css">',
    '<link rel="stylesheet" href="../../2026-09-15_dcs-inner-pages-design/kit.css">\n' +
      "<!-- additions load after the kit; the kit itself is not edited -->\n" +
      '<link rel="stylesheet" href="../kit-additions-blog-r2.css">'
  ).replace(
    "<title>Blog — Digital Consulting Services</title>",
    "<title>Blog (r2 restructure) — Digital Consulting Services</title>"
  ),
  BODY,
  FOOTER,
  "",
  CHROME_SCRIPTS,
  "",
  FILTER_SCRIPT,
  "</body>",
  "</html>",
  "",
].join("\n");

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, html);
console.log(`wrote ${OUT}  (${posts.length} posts, cap ${CAP}, ${html.length} bytes)`);
