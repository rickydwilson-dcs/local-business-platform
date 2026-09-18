import type { Metadata } from 'next';
import Link from 'next/link';

import { Pricing } from '@/components/home/pricing';
import { absUrl } from '@/lib/site';

/**
 * `/pricing` — ported from
 * `output/sessions/2026-09/2026-09-15_dcs-inner-pages-design/prototype/pricing.html`.
 *
 * SECTION 2 ("The picker") is the homepage's own pricing panel, verbatim —
 * the prototype's own header comment is explicit about this: "SECTION 2 OF
 * THIS PAGE IS THE HOMEPAGE SECTION, VERBATIM. Same components, same TIERS
 * data...". `<Pricing/>` (`components/home/pricing.tsx`) is that one shared
 * component; it is not duplicated here. The only difference from the
 * homepage's call is `ctaHref` — the homepage's default (`#end`) points at
 * its own closing chapter, which this route does not have, so this page
 * points the CTA at the real contact route instead.
 *
 * Everything else on this page is the depth the homepage panel has no room
 * for and never claims to answer (sections 1, 3, 4, 5, 6 below) — see the
 * prototype's own header comment for the full rationale.
 *
 * PRICES ARE AUTHORED, NEVER COMPUTED. Every figure outside the shared
 * `<Pricing/>` component (the masthead stats, the "which way to pay" copy,
 * the comparison table) is a literal string transcribed from
 * `components/home/home-data.ts`'s `TIERS`, exactly as the prototype
 * authors it — never derived or animated. £750 / £45 and page counts
 * 5 / 20 / 100 throughout; never £995 / £59, never 20 / 50 (the old
 * pre-port page's figures, which this file replaces).
 *
 * VOICE: first-person singular throughout ("I", never "we"), matching the
 * prototype and the rest of the r9 port.
 *
 * WIRING NOTES (flagged in the Phase 2 report — the prototype's own hrefs
 * are all placeholder "#", since it is a standalone static file):
 *   - The shared `<Pricing/>` CTAs ("Get a free quote") point at
 *     `/contact` rather than a mailto, so a visitor lands on the real
 *     enquiry form rather than their mail client.
 *   - Section 6's extras rows point at `/contact` too — "tell me which ones
 *     you want" is the contact form's job.
 *   - The closing "I have written it out at length here" link points at
 *     `/blog/pay-monthly-vs-upfront-website`, the real post the prototype
 *     names in its own comments (`content/blog/pay-monthly-vs-upfront-website.mdx`).
 *     That route ships in Phase 3 of this brief; the link is correct once it
 *     lands.
 */

const TITLE = 'Pricing — Digital Consulting Services';
const DESCRIPTION =
  'Website pricing from £750 upfront or £45 a month. Four plans, everything included, no hidden fees. See exactly what you get before you ask for a quote.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  robots: { index: true, follow: true },
  alternates: {
    canonical: absUrl('/pricing'),
  },
};

function Check() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3 8.4 6.4 12 13 4.6"
        stroke="currentColor"
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const INCLUDED = [
  'Custom bespoke design',
  'Local SEO built in — service pages, location pages, Schema markup',
  'Mobile-first and fast',
  'Contact form with email notification',
  'Hosting, SSL certificate and domain management',
  'Ongoing support and monitoring',
  'Unlimited revision rounds during the build',
  'Google Search Console submission',
];

const EXTRAS = [
  { name: 'Review capture widget', meta: 'Google and Trustpilot' },
  { name: 'SMS lead notification', meta: 'A text the moment an enquiry lands' },
  { name: 'Call tracking number', meta: 'Which channel drove the call' },
  { name: 'AI chatbot FAQ', meta: 'Common questions, answered 24/7' },
  { name: 'Booking calendar', meta: 'Customers book a slot directly' },
  { name: 'Google Business Profile setup', meta: 'Created and optimised for local search' },
  { name: 'Google Ads management', meta: 'Campaigns managed monthly' },
];

const FAQS = [
  {
    question: 'Do I own my website?',
    answer:
      'Yes, if you paid upfront. Pay-monthly clients own all their content; the hosting arrangement transfers to you if you cancel after your minimum term.',
  },
  {
    question: 'What happens if I want to cancel?',
    answer:
      "Give me 30 days' notice after your minimum term and I'll export all your content so you can take it elsewhere. No fuss.",
  },
  {
    question: 'Can I upgrade my plan later?',
    answer:
      "Yes, you can upgrade at any time. I'll quote for the additional pages and work out the most cost-effective route for you.",
  },
  {
    question: 'Is there a contract?',
    answer:
      'Pay-monthly has a 24-month minimum term, after which it rolls monthly. Upfront clients have no ongoing commitment beyond the monthly hosting fee.',
  },
  {
    question: 'What’s included in “managed hosting”?',
    answer:
      'Hosting on fast UK servers, SSL certificate, domain renewal, security monitoring, and uptime alerts — all managed by me.',
  },
];

export default function PricingPage() {
  return (
    <>
      {/* ===== 1. Breadcrumb + masthead — ink ================================ */}
      <div className="crumb p--ink" data-ground="ink">
        <nav aria-label="Breadcrumb">
          <ol>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <span aria-current="page">Pricing</span>
            </li>
          </ol>
        </nav>
      </div>

      <header className="mast p--ink" data-ground="ink">
        <p className="eyeless">Pricing</p>
        <h1>What a website costs.</h1>
        <p className="lead">
          Four plans, two ways to pay, and the same things included in every one of them. If none of
          them quite fit, tell me what you need and I&rsquo;ll price it properly.
        </p>
        <div className="mast__meta">
          <div>
            <b>&pound;750</b>
            <span>Upfront, from</span>
          </div>
          <div>
            <b>&pound;45/month</b>
            <span>Pay monthly, from</span>
          </div>
          <div>
            <b>24 months</b>
            <span>Pay-monthly minimum term</span>
          </div>
          <div>
            <b>Nothing hidden</b>
            <span>Hosting, SSL and support included</span>
          </div>
        </div>
      </header>

      {/* ===== 2. The picker — white. The homepage section, verbatim. ======== */}
      <section className="sec p--white" data-ground="white" id="plans">
        <p className="eyeless">The plans</p>
        <h2 className="res">Four plans. Two ways to pay.</h2>
        <p className="lead">
          Pick a plan to see what is in it. Every plan can be paid either way except the online
          store, which is upfront only.
        </p>
        <Pricing ctaHref="/contact" />
      </section>

      {/* ===== 3. Which way to pay — ink ====================================== */}
      <section className="sec p--ink" data-ground="ink">
        <p className="eyeless">Which way to pay</p>
        <h2 className="res">Which one suits you.</h2>
        <p className="lead">
          There is no catch in either one &mdash; they just suit different situations. Here is the
          honest version of both, including the part that doesn&rsquo;t flatter them.
        </p>

        <div className="twoup">
          <div>
            <h3>Pay upfront</h3>
            <p className="twoup__p">
              You pay for the build once and own what has been built. After that there is a small
              monthly fee for hosting, SSL, the domain and security monitoring &mdash; &pound;10 a
              month on Starter, up to &pound;50 on an online store.
            </p>
            <div className="detail__l">
              <div>
                <Check />
                <span>
                  You own the site outright. Nobody can take it away or raise the price on you.
                </span>
              </div>
              <div>
                <Check />
                <span>No ongoing commitment beyond the monthly hosting fee.</span>
              </div>
              <div>
                <Check />
                <span>You can move it elsewhere whenever you want to.</span>
              </div>
            </div>
            <div className="trade">
              <p className="eyeless">And the trade-off</p>
              <p>
                It is a lump sum. For a business that is still getting going, &pound;750 to
                &pound;2,995 is money that could go on tools, a van or advertising instead. The
                usual catch with an upfront build elsewhere is that hosting, updates and support are
                then extra, or left to you &mdash; here they are the &pound;10 to &pound;50 a month
                that follows, and nothing else.
              </p>
            </div>
          </div>

          <div>
            <h3>Pay monthly</h3>
            <p className="twoup__p">
              Nothing upfront. One predictable fee covers the design, the build, the hosting, the
              support and the changes &mdash; &pound;45, &pound;85 or &pound;150 a month depending
              on the plan, on a 24-month minimum term.
            </p>
            <div className="detail__l">
              <div>
                <Check />
                <span>No lump sum. The barrier to starting is one month&rsquo;s fee.</span>
              </div>
              <div>
                <Check />
                <span>
                  Everything is included, so there are no separate bills to be surprised by.
                </span>
              </div>
              <div>
                <Check />
                <span>If it breaks it is my problem to fix, not yours.</span>
              </div>
            </div>
            <div className="trade">
              <p className="eyeless">And the trade-off</p>
              <p>
                You do not own it while you are paying for it. If you stop paying, the site goes
                with the subscription &mdash; your content is still yours, and I will export it, but
                the site itself is not.
              </p>
            </div>
          </div>
        </div>

        <div className="trade" style={{ marginTop: 'clamp(56px,8vh,96px)' }}>
          <p className="eyeless">The short version</p>
          <p className="lead" style={{ maxWidth: '62ch' }}>
            If you can put the lump sum down without it hurting your cash flow, pay upfront. If you
            would rather keep hold of the cash and have the whole thing handled for you, pay
            monthly. Both prices are on this page &mdash; work it out whichever way suits you. Still
            weighing it up?{' '}
            <Link
              href="/blog/pay-monthly-vs-upfront-website"
              style={{ borderBottom: '1.5px solid rgba(0,210,216,.5)' }}
            >
              I have written it out at length here
            </Link>{' '}
            &mdash; both options, no thumb on the scale.
          </p>
        </div>
      </section>

      {/* ===== 4. What's in every plan + what changes — white ================= */}
      <section className="sec p--white" data-ground="white">
        <p className="eyeless">What&rsquo;s included</p>
        <h2 className="res">In every plan, including the cheapest one.</h2>
        <p className="lead">
          Whichever plan you choose, and whichever way you pay, all of this comes with it. Nothing
          here is an upgrade or an add-on.
        </p>
        <div className="detail__l detail__l--2">
          {INCLUDED.map((item) => (
            <div key={item}>
              <Check />
              <span>{item}</span>
            </div>
          ))}
        </div>

        <h2 className="res" style={{ marginTop: 'clamp(74px,9vh,120px)' }}>
          All four, side by side.
        </h2>
        <p className="lead">
          Everything that changes between the plans, in one place. An online store is the only one
          that can&rsquo;t be paid monthly.
        </p>

        <div className="cscroll">
          <table className="ctable">
            <thead>
              <tr>
                <th scope="col">
                  <span className="eyeless">Plan</span>
                </th>
                <th scope="col">
                  Starter
                  <span className="tier__s">Up to 5 pages</span>
                </th>
                <th scope="col" data-rec="">
                  Professional
                  <span className="tier__s">Most land here</span>
                </th>
                <th scope="col">
                  Growth
                  <span className="tier__s">Up to 100 pages</span>
                </th>
                <th scope="col">
                  eCommerce
                  <span className="tier__s">Online store</span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row" className="eyeless">
                  Pages
                </th>
                <td>Up to 5</td>
                <td data-rec="">Up to 20</td>
                <td>Up to 100</td>
                <td>Online store</td>
              </tr>
              <tr>
                <th scope="row" className="eyeless">
                  Pay upfront
                </th>
                <td>
                  <span className="tier__f">
                    &pound;750
                    <small>then &pound;10/mo</small>
                  </span>
                </td>
                <td data-rec="">
                  <span className="tier__f">
                    &pound;1,495
                    <small>then &pound;15/mo</small>
                  </span>
                </td>
                <td>
                  <span className="tier__f">
                    &pound;2,995
                    <small>then &pound;25/mo</small>
                  </span>
                </td>
                <td>
                  <span className="tier__f">
                    From &pound;2,995
                    <small>then &pound;50/mo</small>
                  </span>
                </td>
              </tr>
              <tr>
                <th scope="row" className="eyeless">
                  Pay monthly
                </th>
                <td>
                  <span className="tier__f">
                    &pound;45
                    <small>per month</small>
                  </span>
                </td>
                <td data-rec="">
                  <span className="tier__f">
                    &pound;85
                    <small>per month</small>
                  </span>
                </td>
                <td>
                  <span className="tier__f">
                    &pound;150
                    <small>per month</small>
                  </span>
                </td>
                <td className="na">Not available &mdash; upfront only</td>
              </tr>
              <tr>
                <th scope="row" className="eyeless">
                  What you get
                </th>
                <td>
                  <ul>
                    <li>Bespoke design &mdash; no template</li>
                    <li>Local SEO built in</li>
                    <li>Hosting, SSL and security</li>
                  </ul>
                </td>
                <td data-rec="">
                  <ul>
                    <li>Everything in Starter, plus:</li>
                    <li>Service and location pages</li>
                    <li>Monthly plain-English reporting</li>
                  </ul>
                </td>
                <td>
                  <ul>
                    <li>Everything in Professional, plus:</li>
                    <li>Every service in every town</li>
                    <li>Priority support</li>
                  </ul>
                </td>
                <td>
                  <ul>
                    <li>Store built and products loaded</li>
                    <li>Payments and delivery set up</li>
                    <li>Stock and orders handled</li>
                  </ul>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ===== 5. Questions — magenta ========================================= */}
      <section className="sec p--magenta" data-ground="magenta">
        <div className="measure">
          <p className="eyeless">Questions</p>
          <h2 className="res">The ones people actually ask.</h2>
          <div className="qa">
            {FAQS.map((faq) => (
              <details key={faq.question}>
                <summary>{faq.question}</summary>
                <div className="qa__a">
                  <div>
                    <p>{faq.answer}</p>
                  </div>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 6. Extras — aqua =============================================== */}
      <section className="sec p--aqua" data-ground="aqua">
        <p className="eyeless">Extras</p>
        <h2 className="res">And the things you can bolt on.</h2>
        <p className="lead">
          None of these are in the plan prices and none of them have a list price. Tell me which
          ones you want and I&rsquo;ll quote for them with the build.
        </p>
        <div className="work">
          {EXTRAS.map((extra) => (
            <Link key={extra.name} className="row" href="/contact">
              <span className="row__n">{extra.name}</span>
              <span className="row__m">{extra.meta}</span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
