/**
 * Hero V1 - Classic Centered Hero
 * Simple, centered layout with title, subtitle, and CTA
 * Best for: Traditional businesses, professional services
 */

import React from "react";

export interface HeroV1Props {
  title: string;
  subtitle: string;
  ctaText?: string;
  ctaHref?: string;
  backgroundImage?: string;
}

export function HeroV1({
  title,
  subtitle,
  ctaText = "Get Started",
  ctaHref = "#",
  backgroundImage,
}: HeroV1Props) {
  return (
    <section
      className="relative bg-gradient-to-b from-gray-50 to-white py-24"
      style={
        backgroundImage
          ? {
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : undefined
      }
    >
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          {title}
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
          {subtitle}
        </p>
        <a
          href={ctaHref}
          className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition shadow-lg"
        >
          {ctaText}
        </a>
      </div>
    </section>
  );
}

export default HeroV1;
