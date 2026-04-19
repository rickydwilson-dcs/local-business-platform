import { RevealOnScroll } from "@platform/core-components/components/animation";

export interface SocialProofProviderCardProps {
  sectionHeading?: string;
  providerName?: string;
  providerQuote?: string;
  providerRole?: string;
  providerLink?: string;
  providerLinkLabel?: string;
  providerPhotoSrc?: string;
  providerPhotoAlt?: string;
}

export function SocialProofProviderCard({
  sectionHeading = "Szolgáltatások",
  providerName = "Kovács Andrea",
  providerQuote = "A NaváGarden vendégei számára személyre szabott wellness programokat kínálok, amelyek a test és a lélek harmóniáját szolgálják.",
  providerRole = "Wellness szakértő & Masszőr",
  providerLink = "https://example.com",
  providerLinkLabel = "Weboldal megtekintése",
  providerPhotoSrc = "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=600&q=80",
  providerPhotoAlt = "Kovács Andrea wellness szakértő portré",
}: SocialProofProviderCardProps) {
  return (
    <section className="section bg-surface-background py-20 lg:py-28">
      <div className="container-standard mx-auto px-6 lg:px-12">
        <RevealOnScroll>
          {/* Section heading with the gold accent line */}
          <div className="mb-16">
            <span className="block w-16 h-0.5 bg-brand-primary mb-6" />
            <h2
              className="text-h2 text-brand-secondary"
              style={{ fontFamily: "Audrey, Georgia, serif", fontWeight: 500 }}
            >
              {sectionHeading}
            </h2>
          </div>
        </RevealOnScroll>

        <RevealOnScroll>
          {/* Provider card — asymmetric split */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-0 bg-surface-muted overflow-hidden">
            {/* Text side: 3 columns */}
            <div className="lg:col-span-3 flex flex-col justify-center px-8 py-12 lg:px-14 lg:py-16 min-w-0 min-h-[400px]">
              {/* Large decorative quote mark */}
              <span
                className="text-brand-primary opacity-40 block mb-4"
                style={{ fontFamily: "Georgia, serif", fontSize: "5rem", lineHeight: "1" }}
              >
                &ldquo;
              </span>

              <blockquote
                className="text-h4 text-brand-secondary leading-relaxed mb-8 min-w-[60%] max-w-2xl"
                style={{ fontFamily: "Audrey, Georgia, serif", fontWeight: 400 }}
              >
                {providerQuote}
              </blockquote>

              <div className="flex items-center gap-4 mb-6">
                <span className="w-8 h-px bg-brand-primary" />
                <div>
                  <p
                    className="text-body text-brand-secondary font-semibold"
                    style={{ fontFamily: "Work Sans, system-ui, sans-serif" }}
                  >
                    {providerName}
                  </p>
                  <p
                    className="text-small text-surface-muted-foreground"
                    style={{ fontFamily: "Work Sans, system-ui, sans-serif", fontWeight: 300 }}
                  >
                    {providerRole}
                  </p>
                </div>
              </div>

              {providerLink && (
                <a
                  href={providerLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-brand-primary text-small uppercase tracking-widest hover:gap-3 transition-all duration-300"
                  style={{
                    fontFamily: "Work Sans, system-ui, sans-serif",
                    letterSpacing: "0.12em",
                  }}
                >
                  {providerLinkLabel}
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M6 3h7v7M13 3L3 13" />
                  </svg>
                </a>
              )}
            </div>

            {/* Photo side: 2 columns */}
            <div className="lg:col-span-2 aspect-[3/4] lg:aspect-auto bg-surface-muted overflow-hidden min-h-[400px]">
              <img
                src={providerPhotoSrc}
                alt={providerPhotoAlt}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
