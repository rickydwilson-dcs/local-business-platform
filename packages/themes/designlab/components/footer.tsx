/**
 * Footer
 *
 * Footer section
 * Layout: contained
 * Category: Footer
 */

export interface FooterProps {
  /** links */
  links?: Array<{
    title?: string;
    description?: string;
    image?: string;
    href?: string;
    label?: string;
    [key: string]: string | undefined;
  }>;
  /** copyright */
  copyright?: string;
}

export function Footer(props: FooterProps) {
  return (
    <footer className="bg-surface-inverse text-surface-background">
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          {/* Links */}
          {props.links && props.links.length > 0 && (
            <nav aria-label="Footer navigation">
              <ul className="flex flex-wrap gap-4 md:gap-6">
                {props.links.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link?.href}
                      className="text-surface-muted-foreground hover:text-surface-background transition-colors duration-200 text-sm"
                    >
                      {link?.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          {/* Copyright */}
          {props.copyright && (
            <p className="text-surface-muted-foreground text-sm md:text-right">{props.copyright}</p>
          )}
        </div>

        {/* Divider */}
        <div className="mt-8 border-t border-surface-muted opacity-20" />

        {/* Bottom bar */}
        <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <p className="text-surface-muted-foreground text-xs">All rights reserved.</p>
          <div className="flex gap-4">
            <a
              href="#"
              className="text-surface-muted-foreground hover:text-surface-background text-xs transition-colors duration-200"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-surface-muted-foreground hover:text-surface-background text-xs transition-colors duration-200"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
