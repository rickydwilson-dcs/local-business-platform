// mdx-components.tsx (PROJECT ROOT)
import React from "react";
import Link from "next/link";
import Image from "next/image";
import type { MDXComponents as MDXMap } from "mdx/types";
import { Schema } from "@/components/Schema";
import { ServiceBenefits } from "@/components/ui/service-benefits";
import { ContentCard } from "@/components/ui/content-card";

// ============================================================================
// MDX Wrapper Components for reusing existing UI components
// ============================================================================

// ServiceLink - data holder for service card props
interface ServiceLinkProps {
  href: string;
  title: string;
  description: string;
  image?: string;
}
const ServiceLink: React.FC<ServiceLinkProps> = () => null;

// RelatedServices - renders ContentCard grid from ServiceLink children
interface RelatedServicesProps {
  title?: string;
  children: React.ReactNode;
}
const RelatedServices: React.FC<RelatedServicesProps> = ({ title, children }) => {
  const services = React.Children.toArray(children)
    .filter(
      (child): child is React.ReactElement<ServiceLinkProps> =>
        React.isValidElement(child) && child.type === ServiceLink
    )
    .map((child) => child.props);

  return (
    <section className="section-standard bg-white">
      <div className="container-standard">
        {title && <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">{title}</h2>}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, idx) => (
            <ContentCard
              key={idx}
              title={service.title}
              description={service.description}
              href={service.href}
              image={service.image}
              contentType="services"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

// BenefitItem - data holder for benefit text
interface BenefitItemProps {
  children: string;
}
const BenefitItem: React.FC<BenefitItemProps> = () => null;

// Benefits - renders ServiceBenefits component from BenefitItem children
interface BenefitsProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
}
const Benefits: React.FC<BenefitsProps> = ({ title, description, children }) => {
  const items = React.Children.toArray(children)
    .filter(
      (child): child is React.ReactElement<BenefitItemProps> =>
        React.isValidElement(child) && child.type === BenefitItem
    )
    .map((child) => child.props.children);

  return <ServiceBenefits items={items} title={title} description={description} />;
};

// ============================================================================
// CoverageSection - Regional location cards with pill tags
// ============================================================================

// LocationTag - data holder for individual location link
interface LocationTagProps {
  href: string;
  children: string;
}
const LocationTag: React.FC<LocationTagProps> = () => null;

// RegionCard - data holder for a region with its locations
interface RegionCardProps {
  title: string;
  children: React.ReactNode;
}
const RegionCard: React.FC<RegionCardProps> = () => null;

// CoverageSection - main container
interface CoverageSectionProps {
  title: string;
  titleHighlight?: string;
  badge?: string;
  description?: string;
  ctaText?: string;
  ctaHref?: string;
  children: React.ReactNode;
}
const CoverageSection: React.FC<CoverageSectionProps> = ({
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
    <section className="section-standard bg-gray-50">
      <div className="container-standard">
        {/* Badge */}
        {badge && (
          <div className="flex justify-center mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-brand-blue/10 text-brand-blue text-sm font-medium rounded-full">
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
          <span className="text-gray-900">{title}</span>
          {titleHighlight && (
            <>
              <br />
              <span className="text-brand-blue">{titleHighlight}</span>
            </>
          )}
        </h2>

        {/* Description */}
        {description && (
          <p className="text-gray-600 text-center text-lg max-w-2xl mx-auto mb-10">{description}</p>
        )}

        {/* Region Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {regions.map((region, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm">
              {/* Region Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-brand-blue/10 rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-brand-blue"
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
                <h3 className="text-xl font-bold text-gray-900">{region.title}</h3>
              </div>

              {/* Location Pills */}
              <div className="flex flex-wrap gap-2">
                {region.locations.map((loc, locIdx) => (
                  <Link
                    key={locIdx}
                    href={loc.href}
                    className="px-4 py-2 bg-gray-100 hover:ring-2 hover:ring-brand-blue text-gray-700 text-sm font-medium rounded-full transition-all"
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
            className="inline-flex items-center gap-2 px-8 py-4 bg-brand-blue text-white font-semibold rounded-xl hover:bg-brand-blue-hover transition-colors"
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

// ============================================================================
// ServiceIntro - Reversed layout component (sidebar left, content right)
// ============================================================================

// ProcessStep - data holder for process step (displayed in 2-column grid)
interface ProcessStepProps {
  children: string;
}
const ProcessStep: React.FC<ProcessStepProps> = () => null;

// SidebarItem - data holder for sidebar list items
interface SidebarItemProps {
  children: string;
}
const SidebarItem: React.FC<SidebarItemProps> = () => null;

// ServiceIntro - main container with reversed 3-column layout
interface ServiceIntroProps {
  title: string;
  intro: string;
  stepsTitle?: string;
  sidebarTitle?: string;
  sidebarCta?: string;
  children: React.ReactNode;
}
const ServiceIntro: React.FC<ServiceIntroProps> = ({
  title,
  intro,
  stepsTitle = "Our Process",
  sidebarTitle = "Why Choose Us",
  sidebarCta = "Get Free Quote",
  children,
}) => {
  const childArray = React.Children.toArray(children);

  // Extract SidebarItems for sidebar
  const sidebarItems = childArray
    .filter(
      (child): child is React.ReactElement<SidebarItemProps> =>
        React.isValidElement(child) && child.type === SidebarItem
    )
    .map((child) => child.props.children);

  // Extract ProcessSteps for main content (2-column grid)
  const processSteps = childArray
    .filter(
      (child): child is React.ReactElement<ProcessStepProps> =>
        React.isValidElement(child) && child.type === ProcessStep
    )
    .map((child) => child.props.children);

  return (
    <section className="section-standard bg-white">
      <div className="container-standard grid lg:grid-cols-3 gap-12">
        {/* LEFT SIDEBAR */}
        <div className="lg:col-span-1 order-2 lg:order-1">
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 h-fit">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <svg
                className="h-5 w-5 text-brand-blue"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              {sidebarTitle}
            </h3>
            <div className="space-y-3">
              {sidebarItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm"
                >
                  <div className="flex-shrink-0 w-2 h-2 bg-brand-blue rounded-full"></div>
                  <span className="text-gray-900 font-medium text-sm">{item}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-2 text-sm text-gray-800 mb-4">
                <svg
                  className="h-4 w-4 text-brand-blue"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                TG20:21 Compliant & Fully Insured
              </div>
              <p className="text-sm text-gray-800 mb-4">
                £10M public liability insurance and CHAS accreditation for complete peace of mind.
              </p>
              <a
                href="/contact"
                className="w-full inline-flex items-center justify-center px-4 py-3 bg-brand-blue text-white font-semibold rounded-lg hover:bg-brand-blue-hover transition-colors text-sm"
              >
                {sidebarCta}
              </a>
            </div>
          </div>
        </div>

        {/* RIGHT CONTENT - Main area */}
        <div className="lg:col-span-2 order-1 lg:order-2">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">{title}</h2>
          <p className="text-body-lg mb-8">{intro}</p>

          {/* Process Steps - 2 column grid like original */}
          {processSteps.length > 0 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900">{stepsTitle}</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {processSteps.map((step, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0 w-6 h-6 bg-brand-blue rounded-full flex items-center justify-center mt-0.5">
                      <svg
                        className="h-4 w-4 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <span className="text-gray-900 font-medium text-sm">{step}</span>
                  </div>
                ))}
              </div>

              {/* TG20:21 Compliance callout */}
              <div className="mt-8 mb-8 p-6 bg-brand-blue/5 rounded-2xl border border-brand-blue/10">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-brand-blue rounded-lg flex items-center justify-center">
                    <svg
                      className="h-6 w-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Professional Installation & Certification
                    </h4>
                    <p className="text-gray-800 text-sm leading-relaxed">
                      Every scaffold receives a full handover certificate. We conduct 7-day
                      statutory inspections throughout your hire, plus inspections after adverse
                      weather or modifications.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

// ============================================================================
// Blog-Specific Components
// ============================================================================

// InfoBox - Callout/highlight box for important information
interface InfoBoxProps {
  type?: "info" | "tip" | "warning" | "success";
  title?: string;
  children: React.ReactNode;
}
const InfoBox: React.FC<InfoBoxProps> = ({ type = "info", title, children }) => {
  const styles = {
    info: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      icon: "text-blue-600",
      title: "text-blue-900",
    },
    tip: {
      bg: "bg-green-50",
      border: "border-green-200",
      icon: "text-green-600",
      title: "text-green-900",
    },
    warning: {
      bg: "bg-amber-50",
      border: "border-amber-200",
      icon: "text-amber-600",
      title: "text-amber-900",
    },
    success: {
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      icon: "text-emerald-600",
      title: "text-emerald-900",
    },
  };

  const icons = {
    info: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    ),
    tip: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
      />
    ),
    warning: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      />
    ),
    success: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    ),
  };

  const s = styles[type];

  return (
    <div className={`${s.bg} ${s.border} border rounded-xl p-5 my-8`}>
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <svg
            className={`w-6 h-6 ${s.icon}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {icons[type]}
          </svg>
        </div>
        <div className="flex-1">
          {title && <h4 className={`font-semibold ${s.title} mb-2`}>{title}</h4>}
          <div className="text-gray-700 text-sm leading-relaxed [&>p]:my-0">{children}</div>
        </div>
      </div>
    </div>
  );
};

// FeatureCard - Individual feature/scaffold type card
interface FeatureCardProps {
  title: string;
  icon?: "scaffold" | "home" | "building" | "factory" | "heritage" | "mobile" | "suspended";
  children: React.ReactNode;
}
const FeatureCard: React.FC<FeatureCardProps> = ({ title, icon = "scaffold", children }) => {
  const icons: Record<string, React.ReactNode> = {
    scaffold: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
      />
    ),
    home: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
      />
    ),
    building: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
      />
    ),
    factory: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
      />
    ),
    heritage: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"
      />
    ),
    mobile: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
      />
    ),
    suspended: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 14l-7 7m0 0l-7-7m7 7V3"
      />
    ),
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 bg-brand-blue/10 rounded-xl flex items-center justify-center">
          <svg
            className="w-6 h-6 text-brand-blue"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {icons[icon] || icons.scaffold}
          </svg>
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-gray-900 mb-2">{title}</h4>
          <div className="text-gray-700 text-sm leading-relaxed [&>p]:my-0 [&>ul]:my-2 [&>ul]:space-y-1 [&_li]:p-0 [&_li]:bg-transparent [&_li]:text-sm">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

// FeatureGrid - Container for FeatureCards
interface FeatureGridProps {
  columns?: 1 | 2 | 3;
  children: React.ReactNode;
}
const FeatureGrid: React.FC<FeatureGridProps> = ({ columns = 2, children }) => {
  const colClass = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  };

  return <div className={`grid ${colClass[columns]} gap-6 my-8`}>{children}</div>;
};

// ComparisonTable - For comparing options
interface ComparisonRowProps {
  label: string;
  children: React.ReactNode;
}
const ComparisonRow: React.FC<ComparisonRowProps> = () => null;

interface ComparisonTableProps {
  headers: string[];
  children: React.ReactNode;
}
const ComparisonTable: React.FC<ComparisonTableProps> = ({ headers, children }) => {
  const rows = React.Children.toArray(children)
    .filter(
      (child): child is React.ReactElement<ComparisonRowProps> =>
        React.isValidElement(child) && child.type === ComparisonRow
    )
    .map((child) => ({
      label: child.props.label,
      content: child.props.children,
    }));

  return (
    <div className="overflow-x-auto my-8">
      <table className="w-full border-collapse bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200">
        <thead>
          <tr className="bg-gray-50">
            {headers.map((header, idx) => (
              <th
                key={idx}
                className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b border-gray-200"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
              <td className="px-4 py-3 text-sm font-medium text-gray-900 border-b border-gray-100">
                {row.label}
              </td>
              <td className="px-4 py-3 text-sm text-gray-700 border-b border-gray-100">
                {row.content}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// CheckList - Styled checklist for best suited/advantages
interface CheckListProps {
  title?: string;
  type?: "check" | "bullet" | "number";
  children: React.ReactNode;
}
const CheckList: React.FC<CheckListProps> = ({ title, type = "check", children }) => {
  return (
    <div className="my-4">
      {title && <p className="font-semibold text-gray-900 mb-3">{title}</p>}
      <ul className="space-y-2">
        {React.Children.map(children, (child, idx) => {
          if (!React.isValidElement(child)) return null;
          const childProps = child.props as { children?: React.ReactNode };
          return (
            <li key={idx} className="flex items-start gap-3 text-gray-700">
              {type === "check" && (
                <svg
                  className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
              {type === "bullet" && (
                <span className="w-2 h-2 bg-brand-blue rounded-full flex-shrink-0 mt-2" />
              )}
              {type === "number" && (
                <span className="w-6 h-6 bg-brand-blue text-white text-sm font-semibold rounded-full flex items-center justify-center flex-shrink-0">
                  {idx + 1}
                </span>
              )}
              <span>{childProps.children}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

// QuoteBlock - Highlighted quote/callout
interface QuoteBlockProps {
  author?: string;
  role?: string;
  children: React.ReactNode;
}
const QuoteBlock: React.FC<QuoteBlockProps> = ({ author, role, children }) => {
  return (
    <blockquote className="my-8 border-l-4 border-brand-blue bg-gray-50 rounded-r-xl p-6">
      <div className="text-gray-800 text-lg italic leading-relaxed mb-4">{children}</div>
      {author && (
        <footer className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-blue rounded-full flex items-center justify-center text-white font-semibold">
            {author.charAt(0)}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{author}</p>
            {role && <p className="text-sm text-gray-600">{role}</p>}
          </div>
        </footer>
      )}
    </blockquote>
  );
};

// ImageWithCaption - Blog image with caption
interface ImageWithCaptionProps {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
}
const ImageWithCaption: React.FC<ImageWithCaptionProps> = ({
  src,
  alt,
  caption,
  width = 800,
  height = 500,
}) => {
  return (
    <figure className="my-8">
      <div className="relative rounded-xl overflow-hidden shadow-md">
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="w-full h-auto object-cover"
        />
      </div>
      {caption && (
        <figcaption className="mt-3 text-sm text-gray-600 text-center italic">{caption}</figcaption>
      )}
    </figure>
  );
};

// StepByStep - Numbered steps for processes
interface StepProps {
  title: string;
  children: React.ReactNode;
}
const Step: React.FC<StepProps> = () => null;

interface StepByStepProps {
  title?: string;
  children: React.ReactNode;
}
const StepByStep: React.FC<StepByStepProps> = ({ title, children }) => {
  const steps = React.Children.toArray(children)
    .filter(
      (child): child is React.ReactElement<StepProps> =>
        React.isValidElement(child) && child.type === Step
    )
    .map((child) => ({
      title: child.props.title,
      content: child.props.children,
    }));

  return (
    <div className="my-8">
      {title && <h3 className="text-xl font-bold text-gray-900 mb-6">{title}</h3>}
      <div className="space-y-4">
        {steps.map((step, idx) => (
          <div key={idx} className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-brand-blue text-white rounded-full flex items-center justify-center font-bold text-lg">
                {idx + 1}
              </div>
            </div>
            <div className="flex-1 pb-4 border-b border-gray-100 last:border-0">
              <h4 className="font-semibold text-gray-900 mb-2">{step.title}</h4>
              <div className="text-gray-700 text-sm leading-relaxed [&>p]:my-0">{step.content}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// MDX Components Map - Must be defined AFTER all component definitions
// ============================================================================

// Default components map used by both native MDX pages (app/*.mdx)
// and by next-mdx-remote (we'll also import this in [slug] pages)
const mdxComponents: MDXMap = {
  // Links - blue with underline
  a: (props) => {
    const href = typeof props.href === "string" ? props.href : "";
    const isInternal = href.startsWith("/");
    if (isInternal) {
      return (
        <Link
          href={href}
          className="text-brand-blue hover:text-brand-blue-hover font-medium underline underline-offset-2 transition-colors"
        >
          {props.children}
        </Link>
      );
    }
    return (
      <a
        {...props}
        className="text-brand-blue hover:text-brand-blue-hover font-medium underline underline-offset-2 transition-colors"
      />
    );
  },

  // H2 - Large bold heading (NOT blue, NOT underlined)
  h2: (p) => (
    <h2 className={`text-2xl sm:text-3xl font-bold text-gray-900 mt-12 mb-6 ${p.className || ""}`}>
      {p.children}
    </h2>
  ),

  // H3 - Medium heading
  h3: (p) => (
    <h3 className={`text-xl font-semibold text-gray-900 mt-8 mb-4 ${p.className || ""}`}>
      {p.children}
    </h3>
  ),

  // Paragraph
  p: (p) => (
    <p className={`text-gray-700 leading-relaxed my-4 ${p.className || ""}`}>{p.children}</p>
  ),

  // Unordered list - vertical stack
  ul: (p) => <ul className={`space-y-3 my-6 ${p.className || ""}`}>{p.children}</ul>,

  // Ordered list - vertical stack with counter
  ol: (p) => (
    <ol className={`space-y-4 my-6 ${p.className || ""}`} style={{ counterReset: "item" }}>
      {p.children}
    </ol>
  ),

  // List item - card with blue dot indicator
  li: (p) => (
    <li className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg list-none">
      <div className="flex-shrink-0 w-2 h-2 bg-brand-blue rounded-full mt-2" />
      <div className="text-gray-800">{p.children}</div>
    </li>
  ),

  // Strong/bold text
  strong: (p) => (
    <strong className={`font-semibold text-gray-900 ${p.className || ""}`}>{p.children}</strong>
  ),

  // Horizontal rule
  hr: () => <hr className="my-10 border-t border-gray-200" />,

  // Images
  img: (p) => {
    const { src = "", alt = "", width, height, ...rest } = p;
    const w = typeof width === "number" ? width : 1200;
    const h = typeof height === "number" ? height : 800;
    return (
      <Image
        src={src}
        alt={alt}
        width={w}
        height={h}
        {...rest}
        className={`rounded-xl ${p.className || ""}`}
      />
    );
  },

  Schema,

  // Custom MDX wrapper components
  RelatedServices,
  ServiceLink,
  Benefits,
  BenefitItem,
  CoverageSection,
  RegionCard,
  LocationTag,
  ServiceIntro,
  ProcessStep,
  SidebarItem,

  // Blog components
  InfoBox,
  FeatureCard,
  FeatureGrid,
  ComparisonTable,
  ComparisonRow,
  CheckList,
  QuoteBlock,
  ImageWithCaption,
  StepByStep,
  Step,
};

export default mdxComponents;

// This hook is how Next's native MDX discovers your components map.
// It MUST be exported from a file named exactly "mdx-components.(js|tsx)" at the project root.
export function useMDXComponents(components: MDXMap): MDXMap {
  return { ...mdxComponents, ...components };
}
