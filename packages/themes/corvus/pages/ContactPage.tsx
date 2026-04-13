import type { ContactPageTemplateProps } from "@platform/core-components";

export function CorvusContactPage({ siteConfig }: ContactPageTemplateProps) {
  return (
    <main className="page-contact">
      {/* corvus contact layout — stub, to be populated by pipeline */}
      <section className="py-16 text-center">
        <h1 className="text-4xl font-bold">Contact Us</h1>
        <p className="mt-4">Phone: {siteConfig.phone}</p>
      </section>
    </main>
  );
}
