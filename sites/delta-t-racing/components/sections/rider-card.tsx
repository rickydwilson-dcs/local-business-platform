import Image from 'next/image';
import { Instagram } from 'lucide-react';
import type { TeamMember } from '@/lib/team';

/**
 * RiderCard — one rider from content/team/*.mdx: landscape action shot with
 * the race number on a plate, then name, role and a short line. Used on both
 * the homepage rider grid and /team. The rider's own Instagram is linked only
 * when their record carries one.
 */
export interface RiderCardProps {
  rider: TeamMember;
  /** Heading level — h3 inside a homepage section, h2 on /team. */
  as?: 'h2' | 'h3';
}

export function RiderCard({ rider, as: Heading = 'h3' }: RiderCardProps) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-card border border-surface-card-border bg-surface-card">
      <div className="relative aspect-[3/2] overflow-hidden bg-surface-subtle">
        <Image
          src={rider.image.src}
          alt={rider.image.alt}
          width={rider.image.width}
          height={rider.image.height}
          sizes="(min-width: 1024px) 36rem, (min-width: 640px) 50vw, 100vw"
          quality={65}
          className="h-full w-full object-cover"
        />
        {rider.raceNumber && (
          <span
            className="race-plate absolute bottom-4 left-4 h-16 min-w-16 px-3 text-2xl italic"
            aria-hidden="true"
          >
            {rider.raceNumber}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-accent">
          {rider.role}
          {rider.raceNumber && <span className="sr-only">, race number {rider.raceNumber}</span>}
        </p>
        <Heading className="text-h3 uppercase italic text-surface-foreground">{rider.name}</Heading>
        {rider.bike && (
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-surface-tertiary-foreground">
            {rider.bike}
          </p>
        )}
        {rider.description && (
          <p className="mt-3 text-sm leading-relaxed text-surface-secondary-foreground">
            {rider.description}
          </p>
        )}
        {rider.instagramUrl && (
          <a
            href={rider.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-auto inline-flex w-fit items-center gap-2 pt-5 text-sm font-bold uppercase tracking-wide text-surface-secondary-foreground transition-colors hover:text-brand-accent"
          >
            <Instagram className="h-4 w-4" aria-hidden="true" />
            {rider.instagramHandle}
            <span className="sr-only">(opens {rider.name}&rsquo;s Instagram in a new tab)</span>
          </a>
        )}
      </div>
    </article>
  );
}
