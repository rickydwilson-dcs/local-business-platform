/**
 * Contact Page — mirrors colorcode.events/contact/
 */
import type { Metadata } from 'next';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Contact | Digital Marketing Weekend 2026',
  description: 'Get in touch with the Digital Marketing Weekend team.',
};

export default function ContactPage() {
  return (
    <main>
      <section className="py-20 px-4 bg-surface-inverse text-center">
        <div className="max-w-3xl mx-auto">
          <span className="text-brand-secondary text-sm font-semibold uppercase tracking-widest mb-4 block">
            Get in Touch
          </span>
          <h1 className="text-h1 text-surface-foreground mb-6">Contact Us</h1>
          <p className="text-body text-surface-foreground opacity-80">
            Have a question about the event, sponsorship, or speaking opportunities?
          </p>
        </div>
      </section>

      <section className="py-20 px-4 bg-surface-background">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <h2 className="text-h2 text-surface-foreground mb-8">How to Reach Us</h2>
            <ul className="space-y-6">
              <li>
                <span className="text-brand-secondary font-semibold block mb-1">Email</span>
                <a
                  href="mailto:hello@digitalmarketingweekend.co.uk"
                  className="text-surface-foreground hover:text-brand-secondary transition-colors"
                >
                  hello@digitalmarketingweekend.co.uk
                </a>
              </li>
              <li>
                <span className="text-brand-secondary font-semibold block mb-1">Twitter</span>
                <a
                  href="https://twitter.com/dmweekend"
                  className="text-surface-foreground hover:text-brand-secondary transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  @dmweekend
                </a>
              </li>
              <li>
                <span className="text-brand-secondary font-semibold block mb-1">Venue</span>
                <address className="not-italic text-surface-foreground opacity-80">
                  Winter Garden, Compton Street
                  <br />
                  Eastbourne, East Sussex
                  <br />
                  BN21 4BP
                </address>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-h2 text-surface-foreground mb-8">Send a Message</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-small font-semibold text-surface-foreground mb-2">
                  Name
                </label>
                <div className="w-full px-4 py-3 rounded-md bg-surface-card border border-surface-border text-surface-muted-foreground">
                  Your name
                </div>
              </div>
              <div>
                <label className="block text-small font-semibold text-surface-foreground mb-2">
                  Email
                </label>
                <div className="w-full px-4 py-3 rounded-md bg-surface-card border border-surface-border text-surface-muted-foreground">
                  your@email.com
                </div>
              </div>
              <div>
                <label className="block text-small font-semibold text-surface-foreground mb-2">
                  Message
                </label>
                <div className="w-full px-4 py-12 rounded-md bg-surface-card border border-surface-border text-surface-muted-foreground">
                  How can we help?
                </div>
              </div>
              <a
                href="mailto:hello@digitalmarketingweekend.co.uk"
                className="block text-center w-full px-6 py-3 rounded-md bg-brand-secondary text-brand-primary font-bold hover:opacity-90 transition-opacity"
              >
                Send Message
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
