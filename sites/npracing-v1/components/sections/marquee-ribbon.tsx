/**
 * MarqueeRibbon — the horizontal auto-scrolling ticker band.
 *
 * The item list is rendered twice so the -50% translate loops seamlessly;
 * the duplicate copy is aria-hidden so screen readers only announce it once.
 * The animation itself is declared inside a
 * `@media (prefers-reduced-motion: no-preference)` block in app/globals.css,
 * so a reduced-motion visitor simply sees a static strip.
 */
export interface MarqueeRibbonProps {
  items: string[];
  ariaLabel?: string;
  className?: string;
}

function Track({ items, hidden }: { items: string[]; hidden?: boolean }) {
  return (
    <ul className="flex items-center" aria-hidden={hidden || undefined}>
      {items.map((item, index) => (
        <li
          key={`${item}-${index}`}
          className="flex items-center gap-8 whitespace-nowrap px-8 py-3 font-heading text-lg uppercase tracking-[0.06em] text-surface-tertiary-foreground"
        >
          <span>{item}</span>
          {/* Literal glyph, not a numeric HTML entity — a decimal character
              reference reads as a hardcoded hex colour to the no-hex gate. */}
          <span className="text-brand-primary" aria-hidden="true">
            ✦
          </span>
        </li>
      ))}
    </ul>
  );
}

export function MarqueeRibbon({
  items,
  ariaLabel = 'Team highlights',
  className,
}: MarqueeRibbonProps) {
  if (items.length === 0) return null;

  return (
    <section aria-label={ariaLabel} className={['marquee', className].filter(Boolean).join(' ')}>
      <div className="marquee-track">
        <Track items={items} />
        <Track items={items} hidden />
      </div>
    </section>
  );
}
