import { describe, expect, it, vi } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { render } from '@testing-library/react';
import React from 'react';
import type { Metadata } from 'next';

/**
 * Golden-fixture parity gate for Phase 2 of the inner-pages port
 * (`output/sessions/2026-09/2026-09-18_dcs-inner-pages-port/yolo-brief.md`).
 *
 * Each `describe` block below renders a REAL ported component — not a
 * stand-in, not a hand-written fixture — and compares its key structural
 * classes against the REAL approved prototype HTML on disk, parsed live on
 * every run. Sub-agents porting the other wave 1/2 routes extend this file
 * with their own `describe` blocks rather than replacing it.
 *
 * Blocks, by sub-agent:
 *   2a — `/services`, `/services/[slug]`
 *   2b — `/projects`, `/projects/[slug]`
 *   2c — `/pricing`
 *   2d — `/contact`, the root 404 (`app/not-found.tsx`)
 *   2e — `/about`
 */

const DESIGN_DIR = path.resolve(
  __dirname,
  '../../../output/sessions/2026-09/2026-09-15_dcs-inner-pages-design'
);
const CONTACT_PROTO_PATH = path.join(DESIGN_DIR, 'prototype/contact.html');
const NOT_FOUND_PROTO_PATH = path.join(DESIGN_DIR, 'prototype/404.html');
const PRICING_PROTO_PATH = path.join(DESIGN_DIR, 'prototype/pricing.html');
const ABOUT_PROTO_PATH = path.join(DESIGN_DIR, 'prototype/about.html');
const SERVICES_LIST_PROTO_PATH = path.join(DESIGN_DIR, 'prototype/services-list.html');
const SERVICE_DETAIL_PROTO_PATH = path.join(DESIGN_DIR, 'prototype/service-detail.html');
const PROJECTS_LIST_PROTO_PATH = path.join(DESIGN_DIR, 'prototype/projects-list.html');
const PROJECT_DETAIL_PROTO_PATH = path.join(DESIGN_DIR, 'prototype/project-detail.html');
const BLOG_LIST_PROTO_PATH = path.join(DESIGN_DIR, 'prototype/blog-list.html');
const BLOG_POST_PROTO_PATH = path.join(DESIGN_DIR, 'prototype/blog-post.html');
const BLOG_CATEGORY_PROTO_PATH = path.join(DESIGN_DIR, 'prototype/blog-category.html');
const LEGAL_PROTO_PATH = path.join(DESIGN_DIR, 'prototype/legal.html');
const LOCATIONS_LIST_PROTO_PATH = path.join(DESIGN_DIR, 'prototype/locations-list.html');
const LOCATION_DETAIL_PROTO_PATH = path.join(DESIGN_DIR, 'prototype/location-detail.html');

function classesOf(root: ParentNode): Set<string> {
  const set = new Set<string>();
  // `querySelectorAll('*')` yields descendants only, so the root's OWN
  // classes (e.g. `footer.pagefoot` itself carries "pagefoot p--navy") are
  // added explicitly rather than silently dropped.
  if (root instanceof Element) {
    root.classList.forEach((c) => set.add(c));
  }
  root.querySelectorAll('*').forEach((el) => el.classList.forEach((c) => set.add(c)));
  return set;
}

function forbiddenPriceCheck(text: string) {
  expect(text, 'rendered output contains the forbidden price £995').not.toContain('£995');
  expect(text, 'rendered output contains the forbidden price £59').not.toContain('£59');
}

// jsdom implements neither of these. `HomeBehaviour` (inside `SiteChrome`)
// reads `matchMedia` on mount; `IntersectionObserver` is stubbed globally in
// `test/setup.ts`. Only the 404 block renders `SiteChrome`, but the mocks are
// harmless to install once at module scope.
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

vi.mock('next/navigation', () => ({
  usePathname: () => '/this-page-does-not-exist',
}));
vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    ...rest
  }: {
    href: string;
    children: React.ReactNode;
  } & Record<string, unknown>) => React.createElement('a', { href, ...rest }, children),
}));

// `ProjectProse` (`components/projects/project-prose.tsx`) wraps
// `next-mdx-remote/rsc`'s `MDXRemote`, an async Server Component that
// compiles real MDX via a pipeline designed to run inside Next.js's RSC
// renderer — not the plain `react-dom` client renderer
// `@testing-library/react` uses here (the same reason `/services/web-design`'s
// block above stands in for `mdxContent` rather than rendering the real
// thing). Mocked to a synchronous stand-in that keeps the one wrapper element
// (`article.prose.measure`) the structural class comparison depends on.
// Mocked by its `@/…` alias, not a path relative to this test file, because
// Vitest keys a mock to the module's RESOLVED path — `project-detail-page.tsx`
// imports it as `./project-prose`, which resolves to the same file.
vi.mock('@/components/projects/project-prose', () => ({
  ProjectProse: ({ content }: { content: string }) =>
    React.createElement('article', { className: 'prose measure' }, content),
}));

// `vi.mock` calls above are hoisted to the top of the module by Vitest, so
// every route/component imported below already sees the mocked `next/link`.
import PricingPage from '../app/(site)/pricing/page';
import AboutRoute, { metadata as aboutMetadata } from '../app/(site)/about/page';
import { SiteServicesPage } from '../components/pages/ServicesPage';
import { SiteServiceDetailPage } from '../components/pages/ServiceDetailPage';
import { getServices, getService, getTestimonialsByService, getProjects } from '../lib/content';
import type { SiteConfigSummary } from '@platform/core-components';
import ProjectsRoute, { metadata as projectsMetadata } from '../app/(site)/projects/page';
import ProjectRoute, {
  generateMetadata as generateProjectMetadata,
} from '../app/(site)/projects/[slug]/page';
import PrivacyPolicyPage, { metadata as privacyMetadata } from '../app/(site)/privacy-policy/page';
import CookiePolicyPage, { metadata as cookieMetadata } from '../app/(site)/cookie-policy/page';
import TermsAndConditionsPage, {
  metadata as termsMetadata,
} from '../app/(site)/terms-and-conditions/page';

/* ====================================================================== */
/* /pricing — Phase 2c                                                    */
/* ====================================================================== */

describe('/pricing matches the approved design (prototype/pricing.html)', () => {
  const PROTOTYPE_PATH = PRICING_PROTO_PATH;
  const protoHtml = fs.readFileSync(PROTOTYPE_PATH, 'utf-8');
  const proto = new DOMParser().parseFromString(protoHtml, 'text/html').body;

  function renderPage(): HTMLElement {
    const { container } = render(React.createElement(PricingPage));
    return container;
  }

  it('the prototype file is readable and non-trivial (fixture assumption)', () => {
    expect(protoHtml.length).toBeGreaterThan(1000);
    expect(proto.querySelectorAll('*').length).toBeGreaterThan(0);
  });

  it('renders exactly one <h1>, matching the prototype', () => {
    const protoH1 = proto.querySelectorAll('main h1, h1');
    expect(protoH1.length).toBe(1);

    const container = renderPage();
    expect(container.querySelectorAll('h1').length).toBe(1);
    expect(container.querySelector('h1')!.textContent).toBe('What a website costs.');
  });

  it('every live structural class of the prototype body appears in the render', () => {
    // `.bar`, `.menu` and `footer.pagefoot` (with its `.footmap`, `.end__main`
    // etc.) are the r9 chrome — asserted by chrome-parity.test.ts against the
    // real `app/(site)/layout.tsx`. This page is rendered standalone (as
    // SiteChrome's `children`), so those subtrees are excluded here rather
    // than name-blacklisted, which would go stale as the chrome evolves.
    const CHROME_SUBTREE_SELECTOR = '.bar, .menu, footer.pagefoot';
    const bodyOnlyClassesOf = (root: ParentNode): Set<string> => {
      const set = new Set<string>();
      root.querySelectorAll('*').forEach((el) => {
        if (el.closest(CHROME_SUBTREE_SELECTOR)) return;
        el.classList.forEach((c) => set.add(c));
      });
      return set;
    };

    const protoClasses = [...bodyOnlyClassesOf(proto)];
    expect(protoClasses.length).toBeGreaterThan(0);

    const container = renderPage();
    const rendered = bodyOnlyClassesOf(container);
    const missing = protoClasses.filter((c) => !rendered.has(c));
    expect(
      missing,
      `prototype body classes not found in the render: ${missing.join(', ')}`
    ).toEqual([]);
  });

  it('the section id set matches the prototype (plans; detail/tiercards are Pricing furniture)', () => {
    const container = renderPage();
    const ids = [...container.querySelectorAll('[id]')].map((el) => el.id);
    expect(ids).toContain('plans');
  });

  it('the picker (section 2) renders the shared <Pricing/> tablist and mobile cards', () => {
    const container = renderPage();
    expect(container.querySelector('.tiers[role="tablist"]')).toBeTruthy();
    expect(container.querySelectorAll('.tiers .tier').length).toBe(4);
    expect(container.querySelector('.tiercards')).toBeTruthy();
    expect(container.querySelectorAll('.tiercards .tcard').length).toBe(4);
  });

  it('the comparison table (section 4) has 4 plan columns and the eCommerce monthly cell reads "Not available"', () => {
    const container = renderPage();
    const table = container.querySelector('table.ctable');
    expect(table, 'table.ctable not found').toBeTruthy();
    expect(table!.querySelectorAll('thead th[scope="col"]').length).toBe(5); // label col + 4 plans
    const na = table!.querySelector('td.na');
    expect(na, 'td.na (eCommerce pay-monthly cell) not found').toBeTruthy();
    expect(na!.textContent).toMatch(/not available/i);
  });

  it('renders exactly 5 FAQ <details> elements, matching the prototype', () => {
    const protoDetails = proto.querySelectorAll('.qa details');
    expect(protoDetails.length).toBe(5);

    const container = renderPage();
    expect(container.querySelectorAll('.qa details').length).toBe(5);
  });

  it('renders exactly 7 extras rows, matching the prototype', () => {
    const protoRows = proto.querySelectorAll('.work .row');
    expect(protoRows.length).toBe(7);

    const container = renderPage();
    expect(container.querySelectorAll('.work .row').length).toBe(7);
  });

  it('never renders £995 or £59 anywhere (the superseded, pre-port price set)', () => {
    const container = renderPage();
    forbiddenPriceCheck(container.textContent ?? '');
  });

  it('the real prototype itself never renders £995 or £59 either (fixture sanity)', () => {
    // Checked against the parsed body's rendered text, not the raw HTML
    // string — the prototype's own header comments deliberately discuss both
    // superseded figures (£995/£59, from content/services/web-design.mdx) by
    // name, to document why they are NOT used. DOMParser strips comment
    // nodes from textContent, so this only sees what a visitor actually sees.
    forbiddenPriceCheck(proto.textContent ?? '');
  });
});

/* ====================================================================== */
/* /about — Phase 2e                                                      */
/* ====================================================================== */

describe('/about matches the approved design (prototype/about.html)', () => {
  const protoHtml = fs.readFileSync(ABOUT_PROTO_PATH, 'utf-8');
  const proto = new DOMParser().parseFromString(protoHtml, 'text/html').body;

  // `.bar`, `.menu` and `footer.pagefoot` are the shared r9 chrome — asserted
  // against the real `app/(site)/layout.tsx` by chrome-parity.test.ts. The
  // route component under test here (`app/(site)/about/page.tsx`) renders
  // only the page body, as `SiteChrome`'s `children` — those subtrees are
  // excluded from the comparison rather than name-blacklisted, matching
  // /pricing's approach above.
  const CHROME_SUBTREE_SELECTOR = '.bar, .menu, footer.pagefoot';
  function bodyOnlyClassesOf(root: ParentNode): Set<string> {
    const set = new Set<string>();
    root.querySelectorAll('*').forEach((el) => {
      if (el.closest(CHROME_SUBTREE_SELECTOR)) return;
      el.classList.forEach((c) => set.add(c));
    });
    return set;
  }

  function renderPage(): HTMLElement {
    const { container } = render(React.createElement(AboutRoute));
    return container;
  }

  it('the prototype file is readable and non-trivial (fixture assumption)', () => {
    expect(protoHtml.length).toBeGreaterThan(1000);
    expect(proto.querySelectorAll('*').length).toBeGreaterThan(0);
  });

  it('renders exactly one <h1>, matching the prototype text', () => {
    const protoH1 = proto.querySelectorAll('main h1, h1');
    expect(protoH1.length).toBe(1);
    const expectedText = protoH1[0].textContent!.replace(/\s+/g, ' ').trim();

    const container = renderPage();
    const renderedH1 = container.querySelectorAll('h1');
    expect(renderedH1.length).toBe(1);
    expect(renderedH1[0].textContent!.replace(/\s+/g, ' ').trim()).toBe(expectedText);
  });

  it('emits a description via the page metadata export (App Router owns <meta>, not the body)', () => {
    expect(typeof aboutMetadata.description).toBe('string');
    expect((aboutMetadata.description as string).length).toBeGreaterThan(0);
  });

  it('every live structural class of the prototype body appears in the render', () => {
    const protoClasses = [...bodyOnlyClassesOf(proto)];
    expect(protoClasses.length).toBeGreaterThan(0);

    const container = renderPage();
    const rendered = bodyOnlyClassesOf(container);
    const missing = protoClasses.filter((c) => !rendered.has(c));
    expect(
      missing,
      `prototype body classes not found in the render: ${missing.join(', ')}`
    ).toEqual([]);
  });

  it('renders the breadcrumb, masthead and all four page sections', () => {
    const container = renderPage();
    expect(container.querySelector('.crumb')).toBeTruthy();
    expect(container.querySelector('header.mast')).toBeTruthy();
    // 4 `.sec` sections: the studio (white), what one person means (ink),
    // who it's for (magenta), one client (aqua). `footer.pagefoot` is chrome
    // and is correctly absent from this standalone render.
    expect(container.querySelectorAll('section.sec').length).toBe(4);
  });

  it('renders the 4 mast__meta figures, the 7 detail__l items and the 5 sector rows, matching the prototype counts', () => {
    const protoMeta = proto.querySelectorAll('.mast__meta > div');
    const protoDetails = proto.querySelectorAll('.detail__l > div');
    const protoSectors = proto.querySelectorAll('.svcs .svc');
    expect(protoMeta.length).toBe(4);
    expect(protoDetails.length).toBe(7);
    expect(protoSectors.length).toBe(5);

    const container = renderPage();
    expect(container.querySelectorAll('.mast__meta > div').length).toBe(protoMeta.length);
    expect(container.querySelectorAll('.detail__l > div').length).toBe(protoDetails.length);
    expect(container.querySelectorAll('.svcs .svc').length).toBe(protoSectors.length);
  });

  it('never renders £995 or £59 anywhere', () => {
    const container = renderPage();
    forbiddenPriceCheck(container.textContent ?? '');
  });

  it('the real prototype itself never uses £995 or £59 either (fixture sanity)', () => {
    forbiddenPriceCheck(protoHtml);
  });
});

/* ====================================================================== */
/* /services and /services/[slug] — Phase 2a                              */
/* ====================================================================== */

// A minimal, real-shaped `SiteConfigSummary` — neither `SiteServicesPage` nor
// `SiteServiceDetailPage` reads more than `cta`/`phone` fields from it, and
// this test never asserts on the CTA banner copy (that's chrome/site.config
// territory, not this page's).
const TEST_SITE_CONFIG: SiteConfigSummary = {
  name: 'Digital Consulting Services',
  tagline: 'Websites, as professional as you are',
  phone: '07748148082',
  phoneDisplay: '07748 148082',
  address: { city: 'Polegate' },
  cta: { primary: { label: 'Get a free quote', href: '/contact' }, phone: { show: true } },
};

describe('/services matches the approved design (prototype/services-list.html)', () => {
  const protoHtml = fs.readFileSync(SERVICES_LIST_PROTO_PATH, 'utf-8');
  const proto = new DOMParser().parseFromString(protoHtml, 'text/html').body;
  const protoMain = proto.querySelector('main#top')!;

  async function renderPage(): Promise<HTMLElement> {
    const services = await getServices();
    const { container } = render(
      React.createElement(SiteServicesPage, {
        siteConfig: TEST_SITE_CONFIG,
        services: services.map((s) => ({
          slug: s.slug,
          title: s.title,
          description: s.description,
        })),
      })
    );
    return container;
  }

  it('fixture assumptions: the prototype file is readable and non-trivial', () => {
    expect(protoHtml.length).toBeGreaterThan(1000);
    expect(protoMain, 'services-list.html has no <main id="top">').toBeTruthy();
    expect(protoMain.querySelector('.svcgrid'), 'services-list.html has no .svcgrid').toBeTruthy();
  });

  it('every live class of the prototype body (minus its own chrome footer) appears in the render', async () => {
    // The prototype file is a standalone copy of the chrome (`.bar`, `.menu`,
    // `footer.pagefoot`) plus the page body — `SiteChrome` supplies the
    // chrome once, globally (asserted by chrome-parity.test.ts), so this
    // page renders only its own body and the footer's classes are excluded
    // from the comparison the same way /contact and /404 do above.
    const protoFoot = protoMain.querySelector('footer.pagefoot');
    const excluded = protoFoot ? classesOf(protoFoot) : new Set<string>();
    const protoClasses = [...classesOf(protoMain)].filter((c) => !excluded.has(c));
    expect(protoClasses.length).toBeGreaterThan(0);

    const container = await renderPage();
    const rendered = classesOf(container);
    const missing = protoClasses.filter((c) => !rendered.has(c));
    expect(
      missing,
      `body classes present in services-list.html but not rendered: ${missing.join(', ')}`
    ).toEqual([]);
  });

  it('renders exactly one <h1> and six .svccard entries, matching the prototype', async () => {
    const protoH1 = protoMain.querySelectorAll('h1');
    expect(protoH1.length).toBe(1);
    const protoCards = protoMain.querySelectorAll('.svccard');
    expect(protoCards.length).toBe(6);

    const container = await renderPage();
    expect(container.querySelectorAll('h1').length).toBe(1);
    expect(container.querySelectorAll('.svccard').length).toBe(6);
  });

  it('every .svccard links to a real /services/<slug> route', async () => {
    const container = await renderPage();
    const hrefs = [...container.querySelectorAll('.svccard')].map((a) => a.getAttribute('href'));
    for (const href of hrefs) {
      expect(href, 'a .svccard has no href').toBeTruthy();
      expect(href!.startsWith('/services/'), `${href} does not point at /services/<slug>`).toBe(
        true
      );
    }
    expect(new Set(hrefs).size, 'duplicate .svccard hrefs').toBe(hrefs.length);
  });

  it('renders no forbidden price figures', async () => {
    const container = await renderPage();
    forbiddenPriceCheck(container.textContent ?? '');
  });

  it('the real prototype itself never uses £995 or £59 either (fixture sanity)', () => {
    forbiddenPriceCheck(protoMain.textContent ?? '');
  });

  it('the route metadata carries exactly one description, with no forbidden price figures', async () => {
    const { metadata } = await import('../app/(site)/services/page');
    expect(typeof metadata.description).toBe('string');
    expect((metadata.description as string).length).toBeGreaterThan(0);
    forbiddenPriceCheck(metadata.description as string);
  });
});

describe('/services/web-design matches the approved design (prototype/service-detail.html)', () => {
  const protoHtml = fs.readFileSync(SERVICE_DETAIL_PROTO_PATH, 'utf-8');
  const proto = new DOMParser().parseFromString(protoHtml, 'text/html').body;
  const protoMain = proto.querySelector('main#top')!;
  const SLUG = 'web-design';

  interface ServiceFm {
    title: string;
    description?: string;
    hero?: { heading?: string; subheading?: string };
    benefits?: string[];
    faqs?: Array<{ question: string; answer: string }>;
  }

  async function renderPage(): Promise<HTMLElement> {
    const result = await getService(SLUG);
    if (!result) {
      throw new Error(`content/services/${SLUG}.mdx not found — fixture assumption failed`);
    }
    const fm = result.frontmatter as ServiceFm;
    const testimonials = await getTestimonialsByService(SLUG);
    const testimonial = testimonials[0]
      ? {
          text: testimonials[0].text,
          customerName: testimonials[0].customerName,
          customerRole: testimonials[0].customerRole,
        }
      : null;

    const { container } = render(
      React.createElement(SiteServiceDetailPage, {
        siteConfig: TEST_SITE_CONFIG,
        slug: SLUG,
        testimonial,
        heroHeading: fm.hero?.heading,
        heroSubheading: fm.hero?.subheading,
        frontmatter: {
          title: fm.title,
          description: fm.description,
          benefits: fm.benefits,
          faqs: fm.faqs,
        },
        // `mdxContent` is normally `next-mdx-remote/rsc`'s `<MDXRemote/>` —
        // an async Server Component that only resolves inside a real Next.js
        // RSC render, not through `@testing-library/react`'s client
        // renderer. It is also opaque to this component (rendered via
        // `{mdxContent}` with no inspection), so a stand-in proves the
        // `.prose` wrapper renders its children without exercising MDX
        // compilation this test cannot usefully assert on anyway.
        mdxContent: React.createElement('p', null, 'Mock MDX body for the parity test.'),
        breadcrumbs: [
          { name: 'Home', href: '/' },
          { name: 'Services', href: '/services' },
          { name: fm.title, href: `/services/${SLUG}`, current: true },
        ],
      })
    );
    return container;
  }

  it('fixture assumptions: the prototype file is readable and non-trivial', () => {
    expect(protoHtml.length).toBeGreaterThan(1000);
    expect(protoMain, 'service-detail.html has no <main id="top">').toBeTruthy();
    expect(
      protoMain.querySelector('.prose'),
      'service-detail.html has no .prose body'
    ).toBeTruthy();
  });

  it('renders exactly one <h1>, matching the prototype text exactly', async () => {
    const protoH1 = protoMain.querySelectorAll('h1');
    expect(protoH1.length).toBe(1);
    const expectedText = protoH1[0].textContent!.trim();

    const container = await renderPage();
    const renderedH1 = container.querySelectorAll('h1');
    expect(renderedH1.length).toBe(1);
    // `content/services/web-design.mdx`'s own `hero.heading` — the exact
    // source of the prototype's h1 (see ServiceDetailPage.tsx's header note).
    expect(renderedH1[0].textContent!.trim()).toBe(expectedText);
  });

  it('every live class of the prototype body (minus chrome and the unbacked .detail__l checklist) appears in the render', async () => {
    // `.detail__l` (the "Everything, in one price" checklist) is excluded
    // deliberately, not by omission: no `content/services/*.mdx` file has a
    // structured `benefits` array to draw it from (see
    // `ServiceDetailPage.tsx`'s header FLAG). This is a documented content
    // gap, not a rendering bug — asserting it away here would make the gate
    // lie about what's actually shipped.
    const protoFoot = protoMain.querySelector('footer.pagefoot');
    const excludedFromFooter = protoFoot ? classesOf(protoFoot) : new Set<string>();
    const protoClasses = [...classesOf(protoMain)].filter(
      (c) => !excludedFromFooter.has(c) && c !== 'detail__l'
    );
    expect(protoClasses.length).toBeGreaterThan(0);

    const container = await renderPage();
    const rendered = classesOf(container);
    const missing = protoClasses.filter((c) => !rendered.has(c));
    expect(
      missing,
      `body classes present in service-detail.html but not rendered: ${missing.join(', ')}`
    ).toEqual([]);
  });

  it('renders the breadcrumb (Home / Services / current) and the FAQ accordion', async () => {
    const container = await renderPage();
    const crumbItems = container.querySelectorAll('.crumb li');
    expect(crumbItems.length).toBe(3);
    expect(container.querySelector('.crumb [aria-current="page"]')).toBeTruthy();

    // The prototype's 5 FAQs are 6 real `web-design.mdx` FAQs minus one
    // ("What's included in a DCS website?"), which the design session
    // hand-absorbed into the `.detail__l` checklist instead
    // (`service-detail.html:218-223` vs. its FAQ list). This component has
    // no `benefits` data to reproduce that split (see the header FLAG on
    // `.detail__l`), so it renders all 6 real FAQs rather than 5 — a real,
    // documented consequence of the same content gap, not a bug.
    const protoDetails = protoMain.querySelectorAll('.qa details');
    expect(protoDetails.length).toBeGreaterThan(0);
    expect(container.querySelectorAll('.qa details').length).toBe(protoDetails.length + 1);
  });

  it('renders the real service testimonial as a .prose blockquote', async () => {
    const container = await renderPage();
    const quote = container.querySelector('.prose blockquote');
    expect(quote, 'no testimonial blockquote rendered for web-design, which has one').toBeTruthy();
    expect(quote!.querySelector('cite')?.textContent).toContain('Mark H.');
  });

  it('renders exactly 5 "other services" rows, none of them web-design itself', async () => {
    const container = await renderPage();
    const rows = [...container.querySelectorAll('.work .row')];
    expect(rows.length).toBe(5);
    for (const row of rows) {
      expect(row.getAttribute('href')).not.toBe('/services/web-design');
    }
  });

  it('renders no forbidden price figures', async () => {
    const container = await renderPage();
    forbiddenPriceCheck(container.textContent ?? '');
  });

  it('the route metadata carries exactly one description, with no forbidden price figures', async () => {
    const { generateMetadata } = await import('../app/(site)/services/[slug]/page');
    const metadata = await generateMetadata({ params: Promise.resolve({ slug: SLUG }) });
    expect(typeof metadata.description).toBe('string');
    expect((metadata.description as string).length).toBeGreaterThan(0);
    forbiddenPriceCheck(metadata.description as string);
  });
});

describe('/services/[slug] renders all six real services without error', () => {
  // `service-detail.html` only exists for `web-design` (the design session's
  // hand-picked reference page — see its own header comment). This block
  // checks the other five generalise safely: real content, one <h1>, no
  // forbidden prices, no thrown exception — not full prototype parity, which
  // has no fixture to compare against for these five.
  it('every real content/services/*.mdx slug renders with exactly one <h1> and no forbidden prices', async () => {
    const services = await getServices();
    expect(services.length).toBeGreaterThan(0);

    for (const service of services) {
      const result = await getService(service.slug);
      expect(result, `getService(${service.slug}) returned null`).toBeTruthy();
      const fm = result!.frontmatter as {
        title: string;
        description?: string;
        hero?: { heading?: string; subheading?: string };
        benefits?: string[];
        faqs?: Array<{ question: string; answer: string }>;
      };
      const testimonials = await getTestimonialsByService(service.slug);
      const testimonial = testimonials[0]
        ? {
            text: testimonials[0].text,
            customerName: testimonials[0].customerName,
            customerRole: testimonials[0].customerRole,
          }
        : null;

      const { container, unmount } = render(
        React.createElement(SiteServiceDetailPage, {
          siteConfig: TEST_SITE_CONFIG,
          slug: service.slug,
          testimonial,
          heroHeading: fm.hero?.heading,
          heroSubheading: fm.hero?.subheading,
          frontmatter: {
            title: fm.title,
            description: fm.description,
            benefits: fm.benefits,
            faqs: fm.faqs,
          },
          mdxContent: React.createElement('p', null, 'Mock MDX body for the parity test.'),
          breadcrumbs: [
            { name: 'Home', href: '/' },
            { name: 'Services', href: '/services' },
            { name: fm.title, href: `/services/${service.slug}`, current: true },
          ],
        })
      );

      expect(
        container.querySelectorAll('h1').length,
        `${service.slug}: expected exactly one <h1>`
      ).toBe(1);
      forbiddenPriceCheck(container.textContent ?? '');
      unmount();
    }
  });
});

/* ========================================================================
   /contact — Phase 2d
   ======================================================================== */

describe('sites/dcs /contact matches the approved design (contact.html)', () => {
  const html = fs.readFileSync(CONTACT_PROTO_PATH, 'utf-8');
  const proto = new DOMParser().parseFromString(html, 'text/html').body;
  // The prototype's own <main id="top"> holds the crumb/mast/form/aside
  // AND its own copy of the chrome footer — the ported component renders
  // only the body (SiteChrome supplies the footer once, globally), so the
  // fixture is scoped to <main>, minus that footer and the deleted `.rig`.
  const protoMain = proto.querySelector('main#top')!;

  it('fixture assumptions: the prototype file is readable and non-trivial', () => {
    expect(html.length).toBeGreaterThan(1000);
    expect(protoMain, 'contact.html has no <main id="top">').toBeTruthy();
    expect(protoMain.querySelector('#cform'), 'contact.html has no #cform').toBeTruthy();
  });

  it('the demo rig is NOT present in the prototype fixture used for comparison, or in the port', async () => {
    // Scaffolding, explicitly marked "delete at port time" in the source
    // (contact.html's own header comment). Confirms it never leaks into the
    // comparison set below, and confirms the port dropped it.
    expect(protoMain.querySelector('.rig')).toBeNull();

    const { SiteContactPage } = await import('../components/pages/ContactPage');
    const { container } = render(React.createElement(SiteContactPage));
    expect(
      container.querySelector('.rig'),
      '.rig scaffolding was ported — it must be deleted'
    ).toBeNull();
    expect(
      container.innerHTML.includes('data-rig'),
      'a data-rig attribute from the demo rig was ported'
    ).toBe(false);
  });

  it('every live class of the prototype body (minus chrome and the rig) appears in the rendered form', async () => {
    const protoFoot = protoMain.querySelector('footer.pagefoot');
    const excluded = protoFoot ? classesOf(protoFoot) : new Set<string>();
    const protoClasses = [...classesOf(protoMain)].filter((c) => !excluded.has(c) && c !== 'rig');
    expect(protoClasses.length).toBeGreaterThan(0);

    const { SiteContactPage } = await import('../components/pages/ContactPage');
    const { container } = render(React.createElement(SiteContactPage));
    const rendered = classesOf(container);
    const missing = protoClasses.filter((c) => !rendered.has(c));
    expect(
      missing,
      `body classes present in contact.html but not rendered: ${missing.join(', ')}`
    ).toEqual([]);
  });

  it('the five real API fields plus the correctly-named honeypot are all present', async () => {
    const { SiteContactPage } = await import('../components/pages/ContactPage');
    const { container } = render(React.createElement(SiteContactPage));

    for (const name of ['name', 'email', 'phone', 'service', 'message', 'website']) {
      expect(
        container.querySelector(`[name="${name}"]`),
        `no field named "${name}" in the rendered form`
      ).toBeTruthy();
    }
    // The old component's honeypot name, which the handler never read.
    expect(container.querySelector('[name="_gotcha"]')).toBeNull();
  });

  it('the form posts to the real endpoint and has exactly one <h1>', async () => {
    const { SiteContactPage } = await import('../components/pages/ContactPage');
    const { container } = render(React.createElement(SiteContactPage));

    const form = container.querySelector('#cform');
    expect(form?.getAttribute('action')).toBe('/api/contact');
    expect(form?.getAttribute('method')).toBe('post');
    expect(container.querySelectorAll('h1').length, 'more than one <h1> rendered').toBe(1);
  });

  it('renders no forbidden price figures', async () => {
    const { SiteContactPage } = await import('../components/pages/ContactPage');
    const { container } = render(React.createElement(SiteContactPage));
    forbiddenPriceCheck(container.textContent ?? '');
  });

  it('the route metadata carries exactly one description, with no forbidden price figures', async () => {
    const { metadata } = await import('../app/(site)/contact/page');
    expect(typeof metadata.description).toBe('string');
    expect((metadata.description as string).length).toBeGreaterThan(0);
    forbiddenPriceCheck(metadata.description as string);
  });
});

/* ========================================================================
   404 (app/not-found.tsx) — Phase 2d
   ======================================================================== */

describe('sites/dcs 404 matches the approved design (404.html)', () => {
  const html = fs.readFileSync(NOT_FOUND_PROTO_PATH, 'utf-8');
  const proto = new DOMParser().parseFromString(html, 'text/html').body;
  const protoMain = proto.querySelector('main#top')!;

  it('fixture assumptions: the prototype file is readable and non-trivial', () => {
    expect(html.length).toBeGreaterThan(1000);
    expect(protoMain, '404.html has no <main id="top">').toBeTruthy();
    expect(protoMain.querySelector('.work'), '404.html has no .work index').toBeTruthy();
  });

  it('every live class of the prototype body (minus its own chrome footer) appears in the rendered page', async () => {
    const protoFoot = protoMain.querySelector('footer.pagefoot');
    const excluded = protoFoot ? classesOf(protoFoot) : new Set<string>();
    const protoClasses = [...classesOf(protoMain)].filter((c) => !excluded.has(c));
    expect(protoClasses.length).toBeGreaterThan(0);

    const { default: NotFound } = await import('../app/not-found');
    const { container } = render(React.createElement(NotFound));
    const rendered = classesOf(container);
    const missing = protoClasses.filter((c) => !rendered.has(c));
    expect(
      missing,
      `body classes present in 404.html but not rendered: ${missing.join(', ')}`
    ).toEqual([]);
  });

  it('has no <nav> ("no breadcrumb") ahead of the masthead, and exactly one <h1>', async () => {
    const { default: NotFound } = await import('../app/not-found');
    const { container } = render(React.createElement(NotFound));
    expect(
      container.querySelector('.crumb'),
      'a breadcrumb was rendered — the design has none'
    ).toBeNull();
    expect(container.querySelectorAll('h1').length, 'more than one <h1> rendered').toBe(1);
  });

  it('renders all six real routes as the "way out", with no forbidden price figures', async () => {
    const { default: NotFound } = await import('../app/not-found');
    const { container } = render(React.createElement(NotFound));

    const rows = [...container.querySelectorAll('.work .row')];
    expect(rows.length).toBe(6);
    const hrefs = rows.map((r) => r.getAttribute('href')).sort();
    expect(hrefs).toEqual(
      ['/about', '/blog', '/contact', '/pricing', '/projects', '/services'].sort()
    );

    forbiddenPriceCheck(container.textContent ?? '');
  });

  it('the not-found metadata carries exactly one description and denies indexing', async () => {
    const { metadata } = await import('../app/not-found');
    expect(typeof metadata.description).toBe('string');
    expect((metadata.description as string).length).toBeGreaterThan(0);
    forbiddenPriceCheck(metadata.description as string);
    expect(metadata.robots).toMatchObject({ index: false });
  });
});

/* ========================================================================
   /projects and /projects/[slug] — Phase 2b
   ======================================================================== */

describe('/projects matches the approved design (prototype/projects-list.html)', () => {
  const protoHtml = fs.readFileSync(PROJECTS_LIST_PROTO_PATH, 'utf-8');
  const proto = new DOMParser().parseFromString(protoHtml, 'text/html').body;
  const protoMain = proto.querySelector('main#top')!;

  async function renderPage(): Promise<HTMLElement> {
    // `ProjectsRoute` is `app/(site)/projects/page.tsx`'s real async Server
    // Component default export — called directly (not through
    // `@testing-library/react`'s client renderer, which cannot execute an
    // async function component) to resolve its real `getProjects()` /
    // `getTestimonials()` data, then handed to `render()` as the already-
    // resolved, entirely synchronous element tree that results.
    const element = await ProjectsRoute();
    const { container } = render(element);
    return container;
  }

  it('fixture assumptions: the prototype file is readable and non-trivial', () => {
    expect(protoHtml.length).toBeGreaterThan(1000);
    expect(protoMain, 'projects-list.html has no <main id="top">').toBeTruthy();
    expect(
      protoMain.querySelector('.cards--2'),
      'projects-list.html has no .cards--2 grid'
    ).toBeTruthy();
  });

  it('every live class of the prototype body (minus its own chrome footer) appears in the render', async () => {
    const protoFoot = protoMain.querySelector('footer.pagefoot');
    const excluded = protoFoot ? classesOf(protoFoot) : new Set<string>();
    const protoClasses = [...classesOf(protoMain)].filter((c) => !excluded.has(c));
    expect(protoClasses.length).toBeGreaterThan(0);

    const container = await renderPage();
    const rendered = classesOf(container);
    const missing = protoClasses.filter((c) => !rendered.has(c));
    expect(
      missing,
      `body classes present in projects-list.html but not rendered: ${missing.join(', ')}`
    ).toEqual([]);
  });

  it('renders exactly one <h1>, all 13 real case-study cards, and the 6-button sector filter bar', async () => {
    const protoH1 = protoMain.querySelectorAll('h1');
    expect(protoH1.length).toBe(1);
    const protoCards = protoMain.querySelectorAll('.cards--2 .card');
    expect(protoCards.length).toBe(13);
    const protoFilters = protoMain.querySelectorAll('.paytoggle button');
    expect(protoFilters.length).toBe(6); // All + 5 sectors

    const projects = await getProjects();
    expect(projects.length, 'content/projects/*.mdx should have 13 real files').toBe(13);

    const container = await renderPage();
    expect(container.querySelectorAll('h1').length).toBe(1);
    expect(container.querySelectorAll('.cards--2 .card').length).toBe(13);
    expect(container.querySelectorAll('.paytoggle button').length).toBe(6);
  });

  it('every .card links to a real /projects/<slug> route, with no duplicates', async () => {
    const container = await renderPage();
    const hrefs = [...container.querySelectorAll('.cards--2 .card')].map((a) =>
      a.getAttribute('href')
    );
    for (const href of hrefs) {
      expect(href, 'a .card has no href').toBeTruthy();
      expect(href!.startsWith('/projects/'), `${href} does not point at /projects/<slug>`).toBe(
        true
      );
    }
    expect(new Set(hrefs).size, 'duplicate .card hrefs').toBe(hrefs.length);
  });

  it('renders the three real testimonials, and the .slot honesty mechanism for the ten case studies with no real media', async () => {
    const container = await renderPage();
    expect(container.querySelectorAll('.quotes .quote').length).toBe(3);
    // 13 cards, 3 with real R2 video assets (`lib/project-cards.ts`) -> 10
    // `.slot` "Awaiting footage" placeholders. This is the deliberately
    // designed honesty mechanism the Phase 2 brief says must be ported
    // faithfully, not cleaned up as scaffolding.
    expect(container.querySelectorAll('.cards--2 .card .slot').length).toBe(10);
  });

  it('renders no forbidden price figures', async () => {
    const container = await renderPage();
    forbiddenPriceCheck(container.textContent ?? '');
  });

  it('the real prototype itself never uses £995 or £59 either (fixture sanity)', () => {
    forbiddenPriceCheck(protoMain.textContent ?? '');
  });

  it('the route metadata carries exactly one description, with no forbidden price figures', () => {
    expect(typeof projectsMetadata.description).toBe('string');
    expect((projectsMetadata.description as string).length).toBeGreaterThan(0);
    forbiddenPriceCheck(projectsMetadata.description as string);
  });
});

describe('/projects/colossus-scaffolding matches the approved design (prototype/project-detail.html)', () => {
  // Colossus is the one case study the design session actually built out in
  // full ("the one case study with both a complete narrative and a real
  // media asset" — see `project-detail.html`'s own header comment, and
  // `components/projects/project-detail-page.tsx`'s header on what's
  // generalised beyond this one demoed instance for the other 12).
  const SLUG = 'colossus-scaffolding';
  const protoHtml = fs.readFileSync(PROJECT_DETAIL_PROTO_PATH, 'utf-8');
  const proto = new DOMParser().parseFromString(protoHtml, 'text/html').body;
  const protoMain = proto.querySelector('main#top')!;

  async function renderPage(): Promise<HTMLElement> {
    const element = await ProjectRoute({ params: Promise.resolve({ slug: SLUG }) });
    const { container } = render(element);
    return container;
  }

  it('fixture assumptions: the prototype file is readable and non-trivial', () => {
    expect(protoHtml.length).toBeGreaterThan(1000);
    expect(protoMain, 'project-detail.html has no <main id="top">').toBeTruthy();
    expect(
      protoMain.querySelector('.prose'),
      'project-detail.html has no .prose body'
    ).toBeTruthy();
  });

  it('every live class of the prototype body (minus chrome and the real MDX prose internals) appears in the render', async () => {
    // `.prose` itself is asserted (the mocked `ProjectProse` still renders
    // `article.prose.measure`); classes that would only appear INSIDE real
    // compiled MDX markup (there are none in this prototype's structural
    // class set beyond `.prose`/`.measure` themselves — its body is plain
    // `<p>`/`<h2 class="res">`/`<ul>`) are unaffected by the mock.
    const protoFoot = protoMain.querySelector('footer.pagefoot');
    const excluded = protoFoot ? classesOf(protoFoot) : new Set<string>();
    const protoClasses = [...classesOf(protoMain)].filter((c) => !excluded.has(c));
    expect(protoClasses.length).toBeGreaterThan(0);

    const container = await renderPage();
    const rendered = classesOf(container);
    const missing = protoClasses.filter((c) => !rendered.has(c));
    expect(
      missing,
      `body classes present in project-detail.html but not rendered: ${missing.join(', ')}`
    ).toEqual([]);
  });

  it('renders exactly one <h1>, matching the prototype text', async () => {
    const protoH1 = protoMain.querySelectorAll('h1');
    expect(protoH1.length).toBe(1);
    const expectedText = protoH1[0].textContent!.trim();

    const container = await renderPage();
    const renderedH1 = container.querySelectorAll('h1');
    expect(renderedH1.length).toBe(1);
    expect(renderedH1[0].textContent!.trim()).toBe(expectedText);
  });

  it('renders the 4 real outcomes as .detail__l items, matching the MDX outcomes: array', async () => {
    const protoDetails = protoMain.querySelectorAll('.detail__l > div');
    expect(protoDetails.length).toBe(4);

    const container = await renderPage();
    expect(container.querySelectorAll('.detail__l > div').length).toBe(protoDetails.length);
  });

  it('renders the real R2 video for this case study, not the .slot placeholder', async () => {
    const container = await renderPage();
    expect(container.querySelector('.mast__media video')).toBeTruthy();
    expect(container.querySelector('.mast__media .slot')).toBeNull();
  });

  it('the "More like this" related grid renders exactly the demoed pair (DJ Fox Electrical, DCH Automotive)', async () => {
    const container = await renderPage();
    const related = [...container.querySelectorAll('.p--paper .cards--2 .card')];
    expect(related.length).toBe(2);
    const hrefs = related.map((a) => a.getAttribute('href'));
    expect(hrefs.sort()).toEqual(
      ['/projects/dch-automotive', '/projects/dj-fox-electrical'].sort()
    );
  });

  it('renders no forbidden price figures', async () => {
    const container = await renderPage();
    forbiddenPriceCheck(container.textContent ?? '');
  });

  it('the route metadata carries exactly one description, with no forbidden price figures', async () => {
    const metadata = await generateProjectMetadata({ params: Promise.resolve({ slug: SLUG }) });
    expect(typeof metadata.description).toBe('string');
    expect((metadata.description as string).length).toBeGreaterThan(0);
    forbiddenPriceCheck(metadata.description as string);
  });
});

describe('/projects/[slug] renders all 13 real projects without error', () => {
  // `project-detail.html` only exists for Colossus (the design session's
  // hand-picked reference page). This block checks the other 12 generalise
  // safely: real content, one <h1>, exactly two related cards, no forbidden
  // prices, no thrown exception — not full prototype parity, which has no
  // fixture to compare against for these 12.
  it('every real content/projects/*.mdx slug renders with exactly one <h1>, a 2-card related grid, and no forbidden prices', async () => {
    const projects = await getProjects();
    expect(projects.length).toBeGreaterThan(0);

    for (const project of projects) {
      const element = await ProjectRoute({ params: Promise.resolve({ slug: project.slug }) });
      const { container, unmount } = render(element);

      expect(
        container.querySelectorAll('h1').length,
        `${project.slug}: expected exactly one <h1>`
      ).toBe(1);
      expect(
        container.querySelectorAll('.p--paper .cards--2 .card').length,
        `${project.slug}: expected exactly 2 related cards`
      ).toBe(2);
      forbiddenPriceCheck(container.textContent ?? '');
      unmount();
    }
  });
});

/* ========================================================================
   /privacy-policy, /cookie-policy, /terms-and-conditions — Phase 3c

   ONE TEMPLATE, THREE ROUTES. `legal.html` carries all three real bodies as
   three `<div class="doc" data-doc="...">` siblings under one `<main>`
   (its own prototype-only `?doc=` switcher toggles `[hidden]` between them
   for review purposes — NOT ported; each route below is a real, independent
   Next.js page). `docFixture(name)` below scopes the comparison to one
   `.doc` block at a time, which already excludes the shared chrome
   (`.bar`/`.menu`/`footer.pagefoot` sit outside every `.doc`, as siblings
   under `<main>`) and the rig (`[data-rig]` is a sibling of `<main>`
   entirely, outside it) without needing a subtree exclusion list.
   ======================================================================== */

describe('the legal template matches the approved design (prototype/legal.html)', () => {
  const html = fs.readFileSync(LEGAL_PROTO_PATH, 'utf-8');
  const proto = new DOMParser().parseFromString(html, 'text/html').body;

  function docFixture(name: 'privacy' | 'cookie' | 'terms'): Element {
    const doc = proto.querySelector(`.doc[data-doc="${name}"]`);
    if (!doc) throw new Error(`legal.html has no .doc[data-doc="${name}"]`);
    return doc;
  }

  it('fixture assumptions: the prototype file is readable and carries all three real documents', () => {
    expect(html.length).toBeGreaterThan(1000);
    expect(docFixture('privacy')).toBeTruthy();
    expect(docFixture('cookie')).toBeTruthy();
    expect(docFixture('terms')).toBeTruthy();
    // The rig is prototype-only scaffolding, deleted at port — confirms it
    // never leaks into the comparison set built from a `.doc` fixture below.
    expect(proto.querySelector('[data-rig]')).toBeTruthy(); // present in the source fixture...
    expect(docFixture('privacy').querySelector('[data-rig]')).toBeNull(); // ...but outside every .doc
  });

  type LegalCase = {
    name: 'privacy' | 'cookie' | 'terms';
    route: string;
    Component: () => React.ReactElement;
    metadata: Metadata;
    expectedH2Count: number;
    expectedTitle: string;
  };

  const CASES: LegalCase[] = [
    {
      name: 'privacy',
      route: '/privacy-policy',
      Component: PrivacyPolicyPage,
      metadata: privacyMetadata,
      expectedH2Count: 9,
      expectedTitle: 'Privacy policy',
    },
    {
      name: 'cookie',
      route: '/cookie-policy',
      Component: CookiePolicyPage,
      metadata: cookieMetadata,
      expectedH2Count: 6,
      expectedTitle: 'Cookie policy',
    },
    {
      name: 'terms',
      route: '/terms-and-conditions',
      Component: TermsAndConditionsPage,
      metadata: termsMetadata,
      expectedH2Count: 9,
      expectedTitle: 'Terms and conditions',
    },
  ];

  for (const { name, route, Component, metadata, expectedH2Count, expectedTitle } of CASES) {
    describe(`${route} (.doc[data-doc="${name}"])`, () => {
      function renderPage(): HTMLElement {
        const { container } = render(React.createElement(Component));
        return container;
      }

      it('every live class of the prototype .doc block appears in the render', () => {
        const protoDoc = docFixture(name);
        // Descendants only, NOT `protoDoc`'s own class — `.doc` (unlike
        // `footer.pagefoot` elsewhere in this file) carries zero CSS rules
        // (confirmed: `grep -n '^\.doc\b' inner-pages.css` is empty). It
        // exists purely as the prototype's own `?doc=` switcher hook
        // ([hidden] toggle target), which this port deliberately drops, so
        // it is not a real design class to assert against.
        const protoClasses = [...classesOf(protoDoc)].filter((c) => c !== 'doc');
        expect(protoClasses.length).toBeGreaterThan(0);

        const container = renderPage();
        const rendered = classesOf(container);
        const missing = protoClasses.filter((c) => !rendered.has(c));
        expect(
          missing,
          `body classes present in legal.html's .doc[data-doc="${name}"] but not rendered: ${missing.join(', ')}`
        ).toEqual([]);
      });

      it('renders exactly one <h1>, matching the prototype text', () => {
        const protoH1 = docFixture(name).querySelectorAll('h1');
        expect(protoH1.length).toBe(1);
        expect(protoH1[0].textContent!.trim()).toBe(expectedTitle);

        const container = renderPage();
        const renderedH1 = container.querySelectorAll('h1');
        expect(renderedH1.length, 'more than one <h1> rendered').toBe(1);
        expect(renderedH1[0].textContent!.trim()).toBe(expectedTitle);
      });

      it(`renders the full body — all ${expectedH2Count} numbered clauses, nothing truncated`, () => {
        const protoH2s = docFixture(name).querySelectorAll('.legal__body h2[id]');
        expect(protoH2s.length).toBe(expectedH2Count);

        const container = renderPage();
        const renderedH2s = container.querySelectorAll('.legal__body h2[id]');
        expect(renderedH2s.length).toBe(expectedH2Count);
      });

      it('the TOC entry count matches the clause count, and every TOC href resolves to a real heading in this render', () => {
        const container = renderPage();
        const tocLinks = [...container.querySelectorAll('.legal__toc a')];
        expect(tocLinks.length).toBe(expectedH2Count);

        for (const link of tocLinks) {
          const href = link.getAttribute('href');
          expect(href, 'a .legal__toc entry has no href').toBeTruthy();
          expect(href!.startsWith('#'), `${href} is not an in-page anchor`).toBe(true);
          const id = href!.slice(1);
          const target = container.querySelector(`.legal__body #${CSS.escape(id)}`);
          expect(
            target,
            `TOC href "${href}" has no matching heading id in .legal__body`
          ).toBeTruthy();
          expect(target!.tagName, `TOC target #${id} is not an h2`).toBe('H2');
        }
      });

      it('renders exactly 2 .svcs .svc links in the closing band, both pointing at real sibling routes (not the deleted ?doc= switcher)', () => {
        const container = renderPage();
        const svcLinks = [...container.querySelectorAll('.svcs .svc')];
        expect(svcLinks.length).toBe(2);

        const hrefs = svcLinks.map((a) => a.getAttribute('href'));
        for (const href of hrefs) {
          expect(href, 'a .svc has no href').toBeTruthy();
          expect(
            href,
            `.svc href "${href}" still carries the prototype's ?doc= switcher`
          ).not.toMatch(/\?doc=/);
          expect(
            ['/privacy-policy', '/cookie-policy', '/terms-and-conditions'],
            `.svc href "${href}" does not point at a real legal route`
          ).toContain(href);
        }
        expect(hrefs).not.toContain(route); // never links to itself
      });

      it('emits exactly one <meta name="description"> via the page metadata export, with a real canonical URL', () => {
        expect(typeof metadata.description).toBe('string');
        expect((metadata.description as string).length).toBeGreaterThan(0);
        expect(metadata.alternates?.canonical).toContain(route);
      });

      it('renders no forbidden price figures', () => {
        const container = renderPage();
        forbiddenPriceCheck(container.textContent ?? '');
      });
    });
  }

  /*
   * The sticky-TOC-from-below trap (root CLAUDE.md's CSS Syntax rules; brief
   * trap #3): a sticky element reports its PINNED position via
   * getBoundingClientRect()/offsetTop, not its layout position, so native
   * anchor navigation silently no-ops once scrolled past a sticky TARGET.
   * jsdom performs no real layout, so it cannot measure pixel positions or
   * reproduce a scroll — this suite instead asserts the STRUCTURAL
   * precondition Agent H measured in a real browser (`notes-h.md` §3.6) and
   * that this port must preserve: the sticky element is the RAIL, the
   * targets are plain, non-sticky prose headings, and nothing intercepts
   * the click in JS. That combination is exactly what notes-h.md found safe
   * ("the trap bites when the TARGET is sticky, which nothing here is").
   * Verified for real (not just asserted): grep of styles/inner-pages.css
   * confirms `.legal__rail{position:sticky}` (~L4129) and, separately,
   * `.prose h2[id],.prose h3[id]{scroll-margin-top:...}` (~L3727) — the
   * sticky declaration and the scroll-clearance declaration apply to two
   * different elements, not one.
   */
  it('the sticky TOC rail is not an ancestor of its own scroll targets, and no client JS intercepts anchor clicks (the sticky-TOC-from-below precondition)', () => {
    for (const { Component } of CASES) {
      const { container, unmount } = render(React.createElement(Component));

      const rail = container.querySelector('.legal__rail');
      expect(rail, 'no .legal__rail rendered').toBeTruthy();

      // The rail and the scroll targets must be siblings inside `.legal`,
      // never rail-wraps-targets — a target inside the sticky rail would be
      // the exact shape that makes anchor navigation no-op once scrolled
      // past it.
      const targetsInsideRail = rail!.querySelectorAll('h2[id]');
      expect(
        targetsInsideRail.length,
        'a TOC scroll target is nested inside the sticky rail itself'
      ).toBe(0);

      // Plain <a href="#id">, no onClick handler rewritten by React (which
      // would show up as a non-null onclick property once React attaches a
      // synthetic handler) — confirms navigation is native, not JS-driven.
      const anchors = [...container.querySelectorAll('.legal__toc a')];
      expect(anchors.length).toBeGreaterThan(0);
      for (const a of anchors) {
        expect(a.getAttribute('href')).toMatch(/^#/);
      }

      unmount();
    }
  });
});

/* ========================================================================
   /locations and /locations/[slug] — Phase 3b

   Nearest-first ordering is real haversine distance from
   `lib/location-geo.ts`, computed against `site.config.ts`'s registered
   business coordinates and each real `content/locations/*.mdx` file's own
   `coordinates` frontmatter — never a hardcoded town order. See that file's
   header for the reference-point citation and `notes-g.md` §5's independently
   verified distance table this reproduces to the mile.
   ======================================================================== */

// `loadMdx` (`@/lib/mdx`) returns `{ content: <MDXRemote/> }` —
// `next-mdx-remote/rsc`'s async Server Component, which
// `@testing-library/react`'s client renderer cannot execute, same root cause
// as `/projects/colossus-scaffolding`'s `ProjectProse` mock above. Only
// `loadMdx` is stubbed (via `importOriginal`) so any other real export this
// module carries (`listSlugs`, `getPageImage`, etc., used by sibling routes'
// `sitemap.ts` files) stays real for any other describe block in this file
// that needs it.
vi.mock('@/lib/mdx', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/mdx')>();
  return {
    ...actual,
    loadMdx: async () => ({
      content: React.createElement('p', null, 'Mock MDX body for the parity test.'),
    }),
  };
});

import LocationsRoute, { metadata as locationsMetadata } from '../app/(site)/locations/page';
import LocationRoute, {
  generateMetadata as generateLocationMetadata,
} from '../app/(site)/locations/[slug]/page';
import { getLocations } from '../lib/content';
import { sortLocationsNearestFirst } from '../lib/location-geo';

describe('/locations matches the approved design (prototype/locations-list.html)', () => {
  const protoHtml = fs.readFileSync(LOCATIONS_LIST_PROTO_PATH, 'utf-8');
  const proto = new DOMParser().parseFromString(protoHtml, 'text/html').body;
  const protoMain = proto.querySelector('main#top')!;

  async function renderPage(): Promise<HTMLElement> {
    // `LocationsRoute` is `app/(site)/locations/page.tsx`'s real async
    // Server Component default export — called directly (not through
    // `@testing-library/react`'s client renderer, which cannot execute an
    // async function component) to resolve its real `getLocations()` data,
    // then handed to `render()` as the already-resolved element tree.
    const element = await LocationsRoute();
    const { container } = render(element);
    return container;
  }

  it('fixture assumptions: the prototype file is readable and non-trivial', () => {
    expect(protoHtml.length).toBeGreaterThan(1000);
    expect(protoMain, 'locations-list.html has no <main id="top">').toBeTruthy();
    expect(
      protoMain.querySelector('.work--loc'),
      'locations-list.html has no .work--loc row list'
    ).toBeTruthy();
  });

  it('every live class of the prototype body (minus its own chrome footer) appears in the render', async () => {
    const protoFoot = protoMain.querySelector('footer.pagefoot');
    const excluded = protoFoot ? classesOf(protoFoot) : new Set<string>();
    const protoClasses = [...classesOf(protoMain)].filter((c) => !excluded.has(c));
    expect(protoClasses.length).toBeGreaterThan(0);

    const container = await renderPage();
    const rendered = classesOf(container);
    const missing = protoClasses.filter((c) => !rendered.has(c));
    expect(
      missing,
      `body classes present in locations-list.html but not rendered: ${missing.join(', ')}`
    ).toEqual([]);
  });

  it('renders exactly one <h1> and all 8 real towns as .work--loc rows, nearest first', async () => {
    const protoH1 = protoMain.querySelectorAll('h1');
    expect(protoH1.length).toBe(1);
    const protoRows = protoMain.querySelectorAll('.work--loc .row');
    expect(protoRows.length).toBe(8);

    const locations = await getLocations();
    expect(locations.length, 'content/locations/*.mdx should have 8 real files').toBe(8);
    const ordered = sortLocationsNearestFirst(locations);
    expect(ordered[0].location.slug, "nearest-first should put the studio's own town first").toBe(
      'polegate'
    );
    // Real haversine miles, rounded — must match notes-g.md's independently
    // computed table exactly (see this block's header).
    const bySlug = new Map(ordered.map((o) => [o.location.slug, o.miles]));
    expect(bySlug.get('hailsham')).toBe(3);
    expect(bySlug.get('eastbourne')).toBe(4);
    expect(bySlug.get('seaford')).toBe(8);
    expect(bySlug.get('lewes')).toBe(11);
    expect(bySlug.get('uckfield')).toBe(12);
    expect(bySlug.get('brighton')).toBe(17);
    expect(bySlug.get('hove')).toBe(19);

    const container = await renderPage();
    expect(container.querySelectorAll('h1').length).toBe(1);
    const rows = [...container.querySelectorAll('.work--loc .row')];
    expect(rows.length).toBe(8);
    // Row order matches the computed nearest-first order. `.row__n` renders
    // the plain town name ("Brighton"), not the real MDX `title` ("Website
    // Design for Tradespeople in Brighton") — see
    // `lib/location-card-meta.ts#toTownNameFromSlug`.
    const renderedNames = rows.map((r) => r.querySelector('.row__n')?.textContent);
    const expectedNames = ordered.map(
      (o) => o.location.slug.charAt(0).toUpperCase() + o.location.slug.slice(1)
    );
    expect(renderedNames).toEqual(expectedNames);
  });

  it('the studio\'s own row reads "Where I work from", not "0 miles"', async () => {
    const container = await renderPage();
    const rows = [...container.querySelectorAll('.work--loc .row')];
    const polegateRow = rows.find((r) => r.querySelector('.row__n')?.textContent === 'Polegate');
    expect(polegateRow, 'no Polegate row rendered').toBeTruthy();
    expect(polegateRow!.querySelector('.row__m em')?.textContent).toBe('Where I work from');
  });

  it('every row links to a real /locations/<slug> route, with no duplicates', async () => {
    const container = await renderPage();
    const hrefs = [...container.querySelectorAll('.work--loc .row')].map((a) =>
      a.getAttribute('href')
    );
    for (const href of hrefs) {
      expect(href, 'a .row has no href').toBeTruthy();
      expect(href!.startsWith('/locations/'), `${href} does not point at /locations/<slug>`).toBe(
        true
      );
    }
    expect(new Set(hrefs).size, 'duplicate row hrefs').toBe(hrefs.length);
  });

  it('renders no forbidden price figures', async () => {
    const container = await renderPage();
    forbiddenPriceCheck(container.textContent ?? '');
  });

  it('the real prototype itself never uses £995 or £59 either (fixture sanity)', () => {
    forbiddenPriceCheck(protoMain.textContent ?? '');
  });

  it('the route metadata carries exactly one description, with no forbidden price figures', () => {
    expect(typeof locationsMetadata.description).toBe('string');
    expect((locationsMetadata.description as string).length).toBeGreaterThan(0);
    forbiddenPriceCheck(locationsMetadata.description as string);
  });
});

describe('/locations/brighton matches the approved design (prototype/location-detail.html)', () => {
  // Brighton is the design session's own hand-picked reference page (real
  // testimonial, real neighbouring context) — see `location-detail.html`'s
  // own header comment and `components/locations/location-detail-page.tsx`'s
  // header on what is generalised beyond this one demoed instance for the
  // other 7 towns.
  const SLUG = 'brighton';
  const protoHtml = fs.readFileSync(LOCATION_DETAIL_PROTO_PATH, 'utf-8');
  const proto = new DOMParser().parseFromString(protoHtml, 'text/html').body;
  const protoMain = proto.querySelector('main#top')!;

  async function renderPage(slug: string): Promise<HTMLElement> {
    const element = await LocationRoute({ params: Promise.resolve({ slug }) });
    const { container } = render(element);
    return container;
  }

  it('fixture assumptions: the prototype file is readable and non-trivial', () => {
    expect(protoHtml.length).toBeGreaterThan(1000);
    expect(protoMain, 'location-detail.html has no <main id="top">').toBeTruthy();
    expect(
      protoMain.querySelector('.prose'),
      'location-detail.html has no .prose body'
    ).toBeTruthy();
  });

  it('every live class of the prototype body (minus chrome and the hand-authored optional asides) appears in the render', async () => {
    // The prototype's "in person" / "the area around it" asides and its
    // domestic-vs-commercial section are Agent G's own hand-typed, per-town
    // narrative with no structured frontmatter signal to key off — not
    // reproduced by this generalised template (see
    // `location-detail-page.tsx`'s header FLAG). None of those add a
    // structural class beyond `.prose` internals already covered elsewhere,
    // so no exclusion list is needed beyond the usual chrome footer.
    const protoFoot = protoMain.querySelector('footer.pagefoot');
    const excluded = protoFoot ? classesOf(protoFoot) : new Set<string>();
    const protoClasses = [...classesOf(protoMain)].filter((c) => !excluded.has(c));
    expect(protoClasses.length).toBeGreaterThan(0);

    const container = await renderPage(SLUG);
    const rendered = classesOf(container);
    const missing = protoClasses.filter((c) => !rendered.has(c));
    expect(
      missing,
      `body classes present in location-detail.html but not rendered: ${missing.join(', ')}`
    ).toEqual([]);
  });

  it('renders exactly one <h1>, the D2-reframed sentence-case title ("Website design in Brighton")', async () => {
    const protoH1 = protoMain.querySelectorAll('h1');
    expect(protoH1.length).toBe(1);
    expect(protoH1[0].textContent!.trim()).toBe('Website design in Brighton');

    const container = await renderPage(SLUG);
    const renderedH1 = container.querySelectorAll('h1');
    expect(renderedH1.length).toBe(1);
    expect(renderedH1[0].textContent!.trim()).toBe('Website design in Brighton');
  });

  it('renders the real haversine distance (17 miles) and the studio address facts', async () => {
    const container = await renderPage(SLUG);
    const figs = [...container.querySelectorAll('.mast__meta > div > b')].map((b) => b.textContent);
    expect(figs).toContain('17 miles');
    expect(figs.some((f) => f?.includes('Polegate'))).toBe(true);
  });

  it('renders the breadcrumb with no duplicate entries, despite brighton.mdx\'s own duplicate "Locations" bug', async () => {
    // content/locations/brighton.mdx:21-25 lists "Locations" twice in its
    // own frontmatter breadcrumbs array — a confirmed content bug scoped to
    // Phase 4 (agent 4c), NOT fixed here. This asserts the graceful
    // render-time workaround (`dedupeBreadcrumbs`) actually holds, so the
    // rendered page never shows "Home / Locations / Locations / Brighton".
    const container = await renderPage(SLUG);
    const crumbTexts = [...container.querySelectorAll('.crumb li')].map((li) =>
      li.textContent?.trim()
    );
    expect(crumbTexts).toEqual(['Home', 'Locations', 'Brighton']);
  });

  it('renders the real Brighton testimonial (mark-h-electrician.mdx) as a .prose blockquote', async () => {
    const container = await renderPage(SLUG);
    const quote = container.querySelector('.prose blockquote');
    expect(quote, 'no testimonial blockquote rendered for Brighton, which has one').toBeTruthy();
    expect(quote!.querySelector('cite')?.textContent).toContain('Mark H.');
  });

  it('renders the real 5 FAQs as a .qa accordion', async () => {
    const container = await renderPage(SLUG);
    expect(container.querySelectorAll('.qa details').length).toBe(5);
  });

  it('renders no forbidden price figures', async () => {
    const container = await renderPage(SLUG);
    forbiddenPriceCheck(container.textContent ?? '');
  });

  it('the route metadata carries exactly one description, with no forbidden price figures', async () => {
    const metadata = await generateLocationMetadata({ params: Promise.resolve({ slug: SLUG }) });
    expect(typeof metadata.description).toBe('string');
    expect((metadata.description as string).length).toBeGreaterThan(0);
    forbiddenPriceCheck(metadata.description as string);
  });
});

describe('/locations/[slug] renders all 8 real towns without error, and generates exactly 8 static params', () => {
  it('generateStaticParams produces exactly the 8 real content/locations/*.mdx slugs', async () => {
    const { generateStaticParams } = await import('../app/(site)/locations/[slug]/page');
    const params = await generateStaticParams();
    expect(params.length).toBe(8);
    const locations = await getLocations();
    expect(new Set(params.map((p) => p.slug))).toEqual(new Set(locations.map((l) => l.slug)));
  });

  it('every real content/locations/*.mdx slug renders with exactly one <h1>, one .mast, and no forbidden prices', async () => {
    const locations = await getLocations();
    expect(locations.length).toBeGreaterThan(0);

    for (const location of locations) {
      const element = await LocationRoute({ params: Promise.resolve({ slug: location.slug }) });
      const { container, unmount } = render(element);

      expect(
        container.querySelectorAll('h1').length,
        `${location.slug}: expected exactly one <h1>`
      ).toBe(1);
      expect(
        container.querySelectorAll('header.mast').length,
        `${location.slug}: expected exactly one header.mast`
      ).toBe(1);
      forbiddenPriceCheck(container.textContent ?? '');
      unmount();
    }
  });
});

/* ========================================================================
   /blog, /blog/[slug], /blog/category/[slug] — Phase 3a

   SEVEN real categories, not eight — verified by counting all 21
   `content/blog/*.mdx` files (`lib/blog-topics.ts`'s header has the count).
   `/blog/category/[slug]` did not exist before this phase.
   ======================================================================== */

// `BlogProse` (`components/blog/blog-prose.tsx`) wraps `next-mdx-remote/rsc`'s
// `MDXRemote`, same root cause as `ProjectProse`'s mock above — an async
// Server Component `@testing-library/react`'s client renderer cannot run.
// Mocked to a synchronous stand-in that keeps the one wrapper element
// (`article.prose`) the structural class comparison depends on.
vi.mock('@/components/blog/blog-prose', () => ({
  BlogProse: ({ content }: { content: string }) =>
    React.createElement('article', { className: 'prose' }, content),
}));

import BlogRoute from '../app/(site)/blog/page';
import BlogPostRoute, {
  generateMetadata as generateBlogPostMetadata,
} from '../app/(site)/blog/[slug]/page';
import BlogCategoryRoute, {
  generateStaticParams as generateBlogCategoryParams,
  generateMetadata as generateBlogCategoryMetadata,
} from '../app/(site)/blog/category/[slug]/page';
import { getBlogPosts } from '../lib/content';
import { TOPIC_ORDER, categoryOf } from '../lib/blog-topics';

describe('/blog matches the approved design (prototype/blog-list.html)', () => {
  const protoHtml = fs.readFileSync(BLOG_LIST_PROTO_PATH, 'utf-8');
  const proto = new DOMParser().parseFromString(protoHtml, 'text/html').body;
  const protoMain = proto.querySelector('main#top')!;

  async function renderPage(): Promise<HTMLElement> {
    // `BlogRoute` is `app/(site)/blog/page.tsx`'s real async Server
    // Component default export, resolved directly (not through
    // `@testing-library/react`'s client renderer, which cannot execute an
    // async function component) so its real `getBlogPosts()` data drives
    // the render.
    const element = await BlogRoute();
    const { container } = render(element);
    return container;
  }

  it('fixture assumptions: the prototype file is readable and non-trivial', () => {
    expect(protoHtml.length).toBeGreaterThan(1000);
    expect(protoMain, 'blog-list.html has no <main id="top">').toBeTruthy();
    expect(protoMain.querySelector('#filterset'), 'blog-list.html has no #filterset').toBeTruthy();
  });

  it('every live class of the prototype body (minus its own chrome footer) appears in the render', async () => {
    const protoFoot = protoMain.querySelector('footer.pagefoot');
    const excluded = protoFoot ? classesOf(protoFoot) : new Set<string>();
    const protoClasses = [...classesOf(protoMain)].filter((c) => !excluded.has(c));
    expect(protoClasses.length).toBeGreaterThan(0);

    const container = await renderPage();
    const rendered = classesOf(container);
    const missing = protoClasses.filter((c) => !rendered.has(c));
    expect(
      missing,
      `body classes present in blog-list.html but not rendered: ${missing.join(', ')}`
    ).toEqual([]);
  });

  it('renders exactly one <h1>, and the real post/topic counts in .mast__meta', async () => {
    const protoH1 = protoMain.querySelectorAll('h1');
    expect(protoH1.length).toBe(1);

    const posts = await getBlogPosts();
    expect(posts.length, 'content/blog/*.mdx should have 21 real files').toBe(21);

    const container = await renderPage();
    expect(container.querySelectorAll('h1').length).toBe(1);
    const figs = [...container.querySelectorAll('.mast__meta > div > b')].map((b) => b.textContent);
    expect(figs).toContain(String(posts.length));
    expect(figs).toContain(`${TOPIC_ORDER.length} topics`);
  });

  it('renders exactly 7 .topic blocks (one per real category), each linking "N guides" to /blog/category/<slug>', async () => {
    const container = await renderPage();
    const topics = [...container.querySelectorAll('.topic')];
    expect(topics.length).toBe(TOPIC_ORDER.length);
    expect(topics.length).toBe(7);

    const links = [...container.querySelectorAll('.topic__h .card__link')];
    const hrefs = links.map((a) => a.getAttribute('href')).sort();
    expect(hrefs).toEqual(TOPIC_ORDER.map((t) => `/blog/category/${t}`).sort());
  });

  it('renders the featured post and the topic filter controls', async () => {
    const posts = await getBlogPosts();
    const featured = posts.find((p) => p.featured) ?? posts[0];

    const container = await renderPage();
    expect(container.querySelector('.svccard--wide')).toBeTruthy();
    expect(container.querySelector('.svccard--wide')?.getAttribute('href')).toBe(
      `/blog/${featured.slug}`
    );
    expect(container.querySelector('#f-topic')).toBeTruthy();
    // #f-sector (the "who it's for" filter axis) is deliberately not wired up
    // — see blog-filter-section.tsx's header, Ricky declined it 2026-09-19.
    expect(container.querySelector('#f-sector')).toBeNull();
    expect(container.querySelector('.count[role="status"]')).toBeTruthy();
  });

  it('renders no forbidden price figures', async () => {
    const container = await renderPage();
    forbiddenPriceCheck(container.textContent ?? '');
  });

  it('the real prototype itself never uses £995 or £59 either (fixture sanity)', () => {
    forbiddenPriceCheck(protoMain.textContent ?? '');
  });

  it('the route metadata carries exactly one description, with no forbidden price figures', async () => {
    const { metadata } = await import('../app/(site)/blog/page');
    expect(typeof metadata.description).toBe('string');
    expect((metadata.description as string).length).toBeGreaterThan(0);
    forbiddenPriceCheck(metadata.description as string);
  });
});

describe('/blog/a-fast-team-needs-a-fast-website matches the approved design (prototype/blog-post.html)', () => {
  // The one post the design session built out in full — see
  // `components/blog/blog-post-page.tsx`'s header on what's generalised
  // beyond this one demoed instance for the other 20.
  const SLUG = 'a-fast-team-needs-a-fast-website';
  const protoHtml = fs.readFileSync(BLOG_POST_PROTO_PATH, 'utf-8');
  const proto = new DOMParser().parseFromString(protoHtml, 'text/html').body;
  const protoMain = proto.querySelector('main#top')!;

  async function renderPage(slug: string): Promise<HTMLElement> {
    const element = await BlogPostRoute({ params: Promise.resolve({ slug }) });
    const { container } = render(element);
    return container;
  }

  it('fixture assumptions: the prototype file is readable and non-trivial', () => {
    expect(protoHtml.length).toBeGreaterThan(1000);
    expect(protoMain, 'blog-post.html has no <main id="top">').toBeTruthy();
    expect(protoMain.querySelector('.jump'), 'blog-post.html has no .jump list').toBeTruthy();
  });

  it('every live class of the prototype body (minus chrome and the real MDX prose internals) appears in the render', async () => {
    const protoFoot = protoMain.querySelector('footer.pagefoot');
    const excluded = protoFoot ? classesOf(protoFoot) : new Set<string>();
    // `.cscroll` is the table-overflow wrapper `BlogProse`'s own `table`
    // component renders (`components/blog/blog-prose.tsx`) — INSIDE the
    // compiled MDX body, which the `BlogProse` mock above bypasses entirely
    // (same category of gap as `/services/web-design`'s `.detail__l`
    // exclusion above: a real thing this mock cannot exercise, not a
    // rendering bug). The real, unmocked table markup is covered separately
    // by `blog-prose.test.ts`-style unit coverage is out of scope for this
    // golden-fixture gate, which compares against a mocked prose body.
    const protoClasses = [...classesOf(protoMain)].filter(
      (c) => !excluded.has(c) && c !== 'cscroll'
    );
    expect(protoClasses.length).toBeGreaterThan(0);

    const container = await renderPage(SLUG);
    const rendered = classesOf(container);
    const missing = protoClasses.filter((c) => !rendered.has(c));
    expect(
      missing,
      `body classes present in blog-post.html but not rendered: ${missing.join(', ')}`
    ).toEqual([]);
  });

  it("renders exactly one <h1>, matching the real MDX frontmatter title (the body's own duplicate # is stripped)", async () => {
    const protoH1 = protoMain.querySelectorAll('h1');
    expect(protoH1.length).toBe(1);
    expect(protoH1[0].textContent!.trim()).toBe('A fast team needs a fast website');

    const container = await renderPage(SLUG);
    const renderedH1 = container.querySelectorAll('h1');
    expect(renderedH1.length, 'more than one <h1> rendered').toBe(1);
    expect(renderedH1[0].textContent!.trim()).toBe('A fast team needs a fast website');
  });

  it('renders the breadcrumb (Home / Blog / topic / current) and the real mast__meta facts', async () => {
    const container = await renderPage(SLUG);
    const crumbTexts = [...container.querySelectorAll('.crumb li')].map((li) =>
      li.textContent?.trim()
    );
    expect(crumbTexts).toEqual([
      'Home',
      'Blog',
      'Making it fast and usable',
      'A fast team needs a fast website',
    ]);

    const figs = [...container.querySelectorAll('.mast__meta > div > b')].map((b) => b.textContent);
    expect(figs).toContain('Ricky Wilson');
    expect(figs).toContain('6 min');
  });

  it('renders a chip per real frontmatter tag, none of them links', async () => {
    const container = await renderPage(SLUG);
    const chips = [...container.querySelectorAll('.chip')];
    expect(chips.length).toBe(4);
    for (const chip of chips) {
      expect(chip.tagName).not.toBe('A');
    }
  });

  it('renders no forbidden price figures', async () => {
    const container = await renderPage(SLUG);
    forbiddenPriceCheck(container.textContent ?? '');
  });

  it('the route metadata carries exactly one description, with no forbidden price figures', async () => {
    const metadata = await generateBlogPostMetadata({ params: Promise.resolve({ slug: SLUG }) });
    expect(typeof metadata.description).toBe('string');
    expect((metadata.description as string).length).toBeGreaterThan(0);
    forbiddenPriceCheck(metadata.description as string);
  });
});

describe('/blog/[slug] renders all 21 real posts without error', () => {
  it('every real content/blog/*.mdx slug renders with exactly one <h1> and no forbidden prices', async () => {
    const posts = await getBlogPosts();
    expect(posts.length).toBe(21);

    for (const post of posts) {
      const element = await BlogPostRoute({ params: Promise.resolve({ slug: post.slug }) });
      const { container, unmount } = render(element);

      expect(
        container.querySelectorAll('h1').length,
        `${post.slug}: expected exactly one <h1>`
      ).toBe(1);
      forbiddenPriceCheck(container.textContent ?? '');
      unmount();
    }
  });
});

describe('/blog/category/[slug] matches the approved design (prototype/blog-category.html)', () => {
  // `local-seo` is the one topic the design session built out in full (the
  // largest at 6 posts — "the only one where the index's four-post cap
  // actually withholds anything"). See `components/blog/blog-category-
  // page.tsx`'s header on what's generalised beyond this one demoed
  // instance for the other 6 topics.
  const TOPIC = 'local-seo';
  const protoHtml = fs.readFileSync(BLOG_CATEGORY_PROTO_PATH, 'utf-8');
  const proto = new DOMParser().parseFromString(protoHtml, 'text/html').body;
  const protoMain = proto.querySelector('main#top')!;

  async function renderPage(slug: string): Promise<HTMLElement> {
    const element = await BlogCategoryRoute({ params: Promise.resolve({ slug }) });
    const { container } = render(element);
    return container;
  }

  it('generateStaticParams produces exactly 7 params — the 7 real categories, not 8', async () => {
    const params = await generateBlogCategoryParams();
    expect(params.length).toBe(7);
    expect(new Set(params.map((p) => p.slug))).toEqual(new Set(TOPIC_ORDER));
  });

  it('fixture assumptions: the prototype file is readable and non-trivial', () => {
    expect(protoHtml.length).toBeGreaterThan(1000);
    expect(protoMain, 'blog-category.html has no <main id="top">').toBeTruthy();
    expect(protoMain.querySelector('.svcs'), 'blog-category.html has no .svcs list').toBeTruthy();
  });

  it('every live class of the prototype body (minus its own chrome footer) appears in the render', async () => {
    const protoFoot = protoMain.querySelector('footer.pagefoot');
    const excluded = protoFoot ? classesOf(protoFoot) : new Set<string>();
    const protoClasses = [...classesOf(protoMain)].filter((c) => !excluded.has(c));
    expect(protoClasses.length).toBeGreaterThan(0);

    const container = await renderPage(TOPIC);
    const rendered = classesOf(container);
    const missing = protoClasses.filter((c) => !rendered.has(c));
    expect(
      missing,
      `body classes present in blog-category.html but not rendered: ${missing.join(', ')}`
    ).toEqual([]);
  });

  it('renders exactly one <h1>, matching the prototype text, and all 6 real local-seo posts', async () => {
    const protoH1 = protoMain.querySelectorAll('h1');
    expect(protoH1.length).toBe(1);
    expect(protoH1[0].textContent!.trim()).toBe('Showing up in local search');

    const posts = await getBlogPosts();
    const expectedCount = posts.filter((p) => categoryOf(p) === TOPIC).length;
    expect(expectedCount).toBe(6);

    const container = await renderPage(TOPIC);
    const renderedH1 = container.querySelectorAll('h1');
    expect(renderedH1.length, 'more than one <h1> rendered').toBe(1);
    expect(renderedH1[0].textContent!.trim()).toBe('Showing up in local search');
    expect(container.querySelectorAll('.svcs .svc').length).toBe(6);
  });

  it('renders exactly 6 other-topic rows (never itself), each linking to a real /blog/category/<slug>', async () => {
    const container = await renderPage(TOPIC);
    const rows = [...container.querySelectorAll('.work .row')];
    expect(rows.length).toBe(6);
    const hrefs = rows.map((r) => r.getAttribute('href'));
    expect(hrefs).not.toContain(`/blog/category/${TOPIC}`);
    for (const href of hrefs) {
      expect(href, 'a .row has no href').toBeTruthy();
      expect(
        href!.startsWith('/blog/category/'),
        `${href} does not point at /blog/category/<slug>`
      ).toBe(true);
    }
    expect(new Set(hrefs).size, 'duplicate row hrefs').toBe(hrefs.length);
  });

  it('renders no forbidden price figures', async () => {
    const container = await renderPage(TOPIC);
    forbiddenPriceCheck(container.textContent ?? '');
  });

  it('the real prototype itself never uses £995 or £59 either (fixture sanity)', () => {
    forbiddenPriceCheck(protoMain.textContent ?? '');
  });

  it('the route metadata carries exactly one description, with no forbidden price figures', async () => {
    const metadata = await generateBlogCategoryMetadata({
      params: Promise.resolve({ slug: TOPIC }),
    });
    expect(typeof metadata.description).toBe('string');
    expect((metadata.description as string).length).toBeGreaterThan(0);
    forbiddenPriceCheck(metadata.description as string);
  });
});

describe('/blog/category/[slug] renders all 7 real topics without error', () => {
  it('every real category slug renders with exactly one <h1> and no forbidden prices', async () => {
    for (const topic of TOPIC_ORDER) {
      const element = await BlogCategoryRoute({ params: Promise.resolve({ slug: topic }) });
      const { container, unmount } = render(element);

      expect(container.querySelectorAll('h1').length, `${topic}: expected exactly one <h1>`).toBe(
        1
      );
      forbiddenPriceCheck(container.textContent ?? '');
      unmount();
    }
  });
});
