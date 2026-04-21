import React from "react";
import Link from "next/link";

// LocationTag - data holder for individual location link
export interface LocationTagProps {
  href: string;
  children: string;
}
export const LocationTag: React.FC<LocationTagProps> = () => null;

// RegionCard - data holder for a region with its locations
export interface RegionCardProps {
  title: string;
  children: React.ReactNode;
}
export const RegionCard: React.FC<RegionCardProps> = () => null;

// CoverageSection - main container
export interface CoverageSectionProps {
  title: string;
  titleHighlight?: string;
  badge?: string;
  description?: string;
  ctaText?: string;
  ctaHref?: string;
  children: React.ReactNode;
}
export const CoverageSection: React.FC<CoverageSectionProps> = ({
  title,
  titleHighlight,
  badge,
  description,
  ctaText = "View all service locations",
  ctaHref = "/locations",
  children,
}) => {
  // Extract RegionCards from children
  const regions = React.Children.toArray(children)
    .filter(
      (child): child is React.ReactElement<RegionCardProps> =>
        React.isValidElement(child) && child.type === RegionCard
    )
    .map((regionChild) => {
      // Extract LocationTags from each RegionCard
      const locations = React.Children.toArray(regionChild.props.children)
        .filter(
          (child): child is React.ReactElement<LocationTagProps> =>
            React.isValidElement(child) && child.type === LocationTag
        )
        .map((loc) => ({ href: loc.props.href, name: loc.props.children }));

      return {
        title: regionChild.props.title,
        locations,
      };
    });

  return (
    <section className="section-standard bg-surface-subtle">
      <div className="container-standard">
        {/* Badge */}
        {badge && (
          <div className="flex justify-center mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary/10 text-brand-primary text-sm font-medium rounded-full">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              {badge}
            </span>
          </div>
        )}

        {/* Title */}
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">
          <span className="text-surface-foreground">{title}</span>
          {titleHighlight && (
            <>
              <br />
              <span className="text-brand-primary">{titleHighlight}</span>
            </>
          )}
        </h2>

        {/* Description */}
        {description && (
          <p className="text-surface-tertiary text-center text-lg max-w-2xl mx-auto mb-10">
            {description}
          </p>
        )}

        {/* Region Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {regions.map((region, idx) => (
            <div key={idx} className="bg-surface-card rounded-2xl p-6 shadow-sm">
              {/* Region Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-brand-primary/10 rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-brand-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-surface-foreground">{region.title}</h3>
              </div>

              {/* Location Pills */}
              <div className="flex flex-wrap gap-2">
                {region.locations.map((loc, locIdx) => (
                  <Link
                    key={locIdx}
                    href={loc.href}
                    className="px-4 py-2 bg-surface-subtle hover:ring-2 hover:ring-brand-primary text-surface-secondary text-sm font-medium rounded-full transition-all"
                  >
                    {loc.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="flex justify-center">
          <Link
            href={ctaHref}
            className="inline-flex items-center gap-2 px-8 py-4 bg-brand-primary text-white font-semibold rounded-xl hover:bg-brand-primary-hover transition-colors"
          >
            {ctaText}
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};
