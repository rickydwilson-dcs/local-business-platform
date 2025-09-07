import { notFound } from "next/navigation";
import { listSlugs, loadMdx } from "@/lib/mdx";

type Params = { slug: string };

export async function generateStaticParams() {
  const slugs = await listSlugs("services");
  return slugs.map((slug) => ({ slug }));
}

function humanizeSlug(slug: string) {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function normalizeService(frontmatter: any, slug: string) {
  return (
    (frontmatter?.title as string | undefined)?.trim() || humanizeSlug(slug)
  );
}

function buildPageTitle(frontmatter: any, slug: string) {
  if (frontmatter?.seoTitle) return String(frontmatter.seoTitle).trim();
  return normalizeService(frontmatter, slug);
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  try {
    const { frontmatter } = await loadMdx({ baseDir: "services", slug });
    const title = buildPageTitle(frontmatter, slug);
    const service = normalizeService(frontmatter, slug);
    const description =
      frontmatter?.description ??
      `Professional ${service.toLowerCase()} services across the South East UK.`;

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
    const service = normalizeService(frontmatter, slug);

    return (
      <main className="container mx-auto px-4 py-10 prose">
        <h1 className="!mb-2">{service}</h1>
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
