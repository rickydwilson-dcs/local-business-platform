import { TopNavigation } from '@platform/themes/lyra/components';
import { SiteFooter } from '@platform/themes/lyra/components';

const items = [
  { title: 'Services One', slug: 'services-one', description: 'A detailed overview of this offering and what it includes for you.' },
  { title: 'Services Two', slug: 'services-two', description: 'Information about this service and the benefits it provides.' },
  { title: 'Services Three', slug: 'services-three', description: 'How this service can help you achieve your goals.' },
];

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col">
      <TopNavigation />
      {/* Source: https://preview.themeforest.net/item/homerise-construction-industry-vue-js-template/full_screen_preview/62297014 — fallback template */}

      <section className="bg-surface-muted py-12 md:py-16 border-b border-surface-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-surface-foreground">Our Services</h1>
          <p className="mt-4 text-lg text-surface-muted-foreground max-w-3xl">Browse our full range of services below.</p>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-surface-background flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((item) => (
              <a key={item.slug} href={`/services/${item.slug}`} className="group block bg-surface-muted rounded-lg border border-surface-subtle overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-brand-primary opacity-10" />
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-surface-foreground group-hover:text-brand-primary transition-colors mb-2">{item.title}</h2>
                  <p className="text-surface-muted-foreground">{item.description}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-brand-primary text-on-brand-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Interested in Our Services?</h2>
          <p className="text-lg opacity-90 mb-8">Contact us today to discuss your requirements.</p>
          <a href="/contact" className="inline-block bg-surface-background text-surface-foreground font-semibold px-8 py-3 rounded-lg hover:opacity-90 transition-opacity">Get a Quote</a>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
