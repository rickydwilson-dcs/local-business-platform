import Link from "next/link";

export interface SolarisFooterProps {
  logoText?: string;
  tagline?: string;
  navColumns?: { heading: string; links: { label: string; href: string }[] }[];
  contact?: { email?: string; phone?: string };
  legal?: { privacyHref?: string; termsHref?: string; cookiesHref?: string };
  copyright?: string;
}

export function SolarisFooter({
  logoText = "DCS",
  tagline,
  navColumns = [],
  contact,
  legal,
  copyright,
}: SolarisFooterProps) {
  return (
    <footer style={{ background: "#2a2e20" }} className="text-white py-16 sm:py-20">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Top grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 mb-12">
          {/* Brand column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <span className="block font-heading text-xl font-bold text-white mb-3">{logoText}</span>
            {tagline && (
              <p
                className="text-sm leading-relaxed max-w-[280px]"
                style={{ color: "rgba(255,255,255,0.7)" }}
              >
                {tagline}
              </p>
            )}
          </div>

          {/* Nav columns */}
          {navColumns.map((col) => (
            <div key={col.heading}>
              <h3 className="font-heading text-xs font-semibold uppercase tracking-widest text-white mb-4">
                {col.heading}
              </h3>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm transition-colors"
                      style={{ color: "rgba(255,255,255,0.7)" }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact column */}
          {contact && (contact.email || contact.phone) && (
            <div>
              <h3 className="font-heading text-xs font-semibold uppercase tracking-widest text-white mb-4">
                Contact
              </h3>
              <div className="space-y-2 text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
                {contact.phone && (
                  <div>
                    <Link
                      href={`tel:${contact.phone.replace(/\s/g, "")}`}
                      className="transition-colors hover:text-white"
                    >
                      {contact.phone}
                    </Link>
                  </div>
                )}
                {contact.email && (
                  <div>
                    <Link
                      href={`mailto:${contact.email}`}
                      className="transition-colors hover:text-white"
                    >
                      {contact.email}
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Bottom bar */}
        <div
          className="border-t pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs"
          style={{ borderColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)" }}
        >
          <p>
            {copyright ?? `\u00A9 ${new Date().getFullYear()} ${logoText}. All rights reserved.`}
          </p>

          {legal && (
            <div className="flex gap-6">
              {legal.privacyHref && (
                <Link href={legal.privacyHref} className="transition-colors hover:text-white">
                  Privacy Policy
                </Link>
              )}
              {legal.termsHref && (
                <Link href={legal.termsHref} className="transition-colors hover:text-white">
                  Terms
                </Link>
              )}
              {legal.cookiesHref && (
                <Link href={legal.cookiesHref} className="transition-colors hover:text-white">
                  Cookies
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
