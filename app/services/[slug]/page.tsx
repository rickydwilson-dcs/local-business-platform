// app/services/page.tsx
import Link from "next/link";
import path from "path";
import { promises as fs } from "fs";

export const dynamic = "force-static";

type ServiceItem = {
  name: string;
  slug: string;
};

// Convert slug -> title (e.g. "crash-decks-crane-decks" → "Crash Decks & Crane Decks")
function titleizeSlug(slug: string): string {
  const overrides: Record<string, string> = {
    "pavement-gantries-loading-bays": "Pavement Gantries & Loading Bays",
    "crash-decks-crane-decks": "Crash Decks & Crane Decks",
    "sheeting-netting-encapsulation": "Sheeting, Netting & Encapsulation",
    "scaffolding-design-drawings": "Scaffolding Design & Drawings",
    "scaffolding-inspections-maintenance": "Scaffolding Inspections & Maintenance",
    "scaffold-towers-mast-systems": "Scaffold Towers & Mast Systems",
  };

  if (overrides[slug]) return overrides[slug];

  return slug
    .split("-")
    .map((w) => (w.length ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

async function getServices(): Promise<ServiceItem[]> {
  const dir = path.join(process.cwd(), "content", "services");
  const entries = await fs.readdir(dir);

  const items = entries
    .filter((f) => f.toLowerCase().endsWith(".mdx"))
    .map((filename) => {
      const slug = filename.replace(/\.mdx$/i, "");
      return { slug, name: titleizeSlug(slug) };
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  return items;
}

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <main className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Services</h1>

      {services.length === 0 ? (
        <p className="text-gray-600">No services found.</p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {services.map(({ name, slug }) => (
            <li
              key={slug}
              className="rounded-2xl shadow p-4 hover:shadow-md transition bg-white"
            >
              <h2 className="text-lg font-semibold mb-2">
                <Link href={`/services/${slug}`} className="underline">
                  {name}
                </Link>
              </h2>
              <p className="text-sm text-gray-600">
                Learn more about our {name.toLowerCase()} service.
              </p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
