export function FooterMultiColumn({
  contactInfo = {
    phone: "01323 123 456",
    email: "hello@designlab-eastbourne.co.uk",
    address: ["Unit 7, Enterprise Centre", "Lottbridge Drove", "Eastbourne BN23 6QN"],
  },
  servicesLinks = [
    { label: "Vehicle Graphics", href: "/services/vehicle-graphics" },
    { label: "Shop Signage", href: "/services/shop-signage" },
    { label: "Banners & Flags", href: "/services/banners" },
    { label: "Window Graphics", href: "/services/window-graphics" },
    { label: "Exhibition Stands", href: "/services/exhibition" },
    { label: "Design Services", href: "/services/design" },
  ],
  usefulLinks = [
    { label: "About Us", href: "/about" },
    { label: "Portfolio", href: "/portfolio" },
    { label: "Reviews", href: "/reviews" },
    { label: "Blog", href: "/blog" },
    { label: "Privacy Policy", href: "/privacy" },
  ],
  socialLinks = [
    { platform: "Facebook", href: "#" },
    { platform: "Instagram", href: "#" },
    { platform: "LinkedIn", href: "#" },
    { platform: "X", href: "#" },
  ],
  copyright = "© 2024 DesignLab Eastbourne. All rights reserved.",
}) {
  return (
    <footer className="bg-surface-inverse pt-16 pb-8">
      <div className="container-standard mx-auto px-6">
        {/* Top: Logo re-statement */}
        <div className="mb-12 pb-8 border-b border-surface-muted">
          <span className="text-h3 font-heading font-bold text-surface-foreground tracking-tight">
            DESIGN<span className="text-brand-primary">/LAB</span>
          </span>
        </div>

        {/* Asymmetric grid: large contact column, two smaller link columns, social column */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">
          {/* Contact — wider */}
          <div className="lg:col-span-4 min-w-0">
            <h4 className="text-small font-heading font-bold text-brand-primary uppercase tracking-widest mb-6">
              Get In Touch
            </h4>
            <div className="space-y-3">
              <a
                href={`tel:${contactInfo.phone}`}
                className="block text-body font-sans text-surface-foreground hover:text-brand-primary transition-colors"
              >
                {contactInfo.phone}
              </a>
              <a
                href={`mailto:${contactInfo.email}`}
                className="block text-body font-sans text-surface-foreground hover:text-brand-primary transition-colors break-all"
              >
                {contactInfo.email}
              </a>
              <div className="mt-4">
                {contactInfo.address.map((line: string, i: number) => (
                  <p
                    key={i}
                    className="text-body font-sans text-surface-muted-foreground leading-relaxed"
                  >
                    {line}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="lg:col-span-3 min-w-0">
            <h4 className="text-small font-heading font-bold text-brand-primary uppercase tracking-widest mb-6">
              Services
            </h4>
            <ul className="space-y-2.5">
              {servicesLinks.map((link: { label: string; href: string }) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-body font-sans text-surface-muted-foreground hover:text-surface-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Useful Links */}
          <div className="lg:col-span-2 min-w-0">
            <h4 className="text-small font-heading font-bold text-brand-primary uppercase tracking-widest mb-6">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {usefulLinks.map((link: { label: string; href: string }) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-body font-sans text-surface-muted-foreground hover:text-surface-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div className="lg:col-span-3 min-w-0">
            <h4 className="text-small font-heading font-bold text-brand-primary uppercase tracking-widest mb-6">
              Follow Us
            </h4>
            <div className="flex gap-3 flex-wrap">
              {socialLinks.map((social: { platform: string; href: string }) => (
                <a
                  key={social.platform}
                  href={social.href}
                  className="text-body font-sans text-surface-muted-foreground hover:text-surface-foreground transition-colors"
                >
                  {social.platform}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-surface-muted pt-8">
          <p className="text-body font-sans text-surface-muted-foreground text-center">
            {copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
