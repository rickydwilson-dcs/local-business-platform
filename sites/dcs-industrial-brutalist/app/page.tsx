import type { Metadata } from 'next';
import Link from 'next/link';
import { siteConfig } from '@/site.config';

export const metadata: Metadata = {
  title: `${siteConfig.name} | ${siteConfig.tagline}`,
  description: siteConfig.tagline,
};

const services = [
  {
    id: 'SYS.001',
    title: 'PLATFORM\nWEBSITES',
    slug: 'platform-websites',
    rev: 'REV 2.6',
    desc: 'Custom sites deployed on our proprietary platform. Fast, themed, SEO-optimized.',
  },
  {
    id: 'SYS.002',
    title: 'AI\nAUTOMATION',
    slug: 'ai-automation',
    rev: 'REV 2.6',
    desc: 'AI-powered workflows, chatbots, and business automation systems.',
  },
  {
    id: 'SYS.003',
    title: 'ECOMMERCE\nSOLUTIONS',
    slug: 'ecommerce',
    rev: 'REV 2.6',
    desc: 'Online shops with payment processing, inventory, and order management.',
  },
  {
    id: 'SYS.004',
    title: 'WEB\nDESIGN',
    slug: 'web-design',
    rev: 'REV 2.6',
    desc: 'Brand identity, UI/UX design, and responsive layouts.',
  },
  {
    id: 'SYS.005',
    title: 'SEO &\nANALYTICS',
    slug: 'seo-analytics',
    rev: 'REV 2.6',
    desc: 'Search optimization, GA4 setup, and performance tracking.',
  },
  {
    id: 'SYS.006',
    title: 'MAINTENANCE\n& SUPPORT',
    slug: 'maintenance',
    rev: 'REV 2.6',
    desc: 'Ongoing updates, security monitoring, and technical support.',
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-surface-background">
      {/* NAV */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-surface-background border-b border-surface-border">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between h-14">
          <Link
            href="/"
            className="font-bold text-surface-foreground tracking-tight"
            style={{ fontFamily: 'var(--font-space-grotesk, system-ui)' }}
          >
            [ DCS ]
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            {[
              ['SYS.001', 'SERVICES', '/services'],
              ['SYS.002', 'PORTFOLIO', '/projects'],
              ['SYS.003', 'ABOUT', '/about'],
              ['SYS.004', 'CONTACT', '/contact'],
            ].map(([id, label, href]) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-2 text-[0.75rem] tracking-[0.08em] text-surface-foreground hover:text-brand-primary transition-colors duration-150"
                style={{ fontFamily: 'var(--font-geist-mono, monospace)' }}
              >
                <span className="text-surface-secondary">{id}</span>
                {label}
              </Link>
            ))}
          </nav>
          <Link
            href="/contact"
            className="bg-brand-primary text-white text-[0.75rem] tracking-[0.08em] uppercase px-4 py-2 hover:bg-brand-primary-hover transition-colors duration-150"
            style={{ fontFamily: 'var(--font-geist-mono, monospace)' }}
          >
            [ INITIATE CONTACT ]
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* HERO */}
        <section className="pt-14 min-h-screen flex flex-col justify-between px-6 md:px-12 max-w-[1400px] mx-auto py-24">
          <div className="flex-1 flex flex-col justify-center">
            <h1
              className="uppercase text-surface-foreground mb-8 whitespace-pre-line"
              style={{
                fontFamily: 'var(--font-space-grotesk, system-ui)',
                fontSize: 'clamp(3rem, 8vw, 8rem)',
                fontWeight: 700,
                letterSpacing: '-0.04em',
                lineHeight: '0.9',
              }}
            >
              {`DIGITAL_\nCONSULTING_\nSERVICES > `}
              <span className="cursor-blink">_</span>
            </h1>
            <p
              className="mb-12 max-w-xl text-surface-foreground/85"
              style={{
                fontFamily: 'var(--font-geist, system-ui)',
                fontSize: '1.25rem',
                lineHeight: '1.6',
              }}
            >
              We build the platform. You build the business.
            </p>
            <div>
              <Link
                href="/contact"
                className="inline-block bg-brand-primary text-white px-8 py-4 hover:bg-brand-primary-hover transition-colors duration-150 text-[0.875rem] tracking-[0.08em] uppercase"
                style={{ fontFamily: 'var(--font-geist-mono, monospace)' }}
              >
                &lt; INITIATE CONTACT &gt;
              </Link>
            </div>
          </div>

          {/* Status bar */}
          <div
            className="border-t border-surface-border pt-6 flex flex-wrap items-center justify-between gap-4 text-surface-secondary"
            style={{
              fontFamily: 'var(--font-geist-mono, monospace)',
              fontSize: '0.75rem',
              letterSpacing: '0.08em',
            }}
          >
            <div className="flex flex-wrap gap-8 uppercase">
              <span>
                SYS.STATUS: <span className="text-status-success">ONLINE</span>
              </span>
              <span>EST. 2015</span>
              <span>UNIT: UK-001</span>
            </div>
            <span className="uppercase">v2.6</span>
          </div>
        </section>

        {/* HR */}
        <hr className="border-surface-border" />

        {/* SERVICES GRID */}
        <section className="py-24 px-6 md:px-12 max-w-[1400px] mx-auto">
          <div
            className="mb-12 text-surface-secondary"
            style={{
              fontFamily: 'var(--font-geist-mono, monospace)',
              fontSize: '0.75rem',
              letterSpacing: '0.08em',
            }}
          >
            <span
              className="uppercase text-surface-foreground text-sm"
              style={{ fontFamily: 'var(--font-space-grotesk, system-ui)', fontSize: '0.875rem' }}
            >
              /// SERVICES
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 bg-surface-border gap-px">
            {services.map((svc) => (
              <Link
                key={svc.slug}
                href={`/services/${svc.slug}`}
                className="bg-surface-background p-8 flex flex-col gap-4 group hover:bg-surface-muted transition-colors duration-150 border-0"
              >
                <div className="flex items-center justify-between">
                  <span
                    style={{
                      fontFamily: 'var(--font-geist-mono, monospace)',
                      fontSize: '0.75rem',
                      letterSpacing: '0.08em',
                    }}
                    className="uppercase text-surface-secondary"
                  >
                    {svc.id}
                  </span>
                  <span
                    className="flex items-center gap-2 uppercase text-surface-secondary"
                    style={{
                      fontFamily: 'var(--font-geist-mono, monospace)',
                      fontSize: '0.75rem',
                      letterSpacing: '0.08em',
                    }}
                  >
                    <span className="inline-block w-2 h-2 bg-status-success" />
                    ACTIVE
                  </span>
                </div>
                <div
                  className="text-surface-foreground whitespace-pre-line group-hover:text-brand-primary transition-colors duration-150"
                  style={{
                    fontFamily: 'var(--font-space-grotesk, system-ui)',
                    fontSize: 'clamp(1.25rem, 3vw, 2rem)',
                    fontWeight: 700,
                    letterSpacing: '-0.02em',
                    lineHeight: '1.1',
                  }}
                >
                  {svc.title}
                </div>
                <p
                  className="text-surface-foreground/85"
                  style={{
                    fontFamily: 'var(--font-geist, system-ui)',
                    fontSize: '1rem',
                    lineHeight: '1.6',
                  }}
                >
                  {svc.desc}
                </p>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-surface-border">
                  <span
                    className="text-brand-primary uppercase"
                    style={{
                      fontFamily: 'var(--font-geist-mono, monospace)',
                      fontSize: '0.75rem',
                      letterSpacing: '0.08em',
                    }}
                  >
                    &gt; DEPLOY
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-geist-mono, monospace)',
                      fontSize: '0.75rem',
                      letterSpacing: '0.08em',
                    }}
                    className="uppercase text-surface-secondary"
                  >
                    {svc.rev}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* HR */}
        <hr className="border-surface-border" />

        {/* STATS BAR */}
        <section className="py-12 px-6 md:px-12 max-w-[1400px] mx-auto">
          <div
            className="flex flex-wrap gap-8 md:gap-16 text-surface-secondary"
            style={{
              fontFamily: 'var(--font-geist-mono, monospace)',
              fontSize: '0.875rem',
              letterSpacing: '0.08em',
            }}
          >
            <span className="uppercase">
              SITES DEPLOYED: <strong className="text-surface-foreground">047</strong>
            </span>
            <span className="uppercase">
              UPTIME: <strong className="text-surface-foreground">99.9%</strong>
            </span>
            <span className="uppercase">
              CLIENTS SERVED: <strong className="text-surface-foreground">023</strong>
            </span>
          </div>
        </section>

        {/* HR */}
        <hr className="border-surface-border" />

        {/* CTA BAND */}
        <section className="py-24 px-6 md:px-12 bg-surface-muted border-t-2 border-b-2 border-brand-primary">
          <div className="max-w-[1400px] mx-auto text-center">
            <h2
              className="text-surface-foreground mb-8"
              style={{
                fontFamily: 'var(--font-space-grotesk, system-ui)',
                fontSize: 'clamp(2rem, 5vw, 4rem)',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                lineHeight: '1.0',
              }}
            >
              Ready to deploy?
            </h2>
            <Link
              href="/contact"
              className="inline-block bg-brand-primary text-white px-8 py-4 hover:bg-brand-primary-hover transition-colors duration-150 text-[0.875rem] tracking-[0.08em] uppercase"
              style={{ fontFamily: 'var(--font-geist-mono, monospace)' }}
            >
              &lt; INITIATE CONTACT &gt;
            </Link>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="mt-auto border-t border-surface-border bg-surface-background">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 bg-surface-border gap-px">
            <div className="bg-surface-background p-8">
              <p
                className="font-bold text-surface-foreground text-lg mb-2"
                style={{ fontFamily: 'var(--font-space-grotesk, system-ui)' }}
              >
                [ DCS ]
              </p>
              <p
                className="uppercase leading-relaxed text-surface-secondary"
                style={{
                  fontFamily: 'var(--font-geist-mono, monospace)',
                  fontSize: '0.75rem',
                  letterSpacing: '0.08em',
                }}
              >
                Digital Consulting
                <br />
                Services
                <br />
                <br />
                EST. 2015
              </p>
            </div>
            <div className="bg-surface-background p-8">
              <p
                className="uppercase mb-4 text-surface-secondary"
                style={{
                  fontFamily: 'var(--font-geist-mono, monospace)',
                  fontSize: '0.75rem',
                  letterSpacing: '0.08em',
                }}
              >
                Systems
              </p>
              {[
                ['SYS.001', 'PLATFORM WEBSITES', '/services/platform-websites'],
                ['SYS.002', 'AI AUTOMATION', '/services/ai-automation'],
                ['SYS.003', 'ECOMMERCE', '/services/ecommerce'],
                ['SYS.004', 'WEB DESIGN', '/services/web-design'],
                ['SYS.005', 'SEO & ANALYTICS', '/services/seo-analytics'],
                ['SYS.006', 'MAINTENANCE', '/services/maintenance'],
              ].map(([id, label, href]) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-2 mb-2 text-surface-foreground hover:text-brand-primary transition-colors duration-150"
                  style={{
                    fontFamily: 'var(--font-geist-mono, monospace)',
                    fontSize: '0.75rem',
                    letterSpacing: '0.08em',
                  }}
                >
                  <span className="text-surface-secondary">{id}</span>
                  {label}
                </Link>
              ))}
            </div>
            <div className="bg-surface-background p-8">
              <p
                className="uppercase mb-4 text-surface-secondary"
                style={{
                  fontFamily: 'var(--font-geist-mono, monospace)',
                  fontSize: '0.75rem',
                  letterSpacing: '0.08em',
                }}
              >
                Coordinates
              </p>
              <p
                className="uppercase leading-relaxed text-surface-foreground"
                style={{
                  fontFamily: 'var(--font-geist-mono, monospace)',
                  fontSize: '0.75rem',
                  letterSpacing: '0.08em',
                }}
              >
                UK-001
                <br />
                digitalconsultingservices.co.uk
                <br />
                <br />
                <span className="inline-flex items-center gap-2">
                  <span className="inline-block w-2 h-2 bg-status-success" />
                  STATUS: ONLINE
                </span>
              </p>
            </div>
          </div>
          <div className="py-4 flex items-center justify-between">
            <p
              className="uppercase text-surface-secondary"
              style={{
                fontFamily: 'var(--font-geist-mono, monospace)',
                fontSize: '0.7rem',
                letterSpacing: '0.08em',
              }}
            >
              (C) 2026 DIGITAL CONSULTING SERVICES
            </p>
            <p
              className="uppercase text-surface-secondary"
              style={{
                fontFamily: 'var(--font-geist-mono, monospace)',
                fontSize: '0.7rem',
                letterSpacing: '0.08em',
              }}
            >
              REV 2.6
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
