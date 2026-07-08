import Link from 'next/link';
import { siteConfig } from '@/site.config';
import { PHONE_DISPLAY, PHONE_TEL } from '@/lib/contact-info';

const QUICK_LINKS = [
  ...siteConfig.services.map((service) => ({
    label: service.title,
    href: `/services/${service.slug}`,
  })),
  { label: 'Car Remaps', href: '/car-remaps' },
  { label: 'Locations', href: '/locations' },
];

export function SiteFooter() {
  return (
    <footer className="bg-surface-background border-t border-surface-card-border">
      <div className="w-full py-12 px-6 flex flex-col md:flex-row justify-between items-start gap-8 container mx-auto">
        <div className="max-w-sm">
          <div className="text-lg font-heading font-bold text-white mb-4 uppercase tracking-tight">
            {siteConfig.business.name}
          </div>
          <p className="font-sans text-sm text-white/60 mb-6 leading-relaxed">
            {siteConfig.tagline}
          </p>
          <div className="flex space-x-4">
            <a
              href={siteConfig.business.socialMedia.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="DCH Automotive on Facebook"
              className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:border-brand-primary transition-colors"
            >
              <span className="material-symbols-outlined text-xs">thumb_up</span>
            </a>
            <a
              href={siteConfig.business.socialMedia.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="DCH Automotive on Instagram"
              className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:border-brand-primary transition-colors"
            >
              <span className="material-symbols-outlined text-xs">photo_camera</span>
            </a>
            <a
              href={`mailto:${siteConfig.business.email}`}
              aria-label="Email DCH Automotive"
              className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:border-brand-primary transition-colors"
            >
              <span className="material-symbols-outlined text-xs">mail</span>
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-6">
            Quick Links
          </h4>
          <ul className="space-y-3">
            {QUICK_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-white/60 hover:text-brand-primary text-sm hover:underline transition-all"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/privacy-policy"
                className="text-white/60 hover:text-brand-primary text-sm hover:underline transition-all"
              >
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-6">
            Contact Us
          </h4>
          <ul className="space-y-4">
            <li className="flex items-start space-x-3">
              <span className="material-symbols-outlined text-brand-primary text-sm">
                location_on
              </span>
              <span className="text-white/60 text-sm">
                {siteConfig.business.address.street}
                <br />
                {siteConfig.business.address.city}, {siteConfig.business.address.region}{' '}
                {siteConfig.business.address.postalCode}
              </span>
            </li>
            <li className="flex items-center space-x-3">
              <span className="material-symbols-outlined text-brand-primary text-sm">phone</span>
              <a
                href={`tel:${PHONE_TEL}`}
                className="text-white/60 hover:text-brand-primary text-sm"
              >
                {PHONE_DISPLAY}
              </a>
            </li>
            <li className="flex items-center space-x-3">
              <span className="material-symbols-outlined text-brand-primary text-sm">schedule</span>
              <span className="text-white/60 text-sm">
                By appointment — usually Mon-Fri 8:30am-5pm
              </span>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/5 py-8">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-sans text-sm text-white/60">
            &copy; {siteConfig.footer.copyright}
            {siteConfig.footer.builtBy && (
              <>
                {' '}
                | Built by{' '}
                <a
                  href={siteConfig.footer.builtBy.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-brand-primary transition-colors underline"
                >
                  {siteConfig.footer.builtBy.name}
                </a>
              </>
            )}
          </p>
        </div>
      </div>
    </footer>
  );
}
