import type { AboutPageTemplateProps } from "@platform/core-components";
import Link from "next/link";

interface CastorAboutPageProps extends AboutPageTemplateProps {
  /** Company story paragraphs */
  storyParagraphs?: string[];
  /** Blockquote text */
  blockquote?: string;
  /** Trust bar certifications */
  certifications?: Array<{ icon: string; label: string }>;
  /** Company values */
  values?: Array<{ icon: string; title: string; description: string }>;
  /** Team members */
  team?: Array<{
    name: string;
    role: string;
    description: string;
    imageUrl?: string;
  }>;
}

export function CastorAboutPage({
  siteConfig,
  storyParagraphs,
  blockquote,
  certifications,
  values,
  team,
}: CastorAboutPageProps) {
  const defaultStory = [
    `Founded with a single mission: to provide the residents of ${siteConfig.address.city} with a level of craftsmanship that is increasingly rare in the modern industry.`,
    "Our values haven't changed. We believe in punctuality, transparent pricing, and technical mastery. As a family-run business, we understand the importance of a safe, functional home environment for your loved ones.",
  ];

  const defaultCertifications = [
    { icon: "verified", label: "Fully Certified" },
    { icon: "star", label: "Trusted Trader" },
    { icon: "handshake", label: "Trade Approved" },
    { icon: "school", label: "Industry Member" },
  ];

  const defaultValues = [
    {
      icon: "schedule",
      title: "Reliability",
      description:
        "We respect your time. When we set an appointment, we show up - equipped and ready to resolve your issue without delay.",
    },
    {
      icon: "construction",
      title: "Quality Workmanship",
      description:
        "No shortcuts. Every aspect of our work is executed to the highest industry standards for lasting peace of mind.",
    },
    {
      icon: "location_on",
      title: "Local Knowledge",
      description: `Deeply rooted in ${siteConfig.address.city}, we understand the specific requirements unique to the local area.`,
    },
  ];

  const storyContent = storyParagraphs ?? defaultStory;
  const certsContent = certifications ?? defaultCertifications;
  const valuesContent = values ?? defaultValues;

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[614px] flex items-center">
        <div className="absolute inset-0 z-0">
          {/* TODO: wire to heroImage prop or R2 asset */}
          <div
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: "url('/images/hero-about.jpg')",
            }}
          />
          <div className="absolute inset-0" style={{ background: "rgba(26,58,107,0.75)" }} />
        </div>
        <div className="relative z-10 max-w-[1280px] mx-auto px-6 md:px-8 w-full">
          <div className="max-w-2xl">
            <h1 className="font-headline text-white text-[clamp(2.5rem,5vw,4rem)] font-extrabold leading-[1.1] tracking-[-0.025em] mb-6">
              Our Story
            </h1>
            <p className="text-white/90 font-body text-xl leading-relaxed max-w-lg">
              Built on a foundation of integrity and technical excellence.
            </p>
          </div>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-16 md:py-28 bg-surface-background">
        <div className="max-w-[1280px] mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="font-headline text-surface-foreground text-3xl md:text-4xl font-bold mb-6">
                Rooted in {siteConfig.address.city}
              </h2>
              <div className="space-y-4 font-body text-surface-foreground leading-relaxed opacity-90">
                {storyContent.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
                {blockquote && (
                  <blockquote className="border-l-4 border-brand-primary pl-6 py-2 my-8 italic text-xl text-brand-primary font-medium">
                    &ldquo;{blockquote}&rdquo;
                  </blockquote>
                )}
              </div>
            </div>
            <div className="rounded-xl overflow-hidden shadow-lg border border-surface-subtle">
              {/* TODO: wire to about image or R2 asset */}
              <div className="w-full aspect-[4/3] bg-surface-muted" />
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-12 bg-surface-muted">
        <div className="max-w-[1280px] mx-auto px-6 md:px-8">
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-60">
            {certsContent.map((cert, i) => (
              <div
                key={i}
                className="grayscale hover:grayscale-0 transition-all duration-300 flex flex-col items-center group"
              >
                <span className="material-symbols-outlined text-4xl mb-2 text-surface-muted-foreground group-hover:text-brand-accent">
                  {cert.icon}
                </span>
                <span className="font-body font-semibold text-xs tracking-widest uppercase">
                  {cert.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Cards */}
      <section className="py-20 bg-surface-background">
        <div className="max-w-[1280px] mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {valuesContent.map((value, i) => (
              <div
                key={i}
                className="group bg-surface-card p-10 rounded-xl border border-surface-subtle shadow-sm hover:bg-brand-primary transition-all duration-300 cursor-default"
              >
                <span className="material-symbols-outlined text-4xl text-brand-accent group-hover:text-white mb-6 block">
                  {value.icon}
                </span>
                <h3 className="font-headline text-2xl font-bold text-surface-foreground group-hover:text-white mb-4">
                  {value.title}
                </h3>
                <p className="font-body text-surface-muted-foreground group-hover:text-white/80 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Grid */}
      {team && team.length > 0 && (
        <section className="py-20 bg-surface-muted">
          <div className="max-w-[1280px] mx-auto px-6 md:px-8">
            <div className="mb-16">
              <h2 className="font-headline text-surface-foreground text-3xl md:text-4xl font-bold mb-6">
                Meet The Experts
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, i) => (
                <div
                  key={i}
                  className="relative group overflow-hidden rounded-xl bg-surface-card shadow-sm border border-surface-subtle h-[400px]"
                >
                  {/* TODO: wire to team member images or R2 assets */}
                  <div className="w-full h-full bg-surface-muted transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-primary via-transparent to-transparent opacity-90" />
                  <div className="absolute bottom-0 left-0 p-6 w-full transform transition-all duration-300">
                    <p className="text-white font-bold text-xl mb-1">{member.name}</p>
                    <p className="text-brand-accent font-body text-sm font-semibold mb-4">
                      {member.role}
                    </p>
                    <div className="max-h-0 group-hover:max-h-32 overflow-hidden transition-all duration-500 ease-in-out">
                      <p className="text-white/90 text-sm font-body leading-snug">
                        {member.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Band */}
      <section className="py-24 bg-brand-primary text-white">
        <div className="max-w-[1280px] mx-auto px-6 md:px-8 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="max-w-2xl">
              <h2 className="font-headline text-white text-3xl md:text-4xl font-bold mb-6">
                Ready to discuss your project?
              </h2>
              <p className="text-white/80 font-body text-lg leading-relaxed">
                From simple repairs to full installations, our team is ready to deliver the quality
                you deserve.
              </p>
            </div>
            <div className="shrink-0">
              <Link
                href={siteConfig.cta.primary.href}
                className="bg-brand-accent text-white px-10 py-5 rounded-lg font-bold text-lg active:-translate-y-px transition-all duration-150 shadow-lg shadow-black/20"
              >
                {siteConfig.cta.primary.label}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
