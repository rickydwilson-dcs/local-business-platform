"use client";

import { useScrollParallax } from "./use-scroll-parallax";

export interface ParallaxSectionProps {
  children: React.ReactNode;
  backgroundImage?: string;
  speed?: number;
  overlay?: boolean;
  overlayOpacity?: number;
  className?: string;
  minHeight?: string;
}

export function ParallaxSection({
  children,
  backgroundImage,
  speed = 0.3,
  overlay = false,
  overlayOpacity = 0.4,
  className,
  minHeight = "400px",
}: ParallaxSectionProps) {
  const parallaxRef = useScrollParallax({ speed });

  return (
    <div
      className={`relative overflow-hidden ${className ?? ""}`}
      style={{ minHeight }}
    >
      {backgroundImage && (
        <div
          ref={parallaxRef as React.RefObject<HTMLDivElement>}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${backgroundImage})` }}
          aria-hidden="true"
        />
      )}

      {overlay && (
        <div
          className="absolute inset-0 bg-surface-inverse"
          style={{ opacity: overlayOpacity }}
          aria-hidden="true"
        />
      )}

      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
