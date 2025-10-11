import { getAllContent, getContentBySlug } from "../../../lib/content";
import { renderMDX } from "../../../lib/mdx";
import Link from "next/link";

export async function generateStaticParams() {
  const locations = await getAllContent("locations");
  return locations.map((location) => ({
    slug: location.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const location = await getContentBySlug("locations", slug);
  return {
    title: location.frontmatter.title,
    description: location.frontmatter.description,
  };
}

export default async function LocationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const location = await getContentBySlug("locations", slug);
  const content = await renderMDX(location.content);

  return (
    <main className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <Link
          href="/locations"
          className="text-blue-600 hover:text-blue-700 font-medium mb-8 inline-block"
        >
          ← Back to Locations
        </Link>

        <article className="prose prose-lg max-w-none">
          {content}
        </article>

        <div className="mt-12 p-6 bg-blue-50 rounded-lg">
          <h3 className="text-2xl font-bold mb-4">Book Our Local Service</h3>
          <p className="text-gray-700 mb-4">
            Need a plumber in {location.frontmatter.slug}? We provide fast, reliable service.
          </p>
          <div className="flex gap-4">
            <a
              href="tel:01227123456"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Call Now
            </a>
            <Link
              href="/services"
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold border-2 border-blue-600 hover:bg-blue-50 transition"
            >
              View Services
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
