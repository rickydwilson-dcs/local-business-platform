/**
 * Terms and Conditions Page
 *
 * TODO: Draft content pending Ricky's legal review — not reviewed by a solicitor.
 * Commercial terms reflect the pricing model and FAQ data in home-data.ts.
 *
 * Restyled for the r9 inner-pages port (Phase 3c) onto the shared
 * `LegalHero`/`LegalDocument` template — see
 * `output/sessions/2026-09/2026-09-15_dcs-inner-pages-design/prototype/legal.html`
 * and `notes-h.md` for the approved design and its provenance.
 *
 * This is a RESTYLE, not a rewrite: every clause below is the same
 * commercial terms text this file already shipped, in the same order,
 * under the same section ids. This was the one of the three legal pages
 * that did NOT already use `LegalHero`/`LegalToc` — it hand-rolled a
 * `Breadcrumbs` component, an `h1.heading-hero` and a bordered "Contents"
 * box with its own nine-item `<ol>`. All of that is now the shared
 * template; unifying it onto the same pattern as the other two documents
 * is most of the point of this port. Two structural re-markings, both
 * documented in `notes-h.md` §5.3 as presentational, not content, changes:
 *   - §1 and §9's contact/provider blocks move from a Tailwind card to
 *     `.mast__meta` (the same stacked value-over-label item Privacy §1
 *     reuses), matching the approved design.
 *   - The closing note (previously an unlabelled bordered panel) becomes
 *     `.prose hr` + a paragraph — an unnumbered closing remark after
 *     clause 9, with no TOC entry, exactly as in the source.
 * §2's four pricing tiers are deliberately NOT tabulated — building a table
 * means splitting the price strings into cells, and those are contract
 * terms (`notes-h.md` §5.3). They stay as `<h3>` + two lines, verbatim.
 * Headings are sentence-cased per the approved design's site-wide case rule
 * (`notes-c.md` §15); proper nouns, initialisms and the four defined tier
 * names (Starter, Professional, Growth, eCommerce) keep their capitals. No
 * word of the commercial terms themselves was changed.
 */

import type { Metadata } from 'next';
import { siteConfig } from '@/site.config';
import { PHONE_DISPLAY, BUSINESS_EMAIL, formatAddressSingleLine } from '@/lib/contact-info';
import { absUrl } from '@/lib/site';
import { LegalHero } from '@/components/legal/legal-hero';
import { LegalDocument } from '@/components/legal/legal-document';
import { type LegalTocItem } from '@/components/legal/legal-toc';

export const metadata: Metadata = {
  title: `Terms and Conditions | ${siteConfig.business.name}`,
  description: `Terms and conditions for ${siteConfig.business.name}. Understand our service terms, pricing models, and your rights.`,
  alternates: {
    canonical: absUrl('/terms-and-conditions'),
  },
};

const TOC_ITEMS: LegalTocItem[] = [
  { id: 'services-overview', label: 'Services overview' },
  { id: 'quotes-and-pricing', label: 'Quotes and pricing' },
  { id: 'payment', label: 'Payment terms' },
  { id: 'ownership', label: 'Ownership and intellectual property' },
  { id: 'hosting-support', label: 'Hosting and support' },
  { id: 'cancellation', label: 'Cancellation and termination' },
  { id: 'liability', label: 'Limitation of liability' },
  { id: 'governing-law', label: 'Governing law' },
  { id: 'contact', label: 'Contact and disputes' },
];

const OTHER_DOCS = [
  {
    href: '/privacy-policy',
    name: 'Privacy policy',
    description: 'What personal data I hold, why, how long for, and your rights over it.',
  },
  {
    href: '/cookie-policy',
    name: 'Cookie policy',
    description: 'What gets set on your device, why, and how to turn it off.',
  },
];

export default function TermsAndConditionsPage() {
  /*
   * The date this document's TEXT last changed — authored by hand, deliberately.
   *
   * This was `new Date().toLocaleDateString(...)`, which is evaluated at BUILD
   * time. Because these pages are statically generated, every deploy restamped
   * all three legal documents as "last updated" that day, whether or not a word
   * had changed — so the date was guaranteed to be wrong except by coincidence,
   * and on a privacy policy a false revision date is misleading rather than
   * merely untidy.
   *
   * 23 August 2026 is when this file's content last changed in git history.
   * UPDATE THIS BY HAND whenever the wording below actually changes.
   */
  const lastUpdated = '23 August 2026';

  return (
    <div className="font-body">
      <LegalHero
        title="Terms and conditions"
        current="Terms and conditions"
        metaItems={[
          { value: lastUpdated, label: 'Last updated' },
          { value: 'Nine sections', label: 'In this document' },
          { value: 'England & Wales', label: 'Governing law' },
        ]}
      />

      <LegalDocument tocItems={TOC_ITEMS} otherDocs={OTHER_DOCS}>
        <h2 className="res" id="services-overview">
          1. Services overview
        </h2>
        <p>
          {siteConfig.business.legalName} (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;, or
          &quot;Ricky&quot;) provides website design, build, eCommerce solutions, local SEO, ongoing
          management, analytics reporting, and business email services to small businesses and
          service providers.
        </p>
        <p>
          Our services include custom design, content creation, website hosting, security, updates,
          maintenance, and ongoing support. All work is tailored to your business and delivered
          without templates or builder interfaces.
        </p>
        <div className="mast__meta">
          <div>
            <b>{siteConfig.business.legalName}</b>
            <span>Service provider</span>
          </div>
          <div>
            <b>{formatAddressSingleLine()}</b>
            <span>Address</span>
          </div>
          <div>
            <b>{PHONE_DISPLAY}</b>
            <span>Phone</span>
          </div>
          <div>
            <b>
              <a href={`mailto:${BUSINESS_EMAIL}`}>{BUSINESS_EMAIL}</a>
            </b>
            <span>Email</span>
          </div>
        </div>

        <h2 className="res" id="quotes-and-pricing">
          2. Quotes and pricing
        </h2>
        <p>
          Quotes are provided in writing and remain valid for 30 days from the date of issue. Prices
          are based on the project scope outlined in the quote.
        </p>
        <p>Our standard pricing tiers are:</p>
        <h3>Starter</h3>
        <p>
          Up to 5 pages
          <br />
          Upfront: £750 + £10/month | Monthly: £45/month with 24-month minimum term
        </p>
        <h3>Professional</h3>
        <p>
          Up to 20 pages
          <br />
          Upfront: £1,495 + £15/month | Monthly: £85/month with 24-month minimum term
        </p>
        <h3>Growth</h3>
        <p>
          Up to 100 pages
          <br />
          Upfront: £2,995 + £25/month | Monthly: £150/month with 24-month minimum term
        </p>
        <h3>eCommerce</h3>
        <p>
          Online store
          <br />
          From £2,995 upfront + £50/month (upfront model only)
        </p>
        <p>
          Prices may be adjusted for scope changes, additional features, or custom requirements. Any
          changes will be quoted in writing before proceeding.
        </p>

        <h2 className="res" id="payment">
          3. Payment terms
        </h2>
        <p>We offer two payment models: upfront and pay-monthly.</p>
        <h3>Upfront model</h3>
        <ul>
          <li>Full upfront payment is due before work begins</li>
          <li>Monthly hosting fee is due at the start of each month</li>
          <li>No long-term commitment beyond the monthly hosting fee</li>
          <li>Includes all design, build, content, and setup work</li>
        </ul>
        <h3>Pay-monthly model</h3>
        <ul>
          <li>Monthly payment is due at the start of each month</li>
          <li>Includes all design, build, content, setup, and ongoing hosting</li>
          <li>24-month minimum term after which the agreement rolls monthly</li>
          <li>Payment can be made by bank transfer or card</li>
        </ul>
        <p>
          Late payments may result in suspension of hosting and support services. We reserve the
          right to pursue recovery of unpaid invoices.
        </p>

        <h2 className="res" id="ownership">
          4. Ownership and intellectual property
        </h2>
        <h3>Upfront payment model</h3>
        <p>
          You own your website outright upon payment. This includes all content, design, and the
          ability to transfer or modify the site as you choose.
        </p>
        <h3>Pay-monthly model</h3>
        <p>
          You own all content you provide or that we create for you. The website platform, design
          system, and our proprietary code remain our property. Upon cancellation after your minimum
          term, the hosting arrangement can transfer to you, allowing you to take your content and
          continue the site elsewhere if desired.
        </p>
        <p>
          We retain intellectual property rights to our processes, methodologies, and design
          patterns used in delivering our services.
        </p>

        <h2 className="res" id="hosting-support">
          5. Hosting and support
        </h2>
        <p>Your website is hosted on fast UK-based servers with the following included:</p>
        <ul>
          <li>SSL certificate for secure browsing (HTTPS)</li>
          <li>Domain renewal and management</li>
          <li>Security monitoring and uptime alerts</li>
          <li>Regular security updates and patches</li>
          <li>Ongoing backups and data protection</li>
          <li>Technical support and maintenance</li>
        </ul>
        <p>
          For pay-monthly clients, support and changes are handled directly — you contact us with
          requests and we implement them. There is no CMS, dashboard, or portal to manage.
        </p>
        <p>
          We aim to maintain 99% uptime. In the event of downtime, we will work to restore service
          as quickly as possible. We are not liable for losses resulting from temporary
          unavailability beyond our reasonable control.
        </p>

        <h2 className="res" id="cancellation">
          6. Cancellation and termination
        </h2>
        <h3>Upfront model</h3>
        <p>
          No long-term commitment is required. You may cancel at any time by providing 30
          days&rsquo; written notice, after which your hosting will cease.
        </p>
        <h3>Pay-monthly model</h3>
        <p>
          The initial 24-month term is mandatory. After the minimum term expires, you may cancel by
          providing 30 days&rsquo; written notice. During the notice period, your website continues
          to operate normally.
        </p>
        <p>
          Upon cancellation, we will export all your content in standard formats so you can take it
          elsewhere if desired. No data is deleted or withheld.
        </p>
        <h3>Our cancellation rights</h3>
        <p>
          We reserve the right to cancel services if payment is overdue by more than 30 days, or if
          you violate these terms. We will provide 14 days&rsquo; written notice in such cases.
        </p>

        <h2 className="res" id="liability">
          7. Limitation of liability
        </h2>
        <p>
          To the extent permitted by law, our liability for any claim arising from these terms or
          our services is limited to the total fees you have paid to us in the preceding 12 months.
        </p>
        <p>We are not liable for:</p>
        <ul>
          <li>Loss of profit, revenue, or data</li>
          <li>Indirect, incidental, or consequential damages</li>
          <li>Downtime caused by factors beyond our control</li>
          <li>Damages from third-party actions or services</li>
        </ul>
        <p>
          You agree to indemnify us against any claims arising from content you provide, your use of
          the website, or violation of these terms.
        </p>

        <h2 className="res" id="governing-law">
          8. Governing law
        </h2>
        <p>
          These terms and conditions are governed by and construed in accordance with the laws of
          England and Wales. You agree to submit to the exclusive jurisdiction of the courts of
          England and Wales for any disputes arising from or relating to these terms or our
          services.
        </p>

        <h2 className="res" id="contact">
          9. Contact and disputes
        </h2>
        <p>
          If you have questions about these terms or wish to raise a dispute, please contact us:
        </p>
        <div className="mast__meta">
          <div>
            <b>
              <a href={`mailto:${BUSINESS_EMAIL}`}>{BUSINESS_EMAIL}</a>
            </b>
            <span>Email</span>
          </div>
          <div>
            <b>{PHONE_DISPLAY}</b>
            <span>Phone</span>
          </div>
          <div>
            <b>{formatAddressSingleLine()}</b>
            <span>Address</span>
          </div>
        </div>
        <p>
          We will attempt to resolve disputes amicably. If a dispute cannot be resolved through
          direct communication, either party may pursue legal action in accordance with the
          governing law section above.
        </p>

        <hr />
        <p>
          <strong>Note:</strong> These terms and conditions reflect the standard services and
          pricing offered by {siteConfig.business.legalName}. They are provided as a guide and
          represent the commercial terms under which we operate. For any clarification or to discuss
          specific arrangements, please contact us directly.
        </p>
      </LegalDocument>
    </div>
  );
}
