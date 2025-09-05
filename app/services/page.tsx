import Link from 'next/link'
import { getAllMeta } from '@/src/lib/mdx'

export default function ServicesPage() {
  const items = getAllMeta('services').sort(
    (a, b) => (a.order ?? 999) - (b.order ?? 999)
  )

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Services</h1>
      <ul className="grid sm:grid-cols-2 gap-4">
        {items.map((s) => (
          <li key={s.slug} className="border rounded p-4">
            <h2 className="font-semibold text-lg mb-2">{s.title ?? s.slug}</h2>
            {s.summary && (
              <p className="text-sm text-slate-600 mb-3">{s.summary}</p>
            )}
            <Link className="underline" href={`/services/${s.slug}`}>
              Learn more
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
