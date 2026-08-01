/**
 * StatBlocks — the four-up credentials strip that sits directly under the hero.
 *
 * Round 2 of the design review moved this hard against the hero (no top margin)
 * so the red hero underline doubles as the strip's top rule — keep it that way.
 */
export interface StatBlockItem {
  value: string;
  label: string;
  description?: string;
}

export interface StatBlocksProps {
  stats: StatBlockItem[];
  /** Accessible name for the strip. */
  label: string;
}

export function StatBlocks({ stats, label }: StatBlocksProps) {
  if (stats.length === 0) return null;

  return (
    <section aria-label={label} className="border-b border-surface-card-border">
      <dl className="mx-auto grid w-full max-w-[80rem] grid-cols-1 px-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="border-b border-surface-card-border px-0 py-8 sm:px-6 lg:border-b-0 lg:border-r lg:last:border-r-0 lg:first:pl-0"
          >
            <dt className="sr-only">{stat.label}</dt>
            <dd>
              <span className="block font-heading text-[clamp(2rem,3.6vw,3rem)] leading-none text-brand-accent">
                {stat.value}
              </span>
              <span className="mt-1.5 block text-caption uppercase text-surface-tertiary">
                {stat.label}
              </span>
              {stat.description && (
                <span className="mt-2 block text-small text-surface-secondary">
                  {stat.description}
                </span>
              )}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
