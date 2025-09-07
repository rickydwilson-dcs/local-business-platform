import { notFound } from "next/navigation";
import { listSlugs, loadMdx } from "@/lib/mdx";

type Params = { slug: string };

export async function generateStaticParams() {
  const slugs = await listSlugs("services");
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  try {
    const { frontmatter } = await loadMdx({ baseDir: "services", slug });
    return {
      title: frontmatter.title ?? `Service: ${slug.replace(/-/g, " ")}`,
      description:
        frontmatter.description ??
        `Information about ${slug.replace(/-/g, " ")}`,
    };
  } catch {
    return {};
  }
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  try {
    const { content, frontmatter } = await loadMdx({
      baseDir: "services",
      slug,
    });
    return (
      <main className="container mx-auto px-4 py-10 prose">
        {frontmatter.title ? <h1 className="!mb-2">{frontmatter.title}</h1> : null}
        {frontmatter.description ? <p className="lead">{frontmatter.description}</p> : null}
        {content}
      </main>
    );
  } catch {
    notFound();
  }
}
