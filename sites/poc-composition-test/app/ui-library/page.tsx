import "./field-labels.css";

import { HeroSection } from "@platform/core-components/components/composable";
import { ServiceCards } from "@platform/core-components/components/composable";
import { FeatureGrid } from "@platform/core-components/components/composable";
import { TestimonialGrid } from "@platform/core-components/components/composable";
import { StatsStrip } from "@platform/core-components/components/composable";
import { CTASection } from "@platform/core-components/components/composable";
import { ContentSection } from "@platform/core-components/components/composable";

import {
  heroData,
  heroSlots,
  serviceCardsData,
  serviceCardsSlots,
  featureGridData,
  featureGridSlots,
  testimonialGridData,
  testimonialGridSlots,
  statsStripData,
  statsStripSlots,
  ctaSectionData,
  ctaSectionSlots,
  contentSectionData,
  contentSectionSlots,
} from "./ui-library-sample-data";

import { UILibraryToggle } from "./ui-library-toggle";

interface ComponentEntryProps {
  name: string;
  description: string;
  variant?: string;
  children: React.ReactNode;
}

function ComponentEntry({ name, description, variant, children }: ComponentEntryProps) {
  return (
    <section className="border-b border-surface-card-border">
      <div className="px-6 py-4 bg-surface-subtle flex items-start justify-between">
        <div>
          <h2 className="text-h2 font-semibold font-heading">
            {name}
            {variant ? (
              <span className="ml-2 text-sm font-normal text-surface-muted-foreground font-sans">
                — {variant}
              </span>
            ) : null}
          </h2>
          <p className="text-surface-secondary-foreground text-sm mt-1">{description}</p>
        </div>
        <span className="text-xs font-mono bg-surface-card text-surface-muted-foreground px-2 py-1 rounded border border-surface-card-border mt-1">
          {name}
        </span>
      </div>
      <UILibraryToggle componentName={name}>{children}</UILibraryToggle>
    </section>
  );
}

export default function UILibraryPage() {
  return (
    <div className="bg-surface min-h-screen">
      {/* Page header */}
      <header className="px-6 py-10 border-b border-surface-card-border bg-surface">
        <div className="max-w-4xl">
          <p className="text-sm font-mono text-brand-primary mb-2">Local Business Platform</p>
          <h1 className="text-h1 font-heading mb-3">Component Library</h1>
          <p className="text-surface-secondary-foreground text-lg">
            All 7 composable section components rendered with realistic sample data — FastFlo
            Plumbing &amp; Heating (London). Toggle &quot;Show field labels&quot; on any section to
            see which data field maps to which element.
          </p>
          <p className="text-surface-muted-foreground text-sm mt-3">
            To restyle: open{" "}
            <code className="font-mono text-xs bg-surface-subtle px-1 py-0.5 rounded">
              app/ui-library/page.tsx
            </code>{" "}
            and change the layout props, then save. Hot-reload updates instantly.
          </p>
        </div>
      </header>

      {/* Table of contents */}
      <nav className="px-6 py-4 bg-surface-subtle border-b border-surface-card-border">
        <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-brand-primary">
          {[
            "HeroSection",
            "ServiceCards",
            "FeatureGrid",
            "TestimonialGrid",
            "StatsStrip",
            "CTASection",
            "ContentSection",
          ].map((name) => (
            <li key={name}>
              <a href={`#${name}`} className="hover:underline">
                {name}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* HeroSection — split variant */}
      <div id="HeroSection">
        <ComponentEntry
          name="HeroSection"
          description="Primary above-fold hero. First section of any page."
          variant="split — text left, image right"
        >
          <HeroSection
            data={heroData}
            slots={heroSlots}
            layout={{ align: "split", background: "inverse", fullBleed: true }}
          />
        </ComponentEntry>

        {/* HeroSection — centered variant */}
        <ComponentEntry
          name="HeroSection"
          description="Primary above-fold hero."
          variant="center — no image, brand background"
        >
          <HeroSection
            data={heroData}
            slots={{ ...heroSlots, showHeroImage: false, showTrustBadges: false }}
            layout={{ align: "center", background: "brand", fullBleed: true }}
          />
        </ComponentEntry>
      </div>

      {/* ServiceCards */}
      <div id="ServiceCards">
        <ComponentEntry
          name="ServiceCards"
          description="Grid of service cards — services, products, or offerings."
        >
          <ServiceCards
            data={serviceCardsData}
            slots={serviceCardsSlots}
            layout={{ columns: 3, background: "surface" }}
          />
        </ComponentEntry>
      </div>

      {/* FeatureGrid */}
      <div id="FeatureGrid">
        <ComponentEntry
          name="FeatureGrid"
          description="Icon-card grid for features, benefits, or USPs."
        >
          <FeatureGrid
            data={featureGridData}
            slots={featureGridSlots}
            layout={{ columns: 3, background: "subtle" }}
          />
        </ComponentEntry>
      </div>

      {/* TestimonialGrid */}
      <div id="TestimonialGrid">
        <ComponentEntry
          name="TestimonialGrid"
          description="Grid of review/testimonial cards with stars and author info."
        >
          <TestimonialGrid
            data={testimonialGridData}
            slots={testimonialGridSlots}
            layout={{ columns: 3, background: "surface" }}
          />
        </ComponentEntry>
      </div>

      {/* StatsStrip */}
      <div id="StatsStrip">
        <ComponentEntry
          name="StatsStrip"
          description="Horizontal social proof strip — key metrics and achievements."
        >
          <StatsStrip
            data={statsStripData}
            slots={statsStripSlots}
            layout={{ columns: 4, background: "brand", paddingY: "standard" }}
          />
        </ComponentEntry>
      </div>

      {/* CTASection — center/brand variant */}
      <div id="CTASection">
        <ComponentEntry
          name="CTASection"
          description="Full-width conversion band with heading and CTA buttons."
          variant="center — brand background"
        >
          <CTASection
            data={ctaSectionData}
            slots={ctaSectionSlots}
            layout={{ background: "inverse", align: "center" }}
          />
        </ComponentEntry>

        {/* CTASection — left/surface variant */}
        <ComponentEntry
          name="CTASection"
          description="Full-width conversion band with heading and CTA buttons."
          variant="left — surface background"
        >
          <CTASection
            data={ctaSectionData}
            slots={{ ...ctaSectionSlots, showSecondaryCta: true, showTrustLine: true }}
            layout={{ background: "subtle", align: "left" }}
          />
        </ComponentEntry>
      </div>

      {/* ContentSection — split variant */}
      <div id="ContentSection">
        <ComponentEntry
          name="ContentSection"
          description="Flexible content section: heading + prose + optional image."
          variant="split — text left, image right"
        >
          <ContentSection
            data={contentSectionData}
            slots={{ ...contentSectionSlots, showImage: true, showCta: true }}
            layout={{ align: "split", background: "surface" }}
          />
        </ComponentEntry>

        {/* ContentSection — prose variant */}
        <ComponentEntry
          name="ContentSection"
          description="Flexible content section: heading + prose + optional image."
          variant="center — prose only, no image"
        >
          <ContentSection
            data={contentSectionData}
            slots={{ ...contentSectionSlots, showImage: false, showList: true }}
            layout={{ align: "center", background: "subtle" }}
          />
        </ComponentEntry>
      </div>

      {/* Footer */}
      <footer className="px-6 py-8 bg-surface-subtle border-t border-surface-card-border">
        <p className="text-xs text-surface-muted-foreground font-mono">
          Local Business Platform — Component Library — {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}
