import type { BlogPageTemplateProps } from "@platform/core-components";

export function CorvusBlogListPage({ siteConfig, posts }: BlogPageTemplateProps) {
  return (
    <main className="page-blog-list">
      {/* corvus blog list layout — stub, to be populated by pipeline */}
      <section className="py-16">
        <h1 className="text-4xl font-bold text-center">{siteConfig.name} Blog</h1>
      </section>
      <section className="py-8">
        {posts.map((p) => (
          <div key={p.slug}>{p.title}</div>
        ))}
      </section>
    </main>
  );
}
