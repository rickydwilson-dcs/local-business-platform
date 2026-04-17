{
  /* Source: https://www.rpautomotivephotography.com — home (fallback template, no blueprint) */
}

import { SiriusHeader } from '@platform/themes/sirius/components';
import { SiriusFooter } from '@platform/themes/sirius/components';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Gallery', href: '/blog' },
  { label: 'Contact', href: '/contact' },
];

export default function Page() {
  return (
    <>
      <SiriusHeader logo="RP Automotive" navLinks={navLinks} />

      {/* Hero */}
      <section className="relative w-full bg-surface-inverse py-24 md:py-32 lg:py-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-on-brand-primary mb-6 tracking-tight">
            Automotive Photography
          </h1>
          <p className="text-lg md:text-xl text-surface-muted-foreground max-w-2xl mx-auto mb-8">
            Professional car, motorcycle and drone photography by Rachel Persaud. Based in Sussex,
            available anywhere.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/contact" className="btn-primary">
              Book a Shoot
            </a>
            <a href="/blog" className="btn-secondary">
              View Gallery
            </a>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-16 md:py-24 bg-surface-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-surface-foreground mb-4">
              Photography Services
            </h2>
            <p className="text-surface-muted-foreground max-w-2xl mx-auto">
              From social media content to full-day shoots, every session is tailored to showcase
              your vehicle at its best.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Car Photography',
                desc: 'Professional studio and location shoots for cars, classics, and supercars.',
              },
              {
                title: 'Motorcycle Photography',
                desc: 'Dynamic and detail shots that capture the spirit of your bike.',
              },
              {
                title: 'Drone Photography',
                desc: 'Aerial perspectives that add cinematic scale to your automotive story.',
              },
            ].map((service) => (
              <div key={service.title} className="card-interactive text-center">
                <div className="w-16 h-16 bg-brand-primary rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="material-symbols-outlined text-on-brand-primary">
                    photo_camera
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-surface-foreground mb-3">
                  {service.title}
                </h3>
                <p className="text-surface-muted-foreground">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="bg-surface-inverse py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '500+', label: 'Vehicles Shot' },
              { value: '8+', label: 'Years Experience' },
              { value: 'CAA', label: 'Drone Approved' },
              { value: 'BA', label: 'Photography Hons' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl md:text-4xl font-bold text-brand-primary mb-1">
                  {stat.value}
                </div>
                <div className="text-surface-inverseMutedForeground text-sm uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-brand-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-on-brand-primary mb-4">
            Ready to Book Your Shoot?
          </h2>
          <p className="text-on-brand-primary mb-8 max-w-xl mx-auto">
            Get in touch to discuss your project. Whether it is a single car or a full collection,
            every shoot is bespoke.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-surface-background text-brand-primary font-semibold hover:bg-surface-muted transition-all duration-200"
          >
            Get in Touch
          </a>
        </div>
      </section>

      <SiriusFooter
        copyrightText={`\u00A9 ${new Date().getFullYear()} RP Automotive Photography. All rights reserved.`}
        termsLink={{ label: 'Terms & Conditions', href: '/terms' }}
      />
    </>
  );
}
