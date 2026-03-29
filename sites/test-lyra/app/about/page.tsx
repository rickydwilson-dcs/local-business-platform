import { TopNavigation } from '@platform/themes/lyra/components';
import { SiteFooter } from '@platform/themes/lyra/components';

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col">
      <TopNavigation />
      {/* Source: https://preview.themeforest.net/item/homerise-construction-industry-vue-js-template/full_screen_preview/62297014 — fallback template */}

      <section className="bg-surface-muted py-12 md:py-16 border-b border-surface-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-surface-foreground">About Us</h1>
          <p className="mt-4 text-lg text-surface-muted-foreground max-w-3xl">Learn more about our team and what drives us.</p>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-surface-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-bold text-surface-foreground mb-6">Our Story</h2>
            <p className="text-surface-muted-foreground mb-4 text-lg leading-relaxed">We are a dedicated team of professionals committed to delivering exceptional service. With years of experience in the industry, we understand what it takes to exceed expectations.</p>
            <p className="text-surface-muted-foreground text-lg leading-relaxed">Our mission is to provide reliable, high-quality solutions that make a real difference for our clients and their communities.</p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-surface-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-surface-foreground text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-surface-background rounded-lg p-6 border border-surface-subtle text-center">
              <div className="w-12 h-12 bg-brand-primary rounded-full mx-auto mb-4 flex items-center justify-center"><span className="text-on-brand-primary text-xl font-bold">1</span></div>
              <h3 className="text-xl font-semibold text-surface-foreground mb-2">Quality</h3>
              <p className="text-surface-muted-foreground">Uncompromising standards in everything we do.</p>
            </div>
            <div className="bg-surface-background rounded-lg p-6 border border-surface-subtle text-center">
              <div className="w-12 h-12 bg-brand-primary rounded-full mx-auto mb-4 flex items-center justify-center"><span className="text-on-brand-primary text-xl font-bold">2</span></div>
              <h3 className="text-xl font-semibold text-surface-foreground mb-2">Reliability</h3>
              <p className="text-surface-muted-foreground">Consistent delivery you can count on every time.</p>
            </div>
            <div className="bg-surface-background rounded-lg p-6 border border-surface-subtle text-center">
              <div className="w-12 h-12 bg-brand-primary rounded-full mx-auto mb-4 flex items-center justify-center"><span className="text-on-brand-primary text-xl font-bold">3</span></div>
              <h3 className="text-xl font-semibold text-surface-foreground mb-2">Trust</h3>
              <p className="text-surface-muted-foreground">Building lasting relationships with our clients.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-brand-primary text-on-brand-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Work With Us</h2>
          <p className="text-lg opacity-90 mb-8">Ready to find out what we can do for you?</p>
          <a href="/contact" className="inline-block bg-surface-background text-surface-foreground font-semibold px-8 py-3 rounded-lg hover:opacity-90 transition-opacity">Get in Touch</a>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
