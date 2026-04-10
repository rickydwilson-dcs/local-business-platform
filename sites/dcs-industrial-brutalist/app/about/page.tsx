import type { Metadata } from 'next';
import Link from 'next/link';
import { siteConfig } from '@/site.config';

export const metadata: Metadata = {
  title: `About | ${siteConfig.name}`,
  description:
    'Digital Consulting Services is a boutique UK digital agency building websites, AI automation systems, and ecommerce platforms since 2015.',
};

export default function AboutPage() {
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
        {/* HERO */}
        <section className="px-6 md:px-12 max-w-[1400px] mx-auto py-24 md:py-32">
          <h1
            className="uppercase text-[#EAEAEA] mb-0"
            style={{
              fontFamily: 'var(--font-space-grotesk, system-ui)',
              fontSize: 'clamp(3rem, 8vw, 8rem)',
              fontWeight: 700,
              letterSpacing: '-0.04em',
              lineHeight: '0.9',
            }}
          >
            ABOUT*{'\n'}DCS &gt; <span className="cursor-blink">*</span>
          </h1>
        </section>

        <hr className="border-[#2A2A2A]" />

        {/* ASYMMETRIC 2-COL LAYOUT */}
        <section className="px-6 md:px-12 max-w-[1400px] mx-auto py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-px bg-[#2A2A2A]">
            {/* Left: Prose */}
            <div className="bg-[#0A0A0A] p-8 md:p-12">
              <p
                className="mb-4 uppercase"
                style={{
                  fontFamily: 'var(--font-geist-mono, monospace)',
                  fontSize: '0.75rem',
                  letterSpacing: '0.08em',
                  color: '#777777',
                }}
              >
                /// ABOUT
              </p>
              <div
                style={{
                  fontFamily: 'var(--font-geist, system-ui)',
                  fontSize: '1rem',
                  lineHeight: '1.6',
                  color: 'rgba(234,234,234,0.85)',
                }}
              >
                <p className="mb-6">
                  Digital Consulting Services is a boutique UK digital agency specialising in
                  platform-first web development. We don&apos;t build throwaway sites — we deploy
                  systems. Every client gets a production-grade website built on our proprietary
                  platform, designed to scale and perform from day one.
                </p>
                <p className="mb-6">
                  Our platform-first approach means faster builds, lower running costs, and
                  consistent quality across every deployment. When you commission a site from DCS,
                  you&apos;re buying access to the same infrastructure that runs our entire client
                  portfolio — battle-tested, monitored, and continuously improved.
                </p>
                <p>
                  Founded in 2015, we have been building for the web long enough to know what works.
                  AI automation is now central to everything we do — from intelligent contact
                  workflows to data-driven SEO. We bring that capability to businesses that want
                  results, not consultancy hours.
                </p>
              </div>
            </div>

            {/* Right: Data sidebar */}
            <div className="bg-[#0A0A0A] p-8 border-l border-[#2A2A2A]">
              <p
                className="uppercase mb-6"
                style={{
                  fontFamily: 'var(--font-geist-mono, monospace)',
                  fontSize: '0.75rem',
                  letterSpacing: '0.08em',
                  color: '#777777',
                }}
              >
                System data
              </p>
              <div className="flex flex-col gap-4">
                {[
                  ['FOUNDED', '2015'],
                  ['PLATFORM', 'v2.6'],
                  ['SITES DEPLOYED', '047'],
                  ['LOCATION', 'UK-001'],
                  ['UPTIME', '99.9%'],
                  ['STATUS', 'ACCEPTING PROJECTS'],
                ].map(([key, val]) => (
                  <div key={key} className="border-b border-[#2A2A2A] pb-4">
                    <p
                      className="uppercase mb-1"
                      style={{
                        fontFamily: 'var(--font-geist-mono, monospace)',
                        fontSize: '0.7rem',
                        letterSpacing: '0.08em',
                        color: '#777777',
                      }}
                    >
                      {key}
                    </p>
                    <p
                      className="uppercase"
                      style={{
                        fontFamily: 'var(--font-geist-mono, monospace)',
                        fontSize: '0.875rem',
                        letterSpacing: '0.08em',
                        color: '#EAEAEA',
                      }}
                    >
                      {val}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <hr className="border-[#2A2A2A]" />

        {/* VALUES GRID */}
        <section className="px-6 md:px-12 max-w-[1400px] mx-auto py-16 md:py-24">
          <p
            className="mb-12 uppercase"
            style={{
              fontFamily: 'var(--font-geist-mono, monospace)',
              fontSize: '0.75rem',
              letterSpacing: '0.08em',
              color: '#777777',
            }}
          >
            /// CORE VALUES
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 bg-[#2A2A2A] gap-px">
            {[
              {
                label: 'PRECISION',
                body: 'We build to spec. No templates, no guesswork. Every element of every site is intentional.',
              },
              {
                label: 'VELOCITY',
                body: 'Our platform deploys sites in days, not months. Speed to market is a competitive advantage.',
              },
              {
                label: 'INTELLIGENCE',
                body: 'AI automation is built into every workflow. Smarter systems mean less manual overhead and better results.',
              },
            ].map((val) => (
              <div key={val.label} className="bg-[#0A0A0A] p-8">
                <h2
                  className="text-[#EAEAEA] mb-4"
                  style={{
                    fontFamily: 'var(--font-space-grotesk, system-ui)',
                    fontSize: 'clamp(1.25rem, 3vw, 2rem)',
                    fontWeight: 700,
                    letterSpacing: '-0.02em',
                    lineHeight: '1.1',
                  }}
                >
                  {val.label}
                </h2>
                <p
                  style={{
                    fontFamily: 'var(--font-geist, system-ui)',
                    fontSize: '1rem',
                    lineHeight: '1.6',
                    color: 'rgba(234,234,234,0.85)',
                  }}
                >
                  {val.body}
                </p>
              </div>
            ))}
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
