import Image from 'next/image';
import { getImageSizes, getImageUrl } from '@/lib/image';
import { SectionTag } from '@/components/ui/section-tag';

/**
 * GalleryStrip — three square frames in one hairline row.
 *
 * Round 2 rewrote this grid to fix an overlap bug: the frames are a plain
 * 3-column grid with a single shared border and no negative margins. Images
 * desaturate on hover only (no reveal animation), so there is nothing for
 * `prefers-reduced-motion` to suppress beyond the colour transition, which is
 * disabled via `motion-reduce`.
 */
interface GalleryFrame {
  src: string;
  alt: string;
}

export interface GalleryStripProps {
  heading: string;
  teamName: string;
  riderName: string;
}

export function GalleryStrip({ heading, teamName, riderName }: GalleryStripProps) {
  const frames: GalleryFrame[] = [
    {
      src: 'npracing-v3/team/action-lean.jpg',
      alt: `${riderName} leant into a corner on the ${teamName} Honda Fireblade`,
    },
    {
      src: 'npracing-v3/team/paddock-team-2026-08.jpg',
      alt: `${teamName} crew on the grid under the team umbrella`,
    },
    {
      src: 'npracing-v3/team/action-chase.jpg',
      alt: `${riderName} chasing another competitor on track`,
    },
  ];

  return (
    <section id="gallery" className="border-b border-surface-card-border py-24">
      <div className="mx-auto w-full max-w-[80rem] px-6">
        <SectionTag>Gallery</SectionTag>
        <h2 className="mt-5 text-h2 uppercase text-surface-foreground">{heading}</h2>

        <ul className="mt-8 grid border border-surface-card-border sm:grid-cols-3">
          {frames.map((frame) => (
            <li
              key={frame.src}
              className="relative aspect-square border-b border-surface-card-border last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0"
            >
              <Image
                src={getImageUrl(frame.src)}
                alt={frame.alt}
                fill
                sizes={getImageSizes('third')}
                className="object-cover grayscale-[0.35] transition-[filter] duration-slow hover:grayscale-0 motion-reduce:transition-none"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
