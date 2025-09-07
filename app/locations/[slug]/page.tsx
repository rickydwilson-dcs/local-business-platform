import { notFound } from "next/navigation";
import { listSlugs, loadMdx } from "@/lib/mdx";

type Params = { slug: string };

export async function generateStaticParams() {
  const slugs = await listSlugs("locations");
  return slugs.map((slug) => ({ slug }));
}

function humanizeSlug(slug: string) {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function normalizeTown(frontmatter: any, slug: string) {
  const raw =
    (frontmatter?.title as string | undefined)?.trim() ||
    humanizeSlug(slug);
  return raw.replace(/^Scaffolding in\s+/i, "").trim();
}

function buildPageTitle(frontmatter: any, slug: string) {
  if (frontmatter?.seoTitle) return String(frontmatter.seoTitle).trim();
  const town = normalizeTown(frontmatter, slug);
  return `Scaffolding in ${town}`;
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  try {
    const { frontmatter } = await loadMdx({ baseDir: "locations", slug });
    const title = buildPageTitle(frontmatter, slug);
    const town = normalizeTown(frontmatter, slug);
    const description =
      frontmatter?.description ?? `Local scaffolding services in ${town}.`;

    return {
      title,
      description,
      openGraph: { title, description },
      twitter: { title, description },
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
    const town = normalizeTown(frontmatter, slug);
    const h1 = `Scaffolding in ${town}`;

    return (
      <main className="container mx-auto px-4 py-10 prose">
        <h1 className="!mb-2">{h1}</h1>
        {frontmatter?.description ? (
          <p className="lead">{frontmatter.description}</p>
        ) : null}
        {content}
      </main>
    );
  } catch {
    notFound();
  }
}
