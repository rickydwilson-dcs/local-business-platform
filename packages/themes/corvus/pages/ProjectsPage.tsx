import type { ProjectsPageTemplateProps } from "@platform/core-components";

export function CorvusProjectsPage({ siteConfig, projects }: ProjectsPageTemplateProps) {
  return (
    <main className="page-projects">
      {/* corvus projects layout — stub, to be populated by pipeline */}
      <section className="py-16">
        <h1 className="text-4xl font-bold text-center">Our Projects</h1>
      </section>
      <section className="py-8">
        {projects.map((p) => (
          <div key={p.slug}>{p.title}</div>
        ))}
      </section>
    </main>
  );
}
