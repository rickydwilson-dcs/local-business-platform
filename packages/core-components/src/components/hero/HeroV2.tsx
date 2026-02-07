/**
 * Hero V2 - Split Layout Hero
 * Two-column layout with content on left, visual on right
 * Best for: Modern businesses, SaaS products, tech companies
 */

import React from "react";

export interface HeroV2Props {
  title: string;
  subtitle: string;
  ctaText?: string;
  ctaHref?: string;
  secondaryCtaText?: string;
  secondaryCtaHref?: string;
  imageUrl?: string;
  features?: string[];
}

export function HeroV2({
  title,
  subtitle,
  ctaText = "Get Started",
  ctaHref = "#",
  secondaryCtaText,
  secondaryCtaHref,
  imageUrl,
  features = [],
}: HeroV2Props) {
  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              {title}
            </h1>
            <p className="text-xl text-gray-600 mb-8">{subtitle}</p>

            {/* Features List */}
            {features.length > 0 && (
              <ul className="mb-8 space-y-3">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <svg
                      className="w-6 h-6 text-green-500 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            )}

            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <a
                href={ctaHref}
                className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition shadow-lg"
              >
                {ctaText}
              </a>
              {secondaryCtaText && secondaryCtaHref && (
                <a
                  href={secondaryCtaHref}
                  className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold border-2 border-blue-600 hover:bg-blue-50 transition"
                >
                  {secondaryCtaText}
                </a>
              )}
            </div>
          </div>

          {/* Right Column - Image/Visual */}
          <div>
            {imageUrl ? (
              <img src={imageUrl} alt={title} className="w-full h-auto rounded-2xl shadow-2xl" />
            ) : (
              <div className="w-full aspect-square bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-2xl flex items-center justify-center text-white text-6xl font-bold">
                ✨
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
