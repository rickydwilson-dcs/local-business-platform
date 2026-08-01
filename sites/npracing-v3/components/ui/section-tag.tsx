/**
 * SectionTag — the small solid-red label that opens every section in the
 * "Number 51" design. Decorative labelling only; it is never a heading, so it
 * renders as a <span> and the real heading follows it.
 */
export interface SectionTagProps {
  children: React.ReactNode;
  className?: string;
}

export function SectionTag({ children, className = '' }: SectionTagProps) {
  return (
    <span
      className={`inline-block bg-brand-primary text-on-brand-primary font-heading text-base tracking-[0.1em] uppercase px-3.5 py-1.5 leading-none ${className}`}
    >
      {children}
    </span>
  );
}

/**
 * Eyebrow — small uppercase kicker preceded by a red rule. Used in the hero
 * where a solid tag would compete with the headline.
 */
export function Eyebrow({ children, className = '' }: SectionTagProps) {
  return (
    <span
      className={`inline-flex items-center gap-2.5 text-caption font-extrabold uppercase text-brand-accent ${className}`}
    >
      <span aria-hidden="true" className="inline-block h-0.5 w-6 bg-brand-primary" />
      {children}
    </span>
  );
}
