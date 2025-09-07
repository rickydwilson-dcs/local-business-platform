export default function ContactServicesPage() {
  const services: [string, string][] = [
    ["Access Scaffolding", "access-scaffolding"],
    ["Birdcage Scaffolds", "birdcage-scaffolds"],
    ["Crash Decks & Crane Decks", "crash-decks-crane-decks"],
    ["Edge Protection", "edge-protection"],
    ["Facade Scaffolding", "facade-scaffolding"],
    ["Heavy Duty Industrial Scaffolding", "heavy-duty-industrial-scaffolding"],
    ["Pavement Gantries & Loading Bays", "pavement-gantries-loading-bays"],
    ["Public Access Staircases", "public-access-staircases"],
    ["Scaffold Alarms", "scaffold-alarms"],
    ["Scaffold Towers & Mast Systems", "scaffold-towers-mast-systems"],
    ["Scaffolding Design & Drawings", "scaffolding-design-drawings"],
    ["Scaffolding Inspections & Maintenance", "scaffolding-inspections-maintenance"],
    ["Sheeting, Netting & Encapsulation", "sheeting-netting-encapsulation"],
    ["Staircase Towers", "staircase-towers"],
    ["Suspended Scaffolding", "suspended-scaffolding"],
    ["Temporary Roof Systems", "temporary-roof-systems"],
  ];

  return (
    <main className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Services</h1>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {services.map(([name, slug]) => (
          <li key={slug} className="rounded-2xl shadow p-4 hover:shadow-md transition bg-white">
            <a href={`/services/${slug}`} className="font-medium underline">
              {name}
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}
