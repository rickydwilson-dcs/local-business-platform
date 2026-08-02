import type { ReactNode } from 'react';
import { SectionTag } from '@/components/ui/section-tag';

/**
 * PageHead — the standard masthead for every inner page in the "Number 51"
 * design: red section tag, oversized display heading, lede, optional note.
 */
export interface PageHeadProps {
  tag: string;
  heading: string;
  lede?: string;
  note?: ReactNode;
}

export function PageHead({ tag, heading, lede, note }: PageHeadProps) {
  return (
    <header className="border-b border-surface-card-border pb-12 pt-16">
      <div className="mx-auto w-full max-w-[80rem] px-6">
        <SectionTag>{tag}</SectionTag>
        <h1 className="mt-5 max-w-[18ch] text-h1 uppercase text-surface-foreground">{heading}</h1>
        {lede && <p className="mt-4 max-w-[56ch] text-body text-surface-secondary">{lede}</p>}
        {note && <p className="mt-3 text-small text-surface-tertiary">{note}</p>}
      </div>
    </header>
  );
}
