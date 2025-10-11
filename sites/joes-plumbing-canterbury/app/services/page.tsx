import Link from "next/link";
import { getAllContent } from "../../lib/content";

export default async function ServicesPage() {
  const services = await getAllContent("services");

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-4">Our Services</h1>
        <p className="text-xl text-gray-600 text-center mb-12">
          Professional plumbing and heating services across Canterbury
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <Link
              key={service.slug}
              href={`/services/${service.slug}`}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
            >
              <h2 className="text-2xl font-semibold mb-3 text-blue-600">
                {service.frontmatter.title}
              </h2>
              <p className="text-gray-600 mb-4">
                {service.frontmatter.description}
              </p>
              <span className="text-blue-600 font-medium">
                Learn more →
              </span>
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
