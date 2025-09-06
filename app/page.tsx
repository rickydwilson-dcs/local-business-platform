import Link from 'next/link'

export default function Home() {
  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <h1 className="text-4xl font-bold">Safe, tidy scaffolding across East Sussex</h1>
        <p className="text-lg text-slate-700">
          Temporary roofs, access scaffolds, staircase towers, birdcages and edge protection for
          residential and commercial projects. TG20:21 compliant.
        </p>
        <div className="flex gap-3">
          <Link href="/contact" className="px-4 py-2 rounded bg-black text-white">Get a quote</Link>
          <Link href="/services" className="px-4 py-2 rounded border">View services</Link>
        </div>
      </section>

      <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card title="Temporary Roofs" href="/services/temporary-roofs" />
        <Card title="Access Scaffolds" href="/services/access-scaffolds" />
        <Card title="Staircase Towers" href="/services/staircase-towers" />
        <Card title="Edge Protection" href="/services/edge-protection" />
        <Card title="Birdcage Scaffolds" href="/services/birdcage-scaffolds" />
        <Card title="Inspections & Tagging" href="/services/inspections-and-tagging" />
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Areas we cover</h2>
        <p className="text-slate-700">Hastings • St Leonards • Bexhill • Battle • Rye • Eastbourne • Hailsham • Seaford • Newhaven • Lewes • Uckfield</p>
        <Link href="/locations" className="underline">See all areas →</Link>
      </section>
    </div>
  )
}

function Card({ title, href }: { title: string; href: string }) {
  return (
    <Link href={href} className="border rounded p-4 hover:bg-slate-50 transition">
      <div className="font-semibold">{title}</div>
      <div className="text-sm text-slate-600">Learn more →</div>
    </Link>
  )
}
