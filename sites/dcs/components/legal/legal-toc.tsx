export interface LegalTocItem {
  id: string;
  label: string;
}

/**
 * Plain-anchor in-page nav for long-form legal content. No scroll-spy JS —
 * these pages are text, not an app surface, so a static sticky list is
 * enough and keeps them fast and simple.
 */
export function LegalToc({ items }: { items: LegalTocItem[] }) {
  return (
    <nav aria-label="Table of contents" className="lg:sticky lg:top-28 font-sans">
      <p className="text-xs font-semibold uppercase tracking-wider text-surface-muted-foreground mb-3">
        On this page
      </p>
      <ol className="space-y-1">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className="block py-1.5 pl-3 border-l-2 border-transparent text-sm text-surface-muted-foreground hover:text-brand-primary hover:border-brand-primary transition-colors"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
