import type { ProjectDetailPageTemplateProps } from '@platform/core-components';
import { BreadcrumbBar } from '@/components/breadcrumb-bar';
import { CtaBand } from '@/components/cta-band';

export function ProjectDetailPage({
  siteConfig,
  frontmatter,
  mdxContent,
  breadcrumbs,
}: ProjectDetailPageTemplateProps) {
  return (
    <>
      <BreadcrumbBar items={breadcrumbs} />

      {/* Hero */}
      <section className="py-16 sm:py-24 container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          {frontmatter.tags && frontmatter.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {frontmatter.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-brand-primary/10 text-brand-primary text-xs font-bold uppercase tracking-wide px-3 py-1"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          <h1 className="text-4xl sm:text-5xl font-heading font-black uppercase tracking-tight mb-6">
            {frontmatter.title}
          </h1>
          <div className="w-20 h-1.5 bg-brand-primary mb-6" />
          {frontmatter.description && (
            <p className="text-xl text-white/80 leading-relaxed">{frontmatter.description}</p>
          )}
        </div>
      </section>

      {/* MDX content */}
      <section className="pb-16 sm:pb-24 container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-invert prose-lg max-w-none prose-headings:font-heading prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tight prose-h2:text-3xl prose-h3:text-xl prose-p:text-white/70 prose-a:text-brand-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-white prose-li:text-white/70 prose-li:marker:text-brand-primary prose-img:rounded-none prose-img:border prose-img:border-white/10 prose-img:my-8">
            {mdxContent}
          </div>
        </div>
      </section>

      {/* Outcomes */}
      {frontmatter.outcomes && frontmatter.outcomes.length > 0 && (
        <section className="py-16 sm:py-24 bg-[#080807] border-y border-white/5">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-heading font-black uppercase tracking-tight mb-8">
                Outcomes
              </h2>
              <ul className="space-y-4">
                {frontmatter.outcomes.map((outcome, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-brand-primary flex-shrink-0">
                      check_circle
                    </span>
                    <span className="text-white/70">{outcome}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      <CtaBand
        siteConfig={siteConfig}
        title="Ready to Start Your Project?"
        description={`Contact ${siteConfig.name} for a free consultation and quote.`}
      />
    </>
  );
}
