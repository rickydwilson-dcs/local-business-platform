"use client";

import { useEffect, useRef } from "react";

export interface UseScrollParallaxOptions {
  speed?: number;
  direction?: "vertical" | "horizontal";
  disabled?: boolean;
}

export function useScrollParallax({
  speed = 0.3,
  direction = "vertical",
  disabled = false,
}: UseScrollParallaxOptions = {}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (disabled) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const el = ref.current;
    if (!el) return;

    el.style.willChange = "transform";

    let ticking = false;
    let scrollHandler: (() => void) | null = null;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            scrollHandler = () => {
              if (ticking) return;
              ticking = true;
              requestAnimationFrame(() => {
                if (!el) {
                  ticking = false;
                  return;
                }
                const rect = el.getBoundingClientRect();
                const viewportHeight = window.innerHeight;
                const offset = (rect.top - viewportHeight / 2) * speed;

                if (direction === "vertical") {
                  el.style.transform = `translateY(${offset}px)`;
                } else {
                  el.style.transform = `translateX(${offset}px)`;
                }
                ticking = false;
              });
            };
            window.addEventListener("scroll", scrollHandler, { passive: true });
          } else {
            if (scrollHandler) {
              window.removeEventListener("scroll", scrollHandler);
              scrollHandler = null;
            }
          }
        });
      },
      { threshold: 0 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      if (scrollHandler) {
        window.removeEventListener("scroll", scrollHandler);
      }
      el.style.willChange = "";
    };
  }, [speed, direction, disabled]);

  return ref;
}
