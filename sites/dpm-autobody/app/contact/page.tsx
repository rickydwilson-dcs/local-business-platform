/**
 * Contact Page
 *
 * Server Component with metadata, canonical URL, and structured data. The interactive form
 * is the shared `ContactForm` client component (`@platform/core-components`) — it is genuinely
 * wired to `app/api/contact/route.ts`, unlike the static prototype's mocked
 * `onsubmit="return false"` form. `site.config.ts`'s `features.contactForm` flag stays `false`
 * here (not yet confirmed ready to go live) — this page doesn't read or gate on that flag.
 *
 * Visual design ported from the approved static prototype (near-black "Register" direction):
 * output/sessions/2026-08/2026-08-26_dpm-autobody-discovery/prototype/client/contact.html
 * — the full-bleed photographic hero (`.contact`/`.contact__inner`, ~L1416-1433) and the
 * enquiry panel shell below it (`.contact-form`/`.enquiry`, ~L1435-1485). The real header/footer
 * chrome (masthead, footer colophon) was ported in a prior phase via `app/layout.tsx` and isn't
 * touched here.
 */

import type { Metadata } from 'next';
import Image from 'next/image';
import { siteConfig } from '@/site.config';
import { PHONE_DISPLAY, PHONE_TEL, BUSINESS_EMAIL, ADDRESS } from '@/lib/contact-info';
import { absUrl } from '@/lib/site';
import { Schema, ContactForm } from '@platform/core-components';

export const metadata: Metadata = {
  title: `Contact Us | ${siteConfig.business.name}`,
  description:
    'Get in touch with DPM Autobody — concours restoration and paintwork, Berwick, East Sussex. By appointment.',
  alternates: {
    canonical: absUrl('/contact'),
  },
};

// Same approved Instagram photography album already used for the P1800 Candy build
// (content/builds/p1800-candy.mdx uses slide-01.jpg from this album) — slide-04.jpg is the
// prototype's own choice for this page's hero.
const HERO_IMAGE =
  'https://pub-a159d5c51e44442897e06986a53dda1d.r2.dev/prototypes/2026-08-26_dpm-autobody-discovery/assets/dpm-instagram/DU2rgo5DXqC/web/slide-04.jpg';

const textShadowSoft = '[text-shadow:0_1px_24px_rgba(11,11,12,0.92),0_1px_4px_rgba(11,11,12,0.7)]';
const textShadowStrong =
  '[text-shadow:0_1px_28px_rgba(11,11,12,0.94),0_1px_4px_rgba(11,11,12,0.7)]';

/**
 * Restyles the shared `ContactForm` (`@platform/core-components`) toward the approved
 * prototype's underline-field / micro-caps-label / compact-button language (reference:
 * contact.html's `.field input/select/textarea`, `.field label`, `.enquiry__submit`).
 *
 * The component's only visual override surface for the "standard" variant is a single
 * `className` applied to the outer `<form>` element — there are no per-field, per-label,
 * or per-button className props (see `packages/core-components/src/components/ui/
 * contact-form/index.tsx`, the `standard` branch). Everything below is therefore a
 * wrapper-level arbitrary-descendant override (`[&_input]:`, `[&_label]:`, etc.), which is
 * the documented escape hatch for this exact situation. Cannot be done any other way without
 * forking the shared component — out of scope for this site-specific page.
 *
 * Known gaps this can't close from outside the component:
 * - The two-column field grid uses a fixed `gap-6` (1.5rem) inside the component; the
 *   prototype uses 0.9rem. A blanket `[&_.grid]:gap-*` override would risk catching an
 *   unrelated nested grid, so left as-is.
 * - The required-field marker is still a literal `*` character (the prototype's fields
 *   carry no asterisks at all) — recoloured to the neutral ink token below so it stops
 *   reading as an alarm-red validation error, but the character itself can't be removed
 *   without a component change.
 */
const contactFormOverrideClassName = [
  // Labels: micro-caps, matching the eyebrow style used elsewhere on this page.
  '[&_label]:!text-[0.6875rem] [&_label]:!font-medium [&_label]:!uppercase',
  '[&_label]:!tracking-[0.16em] [&_label]:!text-surface-muted-foreground',
  // Required-marker asterisk: neutral ink instead of brand-primary red.
  '[&_label_span]:!text-ink-neutral',
  // Fields: underline-only, transparent, square corners — border colour matches this
  // section's data-accent override (house/house-ink, i.e. `ink-neutral`), not the car-red
  // used on individual build pages.
  '[&_input]:!rounded-none [&_input]:!border-0 [&_input]:!border-b [&_input]:!border-surface-card-border [&_input]:!bg-transparent [&_input]:!px-0 [&_input]:!py-2',
  '[&_select]:!rounded-none [&_select]:!border-0 [&_select]:!border-b [&_select]:!border-surface-card-border [&_select]:!bg-transparent [&_select]:!appearance-none [&_select]:!px-0 [&_select]:!py-2',
  '[&_textarea]:!rounded-none [&_textarea]:!border-0 [&_textarea]:!border-b [&_textarea]:!border-surface-card-border [&_textarea]:!bg-transparent [&_textarea]:!px-0 [&_textarea]:!py-2',
  '[&_input:focus]:!ring-0 [&_input:focus]:!border-ink-neutral',
  '[&_select:focus]:!ring-0 [&_select:focus]:!border-ink-neutral',
  '[&_textarea:focus]:!ring-0 [&_textarea:focus]:!border-ink-neutral',
  // Note: the component's own error state applies a literal `border-error` class, which
  // the theme-system Tailwind plugin never defines as a border-color utility (it only
  // emits `.text-error`/`.bg-error`, and separately extends `colors.semantic.error` —
  // neither produces a top-level `border-error` utility) — so error inputs already render
  // with no red border colour independent of this override. Pre-existing gap in
  // `packages/core-components`, out of scope to fix here.
  // Submit button: hard-edged, uppercase, compact block (not full-width) — reference
  // resolves `.enquiry__submit`'s `background: var(--accent)` to house-stone
  // (`brand-secondary`, #C7BBA1) with dark/near-black text on this page's data-accent
  // override, NOT the car-red brand-primary the component defaults to.
  '[&_button[type=submit]]:!w-auto [&_button[type=submit]]:!inline-flex [&_button[type=submit]]:!items-center [&_button[type=submit]]:!justify-center',
  '[&_button[type=submit]]:!min-h-[48px] [&_button[type=submit]]:!h-auto [&_button[type=submit]]:!py-0 [&_button[type=submit]]:!px-[1.75rem]',
  '[&_button[type=submit]]:!rounded-none [&_button[type=submit]]:!text-xs [&_button[type=submit]]:!uppercase [&_button[type=submit]]:!tracking-[0.18em] [&_button[type=submit]]:!font-sans [&_button[type=submit]]:!font-semibold',
  '[&_button[type=submit]]:!bg-brand-secondary [&_button[type=submit]]:!text-surface-background [&_button[type=submit]]:hover:!opacity-90',
].join(' ');

export default function ContactPage() {
  return (
    <>
      <div className="bg-surface-background">
        {/* ============ Hero — photograph, headline, quick contact rows ============ */}
        <section
          id="top"
          aria-labelledby="contact-h"
          className="relative flex min-h-[100lvh] flex-col justify-end overflow-clip"
        >
          <div className="absolute inset-0">
            <Image
              src={HERO_IMAGE}
              alt=""
              fill
              priority
              sizes="100vw"
              className="scale-[1.08] object-cover object-[62%_46%] brightness-[1.14] saturate-[1.06]"
            />
          </div>
          {/* Two-veil legibility wash — vertical + horizontal, matching the prototype's
              .contact__plate::after exactly (dark enough on the left for the copy, clearing
              toward the right so the car still reads). */}
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(11,11,12,0.42)_0%,rgba(11,11,12,0.18)_40%,rgba(11,11,12,0.55)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(11,11,12,0.88)_0%,rgba(11,11,12,0.68)_36%,rgba(11,11,12,0.26)_66%,rgba(11,11,12,0.04)_100%)]" />

          <div className="relative z-[2] mx-auto w-[min(1360px,100%-3rem)] pb-[clamp(4rem,10vh,6rem)] pt-[clamp(7rem,18vh,12rem)]">
            <p
              className={`m-0 text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-ink-neutral ${textShadowSoft}`}
            >
              Enquiries &nbsp;&middot;&nbsp; {ADDRESS.locality}, {ADDRESS.region}
            </p>
            <h1
              id="contact-h"
              className={`mt-[0.85rem] max-w-[14ch] font-heading text-[clamp(2rem,4.6vw,4rem)] font-light leading-[0.98] tracking-[-0.034em] text-surface-foreground ${textShadowStrong}`}
            >
              Tell us about the car.
            </h1>
            <p
              className={`mt-[0.85rem] max-w-[23em] font-prose text-[clamp(1.25rem,1.4vw+0.9rem,1.875rem)] font-extralight leading-[1.45] text-[#D6D1C8] ${textShadowSoft}`}
            >
              David would rather see it than quote from photographs of one, so most enquiries end
              with a date to bring it in.
            </p>

            <div className="mt-[clamp(2.5rem,6vh,4rem)] grid grid-cols-1 gap-0 border-t border-surface-card-border min-[960px]:grid-cols-3 min-[960px]:gap-x-[clamp(2rem,4vw,4rem)]">
              <a
                href={`tel:${PHONE_TEL}`}
                className={`block border-b border-surface-card-border py-[1.15rem] font-prose text-[clamp(1.1875rem,2vw,1.625rem)] font-light text-surface-foreground no-underline transition-colors duration-300 hover:text-brand-primary-hover min-[960px]:border-b-0 ${textShadowSoft}`}
              >
                <small
                  className={`mb-[0.4rem] block text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-surface-muted-foreground ${textShadowSoft}`}
                >
                  Telephone
                </small>
                {PHONE_DISPLAY}
              </a>
              <a
                href={`mailto:${BUSINESS_EMAIL}`}
                className={`block border-b border-surface-card-border py-[1.15rem] font-prose text-[clamp(1.1875rem,2vw,1.625rem)] font-light text-surface-foreground no-underline transition-colors duration-300 hover:text-brand-primary-hover min-[960px]:border-b-0 ${textShadowSoft}`}
              >
                <small
                  className={`mb-[0.4rem] block text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-surface-muted-foreground ${textShadowSoft}`}
                >
                  Email
                </small>
                {BUSINESS_EMAIL}
              </a>
              <p
                className={`m-0 border-b border-surface-card-border py-[1.15rem] font-prose text-[clamp(1.1875rem,2vw,1.625rem)] font-light text-surface-foreground min-[960px]:border-b-0 ${textShadowSoft}`}
              >
                <small
                  className={`mb-[0.4rem] block text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-surface-muted-foreground ${textShadowSoft}`}
                >
                  Workshop
                </small>
                {ADDRESS.locality}, {ADDRESS.region}
                <br />
                By appointment
              </p>
            </div>
          </div>
        </section>

        {/* ============ Enquiry form — real, functional ContactForm ============ */}
        <section className="mx-auto flex min-h-[100lvh] w-[min(1360px,100%-3rem)] flex-col justify-center py-[clamp(8rem,18vh,9.5rem)]">
          <div className="max-w-[34rem] border border-surface-card-border bg-surface-muted p-[clamp(1.25rem,3vw,1.75rem)]">
            <div className="mb-[clamp(0.85rem,2vh,1.25rem)]">
              <p className="m-0 text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-ink-neutral">
                Enquiry
              </p>
              <h2 className="mt-[0.3rem] font-heading text-[clamp(1.375rem,2.1vw,1.9375rem)] font-light leading-[1.08] tracking-[-0.034em] text-surface-foreground">
                A few details, and we&rsquo;ll call you back.
              </h2>
            </div>

            <ContactForm
              services={siteConfig.services}
              serviceAreas={siteConfig.serviceAreas}
              darkMode
              className={contactFormOverrideClassName}
            />
          </div>
        </section>
      </div>

      {/* Schema Markup */}
      <Schema
        org={{
          name: siteConfig.business.name,
          url: '/',
          logo: '/logo.svg',
        }}
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Contact', url: '/contact' },
        ]}
        webpage={{
          '@type': 'ContactPage',
          '@id': absUrl('/contact#contactpage'),
          url: absUrl('/contact'),
          name: `Contact ${siteConfig.business.name}`,
          description:
            'Get in touch with DPM Autobody — concours restoration and paintwork, Berwick, East Sussex.',
        }}
      />
    </>
  );
}
