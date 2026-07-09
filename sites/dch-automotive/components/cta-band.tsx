import Link from 'next/link';
import type { SiteConfigSummary } from '@platform/core-components';

export function CtaBand({
  siteConfig,
  title,
  description,
}: {
  siteConfig: SiteConfigSummary;
  title: string;
  description: string;
}) {
  const phoneTel = siteConfig.phone.replace(/\s/g, '');

  return (
    <section className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 bg-brand-primary/5 z-0" />
      <div className="absolute left-0 top-0 w-2 h-full bg-brand-primary" />
      <div className="container mx-auto px-6 relative z-10 flex flex-col md:flex-row justify-between items-center gap-12">
        <div>
          <h2 className="text-4xl font-heading font-black uppercase tracking-tight mb-2">
            {title}
          </h2>
          <p className="text-xl text-white/60">{description}</p>
        </div>
        <div className="flex flex-col items-center md:items-end">
          {siteConfig.cta.phone.show && (
            <a
              className="text-3xl font-heading font-black text-brand-primary mb-4 hover:brightness-125 transition-all"
              href={`tel:${phoneTel}`}
            >
              {siteConfig.phoneDisplay}
            </a>
          )}
          <Link
            href={siteConfig.cta.primary.href}
            className="bg-brand-primary text-brand-on-primary px-10 py-5 font-heading font-black uppercase tracking-widest shadow-2xl hover:-translate-y-0.5 transition-all inline-block"
          >
            {siteConfig.cta.primary.label}
          </Link>
        </div>
      </div>
    </section>
  );
}
