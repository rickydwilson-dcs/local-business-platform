import React from "react";

// ProcessStep - data holder for process step (displayed in 2-column grid)
export interface ProcessStepProps {
  children: string;
}
export const ProcessStep: React.FC<ProcessStepProps> = () => null;

// SidebarItem - data holder for sidebar list items
export interface SidebarItemProps {
  children: string;
}
export const SidebarItem: React.FC<SidebarItemProps> = () => null;

// ServiceIntro - main container with reversed 3-column layout
export interface ServiceIntroProps {
  title: string;
  intro: string;
  stepsTitle?: string;
  sidebarTitle?: string;
  sidebarCta?: string;
  children: React.ReactNode;
}
export const ServiceIntro: React.FC<ServiceIntroProps> = ({
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
    <section className="section-standard bg-surface-card">
      <div className="container-standard grid lg:grid-cols-3 gap-12">
        {/* LEFT SIDEBAR */}
        <div className="lg:col-span-1 order-2 lg:order-1">
          <div className="bg-surface-subtle rounded-2xl p-6 border border-surface-subtle h-fit">
            <h3 className="text-lg font-semibold text-surface-foreground mb-4 flex items-center gap-2">
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
              {sidebarTitle}
            </h3>
            <div className="space-y-3">
              {sidebarItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-surface-card rounded-lg shadow-sm"
                >
                  <div className="flex-shrink-0 w-2 h-2 bg-brand-primary rounded-full"></div>
                  <span className="text-surface-foreground font-medium text-base">{item}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-surface-subtle">
              <div className="flex items-center gap-2 text-base text-surface-foreground mb-4">
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
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                TG20:21 Compliant & Fully Insured
              </div>
              <p className="text-base text-surface-foreground mb-4">
                £10M public liability insurance and CHAS accreditation for complete peace of mind.
              </p>
              <a
                href="/contact"
                className="w-full inline-flex items-center justify-center px-4 py-3 bg-brand-primary text-white font-semibold rounded-lg hover:bg-brand-primary-hover transition-colors text-base"
              >
                {sidebarCta}
              </a>
            </div>
          </div>
        </div>

        {/* RIGHT CONTENT - Main area */}
        <div className="lg:col-span-2 order-1 lg:order-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-surface-foreground mb-6">{title}</h2>
          <p className="text-body-lg mb-8">{intro}</p>

          {/* Process Steps - 2 column grid like original */}
          {processSteps.length > 0 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-surface-foreground">{stepsTitle}</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {processSteps.map((step, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 bg-surface-subtle rounded-lg"
                  >
                    <div className="flex-shrink-0 w-6 h-6 bg-brand-primary rounded-full flex items-center justify-center mt-0.5">
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
                    <span className="text-surface-foreground font-medium text-base">{step}</span>
                  </div>
                ))}
              </div>

              {/* TG20:21 Compliance callout */}
              <div className="mt-8 mb-8 p-6 bg-brand-primary/5 rounded-2xl border border-brand-primary/10">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-brand-primary rounded-lg flex items-center justify-center">
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
                    <h4 className="font-semibold text-surface-foreground mb-2">
                      Professional Installation & Certification
                    </h4>
                    <p className="text-surface-foreground text-base leading-relaxed">
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
