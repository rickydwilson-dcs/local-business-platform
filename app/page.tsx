export const metadata = {
  title: "Colossus Scaffolding — South East UK",
  description: "Safe, TG20:21-compliant scaffolding across the South East.",
};

export default function HomePage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <section className="rounded-2xl p-8 shadow bg-white">
        <h1 className="text-4xl font-bold mb-3">Colossus Scaffolding</h1>
        <p className="text-lg text-gray-700 mb-6">
          We design, erect and dismantle safe, compliant scaffolding for residential, commercial and industrial projects.
        </p>
        <ul className="list-disc pl-6 text-gray-700 mb-8">
          <li>CISRS teams · TG20:21 & SG4:22 best practice</li>
          <li>Temporary works design and RAMS provided</li>
          <li>Clean sites, clear communication, on-time dismantle</li>
        </ul>
        <div className="flex gap-3">
          <a href="/services" className="px-4 py-2 rounded-xl shadow hover:shadow-md transition underline">All Services</a>
          <a href="/locations" className="px-4 py-2 rounded-xl shadow hover:shadow-md transition underline">All Locations</a>
          <a href="/contact" className="px-4 py-2 rounded-xl shadow hover:shadow-md transition underline">Contact</a>
        </div>
      </section>
    </main>
  );
}
