import Link from 'next/link'
import { getAllMeta } from '@/src/lib/mdx'

export default function LocationsPage() {
  const towns = getAllMeta('locations').sort(
    (a, b) => (a.priority ?? 999) - (b.priority ?? 999)
  )

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Areas We Cover</h1>
      <ul className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {towns.map((t) => (
          <li key={t.slug} className="border rounded p-4">
            <h2 className="font-semibold">{t.town ?? t.slug}</h2>
            <Link className="underline" href={`/locations/${t.slug}`}>
              Scaffolding in {t.town ?? t.slug}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
