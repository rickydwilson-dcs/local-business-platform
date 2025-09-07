// app/contact/locations/[slug]/page.tsx
import type { Metadata } from "next";

type Params = { slug: string };

// If you generate static params, keep your existing function here.
// export async function generateStaticParams() { ... }

export async function generateMetadata(
  { params }: { params: Promise<Params> }
): Promise<Metadata> {
  const { slug } = await params; // ✅ Next 15: params is a Promise
  return {
    title: `Contact – ${slug}`,
    description: `Get in touch about projects in ${slug}.`,
  };
}

export default async function Page(
  { params }: { params: Promise<Params> }
) {
  const { slug } = await params; // ✅ Next 15: params is a Promise

  return (
    <main className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Contact us in {slug}</h1>
      {/* your existing form / content goes here */}
    </main>
  );
}
