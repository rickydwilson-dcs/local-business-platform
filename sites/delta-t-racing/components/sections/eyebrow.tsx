/**
 * Eyebrow — the small red kicker that sits above every Grid Box heading.
 *
 * Visuals (leading rule, tracking, colour) live in the `.eyebrow` class in
 * app/globals.css so the rule pseudo-element can reference the brand CSS
 * custom property directly.
 */
export interface EyebrowProps {
  children: React.ReactNode;
  className?: string;
}

export function Eyebrow({ children, className }: EyebrowProps) {
  return <span className={['eyebrow', className].filter(Boolean).join(' ')}>{children}</span>;
}
