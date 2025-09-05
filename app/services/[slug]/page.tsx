import { getAllSlugs, getDoc } from '@/src/lib/mdx'
import type { Metadata } from 'next'

export const dynamicParams = false

export function generateStaticParams() {
  return getAllSlugs('services').map((slug) => ({ slug }))
}

export async function generateMetadata(
  props: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await props.params
  const { meta } = await getDoc('services', slug)
  return {
    title: meta.seoTitle || meta.title,
    description: meta.seoDescription,
  }
}

export default async function ServicePage(
  props: { params: Promise<{ slug: string }> }
) {
  const { slug } = await props.params
  const { content } = await getDoc('services', slug)
  return <article className="prose max-w-none">{content}</article>
}
