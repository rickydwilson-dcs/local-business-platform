/**
 * HeroWithImage Component
 *
 * Full-width background image hero with dark overlay and centered content.
 * Designed for homepage and major landing pages.
 * Part of the Orion theme component set.
 *
 * @example
 * ```tsx
 * import { HeroWithImage, AccentUnderline } from "@platform/core-components";
 *
 * <HeroWithImage
 *   imageSrc="/images/electrician-hero.jpg"
 *   imageAlt="Professional electrician working on electrical panel"
 *   heading={
 *     <AccentUnderline as="h1" className="text-5xl md:text-6xl font-bold text-white">
 *       High Quality Electrical Services
 *     </AccentUnderline>
 *   }
 *   subheading="NICEIC Approved Contractor in Eastbourne"
 *   ctaPrimary={{ label: "Get Free Quote", href: "/contact" }}
 *   ctaSecondary={{ label: "Our Services", href: "/services" }}
 *   overlay="dark"
 * />
 * ```
 */

"use client";

import Link from "next/link";
import Image from "next/image";
import { ReactNode } from "react";
import { getImageUrl } from "@/lib/image";

export interface HeroWithImageProps {
  /** Path to hero background image (relative to R2 bucket root) */
  imageSrc: string;
  /** Alt text for background image (important for accessibility) */
  imageAlt: string;
  /** Main heading — can include AccentUnderline for emphasis */
  heading: ReactNode;
  /** Subheading text displayed below main heading */
  subheading?: string;
  /** Primary CTA button */
  ctaPrimary?: { label: string; href: string };
  /** Secondary CTA button */
  ctaSecondary?: { label: string; href: string };
  /** Overlay darkness: 'dark' = black/50, 'darker' = black/70, 'red' = brand/30 */
  overlay?: "dark" | "darker" | "red";
  /** Optional breadcrumb navigation at bottom of hero */
  breadcrumbs?: Array<{ name: string; href: string; current?: boolean }>;
  /** Minimum height of hero section. Defaults to 'min-h-[60vh]'. */
  minHeight?: string;
}

export function HeroWithImage({
  imageSrc,
  imageAlt,
  heading,
  subheading,
  ctaPrimary,
  ctaSecondary,
  overlay = "dark",
  breadcrumbs,
  minHeight = "min-h-[60vh]",
}: HeroWithImageProps) {
  const overlayClasses = {
    dark: "bg-black/50",
    darker: "bg-black/70",
    red: "bg-brand-primary/30",
  };

  return (
    <section className={`relative ${minHeight} flex items-center justify-center overflow-hidden`}>
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={getImageUrl(imageSrc)}
          alt={imageAlt}
          fill
          className="object-cover"
          priority
          sizes="100vw"
          quality={75}
        />
      </div>

      {/* Gradient Overlay */}
      <div className={`absolute inset-0 z-10 ${overlayClasses[overlay]}`} aria-hidden="true" />

      {/* Content Container */}
      <div className="relative z-20 container-standard py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Heading */}
          <div className="mb-6">{heading}</div>

          {/* Subheading */}
          {subheading && (
            <p className="text-xl md:text-2xl text-white/90 mb-8 font-medium">{subheading}</p>
          )}

          {/* CTA Buttons */}
          {(ctaPrimary || ctaSecondary) && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {ctaPrimary && (
                <Link href={ctaPrimary.href} className="btn-primary-lg w-full sm:w-auto">
                  {ctaPrimary.label}
                </Link>
              )}
              {ctaSecondary && (
                <Link
                  href={ctaSecondary.href}
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-brand-primary transition-colors w-full sm:w-auto"
                >
                  {ctaSecondary.label}
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="absolute bottom-8 left-1/2 -translate-x-1/2">
            <ol className="flex items-center space-x-2 text-sm text-white/80">
              {breadcrumbs.map((crumb, index) => (
                <li key={crumb.href} className="flex items-center">
                  {index > 0 && (
                    <svg
                      aria-hidden="true"
                      className="w-4 h-4 mx-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  {crumb.current ? (
                    <span className="font-medium text-white" aria-current="page">
                      {crumb.name}
                    </span>
                  ) : (
                    <Link href={crumb.href} className="hover:text-white transition-colors">
                      {crumb.name}
                    </Link>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}
      </div>
    </section>
  );
}
