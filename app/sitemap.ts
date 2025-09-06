import { getAllSlugs } from '@/src/lib/mdx'

export default function sitemap() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://colossus-scaffolding.vercel.app'

  const staticPaths = ['', '/services', '/locations', '/contact']
  const servicePaths = getAllSlugs('services').map((s) => `/services/${s}`)
  const locationPaths = getAllSlugs('locations').map((t) => `/locations/${t}`)

  return [...staticPaths, ...servicePaths, ...locationPaths].map((p) => ({
    url: `${base}${p}`,
    lastModified: new Date(),
  }))
}
