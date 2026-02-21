"use client";

import { useEffect, useRef, useState } from "react";

export type RevealVariant = "fade-up" | "fade-in" | "fade-down" | "slide-left" | "slide-right" | "scale-up";

export interface RevealOnScrollProps {
  children: React.ReactNode;
  variant?: RevealVariant;
  delay?: number;
  duration?: number;
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
  className?: string;
  as?: "div" | "section" | "article";
}

const VARIANT_MAP: Record<RevealVariant, { initial: React.CSSProperties; className: string }> = {
  "fade-up": {
    initial: { opacity: 0, transform: "translateY(16px)" },
    className: "animate-fade-in-up",
  },
  "fade-in": {
    initial: { opacity: 0 },
    className: "animate-fade-in",
  },
  "fade-down": {
    initial: { opacity: 0, transform: "translateY(-16px)" },
    className: "animate-fade-in-down",
  },
  "slide-left": {
    initial: { opacity: 0, transform: "translateX(-24px)" },
    className: "animate-slide-in-left",
  },
  "slide-right": {
    initial: { opacity: 0, transform: "translateX(24px)" },
    className: "animate-slide-in-right",
  },
  "scale-up": {
    initial: { opacity: 0, transform: "scale(0.9)" },
    className: "animate-scale-up",
  },
};

export function RevealOnScroll({
  children,
  variant = "fade-up",
  delay,
  duration,
  threshold = 0.1,
  rootMargin = "0px 0px -50px 0px",
  once = true,
  className,
  as: Tag = "div",
}: RevealOnScrollProps) {
  const ref = useRef<HTMLElement>(null);
  const [isHidden, setIsHidden] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    setIsHidden(true);

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsRevealed(true);
            if (once) {
              observer.unobserve(el);
            }
          } else if (!once) {
            setIsRevealed(false);
          }
        });
      },
      { threshold, rootMargin }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, once]);

  const config = VARIANT_MAP[variant];

  const style: React.CSSProperties = {};
  if (isHidden && !isRevealed) {
    Object.assign(style, config.initial);
  }
  if (delay !== undefined) {
    style.animationDelay = `${delay}ms`;
  }
  if (duration !== undefined) {
    style.animationDuration = `${duration}ms`;
  }

  const animationClass = isRevealed ? config.className : "";
  const classes = [className, animationClass].filter(Boolean).join(" ") || undefined;

  return (
    <Tag
      ref={ref as React.RefObject<HTMLDivElement>}
      className={classes}
      style={Object.keys(style).length > 0 ? style : undefined}
      suppressHydrationWarning
    >
      {children}
    </Tag>
  );
}
