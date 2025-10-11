import { listSlugs } from '@/lib/mdx'

export default async function sitemap() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://colossus-scaffolding.vercel.app'

  const staticPaths = ['', '/services', '/locations', '/contact']
  const serviceSlugs = await listSlugs('services')
  const locationSlugs = await listSlugs('locations')
  const servicePaths = serviceSlugs.map((s) => `/services/${s}`)
  const locationPaths = locationSlugs.map((t) => `/locations/${t}`)

  return [...staticPaths, ...servicePaths, ...locationPaths].map((p) => ({
    url: `${base}${p}`,
    lastModified: new Date(),
  }))
}
