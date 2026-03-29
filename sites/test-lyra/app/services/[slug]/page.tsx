import { TopNavigation } from '@platform/themes/lyra/components';
import { SiteFooter } from '@platform/themes/lyra/components';

export default function Page({ params }: { params: { slug: string } }) {
  const title = params.slug
    .split('-')
    .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  return (
    <div className="min-h-screen flex flex-col">
      <TopNavigation />
      {/* Source: https://preview.themeforest.net/item/homerise-construction-industry-vue-js-template/full_screen_preview/62297014 — fallback template */}

      <section className="bg-brand-primary text-on-brand-primary py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-sm mb-4 opacity-75" aria-label="Breadcrumb">
            <a href="/" className="hover:underline">Home</a>
            <span className="mx-2">/</span>
            <a href="/services" className="hover:underline capitalize">services</a>
            <span className="mx-2">/</span>
            <span>{title}</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-bold mt-2">{title}</h1>
          <p className="mt-4 text-xl opacity-90 max-w-2xl">Professional services delivered with expertise and care.</p>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-surface-background flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-surface-foreground mb-6">Overview</h2>
          <p className="text-surface-muted-foreground text-lg leading-relaxed mb-6">Our {title.toLowerCase()} service is delivered by experienced professionals committed to quality and reliability. We tailor every project to your specific requirements.</p>
          <h2 className="text-2xl font-bold text-surface-foreground mt-12 mb-4">{"What's Included"}</h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-3"><span className="text-brand-primary mt-1 font-bold">✓</span><span className="text-surface-muted-foreground">Initial consultation and needs assessment</span></li>
            <li className="flex items-start gap-3"><span className="text-brand-primary mt-1 font-bold">✓</span><span className="text-surface-muted-foreground">Detailed planning and preparation</span></li>
            <li className="flex items-start gap-3"><span className="text-brand-primary mt-1 font-bold">✓</span><span className="text-surface-muted-foreground">Professional delivery by qualified team</span></li>
            <li className="flex items-start gap-3"><span className="text-brand-primary mt-1 font-bold">✓</span><span className="text-surface-muted-foreground">Follow-up and satisfaction guarantee</span></li>
          </ul>
        </div>
      </section>

      <section className="py-16 bg-surface-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-surface-foreground mb-8">Related Services</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <a href="/services/services-one" className="block bg-surface-background rounded-lg p-6 border border-surface-subtle hover:shadow-md transition-shadow">
              <h3 className="text-lg font-semibold text-surface-foreground hover:text-brand-primary transition-colors mb-2">Services One</h3>
              <p className="text-surface-muted-foreground text-sm">A related service offering from our portfolio.</p>
            </a>
            <a href="/services/services-two" className="block bg-surface-background rounded-lg p-6 border border-surface-subtle hover:shadow-md transition-shadow">
              <h3 className="text-lg font-semibold text-surface-foreground hover:text-brand-primary transition-colors mb-2">Services Two</h3>
              <p className="text-surface-muted-foreground text-sm">Another service offering from our portfolio.</p>
            </a>
          </div>
        </div>
      </section>

      <section className="py-16 bg-brand-primary text-on-brand-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Get a Quote for {title}</h2>
          <p className="text-lg opacity-90 mb-8">Contact us to discuss your project.</p>
          <a href="/contact" className="inline-block bg-surface-background text-surface-foreground font-semibold px-8 py-3 rounded-lg hover:opacity-90 transition-opacity">Contact Us</a>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
