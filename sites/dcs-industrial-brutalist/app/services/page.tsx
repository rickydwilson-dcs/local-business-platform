import type { Metadata } from 'next';
import Link from 'next/link';
import { siteConfig } from '@/site.config';
import { getServices } from '@/lib/content';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: `Services | ${siteConfig.name}`,
  description:
    'Platform websites, AI automation, ecommerce, web design, SEO, and maintenance for UK businesses.',
};

const serviceIds: Record<string, string> = {
  'platform-websites': 'SYS.001',
  'ai-automation': 'SYS.002',
  ecommerce: 'SYS.003',
  'web-design': 'SYS.004',
  'seo-analytics': 'SYS.005',
  maintenance: 'SYS.006',
};

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <div className="min-h-screen flex flex-col bg-[#0A0A0A]">
      {/* NAV */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A] border-b border-[#2A2A2A]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between h-14">
          <Link
            href="/"
            className="font-bold text-[#EAEAEA] tracking-tight"
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
                className="flex items-center gap-2 text-[0.75rem] tracking-[0.08em] text-[#EAEAEA] hover:text-[#FF2A2A] transition-colors duration-150"
                style={{ fontFamily: 'var(--font-geist-mono, monospace)' }}
              >
                <span className="text-[#777777]">{id}</span>
                {label}
              </Link>
            ))}
          </nav>
          <Link
            href="/contact"
            className="bg-[#FF2A2A] text-white text-[0.75rem] tracking-[0.08em] uppercase px-4 py-2 hover:bg-[#CC2222] transition-colors duration-150"
            style={{ fontFamily: 'var(--font-geist-mono, monospace)' }}
          >
            [ INITIATE CONTACT ]
          </Link>
        </div>
      </header>

      <main className="flex-1 pt-14">
        {/* Breadcrumb */}
        <div className="border-b border-[#2A2A2A] px-6 md:px-12 max-w-[1400px] mx-auto py-3">
          <p
            className="uppercase"
            style={{
              fontFamily: 'var(--font-geist-mono, monospace)',
              fontSize: '0.75rem',
              letterSpacing: '0.08em',
              color: '#777777',
            }}
          >
            <Link href="/" className="hover:text-[#FF2A2A] transition-colors duration-150">
              HOME
            </Link>
            {' > '}
            <span className="text-[#EAEAEA]">SERVICES</span>
          </p>
        </div>

        {/* Page header */}
        <section className="px-6 md:px-12 max-w-[1400px] mx-auto py-16 md:py-24">
          <p
            className="mb-4 uppercase"
            style={{
              fontFamily: 'var(--font-geist-mono, monospace)',
              fontSize: '0.75rem',
              letterSpacing: '0.08em',
              color: '#777777',
            }}
          >
            /// SERVICES
          </p>
          <h1
            className="text-[#EAEAEA] mb-4"
            style={{
              fontFamily: 'var(--font-space-grotesk, system-ui)',
              fontSize: 'clamp(2rem, 5vw, 4rem)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              lineHeight: '1.0',
            }}
          >
            Systems & capabilities
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-geist, system-ui)',
              fontSize: '1.25rem',
              lineHeight: '1.6',
              color: 'rgba(234,234,234,0.85)',
            }}
          >
            Every deployment starts with the right system. Select a capability to read technical
            specifications.
          </p>
        </section>

        <hr className="border-[#2A2A2A]" />

        {/* Services grid */}
        <section className="px-6 md:px-12 max-w-[1400px] mx-auto py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 bg-[#2A2A2A] gap-px">
            {services.map((svc) => {
              const sysId = serviceIds[svc.slug] ?? 'SYS.???';
              return (
                <Link
                  key={svc.slug}
                  href={`/services/${svc.slug}`}
                  className="bg-[#0A0A0A] p-8 flex flex-col gap-4 group hover:bg-[#111111] transition-colors duration-150"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="uppercase"
                      style={{
                        fontFamily: 'var(--font-geist-mono, monospace)',
                        fontSize: '0.75rem',
                        letterSpacing: '0.08em',
                        color: '#777777',
                      }}
                    >
                      {sysId}
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
                  <h2
                    className="text-[#EAEAEA] group-hover:text-[#FF2A2A] transition-colors duration-150"
                    style={{
                      fontFamily: 'var(--font-space-grotesk, system-ui)',
                      fontSize: 'clamp(1.25rem, 3vw, 2rem)',
                      fontWeight: 700,
                      letterSpacing: '-0.02em',
                      lineHeight: '1.1',
                    }}
                  >
                    {svc.title}
                  </h2>
                  <p
                    style={{
                      fontFamily: 'var(--font-geist, system-ui)',
                      fontSize: '1rem',
                      lineHeight: '1.6',
                      color: 'rgba(234,234,234,0.85)',
                    }}
                    className="flex-1"
                  >
                    {svc.description ?? `${svc.title} services from Digital Consulting Services.`}
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
                      &gt; READ SPEC
                    </span>
                    <span
                      className="uppercase"
                      style={{
                        fontFamily: 'var(--font-geist-mono, monospace)',
                        fontSize: '0.75rem',
                        letterSpacing: '0.08em',
                        color: '#777777',
                      }}
                    >
                      REV 2.6
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

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
            <Link
              href="/contact"
              className="inline-block bg-[#FF2A2A] text-white px-8 py-4 hover:bg-[#CC2222] transition-colors duration-150 text-[0.875rem] tracking-[0.08em] uppercase"
              style={{ fontFamily: 'var(--font-geist-mono, monospace)' }}
            >
              &lt; INITIATE CONTACT &gt;
            </Link>
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
                <Link
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
                </Link>
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
