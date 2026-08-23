import { PageShell } from '@platform/core-components';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { siteConfig } from '@/site.config';
import { PHONE_DISPLAY, BUSINESS_EMAIL } from '@/lib/contact-info';

/**
 * The `(site)` route group carries the solaris `PageShell`/`SiteHeader`/
 * `SiteFooter` chrome for the 14 inner routes (about, blog, contact,
 * cookie-policy, locations, pricing, privacy-policy, projects, reviews,
 * services and their dynamic `[slug]` children). Route groups are
 * parenthesised so this segment does not appear in any URL.
 *
 * The homepage (`app/page.tsx`, outside this group) does not use this
 * layout — it carries its own r9 bar/menu/end-section furniture via
 * `HomeBody`/`HomeBehaviour` instead. See Phase 7 of
 * `output/sessions/2026-08/2026-08-23_dcs-homepage-nextjs-port/yolo-brief.md`.
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <PageShell
      header={
        <SiteHeader
          logoSrc="/logo.svg"
          logoAlt="DCS Gardening & Landscaping"
          logoText="DCS"
          navItems={siteConfig.navigation.main}
          ctaLabel={siteConfig.cta.primary.label}
          ctaHref={siteConfig.cta.primary.href}
          phone={PHONE_DISPLAY}
          showPhone={siteConfig.cta.phone.show}
        />
      }
      footer={
        <SiteFooter
          logoSrc="/logo.svg"
          logoAlt="DCS Gardening & Landscaping"
          logoText="DCS"
          tagline={siteConfig.tagline}
          copyright={siteConfig.footer.copyright}
          navColumns={[
            {
              heading: 'Services',
              links: siteConfig.services.map((s) => ({
                label: s.title,
                href: `/services/${s.slug}`,
              })),
            },
            {
              heading: 'Locations',
              links: ['Polegate', 'Eastbourne', 'Brighton', 'Hove', 'Lewes', 'Seaford'].map(
                (l) => ({
                  label: l,
                  href: `/locations/${l.toLowerCase()}`,
                })
              ),
            },
            {
              heading: 'Company',
              links: [
                { label: 'About', href: '/about' },
                { label: 'Portfolio', href: '/projects' },
                { label: 'Pricing', href: '/pricing' },
                { label: 'Blog', href: '/blog' },
                { label: 'Contact', href: '/contact' },
              ],
            },
          ]}
          contact={{
            phone: PHONE_DISPLAY,
            email: BUSINESS_EMAIL,
          }}
          legal={{ privacyHref: '/privacy-policy' }}
        />
      }
    >
      {children}
    </PageShell>
  );
}
