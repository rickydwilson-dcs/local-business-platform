/**
 * ColorCodeEventsAbout
 *
 * Describes the ColorCode Events organisation and its mission with heading, body copy and learn more CTA
 * Layout: Dark purple background with heading left and body copy right, plus a learn more CTA button
 * Category: Content
 */

export interface ColorCodeEventsAboutProps {
  /** section-heading */
  sectionHeading?: string;
  /** body-copy */
  bodyCopy?: string;
  /** learn-more-cta */
  learnMoreCta?: Array<{ label?: string; href?: string }>;
}

export function ColorCodeEventsAbout(props: ColorCodeEventsAboutProps) {
  return (
    <section className="bg-brand-primary py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          <div>
            <h2 className="text-on-brand-primary text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
              {props["section-heading"] ?? "About ColorCode Events"}
            </h2>
          </div>
          <div className="flex flex-col gap-6">
            <p className="text-on-brand-primary text-base md:text-lg leading-relaxed opacity-90">
              {props["body-copy"] ??
                "ColorCode Events is a community-driven organisation dedicated to creating inclusive, vibrant, and memorable experiences for everyone. Our mission is to bring people together through the power of colour, creativity, and connection — fostering a sense of belonging and joy at every event we produce."}
            </p>
            <div>
              <a
                href="#"
                className="inline-block bg-brand-accent text-on-brand-secondary font-semibold text-sm md:text-base px-6 py-3 rounded-full hover:opacity-90 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2 focus:ring-offset-brand-primary"
              >
                {props["learn-more-cta"] ?? "Learn More"}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
