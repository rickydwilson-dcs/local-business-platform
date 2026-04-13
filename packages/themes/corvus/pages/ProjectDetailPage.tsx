import type { ProjectDetailPageTemplateProps } from "@platform/core-components";

export function CorvusProjectDetailPage({
  siteConfig,
  frontmatter,
  mdxContent,
}: ProjectDetailPageTemplateProps) {
  return (
    <main className="page-project-detail">
      {/* corvus project detail layout — stub, to be populated by pipeline */}
      <article className="py-16">
        <h1 className="text-4xl font-bold">{frontmatter.title}</h1>
        <p className="text-muted">{frontmatter.description}</p>
        <div className="prose">{mdxContent}</div>
      </article>
    </main>
  );
}
