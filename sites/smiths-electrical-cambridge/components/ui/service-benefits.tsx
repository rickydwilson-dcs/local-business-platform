/**
 * Service benefits props
 */
interface ServiceBenefitsProps {
  /** Array of benefit items */
  items: string[];
  /** Section title */
  title?: string;
  /** Section description */
  description?: string;
}

/**
 * Service Benefits Component
 *
 * Displays a grid of service benefits with checkmarks.
 * Used on service pages to highlight key advantages.
 *
 * @example
 * ```tsx
 * <ServiceBenefits
 *   items={[
 *     "Professional installation",
 *     "Safety certified",
 *     "24/7 support",
 *     "Competitive pricing"
 *   ]}
 *   title="Why Choose Us"
 *   description="Discover the advantages of working with our team"
 * />
 * ```
 */
export function ServiceBenefits({
  items,
  title = 'Why Choose Our Services',
  description,
}: ServiceBenefitsProps) {
  return (
    <section className="py-16 sm:py-20 bg-surface-subtle">
      <div className="mx-auto w-full lg:w-[90%] px-6">
        {/* Header */}
        <div className="mx-auto w-full lg:w-[90%] text-center mb-12">
          <h2 className="heading-section">{title}</h2>
          {description && <p className="text-body-lg">{description}</p>}
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mx-auto w-full lg:w-[90%]">
          {items.map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-4 bg-surface-background rounded-lg shadow-sm"
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
              <span className="text-surface-foreground font-medium">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
