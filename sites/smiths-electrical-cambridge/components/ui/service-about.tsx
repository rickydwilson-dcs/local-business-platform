import Link from 'next/link';

/**
 * About section content interface
 */
export interface AboutContent {
  /** Description of what the service is */
  whatIs: string;
  /** When/why customers need this service */
  whenNeeded: string[];
  /** What customers achieve with this service */
  whatAchieve: string[];
  /** Optional key points */
  keyPoints?: string[];
}

/**
 * Service about props
 */
interface ServiceAboutProps {
  /** Service name for display */
  serviceName: string;
  /** Service slug for fallback content */
  slug: string;
  /** Optional about content from MDX */
  about?: AboutContent;
  /** Contact URL */
  contactUrl?: string;
  /** Trust badges for the compliance section */
  trustBadges?: string[];
}

/**
 * Generate default content for services without about section
 */
function getDefaultContent(slug: string): AboutContent {
  const formattedName = slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  return {
    whatIs: `${formattedName} is a professional solution designed to provide safe, compliant access for your project needs.`,
    whenNeeded: [
      'Construction and building work',
      'Maintenance and repair projects',
      'Safety and access requirements',
      'Professional installation needs',
    ],
    whatAchieve: [
      'Safe working conditions',
      'Regulatory compliance',
      'Professional results',
      'Improved safety standards',
    ],
    keyPoints: [
      'Professional installation service',
      'Full safety compliance',
      'Expert technical support',
      'Comprehensive service guarantee',
    ],
  };
}

/**
 * Service About Component
 *
 * Detailed service information section with two-column layout.
 * Shows what the service is, when it's needed, and what customers achieve.
 *
 * @example
 * ```tsx
 * <ServiceAbout
 *   serviceName="Commercial Services"
 *   slug="commercial-services"
 *   about={{
 *     whatIs: "Our commercial services provide...",
 *     whenNeeded: ["Large projects", "Corporate clients"],
 *     whatAchieve: ["Professional results", "Cost savings"]
 *   }}
 * />
 * ```
 */
export function ServiceAbout({
  serviceName,
  slug,
  about,
  contactUrl = '/contact',
  trustBadges = [],
}: ServiceAboutProps) {
  const content = about || getDefaultContent(slug);

  return (
    <section className="py-16 sm:py-20 bg-surface-background">
      <div className="mx-auto w-full lg:w-[90%] px-6">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <h2 className="text-3xl sm:text-4xl font-bold text-surface-foreground mb-6">
              Professional {serviceName} Services
            </h2>
            <p className="text-body-lg mb-8">{content.whatIs}</p>

            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-surface-foreground">
                When You Need {serviceName}
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {content.whenNeeded.map((need, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 bg-surface-subtle rounded-lg"
                  >
                    <div className="flex-shrink-0 w-6 h-6 bg-brand-primary rounded-full flex items-center justify-center mt-0.5">
                      <svg
                        className="h-4 w-4 text-brand-on-primary"
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
                    <span className="text-surface-foreground font-medium text-sm">{need}</span>
                  </div>
                ))}
              </div>

              {/* Trust/Compliance Box */}
              {trustBadges.length > 0 && (
                <div className="mt-8 p-6 bg-brand-primary/5 rounded-2xl border border-brand-primary/10">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-brand-primary rounded-lg flex items-center justify-center">
                      <svg
                        className="h-6 w-6 text-brand-on-primary"
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
                      <h4 className="font-semibold text-surface-foreground mb-2">
                        Certified & Fully Insured
                      </h4>
                      <p className="text-surface-muted-foreground text-sm leading-relaxed">
                        All our {serviceName.toLowerCase()} services meet industry standards with
                        comprehensive insurance coverage for complete peace of mind.
                        {trustBadges.length > 0 && ` ${trustBadges.join(' • ')}`}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-surface-subtle rounded-2xl p-6 border border-surface-border sticky top-8">
              <h3 className="text-xl font-semibold text-surface-foreground mb-4 flex items-center gap-2">
                <svg
                  className="h-5 w-5 text-brand-primary"
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
                What You Achieve
              </h3>
              <div className="space-y-3">
                {content.whatAchieve.map((achievement, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-surface-background rounded-lg shadow-sm"
                  >
                    <div className="flex-shrink-0 w-2 h-2 bg-brand-primary rounded-full"></div>
                    <span className="text-surface-foreground font-medium text-sm">
                      {achievement}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-surface-border">
                <div className="flex items-center gap-2 text-sm text-surface-foreground mb-4">
                  <svg
                    className="h-4 w-4 text-brand-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  Professional Installation
                </div>
                <p className="text-sm text-surface-muted-foreground mb-4">
                  Expert qualified teams ensuring safe, compliant installation with full
                  certification.
                </p>
                <Link
                  href={contactUrl}
                  className="w-full inline-flex items-center justify-center px-4 py-3 bg-brand-primary text-brand-on-primary font-semibold rounded-lg hover:bg-brand-primary-hover transition-colors text-sm"
                >
                  Get Free Quote
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
