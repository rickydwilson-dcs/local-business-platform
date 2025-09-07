import Link from "next/link";

export default function HomePage() {
  return (
    <main className="container mx-auto px-4 py-10 prose">
      <h1 className="text-3xl font-bold mb-6">Colossus Scaffolding</h1>
      <p className="lead">
        Safe, reliable scaffolding services across the South East UK. Fully
        insured, TG20:21 compliant, and CHAS accredited.
      </p>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">Our Services</h2>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <li className="rounded-2xl shadow p-4 hover:shadow-md transition bg-white">
            <Link href="/services">View All Services</Link>
          </li>
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">Our Locations</h2>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <li className="rounded-2xl shadow p-4 hover:shadow-md transition bg-white">
            <Link href="/locations">View All Locations</Link>
          </li>
        </ul>
      </section>
    </main>
  );
}
