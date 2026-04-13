import type { ServicesPageTemplateProps } from "@platform/core-components";

export function CorvusServicesPage({ siteConfig, services }: ServicesPageTemplateProps) {
  return (
    <main className="page-services">
      {/* corvus services layout — stub, to be populated by pipeline */}
      <section className="py-16">
        <h1 className="text-4xl font-bold text-center">Our Services</h1>
      </section>
      <section className="py-8">
        {services.map((s) => (
          <div key={s.slug}>{s.title}</div>
        ))}
      </section>
    </main>
  );
}
