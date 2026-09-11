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
              className={`m-0 text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-brand-primary-hover ${textShadowSoft}`}
            >
              Enquiries &nbsp;&middot;&nbsp; {ADDRESS.locality}, {ADDRESS.region}
            </p>
            <h1
              id="contact-h"
              className={`mt-[0.85rem] max-w-[14ch] font-serif text-[clamp(2rem,4.6vw,4rem)] font-light leading-[0.98] tracking-[-0.034em] text-surface-foreground ${textShadowStrong}`}
            >
              Tell us about the car.
            </h1>
            <p
              className={`mt-[0.85rem] max-w-[23em] font-serif text-[clamp(1.25rem,1.4vw+0.9rem,1.875rem)] font-light leading-[1.45] text-[#D6D1C8] ${textShadowSoft}`}
            >
              David would rather see it than quote from photographs of one, so most enquiries end
              with a date to bring it in.
            </p>

            <div className="mt-[clamp(2.5rem,6vh,4rem)] grid grid-cols-1 gap-0 border-t border-surface-card-border min-[60rem]:grid-cols-3 min-[60rem]:gap-x-[clamp(2rem,4vw,4rem)]">
              <a
                href={`tel:${PHONE_TEL}`}
                className={`block border-b border-surface-card-border py-[1.15rem] font-serif text-[clamp(1.1875rem,2vw,1.625rem)] font-light text-surface-foreground no-underline transition-colors duration-300 hover:text-brand-primary-hover min-[60rem]:border-b-0 ${textShadowSoft}`}
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
                className={`block border-b border-surface-card-border py-[1.15rem] font-serif text-[clamp(1.1875rem,2vw,1.625rem)] font-light text-surface-foreground no-underline transition-colors duration-300 hover:text-brand-primary-hover min-[60rem]:border-b-0 ${textShadowSoft}`}
              >
                <small
                  className={`mb-[0.4rem] block text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-surface-muted-foreground ${textShadowSoft}`}
                >
                  Email
                </small>
                {BUSINESS_EMAIL}
              </a>
              <p
                className={`m-0 border-b border-surface-card-border py-[1.15rem] font-serif text-[clamp(1.1875rem,2vw,1.625rem)] font-light text-surface-foreground min-[60rem]:border-b-0 ${textShadowSoft}`}
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
              <p className="m-0 text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-brand-primary-hover">
                Enquiry
              </p>
              <h2 className="mt-[0.3rem] font-serif text-[clamp(1.375rem,2.1vw,1.9375rem)] font-light leading-[1.08] text-surface-foreground">
                A few details, and we&rsquo;ll call you back.
              </h2>
            </div>

            <ContactForm
              services={siteConfig.services}
              serviceAreas={siteConfig.serviceAreas}
              darkMode
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
