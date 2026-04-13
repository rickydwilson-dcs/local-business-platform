import type { BlogPostPageTemplateProps } from "@platform/core-components";

export function CorvusBlogPostPage({
  siteConfig,
  frontmatter,
  mdxContent,
  schemaNodes,
}: BlogPostPageTemplateProps) {
  return (
    <main className="page-blog-post">
      {schemaNodes}
      {/* corvus blog post layout — stub, to be populated by pipeline */}
      <article className="py-16">
        <h1 className="text-4xl font-bold">{frontmatter.title}</h1>
        <p className="text-muted">{frontmatter.description}</p>
        <div className="prose">{mdxContent}</div>
      </article>
    </main>
  );
}
