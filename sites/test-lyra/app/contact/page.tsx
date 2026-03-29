import { ContactForm } from '@platform/core-components';
import { TopNavigation } from '@platform/themes/lyra/components';
import { SiteFooter } from '@platform/themes/lyra/components';

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col">
      <TopNavigation />
      {/* Source: https://preview.themeforest.net/item/homerise-construction-industry-vue-js-template/full_screen_preview/62297014 — fallback template */}

      <section className="bg-surface-muted py-12 md:py-16 border-b border-surface-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-surface-foreground">Contact Us</h1>
          <p className="mt-4 text-lg text-surface-muted-foreground max-w-3xl">Get in touch with our team — we would love to hear from you.</p>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-surface-background flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <ContactForm />
            </div>
            <div className="space-y-6">
              <div className="bg-surface-muted rounded-lg p-6 border border-surface-subtle">
                <h2 className="text-xl font-bold text-surface-foreground mb-4">Get in Touch</h2>
                <div className="space-y-3 text-surface-muted-foreground text-sm">
                  <p>We aim to respond to all enquiries within 24 hours.</p>
                  <p>For urgent matters, please call us directly.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
