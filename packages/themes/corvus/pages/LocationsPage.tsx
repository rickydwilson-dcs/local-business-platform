import type { LocationsPageTemplateProps } from "@platform/core-components";

export function CorvusLocationsPage({ siteConfig, locations }: LocationsPageTemplateProps) {
  return (
    <main className="page-locations">
      {/* corvus locations layout — stub, to be populated by pipeline */}
      <section className="py-16">
        <h1 className="text-4xl font-bold text-center">Our Service Areas</h1>
      </section>
      <section className="py-8">
        {locations.map((l) => (
          <div key={l.slug}>{l.title}</div>
        ))}
      </section>
    </main>
  );
}
