import { notFound } from "next/navigation";

const locations = new Set([
  "hastings","st-leonards-on-sea","bexhill","battle","rye","eastbourne","hailsham","seaford","newhaven","lewes","uckfield",
  "east-sussex","west-sussex","kent","surrey","london","essex","hertfordshire","berkshire","buckinghamshire"
]);

export async function generateStaticParams() {
  return Array.from(locations).map(slug => ({ slug }));
}

export default function LocationPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  if (!locations.has(slug)) notFound();
  return (
    <main className="container mx-auto px-4 py-10">
      <article className="prose">
        <h1>Location: {{slug}}</h1>
        <p>Render the MDX for this location slug here.</p>
      </article>
    </main>
  );
}
