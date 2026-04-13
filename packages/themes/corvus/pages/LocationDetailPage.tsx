import type { LocationDetailPageTemplateProps } from "@platform/core-components";

export function CorvusLocationDetailPage({
  siteConfig,
  frontmatter,
  mdxContent,
  schemaNodes,
}: LocationDetailPageTemplateProps) {
  return (
    <main className="page-location-detail">
      {schemaNodes}
      {/* corvus location detail layout — stub, to be populated by pipeline */}
      <article className="py-16">
        <h1 className="text-4xl font-bold">{frontmatter.title}</h1>
        <p className="text-muted">{frontmatter.description}</p>
        <div className="prose">{mdxContent}</div>
      </article>
    </main>
  );
}
