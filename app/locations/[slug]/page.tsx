import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { listSlugs, loadMdx } from "@/lib/mdx";

type Params = { slug: string };

type Frontmatter = {
  title?: string;
  description?: string;
  seoTitle?: string;
  [key: string]: unknown;
};

export async function generateStaticParams() {
  const slugs = await listSlugs("locations");
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<Params> }
): Promise<Metadata> {
  const { slug } = await params;
  try {
    const { frontmatter } = await loadMdx<{ frontmatter: Frontmatter }>({
      baseDir: "locations",
      slug,
    });
    const titleFromFile = frontmatter.title?.trim();
    const pageTitle = titleFromFile || slug.replace(/-/g, " ");
    // Title should NOT prepend "Scaffolding in" here — content handles headings.
    return {
      title: frontmatter.seoTitle || `${pageTitle} | Colossus Scaffolding`,
      description:
        (frontmatter.description as string | undefined) ??
        `Local scaffolding services in ${pageTitle}.`,
    };
  } catch {
    return {};
  }
}

export default async function LocationDetailPage(
  { params }: { params: Promise<Params> }
) {
  const { slug } = await params;
  try {
    const { content, frontmatter } = await loadMdx<{
      content: React.ReactNode;
      frontmatter: Frontmatter;
    }>({ baseDir: "locations", slug });

    const titleFromFile = frontmatter.title?.trim();
    const heading = titleFromFile || slug.replace(/-/g, " ");

    return (
      <main className="container mx-auto px-4 py-10 prose">
        <h1 className="!mb-2">{heading}</h1>
        {frontmatter.description ? (
          <p className="lead">{String(frontmatter.description)}</p>
        ) : null}
        {content}
      </main>
    );
  } catch {
    notFound();
  }
}
