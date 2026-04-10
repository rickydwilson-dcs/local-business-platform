import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getServices, getService } from '@/lib/content';
import { loadMdx } from '@/lib/mdx';
import { siteConfig } from '@/site.config';

interface ServiceFrontmatter {
  title: string;
  seoTitle?: string;
  description?: string;
  badge?: string;
  keywords?: string[];
  benefits?: string[];
  faqs?: Array<{ question: string; answer: string }>;
}

export const dynamic = 'force-static';
export const dynamicParams = false;

type Params = { slug: string };

export async function generateStaticParams() {
  const services = await getServices();
  return services.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const result = await getService(slug);
  if (!result) return { title: 'Service Not Found' };
  const fm = result.frontmatter as ServiceFrontmatter;
  return {
    title: fm.seoTitle || fm.title,
    description: fm.description,
    keywords: fm.keywords,
  };
}

const NAV_LINKS = [
  { label: 'Services', href: '/services' },
  { label: 'Portfolio', href: '/projects' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export default async function ServicePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const result = await getService(slug);
  if (!result) notFound();

  const fm = result.frontmatter as ServiceFrontmatter;
  const { content: mdxContent } = await loadMdx({ baseDir: 'services', slug });
  const benefits = fm.benefits ?? [];
  const faqs = fm.faqs ?? [];

  const serviceIndex = siteConfig.services.findIndex((s) => s.slug === slug);
  const serviceNumber = serviceIndex >= 0 ? String(serviceIndex + 1).padStart(2, '0') : '—';

  return (
    <>
      {/* Minimal static nav for static pages */}
      <nav
        className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-6 px-6 py-3 rounded-full bg-surface-background/80 backdrop-blur-md"
        style={{ boxShadow: '0 0 0 1px rgba(0,0,0,0.05), 0 2px 8px rgba(0,0,0,0.04)' }}
        aria-label="Primary navigation"
      >
        <Link
          href="/"
          className="font-bold text-[#0D0D0D] tracking-tight mr-2"
          style={{ fontFamily: 'var(--font-space-grotesk, system-ui)' }}
        >
          DCS
        </Link>
        <div className="hidden md:flex items-center gap-5">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-surface-secondary hover:text-surface-foreground transition-colors duration-150"
            >
              {link.label}
            </Link>
          ))}
        </div>
        <Link
          href="/contact"
          className="hidden md:inline-flex items-center gap-1.5 bg-[#2563EB] text-white text-sm font-semibold px-5 py-2 rounded-full hover:bg-[#1D4ED8] transition-colors duration-150 active:scale-[0.98] ml-2"
        >
          Start a Project
        </Link>
      </nav>

      {/* Page hero */}
      <section className="pt-36 pb-16 bg-[#FAFAFA]">
        <div className="container-standard">
          <nav className="mb-8" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-xs text-surface-secondary">
              <li>
                <Link href="/" className="hover:text-surface-secondary transition-colors">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/services" className="hover:text-surface-secondary transition-colors">
                  Services
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-surface-secondary">{fm.title}</li>
            </ol>
          </nav>

          <div className="flex items-start gap-4 mb-4">
            <span
              className="text-xs font-semibold tracking-widest text-surface-secondary mt-1"
              style={{ fontFamily: 'var(--font-geist-mono, monospace)' }}
            >
              {serviceNumber}
            </span>
            {fm.badge && <span className="pill-badge">{fm.badge}</span>}
          </div>
          <h1 className="heading-hero mb-6">{fm.title}</h1>
          {fm.description && <p className="body-relaxed text-lg max-w-2xl">{fm.description}</p>}
        </div>
      </section>

      {/* Benefits */}
      {benefits.length > 0 && (
        <section className="bg-[#FAFAFA] pb-16">
          <div className="container-standard max-w-2xl">
            <span className="eyebrow mb-6 block">/// WHAT&apos;S INCLUDED</span>
            <ul className="divide-y divide-surface-border">
              {benefits.map((benefit) => (
                <li
                  key={benefit}
                  className="py-4 flex items-start gap-3 text-sm text-surface-secondary"
                >
                  <span className="text-[#2563EB] flex-shrink-0 mt-0.5" aria-hidden="true">
                    —
                  </span>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* MDX prose content */}
      <section className="bg-[#FAFAFA] pb-16">
        <div className="container-standard">
          <div className="max-w-[65ch] prose prose-zinc prose-headings:font-bold prose-headings:tracking-tight prose-a:text-[#2563EB] prose-a:no-underline hover:prose-a:underline prose-strong:text-[#0D0D0D]">
            {mdxContent}
          </div>
        </div>
      </section>

      {/* FAQs */}
      {faqs.length > 0 && (
        <section className="bg-surface-muted border-y border-surface-border py-16">
          <div className="container-standard max-w-2xl">
            <span className="eyebrow mb-8 block">/// FAQ</span>
            <div className="space-y-0">
              {faqs.map((faq, i) => (
                <details key={i} className="group border-b border-surface-border py-1">
                  <summary className="flex items-center justify-between py-4 cursor-pointer list-none text-sm font-medium text-[#0D0D0D] hover:text-[#2563EB] transition-colors">
                    <span className="flex items-start gap-3">
                      <span
                        className="text-xs text-surface-secondary mt-0.5 flex-shrink-0 w-5"
                        style={{ fontFamily: 'var(--font-geist-mono, monospace)' }}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      {faq.question}
                    </span>
                    <svg
                      className="w-4 h-4 flex-shrink-0 ml-4 text-surface-secondary transition-transform group-open:rotate-180"
                      viewBox="0 0 16 16"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M3 6l5 5 5-5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </summary>
                  <div className="pb-5 pl-8 text-sm text-surface-secondary leading-relaxed">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-24 bg-[#0D0D0D]">
        <div className="container-standard text-center">
          <h2
            className="text-3xl md:text-4xl font-bold tracking-tighter text-white mb-4"
            style={{ fontFamily: 'var(--font-space-grotesk, system-ui)' }}
          >
            Ready to get started?
          </h2>
          <p className="text-surface-secondary mb-8 max-w-md mx-auto">
            Tell us about your project and we&apos;ll reply within one business day.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-white text-[#0D0D0D] font-semibold px-8 py-4 rounded-full hover:bg-surface-muted transition-colors active:scale-[0.98]"
          >
            Start a Project
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0D0D0D] border-t border-white/5">
        <div className="container-standard py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div>
              <div
                className="text-white font-bold text-xl mb-3 tracking-tight"
                style={{ fontFamily: 'var(--font-space-grotesk, system-ui)' }}
              >
                DCS
              </div>
              <p className="text-surface-secondary text-sm leading-relaxed max-w-[28ch]">
                Websites as intelligent as your business
              </p>
            </div>
            <div>
              <div className="text-surface-secondary text-xs font-semibold tracking-widest uppercase mb-4">
                Services
              </div>
              <ul className="space-y-2">
                {siteConfig.services.map((s) => (
                  <li key={s.slug}>
                    <Link
                      href={`/services/${s.slug}`}
                      className="text-surface-secondary text-sm hover:text-white transition-colors"
                    >
                      {s.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="text-surface-secondary text-xs font-semibold tracking-widest uppercase mb-4">
                Contact
              </div>
              <ul className="space-y-2 text-sm text-surface-secondary">
                <li>hello@digitalconsultingservices.co.uk</li>
                <li>United Kingdom</li>
                <li className="flex items-center gap-2 mt-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-status-success inline-block" />
                  <span>Open to new projects</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/5 mt-12 pt-6">
            <p className="text-surface-secondary text-xs">
              &copy; 2015 Digital Consulting Services Ltd. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
