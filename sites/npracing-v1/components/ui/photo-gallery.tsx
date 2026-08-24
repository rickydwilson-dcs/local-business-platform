'use client';

import { useState } from 'react';
import Image from 'next/image';
import { GalleryLightbox } from './gallery-lightbox';

export type GalleryItem =
  | { type: 'image'; src: string; alt: string; width: number; height: number }
  | { type: 'video'; src: string; poster: string; ariaLabel: string };

interface PhotoGalleryProps {
  items: GalleryItem[];
}

const TILE_CLASSES =
  'aspect-[4/3] w-full rounded-lg border border-surface-card-border object-cover transition-opacity group-hover:opacity-90';

export function PhotoGallery({ items }: PhotoGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {items.map((item, index) => (
          <button
            key={item.type === 'image' ? item.src : item.src + index}
            type="button"
            onClick={() => setSelectedIndex(index)}
            className="group relative cursor-pointer overflow-hidden rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2"
            aria-label={
              item.type === 'image' ? `View larger: ${item.alt}` : `Play video: ${item.ariaLabel}`
            }
          >
            {item.type === 'image' ? (
              <Image
                src={item.src}
                alt={item.alt}
                width={item.width}
                height={item.height}
                sizes="(min-width: 640px) 33vw, 50vw"
                quality={65}
                className={TILE_CLASSES}
              />
            ) : (
              <>
                <Image
                  src={item.poster}
                  alt={item.ariaLabel}
                  width={640}
                  height={480}
                  sizes="(min-width: 640px) 33vw, 50vw"
                  quality={65}
                  className={TILE_CLASSES}
                />
                <span
                  className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors group-hover:bg-black/30"
                  aria-hidden="true"
                >
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 shadow-lg transition-transform group-hover:scale-110">
                    <svg
                      className="ml-1 h-6 w-6 text-black"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                </span>
              </>
            )}
          </button>
        ))}
      </div>

      <GalleryLightbox
        items={items}
        selectedIndex={selectedIndex ?? 0}
        isOpen={selectedIndex !== null}
        onClose={() => setSelectedIndex(null)}
        onNavigate={setSelectedIndex}
      />
    </>
  );
}
