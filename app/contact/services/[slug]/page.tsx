// app/contact/services/[slug]/page.tsx
import type { Metadata } from "next";

type Params = { slug: string };

// If you prebuild routes, keep your existing function here.
// export async function generateStaticParams() { ... }

export async function generateMetadata(
  { params }: { params: Promise<Params> }
): Promise<Metadata> {
  const { slug } = await params; // ✅ Next 15 requires awaiting params
  return {
    title: `Contact – ${slug}`,
    description: `Get in touch about our ${slug} service.`,
    openGraph: { title: `Contact – ${slug}`, description: `Enquiry for ${slug}` },
  };
}

export default async function Page(
  { params }: { params: Promise<Params> }
) {
  const { slug } = await params; // ✅ await it here too

  return (
    <main className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Contact us about {slug}</h1>
      {/* your existing form / content goes here */}
    </main>
  );
}
