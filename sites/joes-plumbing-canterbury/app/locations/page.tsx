import Link from "next/link";
import { getAllContent } from "../../lib/content";

export default async function LocationsPage() {
  const locations = await getAllContent("locations");

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-4">Areas We Serve</h1>
        <p className="text-xl text-gray-600 text-center mb-12">
          Professional plumbing services across Canterbury and Kent
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {locations.map((location) => (
            <Link
              key={location.slug}
              href={`/locations/${location.slug}`}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
            >
              <h2 className="text-xl font-semibold mb-2 text-blue-600">
                {location.frontmatter.title}
              </h2>
              <p className="text-gray-600 text-sm">
                {location.frontmatter.county}
              </p>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
