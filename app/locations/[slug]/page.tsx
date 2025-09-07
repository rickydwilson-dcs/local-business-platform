// app/locations/page.tsx
import Link from "next/link";
import path from "path";
import { promises as fs } from "fs";

// Optional: make this page fully static at build-time
export const dynamic = "force-static";

type LocationItem = {
  name: string;
  slug: string;
};

// Title-case a slug like "east-sussex" -> "East Sussex"
// with a couple of sensible overrides.
function titleizeSlug(slug: string): string {
  const overrides: Record<string, string> = {
    "st-leonards-on-sea": "St Leonards-on-Sea",
  };
  if (overrides[slug]) return overrides[slug];

  // Basic titleize for hyphenated slugs
  return slug
    .split("-")
    .map((w) => (w.length ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

async function getLocations(): Promise<LocationItem[]> {
  const dir = path.join(process.cwd(), "content", "locations");
  const entries = await fs.readdir(dir);

  // Only .mdx files; map to slug + display name
  const items = entries
    .filter((f) => f.toLowerCase().endsWith(".mdx"))
    .map((filename) => {
      const slug = filename.replace(/\.mdx$/i, "");
      return { slug, name: titleizeSlug(slug) };
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  return items;
}

export default async function LocationsPage() {
  const locations = await getLocations();

  return (
    <main className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Locations</h1>

      {locations.length === 0 ? (
        <p className="text-gray-600">No locations found.</p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {locations.map(({ name, slug }) => (
            <li
              key={slug} // ✅ unique & stable
              className="rounded-2xl shadow p-4 hover:shadow-md transition bg-white"
            >
              <h2 className="text-lg font-semibold mb-2">
                <Link href={`/locations/${slug}`} className="underline">
                  {name}
                </Link>
              </h2>
              <p className="text-sm text-gray-600">
                Professional scaffolding services available in {name}.
              </p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
