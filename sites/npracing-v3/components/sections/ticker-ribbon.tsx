/**
 * TickerRibbon — the red scrolling strip above the nav.
 *
 * The track holds two identical copies of the item list so a -50% translate
 * loops seamlessly. Decorative repetition is hidden from assistive tech, and
 * the animation stops entirely under `prefers-reduced-motion`.
 */
export interface TickerRibbonProps {
  items: string[];
}

export function TickerRibbon({ items }: TickerRibbonProps) {
  if (items.length === 0) return null;

  return (
    <div className="overflow-hidden bg-brand-primary border-b-[3px] border-surface-background">
      <div className="flex w-max animate-marquee-fast motion-reduce:animate-none">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex" aria-hidden={copy === 1 ? 'true' : undefined}>
            {items.map((item) => (
              <span
                key={item}
                className="whitespace-nowrap px-8 py-2 font-heading text-lg tracking-[0.08em] uppercase text-on-brand-primary"
              >
                {item}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
