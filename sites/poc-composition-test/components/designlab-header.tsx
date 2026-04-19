interface DesignlabHeaderProps {
  siteName: string;
  navigation: Array<{ label: string; href: string }>;
  primaryCta?: { label: string; href: string };
}

export function DesignlabHeader({ siteName, navigation, primaryCta }: DesignlabHeaderProps) {
  return (
    <header className="bg-surface-inverse text-surface-inverse-foreground sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <span className="font-heading font-bold text-lg tracking-tight">{siteName}</span>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          {navigation.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="opacity-80 hover:opacity-100 hover:text-brand-primary transition-colors"
            >
              {item.label}
            </a>
          ))}
          {primaryCta && (
            <a
              href={primaryCta.href}
              className="bg-brand-primary text-brand-on-primary hover:bg-brand-primary-hover rounded px-4 py-2 font-semibold transition-colors"
            >
              {primaryCta.label}
            </a>
          )}
        </nav>
      </div>
    </header>
  );
}
