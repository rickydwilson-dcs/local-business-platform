import type { Metadata } from 'next';
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
    <div className="min-h-screen flex flex-col bg-[#0A0A0A]">
      {/* NAV */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A] border-b border-[#2A2A2A]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between h-14">
          <a
            href="/"
            className="font-bold text-[#EAEAEA] tracking-tight"
            style={{ fontFamily: 'var(--font-space-grotesk, system-ui)' }}
          >
            [ DCS ]
          </a>
          <nav className="hidden md:flex items-center gap-8">
            {[
              ['SYS.001', 'SERVICES', '/services'],
              ['SYS.002', 'PORTFOLIO', '/projects'],
              ['SYS.003', 'ABOUT', '/about'],
              ['SYS.004', 'CONTACT', '/contact'],
            ].map(([id, label, href]) => (
              <a
                key={href}
                href={href}
                className="flex items-center gap-2 text-[0.75rem] tracking-[0.08em] text-[#EAEAEA] hover:text-[#FF2A2A] transition-colors duration-150"
                style={{ fontFamily: 'var(--font-geist-mono, monospace)' }}
              >
                <span className="text-[#777777]">{id}</span>
                {label}
              </a>
            ))}
          </nav>
          <a
            href="/contact"
            className="bg-[#FF2A2A] text-white text-[0.75rem] tracking-[0.08em] uppercase px-4 py-2 hover:bg-[#CC2222] transition-colors duration-150"
            style={{ fontFamily: 'var(--font-geist-mono, monospace)' }}
          >
            [ INITIATE CONTACT ]
          </a>
        </div>
      </header>

      <main className="flex-1">
        {/* HERO */}
        <section className="pt-14 min-h-screen flex flex-col justify-between px-6 md:px-12 max-w-[1400px] mx-auto py-24">
          <div className="flex-1 flex flex-col justify-center">
            <h1
              className="uppercase text-[#EAEAEA] mb-8 whitespace-pre-line"
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
              className="mb-12 max-w-xl"
              style={{
                fontFamily: 'var(--font-geist, system-ui)',
                fontSize: '1.25rem',
                lineHeight: '1.6',
                color: 'rgba(234, 234, 234, 0.85)',
              }}
            >
              We build the platform. You build the business.
            </p>
            <div>
              <a
                href="/contact"
                className="inline-block bg-[#FF2A2A] text-white px-8 py-4 hover:bg-[#CC2222] transition-colors duration-150 text-[0.875rem] tracking-[0.08em] uppercase"
                style={{ fontFamily: 'var(--font-geist-mono, monospace)' }}
              >
                &lt; INITIATE CONTACT &gt;
              </a>
            </div>
          </div>

          {/* Status bar */}
          <div
            className="border-t border-[#2A2A2A] pt-6 flex flex-wrap items-center justify-between gap-4"
            style={{
              fontFamily: 'var(--font-geist-mono, monospace)',
              fontSize: '0.75rem',
              letterSpacing: '0.08em',
              color: '#777777',
            }}
          >
            <div className="flex flex-wrap gap-8 uppercase">
              <span>
                SYS.STATUS: <span className="text-[#4AF626]">ONLINE</span>
              </span>
              <span>EST. 2015</span>
              <span>UNIT: UK-001</span>
            </div>
            <span className="uppercase">v2.6</span>
          </div>
        </section>

        {/* HR */}
        <hr className="border-[#2A2A2A]" />

        {/* SERVICES GRID */}
        <section className="py-24 px-6 md:px-12 max-w-[1400px] mx-auto">
          <div
            className="mb-12"
            style={{
              fontFamily: 'var(--font-geist-mono, monospace)',
              fontSize: '0.75rem',
              letterSpacing: '0.08em',
              color: '#777777',
            }}
          >
            <span
              className="uppercase text-[#EAEAEA] text-sm"
              style={{ fontFamily: 'var(--font-space-grotesk, system-ui)', fontSize: '0.875rem' }}
            >
              /// SERVICES
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 bg-[#2A2A2A] gap-px">
            {services.map((svc) => (
              <a
                key={svc.slug}
                href={`/services/${svc.slug}`}
                className="bg-[#0A0A0A] p-8 flex flex-col gap-4 group hover:bg-[#111111] transition-colors duration-150 border-0"
              >
                <div className="flex items-center justify-between">
                  <span
                    style={{
                      fontFamily: 'var(--font-geist-mono, monospace)',
                      fontSize: '0.75rem',
                      letterSpacing: '0.08em',
                      color: '#777777',
                    }}
                    className="uppercase"
                  >
                    {svc.id}
                  </span>
                  <span
                    className="flex items-center gap-2 uppercase"
                    style={{
                      fontFamily: 'var(--font-geist-mono, monospace)',
                      fontSize: '0.75rem',
                      letterSpacing: '0.08em',
                      color: '#777777',
                    }}
                  >
                    <span className="inline-block w-2 h-2 bg-[#4AF626]" />
                    ACTIVE
                  </span>
                </div>
                <div
                  className="text-[#EAEAEA] whitespace-pre-line group-hover:text-[#FF2A2A] transition-colors duration-150"
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
                  style={{
                    fontFamily: 'var(--font-geist, system-ui)',
                    fontSize: '1rem',
                    lineHeight: '1.6',
                    color: 'rgba(234,234,234,0.85)',
                  }}
                >
                  {svc.desc}
                </p>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#2A2A2A]">
                  <span
                    className="text-[#FF2A2A] uppercase"
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
                      color: '#777777',
                    }}
                    className="uppercase"
                  >
                    {svc.rev}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* HR */}
        <hr className="border-[#2A2A2A]" />

        {/* STATS BAR */}
        <section className="py-12 px-6 md:px-12 max-w-[1400px] mx-auto">
          <div
            className="flex flex-wrap gap-8 md:gap-16"
            style={{
              fontFamily: 'var(--font-geist-mono, monospace)',
              fontSize: '0.875rem',
              letterSpacing: '0.08em',
              color: '#777777',
            }}
          >
            <span className="uppercase">
              SITES DEPLOYED: <strong className="text-[#EAEAEA]">047</strong>
            </span>
            <span className="uppercase">
              UPTIME: <strong className="text-[#EAEAEA]">99.9%</strong>
            </span>
            <span className="uppercase">
              CLIENTS SERVED: <strong className="text-[#EAEAEA]">023</strong>
            </span>
          </div>
        </section>

        {/* HR */}
        <hr className="border-[#2A2A2A]" />

        {/* CTA BAND */}
        <section className="py-24 px-6 md:px-12 bg-[#111111] border-t-2 border-b-2 border-[#FF2A2A]">
          <div className="max-w-[1400px] mx-auto text-center">
            <h2
              className="text-[#EAEAEA] mb-8"
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
            <a
              href="/contact"
              className="inline-block bg-[#FF2A2A] text-white px-8 py-4 hover:bg-[#CC2222] transition-colors duration-150 text-[0.875rem] tracking-[0.08em] uppercase"
              style={{ fontFamily: 'var(--font-geist-mono, monospace)' }}
            >
              &lt; INITIATE CONTACT &gt;
            </a>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="mt-auto border-t border-[#2A2A2A] bg-[#0A0A0A]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 bg-[#2A2A2A] gap-px">
            <div className="bg-[#0A0A0A] p-8">
              <p
                className="font-bold text-[#EAEAEA] text-lg mb-2"
                style={{ fontFamily: 'var(--font-space-grotesk, system-ui)' }}
              >
                [ DCS ]
              </p>
              <p
                className="uppercase leading-relaxed"
                style={{
                  fontFamily: 'var(--font-geist-mono, monospace)',
                  fontSize: '0.75rem',
                  letterSpacing: '0.08em',
                  color: '#777777',
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
            <div className="bg-[#0A0A0A] p-8">
              <p
                className="uppercase mb-4"
                style={{
                  fontFamily: 'var(--font-geist-mono, monospace)',
                  fontSize: '0.75rem',
                  letterSpacing: '0.08em',
                  color: '#777777',
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
                <a
                  key={href}
                  href={href}
                  className="flex items-center gap-2 mb-2 hover:text-[#FF2A2A] transition-colors duration-150"
                  style={{
                    fontFamily: 'var(--font-geist-mono, monospace)',
                    fontSize: '0.75rem',
                    letterSpacing: '0.08em',
                    color: '#EAEAEA',
                  }}
                >
                  <span style={{ color: '#777777' }}>{id}</span>
                  {label}
                </a>
              ))}
            </div>
            <div className="bg-[#0A0A0A] p-8">
              <p
                className="uppercase mb-4"
                style={{
                  fontFamily: 'var(--font-geist-mono, monospace)',
                  fontSize: '0.75rem',
                  letterSpacing: '0.08em',
                  color: '#777777',
                }}
              >
                Coordinates
              </p>
              <p
                className="uppercase leading-relaxed"
                style={{
                  fontFamily: 'var(--font-geist-mono, monospace)',
                  fontSize: '0.75rem',
                  letterSpacing: '0.08em',
                  color: '#EAEAEA',
                }}
              >
                UK-001
                <br />
                digitalconsultingservices.co.uk
                <br />
                <br />
                <span className="inline-flex items-center gap-2">
                  <span className="inline-block w-2 h-2 bg-[#4AF626]" />
                  STATUS: ONLINE
                </span>
              </p>
            </div>
          </div>
          <div className="py-4 flex items-center justify-between">
            <p
              className="uppercase"
              style={{
                fontFamily: 'var(--font-geist-mono, monospace)',
                fontSize: '0.7rem',
                letterSpacing: '0.08em',
                color: '#777777',
              }}
            >
              (C) 2026 DIGITAL CONSULTING SERVICES
            </p>
            <p
              className="uppercase"
              style={{
                fontFamily: 'var(--font-geist-mono, monospace)',
                fontSize: '0.7rem',
                letterSpacing: '0.08em',
                color: '#777777',
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
