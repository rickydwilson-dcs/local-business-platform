import type { AboutPageTemplateProps } from "@platform/core-components";

export function CorvusAboutPage({ siteConfig }: AboutPageTemplateProps) {
  return (
    <main className="page-about">
      {/* corvus about layout — stub, to be populated by pipeline */}
      <section className="py-16 text-center">
        <h1 className="text-4xl font-bold">About {siteConfig.name}</h1>
        <p className="mt-4 text-lg">{siteConfig.tagline}</p>
      </section>
    </main>
  );
}
