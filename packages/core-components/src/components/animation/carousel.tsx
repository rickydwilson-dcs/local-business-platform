"use client";

import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface CarouselProps {
  children: React.ReactNode;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showDots?: boolean;
  showArrows?: boolean;
  loop?: boolean;
  pauseOnHover?: boolean;
  className?: string;
  slideClassName?: string;
}

export function Carousel({
  children,
  autoPlay = false,
  autoPlayInterval = 5000,
  showDots = true,
  showArrows = true,
  loop = true,
  pauseOnHover = true,
  className,
  slideClassName,
}: CarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const [autoPlayEnabled, setAutoPlayEnabled] = useState(autoPlay);

  const slides = React.Children.toArray(children);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  // Disable auto-play for prefers-reduced-motion
  useEffect(() => {
    if (!autoPlay) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      setAutoPlayEnabled(false);
    }
  }, [autoPlay]);

  // Auto-play interval
  useEffect(() => {
    if (!autoPlayEnabled || !emblaApi) return;
    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, autoPlayInterval);
    return () => clearInterval(interval);
  }, [autoPlayEnabled, emblaApi, autoPlayInterval]);

  const handleMouseEnter = useCallback(() => {
    if (pauseOnHover && autoPlay) setAutoPlayEnabled(false);
  }, [pauseOnHover, autoPlay]);

  const handleMouseLeave = useCallback(() => {
    if (pauseOnHover && autoPlay) {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      if (!mq.matches) setAutoPlayEnabled(true);
    }
  }, [pauseOnHover, autoPlay]);

  const handleFocusCapture = useCallback(() => {
    if (autoPlay) setAutoPlayEnabled(false);
  }, [autoPlay]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        scrollPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        scrollNext();
      }
    },
    [scrollPrev, scrollNext]
  );

  return (
    <div
      className={className}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocusCapture={handleFocusCapture}
      onKeyDown={handleKeyDown}
      role="region"
      aria-roledescription="carousel"
      aria-label="Carousel"
      tabIndex={0}
    >
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`flex-[0_0_100%] min-w-0 ${slideClassName ?? ""}`}
              role="group"
              aria-roledescription="slide"
              aria-label={`Slide ${index + 1} of ${slides.length}`}
            >
              {slide}
            </div>
          ))}
        </div>
      </div>

      {showArrows && (
        <>
          <button
            onClick={scrollPrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-surface-card shadow-md hover:bg-surface-subtle transition-colors"
            aria-label="Previous slide"
            type="button"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={scrollNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-surface-card shadow-md hover:bg-surface-subtle transition-colors"
            aria-label="Next slide"
            type="button"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {showDots && scrollSnaps.length > 0 && (
        <div className="flex justify-center gap-2 mt-4" role="tablist" aria-label="Carousel navigation">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                index === selectedIndex ? "bg-brand-primary" : "bg-surface-muted"
              }`}
              role="tab"
              aria-selected={index === selectedIndex}
              aria-label={`Go to slide ${index + 1}`}
              type="button"
            />
          ))}
        </div>
      )}
    </div>
  );
}
