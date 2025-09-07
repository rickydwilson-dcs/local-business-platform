export const metadata = {
  title: "Locations",
  description: "Areas we cover across the South East"
};

const locations: Array<[string,string]> = [('Hastings', 'hastings'), ('St Leonards on Sea', 'st-leonards-on-sea'), ('Bexhill', 'bexhill'), ('Battle', 'battle'), ('Rye', 'rye'), ('Eastbourne', 'eastbourne'), ('Hailsham', 'hailsham'), ('Seaford', 'seaford'), ('Newhaven', 'newhaven'), ('Lewes', 'lewes'), ('Uckfield', 'uckfield'), ('East Sussex', 'east-sussex'), ('West Sussex', 'west-sussex'), ('Kent', 'kent'), ('Surrey', 'surrey'), ('London', 'london'), ('Essex', 'essex'), ('Hertfordshire', 'hertfordshire'), ('Berkshire', 'berkshire'), ('Buckinghamshire', 'buckinghamshire')];

export default function LocationsPage() {
  return (
    <main className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Locations</h1>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {locations.map(([name, slug]) => (
          <li key=st-leonards-on-sea className="rounded-2xl shadow p-4 hover:shadow-md transition bg-white">
            <a href={`/locations/${slug}`} className="font-medium underline">
              {name}
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}
