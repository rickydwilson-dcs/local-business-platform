/**
 * Hero V3 - Full-Screen Video/Image Hero
 * Immersive full-screen hero with overlay text
 * Best for: Creative agencies, portfolios, hospitality
 */

import React from "react";

export interface HeroV3Props {
  title: string;
  subtitle: string;
  ctaText?: string;
  ctaHref?: string;
  backgroundVideo?: string;
  backgroundImage?: string;
  overlayOpacity?: number;
}

export function HeroV3({
  title,
  subtitle,
  ctaText = "Explore More",
  ctaHref = "#",
  backgroundVideo,
  backgroundImage,
  overlayOpacity = 0.5,
}: HeroV3Props) {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Media */}
      {backgroundVideo ? (
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={backgroundVideo} type="video/mp4" />
        </video>
      ) : (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${backgroundImage || "https://images.unsplash.com/photo-1497366216548-37526070297c"})`,
          }}
        />
      )}

      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black"
        style={{ opacity: overlayOpacity }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl">
        <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 drop-shadow-2xl">
          {title}
        </h1>
        <p className="text-2xl md:text-3xl text-white mb-12 drop-shadow-lg">
          {subtitle}
        </p>
        <a
          href={ctaHref}
          className="inline-block bg-white text-gray-900 px-12 py-5 rounded-full text-xl font-bold hover:bg-gray-100 transition shadow-2xl transform hover:scale-105"
        >
          {ctaText}
        </a>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="animate-bounce">
          <svg
            className="w-8 h-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}

export default HeroV3;
