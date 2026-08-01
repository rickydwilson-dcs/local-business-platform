/**
 * ValueStrip — numbered hairline grid of what the team is known for.
 *
 * Values come from site.config.ts (`about.values`), which was repurposed from
 * the brief's "Reputation" section — nothing here is marketing invention.
 */
export interface ValueStripItem {
  title: string;
  description: string;
}

export interface ValueStripProps {
  values: ValueStripItem[];
  label: string;
}

export function ValueStrip({ values, label }: ValueStripProps) {
  if (values.length === 0) return null;

  return (
    <section aria-label={label} className="border-b border-surface-card-border pb-24">
      <div className="mx-auto w-full max-w-[80rem] px-6">
        <ul className="grid border border-surface-card-border sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value, index) => (
            <li
              key={value.title}
              className="border-b border-surface-card-border p-7 last:border-b-0 sm:border-r sm:[&:nth-child(2n)]:border-r-0 lg:border-b-0 lg:border-r lg:[&:nth-child(2n)]:border-r lg:last:border-r-0"
            >
              <span
                aria-hidden="true"
                className="block font-heading text-4xl leading-none text-brand-accent"
              >
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-2.5 font-sans text-base font-extrabold text-surface-foreground">
                {value.title}
              </h3>
              <p className="mt-2 text-small text-surface-secondary">{value.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
