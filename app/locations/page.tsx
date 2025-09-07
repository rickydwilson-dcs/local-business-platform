// app/locations/page.tsx
import Link from "next/link";
import path from "path";
import { promises as fs } from "fs";
import matter from "gray-matter";

export const dynamic = "force-static";

type Item = {
  slug: string;
  title: string;
  description?: string;
};

async function getLocationItems(): Promise<Item[]> {
  const dir = path.join(process.cwd(), "content", "locations");
  const files = await fs.readdir(dir);

  const items: Item[] = [];
  for (const file of files) {
    if (!file.toLowerCase().endsWith(".mdx")) continue;
    const slug = file.replace(/\.mdx$/i, "");
    const full = path.join(dir, file);
    const raw = await fs.readFile(full, "utf8");
    const { data } = matter(raw);

    const title =
      (typeof data.title === "string" && data.title.trim()) ||
      slug
        .split("-")
        .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
        .join(" ");

    items.push({
      slug,
      title,
      description:
        typeof data.description === "string" ? data.description.trim() : undefined,
    });
  }

  return items.sort((a, b) => a.title.localeCompare(b.title));
}

export default async function LocationsPage() {
  const locations = await getLocationItems();

  return (
    <main className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Locations</h1>

      {locations.length === 0 ? (
        <p className="text-gray-600">No locations found.</p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {locations.map(({ slug, title, description }) => (
            <li
              key={slug}
              className="rounded-2xl shadow p-4 hover:shadow-md transition bg-white"
            >
              <h2 className="text-lg font-semibold mb-2">
                <Link href={`/locations/${slug}`} className="underline">
                  {title}
                </Link>
              </h2>
              {description ? (
                <p className="text-sm text-gray-600">{description}</p>
              ) : (
                <p className="text-sm text-gray-600">
                  Professional scaffolding services available in {title}.
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
