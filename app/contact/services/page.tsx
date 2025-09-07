export const metadata = {
  title: "Services",
  description: "Full range of scaffolding services"
};

const services: Array<[string,string]> = [('Access Scaffolding', 'access-scaffolding'), ('Facade Scaffolding', 'facade-scaffolding'), ('Temporary Roof Systems', 'temporary-roof-systems'), ('Suspended Scaffolding', 'suspended-scaffolding'), ('Public Access Staircases', 'public-access-staircases'), ('Pavement Gantries & Loading Bays', 'pavement-gantries-loading-bays'), ('Heavy-Duty Industrial Scaffolding', 'heavy-duty-industrial-scaffolding'), ('Scaffold Towers & Mast Systems', 'scaffold-towers-mast-systems'), ('Crash Decks & Crane Decks', 'crash-decks-crane-decks'), ('Sheeting, Netting & Encapsulation', 'sheeting-netting-encapsulation'), ('Scaffolding Design & Drawings', 'scaffolding-design-drawings'), ('Scaffolding Inspections & Maintenance', 'scaffolding-inspections-maintenance'), ('Edge Protection', 'edge-protection'), ('Birdcage Scaffolds', 'birdcage-scaffolds'), ('Scaffold Alarms', 'scaffold-alarms'), ('Staircase Towers', 'staircase-towers')];

export default function ServicesPage() {
  return (
    <main className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Services</h1>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {services.map(([name, slug]) => (
          <li key=st-leonards-on-sea className="rounded-2xl shadow p-4 hover:shadow-md transition bg-white">
            <a href={`/services/${slug}`} className="font-medium underline">
              {name}
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}
