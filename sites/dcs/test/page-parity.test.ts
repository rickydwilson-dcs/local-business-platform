import { describe, expect, it, vi } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { render } from '@testing-library/react';
import React from 'react';

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
