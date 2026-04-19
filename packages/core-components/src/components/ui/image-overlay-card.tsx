/**
 * ImageOverlayCard Component
 *
 * Interactive image card with dark gradient and brand-colour hover overlay.
 * Part of the Orion theme component set.
 *
 * @example
 * ```tsx
 * import { ImageOverlayCard } from "@platform/core-components";
 *
 * <ImageOverlayCard
 *   imageSrc="/images/services/installation.jpg"
 *   imageAlt="Electrical installation service"
 *   category="Installation"
 *   title="Complete Electrical Installation"
 *   href="/services/electrical-installation"
 * />
 * ```
 */

import Image from "next/image";
import Link from "next/link";
import { getImageUrl } from "../../lib/image";

export interface ImageOverlayCardProps {
  imageSrc: string;
  imageAlt: string;
  category?: string;
  title: string;
  href: string;
}

export function ImageOverlayCard({
  imageSrc,
  imageAlt,
  category,
  title,
  href,
}: ImageOverlayCardProps) {
  return (
    <Link
      href={href}
      className="group relative block overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300"
    >
      {/* Image Container with aspect ratio */}
      <div className="relative aspect-[16/9] md:aspect-[4/5] w-full overflow-hidden">
        <Image
          src={getImageUrl(imageSrc)}
          alt={imageAlt}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Dark gradient overlay (always visible) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        {/* Brand-colour overlay on hover */}
        <div className="absolute inset-0 bg-brand-primary opacity-0 group-hover:opacity-80 transition-opacity duration-300" />

        {/* Content — sits above overlays */}
        <div className="absolute inset-0 flex flex-col justify-end p-6 z-10">
          {/* Category Badge */}
          {category && (
            <span className="inline-block w-fit mb-3 px-3 py-1 text-xs font-semibold text-white bg-brand-primary rounded-full">
              {category}
            </span>
          )}

          {/* Title */}
          <h3 className="text-xl font-bold text-white mb-2 transition-transform duration-300 group-hover:translate-x-2">
            {title}
          </h3>

          {/* View More indicator */}
          <span className="text-sm text-white/80 group-hover:text-white transition-colors duration-300">
            View More &rarr;
          </span>
        </div>
      </div>
    </Link>
  );
}
