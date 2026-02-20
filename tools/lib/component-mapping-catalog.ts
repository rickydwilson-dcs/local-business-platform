/**
 * Component Mapping Catalog
 *
 * Static lookup table mapping detected section patterns to existing
 * core-components. Used by the reference analysis pipeline as a
 * fallback resolver when mapping detected sections to components.
 */

export interface CatalogEntry {
  componentPath: string;
  status: "REUSE" | "ADAPT";
  notes: string;
}

export const COMPONENT_CATALOG: Record<string, CatalogEntry> = {
  "hero:dark-full-bleed":   { componentPath: "components/ui/hero-section.tsx",       status: "ADAPT", notes: "Needs dark background variant" },
  "hero:split":             { componentPath: "components/ui/hero-with-image.tsx",     status: "REUSE", notes: "Good match for split layout" },
  "hero:centered":          { componentPath: "components/ui/hero-section.tsx",        status: "REUSE", notes: "Default centered layout" },
  "cta:full-bleed-band":    { componentPath: "components/ui/cta-section.tsx",         status: "ADAPT", notes: "Add background colour prop" },
  "blog:grid":              { componentPath: "components/ui/blog-post-card.tsx",      status: "REUSE", notes: "Good match for blog card grid" },
  "nav:dark":               { componentPath: "components/ui/site-header.tsx",         status: "REUSE", notes: "Already supports dark appearance" },
  "nav:light":              { componentPath: "components/ui/site-header.tsx",         status: "REUSE", notes: "Default light appearance" },
  "footer:multi-column":    { componentPath: "components/ui/footer.tsx",              status: "REUSE", notes: "Good match" },
  "about:split":            { componentPath: "components/ui/service-about.tsx",       status: "ADAPT", notes: "Adapt for non-service context" },
  "about:capability":       { componentPath: "components/ui/capability-showcase.tsx", status: "ADAPT", notes: "Adapt for general about content" },
  "testimonial:grid":       { componentPath: "components/ui/testimonial-card.tsx",    status: "REUSE", notes: "Good match" },
  "faq:accordion":          { componentPath: "components/ui/faq-section.tsx",         status: "REUSE", notes: "Good match" },
  "pricing:cards":          { componentPath: "components/ui/pricing-packages.tsx",    status: "REUSE", notes: "Good match" },
  "cards:icon-grid":        { componentPath: "components/ui/circular-icon-card.tsx",  status: "REUSE", notes: "Orion-style icon card grid" },
  "cards:standard-grid":    { componentPath: "components/ui/card-grid.tsx",           status: "REUSE", notes: "Generic card grid" },
};
// Sections not in catalog → status: "NEW" → goes to newComponentBacklog
