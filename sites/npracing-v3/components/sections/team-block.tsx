import Image from 'next/image';
import type { ReactNode } from 'react';
import { getImageSizes, getImageUrl } from '@/lib/image';
import { SectionTag } from '@/components/ui/section-tag';

/**
 * TeamBlock — the restructured team section from Round 2 of the design review.
 *
 * Photograph on the left, editorial copy on the right, one hairline box around
 * the pair, hard against the credentials strip above it. Generic over its
 * `children` — the homepage passes a condensed teaser matching the approved
 * mockup, while /about passes the full rendered MDX narrative.
 */
export interface TeamBlockProps {
  heading: string;
  /** Rendered MDX body of the brand record. */
  children: ReactNode;
  imageAlt: string;
}

const PROSE_CLASSES = [
  'prose prose-invert max-w-none',
  'prose-headings:font-sans prose-headings:font-extrabold prose-headings:uppercase',
  'prose-headings:tracking-[0.06em] prose-headings:text-surface-foreground',
  'prose-h2:text-base prose-h2:mt-8 prose-h2:mb-2',
  'prose-p:text-body prose-p:text-surface-secondary',
  'prose-li:text-surface-secondary prose-strong:text-surface-foreground',
  'prose-a:text-brand-accent',
].join(' ');

export function TeamBlock({ heading, children, imageAlt }: TeamBlockProps) {
  return (
    <section id="team" className="border-b border-surface-card-border pt-10 pb-24">
      <div className="mx-auto w-full max-w-[80rem] px-6">
        <div className="grid border border-surface-card-border lg:grid-cols-[1fr_1.1fr]">
          <div className="relative min-h-[20rem] lg:min-h-full">
            <Image
              src={getImageUrl('npracing-v3/team/paddock-team-2026-08.jpg')}
              alt={imageAlt}
              fill
              sizes={getImageSizes('card')}
              className="object-cover grayscale-[0.1]"
            />
          </div>

          <div className="flex flex-col justify-center p-8 lg:p-12">
            <SectionTag className="mb-5 self-start">The team</SectionTag>
            <h2 className="text-h2 uppercase text-surface-foreground">{heading}</h2>
            <div className={`mt-5 ${PROSE_CLASSES}`}>{children}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
