import {
  TopNavigation,
  PageTitleBanner,
  NewsletterSignupCTA,
  SiteFooter,
} from '@platform/themes/rigel/components';

export default function ContactPage() {
  return (
    <>
      {/* Source: fallback template */}
      <TopNavigation logo="/images/colorcode-buffalo-logo-white.svg" />
      <PageTitleBanner pageTitle="Contact Us" />

      <section className="py-16 md:py-24 bg-surface-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-surface-foreground mb-6">Get in Touch</h2>
              <p className="text-surface-muted-foreground mb-8">
                Have questions about ColorCode Events? We&apos;d love to hear from you.
                Reach out and we&apos;ll get back to you as soon as possible.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-brand-secondary mt-1">location_on</span>
                  <div>
                    <p className="font-semibold text-surface-foreground">Buffalo, NY</p>
                    <p className="text-surface-muted-foreground">ColorCode Events HQ</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-brand-secondary mt-1">mail</span>
                  <div>
                    <p className="font-semibold text-surface-foreground">Email Us</p>
                    <p className="text-surface-muted-foreground">hello@colorcode.events</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-surface-muted rounded-xl p-8 border border-surface-subtle">
              <h3 className="text-xl font-semibold text-surface-foreground mb-6">Send a Message</h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-surface-foreground mb-1">Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 rounded-lg border border-surface-subtle bg-surface-background text-surface-foreground focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-foreground mb-1">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-2 rounded-lg border border-surface-subtle bg-surface-background text-surface-foreground focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-foreground mb-1">Message</label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-2 rounded-lg border border-surface-subtle bg-surface-background text-surface-foreground focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    placeholder="How can we help?"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-brand-primary text-on-brand-primary font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <NewsletterSignupCTA />
      <SiteFooter />
    </>
  );
}
