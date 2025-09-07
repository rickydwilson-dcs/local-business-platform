import { listSlugs } from "@/lib/mdx";
import Link from "next/link";

export default async function LocationsPage() {
  const locations = await listSlugs("locations");

  return (
    <main className="container mx-auto px-4 py-10 prose">
      <h1 className="text-3xl font-bold mb-6">Locations</h1>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {locations.map(([name, slug]) => (
          <li
            key={slug}
            className="rounded-2xl shadow p-4 hover:shadow-md transition bg-white"
          >
            <Link href={`/locations/${slug}`} className="font-medium underline">
              {name}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
