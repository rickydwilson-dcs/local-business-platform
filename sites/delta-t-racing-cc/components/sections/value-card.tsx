/**
 * ValueCard — numbered flat panel used for the homepage "what we're about"
 * grid. Number, title and body are supplied by the caller.
 */
export interface ValueCardProps {
  /** Two-digit index shown in red above the title, e.g. "01". */
  index: string;
  title: string;
  description: string;
}

export function ValueCard({ index, title, description }: ValueCardProps) {
  return (
    <article className="card h-full">
      <span className="font-heading text-sm tracking-[0.1em] text-brand-accent">{index}</span>
      <h3 className="mt-2 text-h4 text-surface-foreground">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-surface-secondary-foreground">
        {description}
      </p>
    </article>
  );
}
