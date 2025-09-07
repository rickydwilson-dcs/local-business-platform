import { notFound } from "next/navigation";
import { listSlugs, loadMdx } from "@/lib/mdx";

type Params = { slug: string };

export async function generateStaticParams() {
  const slugs = await listSlugs("locations");
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  try {
    const { frontmatter } = await loadMdx({ baseDir: "locations", slug });
    const town = frontmatter.title ?? slug.replace(/-/g, " ");
    return {
      title: `Scaffolding in ${town}`,
      description: frontmatter.description ?? `Local scaffolding services in ${town}.`,
    };
  } catch {
    return {};
  }
}

export default async function LocationDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  try {
    const { content, frontmatter } = await loadMdx({
      baseDir: "locations",
      slug,
    });
    return (
      <main className="container mx-auto px-4 py-10 prose">
        <h1 className="!mb-2">
          {frontmatter.title
            ? `Scaffolding in ${frontmatter.title}`
            : `Scaffolding in ${slug.replace(/-/g, " ")}`}
        </h1>
        {frontmatter.description ? <p className="lead">{frontmatter.description}</p> : null}
        {content}
      </main>
    );
  } catch {
    notFound();
  }
}
