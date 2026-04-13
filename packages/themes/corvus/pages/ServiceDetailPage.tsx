import type { ServiceDetailPageTemplateProps } from "@platform/core-components";

export function CorvusServiceDetailPage({
  siteConfig,
  frontmatter,
  mdxContent,
  schemaNodes,
}: ServiceDetailPageTemplateProps) {
  return (
    <main className="page-service-detail">
      {schemaNodes}
      {/* corvus service detail layout — stub, to be populated by pipeline */}
      <article className="py-16">
        <h1 className="text-4xl font-bold">{frontmatter.title}</h1>
        <p className="text-muted">{frontmatter.description}</p>
        <div className="prose">{mdxContent}</div>
      </article>
    </main>
  );
}
