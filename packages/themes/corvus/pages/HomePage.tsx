import type { HomePageTemplateProps } from "@platform/core-components";

export function CorvusHomePage({
  siteConfig,
  services,
  locations,
  schemaNodes,
}: HomePageTemplateProps) {
  return (
    <main className="page-home">
      {schemaNodes}
      {/* corvus home layout — stub, to be populated by pipeline */}
      <section className="py-16 text-center">
        <h1 className="text-4xl font-bold">{siteConfig.name}</h1>
        <p className="mt-4 text-lg">{siteConfig.tagline}</p>
      </section>
      <section className="py-8">
        {services.map((s) => (
          <div key={s.slug}>{s.title}</div>
        ))}
      </section>
      <section className="py-8">
        {locations.map((l) => (
          <div key={l.slug}>{l.title}</div>
        ))}
      </section>
    </main>
  );
}
