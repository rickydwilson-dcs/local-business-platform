import { getAllContent, getContentBySlug } from "../../../lib/content";
import { renderMDX } from "../../../lib/mdx";
import Link from "next/link";

export async function generateStaticParams() {
  const services = await getAllContent("services");
  return services.map((service) => ({
    slug: service.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = await getContentBySlug("services", slug);
  return {
    title: service.frontmatter.title,
    description: service.frontmatter.description,
  };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = await getContentBySlug("services", slug);
  const content = await renderMDX(service.content);

  return (
    <main className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <Link
          href="/services"
          className="text-blue-600 hover:text-blue-700 font-medium mb-8 inline-block"
        >
          ← Back to Services
        </Link>

        <article className="prose prose-lg max-w-none">
          {content}
        </article>

        <div className="mt-12 p-6 bg-blue-50 rounded-lg">
          <h3 className="text-2xl font-bold mb-4">Get a Free Quote</h3>
          <p className="text-gray-700 mb-4">
            Interested in this service? Contact us today for a free, no-obligation quote.
          </p>
          <a
            href="tel:01227123456"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition inline-block"
          >
            Call 01227 123456
          </a>
        </div>
      </div>
    </main>
  );
}
