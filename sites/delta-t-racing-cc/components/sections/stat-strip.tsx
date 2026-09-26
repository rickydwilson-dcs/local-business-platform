/**
 * StatStrip — the four-across hairline-divided credentials band that sits
 * directly under the hero. Grid + dividers come from `.stat-strip` in
 * app/globals.css; everything else is theme-token Tailwind.
 */
export interface StatStripItem {
  /** Large condensed value, e.g. "2004" or "#51". */
  value: string;
  /** Small uppercase caption underneath. */
  label: string;
}

export interface StatStripProps {
  items: StatStripItem[];
  /** Accessible name for the surrounding region. */
  ariaLabel?: string;
  className?: string;
}

export function StatStrip({ items, ariaLabel = 'Team at a glance', className }: StatStripProps) {
  if (items.length === 0) return null;

  return (
    <section aria-label={ariaLabel} className={className}>
      <div className="container-grid">
        <dl className="stat-strip">
          {items.map((item) => (
            <div key={`${item.value}-${item.label}`}>
              <dt className="sr-only">{item.label}</dt>
              <dd className="m-0">
                <span className="block font-heading text-3xl md:text-4xl leading-none text-surface-foreground">
                  {item.value}
                </span>
                <span className="mt-2 block text-xs font-bold uppercase tracking-[0.12em] text-surface-tertiary-foreground">
                  {item.label}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
