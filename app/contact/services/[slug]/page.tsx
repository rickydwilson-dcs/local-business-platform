import { notFound } from "next/navigation";

// Replace this with your real data source (e.g., Contentlayer allDocuments filter or FS map)
const services = new Set([
  "access-scaffolding","facade-scaffolding","temporary-roof-systems","suspended-scaffolding",
  "public-access-staircases","pavement-gantries-loading-bays","heavy-duty-industrial-scaffolding",
  "scaffold-towers-mast-systems","crash-decks-crane-decks","sheeting-netting-encapsulation",
  "scaffolding-design-drawings","scaffolding-inspections-maintenance","edge-protection",
  "birdcage-scaffolds","scaffold-alarms","staircase-towers"
]);

export async function generateStaticParams() {
  return Array.from(services).map(slug => ({ slug }));
}

export default function ServicePage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  if (!services.has(slug)) notFound();
  // Your MDX renderer should hydrate the MDX matching this slug in /content/services
  return (
    <main className="container mx-auto px-4 py-10">
      <article className="prose">
        <h1>Service: {{slug}}</h1>
        <p>Render the MDX for this service slug here.</p>
      </article>
    </main>
  );
}
