interface DesignlabFooterProps {
  siteName: string;
  tagline?: string;
  email?: string;
  services?: Array<{ label: string; href: string }>;
  copyright?: string;
}

export function DesignlabFooter({
  siteName,
  tagline,
  email,
  services,
  copyright,
}: DesignlabFooterProps) {
  return (
    <footer className="bg-surface-inverse text-surface-inverse-foreground">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <p className="font-bold text-lg mb-3">{siteName}</p>
          {tagline && <p className="text-sm opacity-60 leading-relaxed">{tagline}</p>}
        </div>
        {services && services.length > 0 && (
          <div>
            <p className="font-semibold mb-3 text-sm uppercase tracking-wide text-brand-primary">
              Services
            </p>
            <ul className="space-y-2 text-sm opacity-80">
              {services.map((service) => (
                <li key={service.href}>
                  <a href={service.href} className="hover:text-brand-primary transition-colors">
                    {service.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
        {email && (
          <div>
            <p className="font-semibold mb-3 text-sm uppercase tracking-wide text-brand-primary">
              Contact
            </p>
            <ul className="space-y-2 text-sm opacity-80">
              <li>{email}</li>
            </ul>
          </div>
        )}
      </div>
      {copyright && (
        <div className="border-t border-white/10 text-center py-4 text-xs opacity-40">
          {copyright}
        </div>
      )}
    </footer>
  );
}
