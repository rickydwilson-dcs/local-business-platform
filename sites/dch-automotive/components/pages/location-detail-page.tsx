import Link from 'next/link';
import type { LocationDetailPageTemplateProps } from '@platform/core-components';
import { BreadcrumbBar } from '@/components/breadcrumb-bar';
import { FaqAccordion } from '@/components/faq-accordion';
import { CtaBand } from '@/components/cta-band';
import { getImageUrl } from '@/lib/image';

export function LocationDetailPage({
  siteConfig,
  frontmatter,
  mdxContent,
  breadcrumbs,
  schemaNodes,
}: LocationDetailPageTemplateProps) {
  const locationName = frontmatter.title;
  const heroTitle = frontmatter.hero?.title || `Professional Services in ${locationName}`;
  const heroDescription = frontmatter.hero?.description || frontmatter.description || '';
  const phoneTel = siteConfig.phone.replace(/\s/g, '');

  return (
    <>
      {schemaNodes}

      <BreadcrumbBar items={breadcrumbs} />

      {/* Hero */}
      <section className="py-16 sm:py-24 container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl sm:text-5xl font-heading font-black uppercase tracking-tight mb-6">
              {heroTitle}
            </h1>
            <div className="w-20 h-1.5 bg-brand-primary mb-6" />
            {heroDescription && (
              <p className="text-xl text-white/80 mb-8 leading-relaxed">{heroDescription}</p>
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
                  alt={`${locationName} — DCH Automotive`}
                  src={getImageUrl(frontmatter.heroImage)}
                />
              </div>
            ) : (
              <div className="stamped-plate aspect-[4/3] flex items-center justify-center">
                <span
                  className="material-symbols-outlined text-brand-primary"
                  style={{ fontSize: '5rem' }}
                >
                  location_on
                </span>
              </div>
            )}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 border-r-4 border-b-4 border-brand-primary/20 pointer-events-none" />
          </div>
        </div>
      </section>

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
        <FaqAccordion
          items={frontmatter.faqs}
          title={`${locationName} Frequently Asked Questions`}
        />
      )}

      <CtaBand
        siteConfig={siteConfig}
        title={`Ready for Professional Services in ${locationName}?`}
        description={`Our local team knows ${locationName} and is ready to help.`}
      />
    </>
  );
}
