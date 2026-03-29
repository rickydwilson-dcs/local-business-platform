import { TopNavigation } from '@platform/themes/lyra/components';
import { SiteFooter } from '@platform/themes/lyra/components';

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col">
      <TopNavigation />
      {/* Source: https://preview.themeforest.net/item/homerise-construction-industry-vue-js-template/full_screen_preview/62297014 — fallback template */}

      {/* Hero */}
      <section className="bg-brand-primary text-on-brand-primary py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Welcome to Our Business</h1>
          <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto mb-8">Professional services tailored to your needs</p>
          <a href="/contact" className="inline-block bg-surface-background text-surface-foreground font-semibold px-8 py-3 rounded-lg hover:opacity-90 transition-opacity">Get in Touch</a>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-16 md:py-24 bg-surface-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-surface-foreground text-center mb-12">What We Do</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-surface-muted rounded-lg p-6 border border-surface-subtle">
              <h3 className="text-xl font-semibold text-surface-foreground mb-3">Quality Service</h3>
              <p className="text-surface-muted-foreground">Experienced professionals delivering reliable results every time.</p>
            </div>
            <div className="bg-surface-muted rounded-lg p-6 border border-surface-subtle">
              <h3 className="text-xl font-semibold text-surface-foreground mb-3">Tailored Solutions</h3>
              <p className="text-surface-muted-foreground">Customised approaches that meet your specific requirements.</p>
            </div>
            <div className="bg-surface-muted rounded-lg p-6 border border-surface-subtle">
              <h3 className="text-xl font-semibold text-surface-foreground mb-3">Get Started</h3>
              <p className="text-surface-muted-foreground">Contact us today for a free, no-obligation consultation.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="py-12 bg-surface-inverse">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div><p className="text-4xl font-bold text-brand-primary">10+</p><p className="text-surface-muted-foreground mt-1">Years Experience</p></div>
            <div><p className="text-4xl font-bold text-brand-primary">500+</p><p className="text-surface-muted-foreground mt-1">Happy Clients</p></div>
            <div><p className="text-4xl font-bold text-brand-primary">100%</p><p className="text-surface-muted-foreground mt-1">Satisfaction Rate</p></div>
            <div><p className="text-4xl font-bold text-brand-primary">24/7</p><p className="text-surface-muted-foreground mt-1">Support Available</p></div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-brand-primary text-on-brand-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg opacity-90 mb-8">Get in touch for a free quote today.</p>
          <a href="/contact" className="inline-block bg-surface-background text-surface-foreground font-semibold px-8 py-3 rounded-lg hover:opacity-90 transition-opacity">Contact Us</a>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
