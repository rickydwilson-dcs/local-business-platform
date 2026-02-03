import Link from 'next/link';

/**
 * FAQ item interface
 */
export interface FAQItem {
  /** Question text */
  question: string;
  /** Answer text */
  answer: string;
}

/**
 * FAQ section props
 */
interface FAQSectionProps {
  /** Array of FAQ items */
  items: FAQItem[];
  /** Section title */
  title?: string;
  /** Section description */
  description?: string;
  /** Optional location context (for location pages) */
  location?: string;
  /** Variant for styling */
  variant?: 'default' | 'location';
  /** Contact URL for the "Get Expert Advice" button */
  contactUrl?: string;
  /** Phone number to display */
  phone?: string;
}

/**
 * FAQ Section Component
 *
 * Displays a list of frequently asked questions with answers.
 * Supports both service and location page variants.
 *
 * @example
 * ```tsx
 * // Service page variant
 * <FAQSection
 *   items={[{ question: "How long does it take?", answer: "Typically 1-2 days." }]}
 *   title="Common Questions"
 * />
 *
 * // Location page variant
 * <FAQSection
 *   items={faqs}
 *   title="Your Questions Answered"
 *   location="Brighton"
 *   variant="location"
 * />
 * ```
 */
export function FAQSection({
  items,
  title = 'Frequently Asked Questions',
  description,
  location,
  variant = 'default',
  contactUrl = '/contact',
  phone,
}: FAQSectionProps) {
  const isLocationVariant = variant === 'location';

  return (
    <section
      className={`py-16 sm:py-20 ${isLocationVariant ? 'bg-surface-background' : 'bg-surface-subtle'}`}
    >
      <div className="mx-auto w-full lg:w-[90%] px-6">
        <div className={isLocationVariant ? 'mx-auto w-full lg:w-[90%]' : ''}>
          {/* Header */}
          <div className={`${isLocationVariant ? 'text-center' : ''} mb-12`}>
            <h2 className="heading-section">{location ? `${location} ${title}` : title}</h2>
            {description && <p className="text-body-lg">{description}</p>}
          </div>

          {/* FAQ Items */}
          <div className="space-y-6">
            {items.map((item, i) => (
              <div
                key={i}
                className={`${isLocationVariant ? 'bg-surface-subtle' : 'bg-surface-background'} border border-surface-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow`}
              >
                <h3 className="text-lg font-semibold text-surface-foreground mb-3 flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-brand-primary rounded-full flex items-center justify-center text-brand-on-primary text-sm font-bold">
                    Q
                  </span>
                  {item.question}
                </h3>
                <div className="ml-9">
                  <p className="text-surface-foreground leading-relaxed">{item.answer}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          {isLocationVariant && location ? (
            <div className="text-center mt-12 p-8 bg-brand-primary/5 rounded-2xl border border-brand-primary/10">
              <h3 className="text-xl font-semibold text-surface-foreground mb-4">
                More Questions About Services in {location}?
              </h3>
              <p className="text-surface-foreground mb-6">
                Our local team knows {location} regulations and requirements inside out. Get expert
                advice for your project.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href={contactUrl} className="btn-primary">
                  Get Expert Advice
                </Link>
                {phone && (
                  <Link href={`tel:${phone.replace(/\s/g, '')}`} className="btn-secondary gap-2">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    Call: {phone}
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center mt-12">
              <p className="text-surface-foreground mb-4">Still have questions?</p>
              {phone ? (
                <Link href={`tel:${phone.replace(/\s/g, '')}`} className="btn-primary gap-2">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  Call Us: {phone}
                </Link>
              ) : (
                <Link href={contactUrl} className="btn-primary">
                  Contact Us
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
