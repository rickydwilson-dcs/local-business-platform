/**
 * HowItStarted
 *
 * Describes the founding story and mission of ColorCode Events with decorative arrows and multi-paragraph text
 * Layout: Two-column layout: decorative arrow row left, multi-paragraph text right on dark navy background
 * Category: Content
 */

export interface HowItStartedProps {
  /** section-heading */
  sectionHeading?: string;
  /** decorative-arrows */
  decorativeArrows?: string;
  /** body-text */
  bodyText?: string;
}

export function HowItStarted(props: HowItStartedProps) {
  return (
    <section className="bg-brand-primary py-16 px-4 md:py-24">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Left column: decorative arrows */}
          <div className="flex flex-col items-start space-y-4" aria-hidden="true">
            <h2 className="text-white text-2xl md:text-3xl font-bold mb-6">
              {props["section-heading"] ?? "How It Started"}
            </h2>
            <div className="flex flex-col space-y-3">
              {(props["decorative-arrows"] ?? ["→", "→", "→", "→", "→"]).map(
                (arrow, index) => (
                  <span
                    key={index}
                    className="text-brand-accent text-4xl md:text-5xl font-bold leading-none"
                  >
                    {arrow}
                  </span>
                )
              )}
            </div>
          </div>

          {/* Right column: multi-paragraph text */}
          <div className="flex flex-col space-y-6">
            {(
              props["body-text"] ?? [
                "ColorCode Events was born out of a simple but powerful idea: that every gathering deserves a splash of personality. Our founders, a group of passionate event designers, noticed that too many events felt generic and forgettable.",
                "In 2018, they set out to change that by building a platform that puts colour, creativity, and community at the heart of every celebration. From intimate birthday parties to large-scale corporate conferences, ColorCode Events brings vibrant energy to every occasion.",
                "Our mission is to make event planning joyful, accessible, and deeply personal. We believe the right colours and atmosphere can transform a simple gathering into an unforgettable experience that people talk about for years.",
                "Today, we work with thousands of clients across the country, helping them craft events that truly reflect who they are. Every event we touch carries our commitment to creativity, quality, and the belief that colour has the power to connect people.",
              ]
            ).map((paragraph, index) => (
              <p
                key={index}
                className="text-surface-background text-base md:text-lg leading-relaxed"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
