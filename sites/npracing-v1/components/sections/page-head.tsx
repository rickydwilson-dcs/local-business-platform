import { Eyebrow } from './eyebrow';

/**
 * PageHead — the shared interior-page masthead (Merch, News, Contact).
 * Eyebrow, oversized italic condensed H1, lede, and an optional small note,
 * closed off by the hairline rule that separates it from page content.
 */
export interface PageHeadProps {
  eyebrow: string;
  title: string;
  lede?: string;
  /** Small print under the lede — e.g. the merch VAT / fulfilment caveat. */
  note?: React.ReactNode;
}

export function PageHead({ eyebrow, title, lede, note }: PageHeadProps) {
  return (
    <header className="border-b border-surface-card-border pb-14 pt-16 sm:pt-20">
      <div className="container-grid">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="mt-4 max-w-[20ch] text-h1 uppercase italic text-surface-foreground">
          {title}
        </h1>
        {lede && (
          <p className="mt-4 max-w-[56ch] text-lg leading-relaxed text-surface-secondary-foreground">
            {lede}
          </p>
        )}
        {note && <p className="mt-4 text-sm text-surface-tertiary-foreground">{note}</p>}
      </div>
    </header>
  );
}
