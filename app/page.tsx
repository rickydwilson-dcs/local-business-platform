import Link from "next/link";

export default function HomePage() {
  return (
    <main className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Colossus Scaffolding</h1>

      <div className="space-x-4">
        <Link href="/services/" className="underline">
          Services
        </Link>
        <Link href="/locations/" className="underline">
          Locations
        </Link>
      </div>
    </main>
  );
}
