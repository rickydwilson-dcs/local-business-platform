import Link from 'next/link';
import type { ServiceDetailPageTemplateProps } from '@platform/core-components';

const SERVICE_ICONS: Record<string, string> = {
  'Vehicle Security': 'gps_fixed',
  'Parking Aids': 'sensors',
  'Fleet Solutions': 'local_shipping',
  Accessories: 'settings',
  'Dash Cameras': 'videocam',
};

export function ServiceDetailPage({
  siteConfig,
  frontmatter,
  mdxContent,
  breadcrumbs,
  schemaNodes,
}: ServiceDetailPageTemplateProps) {
  const icon = SERVICE_ICONS[frontmatter.title] ?? 'build';
  const phoneTel = siteConfig.phone.replace(/\s/g, '');

  return (
    <>
      {schemaNodes}

      {/* Breadcrumb */}
      <div className="bg-[#080807] border-b border-white/5 py-4">
        <div className="container mx-auto px-6">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-xs uppercase tracking-widest"
          >
            {breadcrumbs.map((item, i) => (
              <span key={item.href} className="flex items-center gap-2">
                {i > 0 && <span className="text-white/30">/</span>}
                {item.current ? (
                  <span className="text-brand-primary font-bold">{item.name}</span>
                ) : (
                  <Link
                    href={item.href}
                    className="text-white/50 hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                )}
              </span>
            ))}
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="py-16 sm:py-24 container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl sm:text-5xl font-heading font-black uppercase tracking-tight mb-6">
              {frontmatter.title}
            </h1>
            <div className="w-20 h-1.5 bg-brand-primary mb-6" />
            {frontmatter.description && (
              <p className="text-xl text-white/80 mb-8 leading-relaxed">
                {frontmatter.description}
              </p>
            )}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href={siteConfig.cta.primary.href}
                className="inline-flex items-center justify-center bg-brand-primary text-brand-on-primary px-8 py-4 font-heading font-black uppercase tracking-widest hover:brightness-110 transition-all active:scale-95"
              >
                {siteConfig.cta.primary.label}
              </Link>
              {siteConfig.cta.phone.show && (
                <a
                  href={`tel:${phoneTel}`}
                  className="inline-flex items-center justify-center gap-2 border-2 border-brand-primary text-brand-primary px-8 py-4 font-heading font-black uppercase tracking-widest hover:bg-brand-primary hover:text-white transition-all"
                >
                  <span className="material-symbols-outlined">call</span>
                  {siteConfig.phoneDisplay}
                </a>
              )}
            </div>
          </div>

          <div className="relative">
            {frontmatter.heroImage ? (
              <div className="aspect-[4/3] relative overflow-hidden border border-white/10">
                {/* eslint-disable-next-line @next/next/no-img-element -- static Stitch design review asset, not next/image */}
                <img
                  className="w-full h-full object-cover"
                  alt={`${frontmatter.title} — DCH Automotive`}
                  src={frontmatter.heroImage}
                />
              </div>
            ) : (
              <div className="stamped-plate aspect-[4/3] flex items-center justify-center">
                <span
                  className="material-symbols-outlined text-brand-primary"
                  style={{ fontSize: '5rem' }}
                >
                  {icon}
                </span>
              </div>
            )}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 border-r-4 border-b-4 border-brand-primary/20 pointer-events-none" />
          </div>
        </div>
      </section>

      {/* Benefits strip */}
      {frontmatter.benefits && frontmatter.benefits.length > 0 && (
        <section className="bg-[#080807] border-y border-white/5 py-12">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {frontmatter.benefits.map((item) => (
                <div key={item} className="flex items-start gap-3 p-4 stamped-plate">
                  <span className="material-symbols-outlined text-brand-primary flex-shrink-0">
                    check_circle
                  </span>
                  <span className="text-white/80 text-sm font-medium leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* MDX content */}
      <section className="py-16 sm:py-24 container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-invert prose-lg max-w-none prose-headings:font-heading prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tight prose-h2:text-3xl prose-h3:text-xl prose-p:text-white/70 prose-a:text-brand-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-white prose-li:text-white/70 prose-li:marker:text-brand-primary prose-img:rounded-none prose-img:border prose-img:border-white/10 prose-img:my-8">
            {mdxContent}
          </div>
        </div>
      </section>

      {/* FAQs */}
      {frontmatter.faqs && frontmatter.faqs.length > 0 && (
        <section className="py-16 sm:py-24 bg-[#080807] border-y border-white/5">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl font-heading font-black uppercase tracking-tight mb-2">
                Frequently Asked Questions
              </h2>
              <div className="w-20 h-1.5 bg-brand-primary mb-12" />
              <div className="space-y-4">
                {frontmatter.faqs.map((faq) => (
                  <details
                    key={faq.question}
                    className="group bg-surface-card border border-surface-card-border hover:border-brand-primary transition-all p-6"
                  >
                    <summary className="flex items-center justify-between cursor-pointer font-heading font-bold uppercase tracking-tight text-lg list-none">
                      {faq.question}
                      <span className="material-symbols-outlined text-brand-primary transition-transform group-open:rotate-180">
                        expand_more
                      </span>
                    </summary>
                    <p className="text-white/70 mt-4 leading-relaxed">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA band */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-brand-primary/5 z-0" />
        <div className="absolute left-0 top-0 w-2 h-full bg-brand-primary" />
        <div className="container mx-auto px-6 relative z-10 flex flex-col md:flex-row justify-between items-center gap-12">
          <div>
            <h2 className="text-4xl font-heading font-black uppercase tracking-tight mb-2">
              Ready for {frontmatter.title}?
            </h2>
            <p className="text-xl text-white/60">
              Based in {siteConfig.address.city}, serving{' '}
              {siteConfig.address.county ?? 'the South East'}.
            </p>
          </div>
          <div className="flex flex-col items-center md:items-end">
            <a
              className="text-3xl font-heading font-black text-brand-primary mb-4 hover:brightness-125 transition-all"
              href={`tel:${phoneTel}`}
            >
              {siteConfig.phoneDisplay}
            </a>
            <Link
              href={siteConfig.cta.primary.href}
              className="bg-brand-primary text-brand-on-primary px-10 py-5 font-heading font-black uppercase tracking-widest shadow-2xl hover:-translate-y-0.5 transition-all inline-block"
            >
              {siteConfig.cta.primary.label}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
