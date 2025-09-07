// /app/services/page.tsx
import Link from "next/link";
import { listSlugs, loadMdx } from "@/lib/mdx";

export default async function ServicesPage() {
  const slugs = await listSlugs("services");
  const items = await Promise.all(
    slugs.map(async (slug) => {
      try {
        const { frontmatter } = await loadMdx({ baseDir: "services", slug });
        return { slug, title: frontmatter.title ?? slug.replace(/-/g, " ") };
      } catch {
        return { slug, title: slug.replace(/-/g, " ") };
      }
    })
  );

  return (
    <main className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Services</h1>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(({ slug, title }) => (
          <li key={slug} className="rounded-2xl shadow p-4 hover:shadow-md transition">
            <Link href={`/services/${slug}`} className="font-medium underline">
              {title}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
