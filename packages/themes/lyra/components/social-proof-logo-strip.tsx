/**
 * ClientLogoStrip
 *
 * Displays logos of notable clients to build trust and credibility
 * Layout: Full-width horizontal row of client logos evenly spaced
 * Category: Social Proof
 */
import { RevealOnScroll } from "@platform/core-components/components/animation";
export interface ClientLogoStripProps {
  /** client-logo-1 */
  clientLogo1?: string;
  /** client-logo-2 */
  clientLogo2?: string;
  /** client-logo-3 */
  clientLogo3?: string;
  /** client-logo-4 */
  clientLogo4?: string;
  /** client-logo-5 */
  clientLogo5?: string;
  /** client-logo-6 */
  clientLogo6?: string;
}
export function ClientLogoStrip(props: ClientLogoStripProps) {
  return (
    <section className="w-full bg-surface-background border-t border-b border-surface-muted py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <RevealOnScroll variant="fade-up">
          <p className="text-center text-sm font-medium uppercase tracking-widest text-surface-muted-foreground mb-8">
            Trusted by leading companies
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 lg:gap-16">
            {props.clientLogo1 && (
              <div className="flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity duration-300">
                <img
                  src={props.clientLogo1}
                  alt="Client logo"
                  className="h-8 md:h-10 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300"
                />
              </div>
            )}
            {props.clientLogo2 && (
              <div className="flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity duration-300">
                <img
                  src={props.clientLogo2}
                  alt="Client logo"
                  className="h-8 md:h-10 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300"
                />
              </div>
            )}
            {props.clientLogo3 && (
              <div className="flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity duration-300">
                <img
                  src={props.clientLogo3}
                  alt="Client logo"
                  className="h-8 md:h-10 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300"
                />
              </div>
            )}
            {props.clientLogo4 && (
              <div className="flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity duration-300">
                <img
                  src={props.clientLogo4}
                  alt="Client logo"
                  className="h-8 md:h-10 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300"
                />
              </div>
            )}
            {props.clientLogo5 && (
              <div className="flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity duration-300">
                <img
                  src={props.clientLogo5}
                  alt="Client logo"
                  className="h-8 md:h-10 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300"
                />
              </div>
            )}
            {props.clientLogo6 && (
              <div className="flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity duration-300">
                <img
                  src={props.clientLogo6}
                  alt="Client logo"
                  className="h-8 md:h-10 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300"
                />
              </div>
            )}
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
