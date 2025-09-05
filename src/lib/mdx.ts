import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import { compileMDX } from 'next-mdx-remote/rsc'
import type { ReactNode } from 'react'

type DocMeta = {
  slug: string
  title?: string
  seoTitle?: string
  seoDescription?: string
  summary?: string
  order?: number
  town?: string
  county?: string
  priority?: number
  // allow extra front-matter keys without using `any`
  [key: string]: unknown
}

const CONTENT_DIR = path.join(process.cwd(), 'content')

export async function getDoc(
  collection: 'services' | 'locations',
  slug: string
): Promise<{ meta: DocMeta; content: ReactNode }> {
  const filePath = path.join(CONTENT_DIR, collection, `${slug}.mdx`)
  const raw = fs.readFileSync(filePath, 'utf8')

  const { content: body, data } = matter(raw)
  const fm = data as Partial<DocMeta>

  // compileMDX returns { content, frontmatter }
  const { content: compiled, frontmatter } = await compileMDX({
    source: body,
  })
  const fm2 = (frontmatter ?? {}) as Partial<DocMeta>

  return {
    meta: { slug, ...fm, ...fm2 } as DocMeta,
    content: compiled,
  }
}

export function getAllSlugs(collection: 'services' | 'locations'): string[] {
  const dir = path.join(CONTENT_DIR, collection)
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => f.replace(/\.mdx$/, ''))
}

export function getAllMeta(collection: 'services' | 'locations'): DocMeta[] {
  const dir = path.join(CONTENT_DIR, collection)
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => {
      const slug = f.replace(/\.mdx$/, '')
      const raw = fs.readFileSync(path.join(dir, f), 'utf8')
      const { data } = matter(raw)
      const fm = data as Partial<DocMeta>
      return { slug, ...fm } as DocMeta
    })
}
