// contentlayer.config.ts
import { defineDocumentType, makeSource } from 'contentlayer2/source-files'
import remarkGfm from 'remark-gfm'
import remarkFrontmatter from 'remark-frontmatter'

/** Shared frontmatter fields */
const sharedFields = {
  title: { type: 'string', required: true },
  description: { type: 'string', required: false },
  keywords: { type: 'list', of: { type: 'string' } },
  hero: { type: 'json', required: false },        // { heading, subheading, image, cta }
  breadcrumbs: { type: 'list', of: { type: 'json' }, required: false },
}

/** Services MDX */
export const Service = defineDocumentType(() => ({
  name: 'Service',
  filePathPattern: `services/*.mdx`,
  contentType: 'mdx',
  fields: sharedFields,
  computedFields: {
    slug: {
      type: 'string',
      resolve: (doc) => doc._raw.flattenedPath.replace(/^services\//, ''),
    },
    url: {
      type: 'string',
      resolve: (doc) => `/services/${doc._raw.sourceFileName.replace(/\\.mdx$/, '')}`,
    },
  },
}))

/** Locations MDX */
export const Location = defineDocumentType(() => ({
  name: 'Location',
  filePathPattern: `locations/*.mdx`,
  contentType: 'mdx',
  fields: sharedFields,
  computedFields: {
    slug: {
      type: 'string',
      resolve: (doc) => doc._raw.flattenedPath.replace(/^locations\//, ''),
    },
    url: {
      type: 'string',
      resolve: (doc) => `/locations/${doc._raw.sourceFileName.replace(/\\.mdx$/, '')}`,
    },
  },
}))

/** Export the source */
export default makeSource({
  contentDirPath: 'content', // 👈 put your MDX under /content/services and /content/locations
  documentTypes: [Service, Location],
  mdx: {
    remarkPlugins: [remarkGfm, remarkFrontmatter],
    rehypePlugins: [],
  },
})
