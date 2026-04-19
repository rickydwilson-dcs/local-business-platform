export interface FooterContactInfoProps {
  logoText?: string;
  tagline?: string;
  ownerNames?: string[];
  email?: string;
  phoneNumbers?: string[];
  address?: string;
  socialLinks?: Array<{ label: string; href: string }>;
  legalLinks?: Array<{ label: string; href: string }>;
  copyright?: string;
}

export function FooterContactInfo({
  logoText = "NaváGarden",
  tagline = "Ahol a Balaton varázsa otthonra talál.",
  ownerNames = ["Szabó Péter", "Szabó Katalin"],
  email = "info@navagarden.hu",
  phoneNumbers = ["+36 30 123 4567", "+36 30 765 4321"],
  address = "8256 Ábrahámhegy, Petőfi Sándor utca 12.",
  socialLinks = [{ label: "Instagram", href: "https://instagram.com" }],
  legalLinks = [
    { label: "Adatkezelési tájékoztató", href: "#" },
    { label: "Impresszum", href: "#" },
  ],
  copyright = "© 2024 NaváGarden. Minden jog fenntartva.",
}: FooterContactInfoProps) {
  return (
    <footer className="bg-brand-secondary py-16 lg:py-24">
      <div className="container-narrow mx-auto px-6 lg:px-12 text-center">
        {/* Logo */}
        <a
          href="/"
          className="text-h3 font-bold text-surface-background inline-block mb-4"
          style={{ fontFamily: "Audrey, Georgia, serif" }}
        >
          {logoText}
        </a>

        {/* Gold separator */}
        <span className="block w-12 h-0.5 bg-brand-primary mx-auto mb-6" />

        {/* Tagline */}
        <p
          className="text-body text-surface-muted mb-10"
          style={{ fontFamily: "Work Sans, system-ui, sans-serif", fontWeight: 300, opacity: 0.7 }}
        >
          {tagline}
        </p>

        {/* Owner names */}
        <div className="mb-6">
          {ownerNames.map((name) => (
            <p
              key={name}
              className="text-body text-surface-background"
              style={{ fontFamily: "Work Sans, system-ui, sans-serif", fontWeight: 400 }}
            >
              {name}
            </p>
          ))}
        </div>

        {/* Contact details — stacked, centered */}
        <div className="space-y-2 mb-8">
          <a
            href={`mailto:${email}`}
            className="block text-brand-primary text-body hover:underline transition-all"
            style={{ fontFamily: "Work Sans, system-ui, sans-serif" }}
          >
            {email}
          </a>
          {phoneNumbers.map((phone) => (
            <a
              key={phone}
              href={`tel:${phone.replace(/\s/g, "")}`}
              className="block text-surface-background text-small opacity-70 hover:opacity-100 transition-opacity"
              style={{ fontFamily: "Work Sans, system-ui, sans-serif", fontWeight: 300 }}
            >
              {phone}
            </a>
          ))}
          <p
            className="text-surface-background text-small opacity-50 pt-2"
            style={{ fontFamily: "Work Sans, system-ui, sans-serif", fontWeight: 300 }}
          >
            {address}
          </p>
        </div>

        {/* Social links */}
        <div className="flex justify-center gap-6 mb-12">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-surface-background opacity-60 hover:opacity-100 hover:text-brand-primary transition-all duration-300"
              aria-label={link.label}
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <circle cx="12" cy="12" r="5" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
              </svg>
            </a>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-surface-muted opacity-20 mb-8" />

        {/* Legal links and copyright */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
          {legalLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-caption text-surface-background opacity-40 hover:opacity-70 transition-opacity"
              style={{ fontFamily: "Work Sans, system-ui, sans-serif", fontWeight: 300 }}
            >
              {link.label}
            </a>
          ))}
        </div>
        <p
          className="text-caption text-surface-background opacity-30 mt-4"
          style={{ fontFamily: "Work Sans, system-ui, sans-serif", fontWeight: 300 }}
        >
          {copyright}
        </p>
      </div>
    </footer>
  );
}
