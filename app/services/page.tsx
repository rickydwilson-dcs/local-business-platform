import { listSlugs } from "@/lib/mdx";
import Link from "next/link";

export default async function ServicesPage() {
  const services = await listSlugs("services");

  return (
    <main className="container mx-auto px-4 py-10 prose">
      <h1 className="text-3xl font-bold mb-6">Services</h1>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {services.map(([name, slug]) => (
          <li
            key={slug}
            className="rounded-2xl shadow p-4 hover:shadow-md transition bg-white"
          >
            <Link href={`/services/${slug}`} className="font-medium underline">
              {name}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
