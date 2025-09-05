import { defineDocumentType, makeSource } from 'contentlayer/source-files'

const Service = defineDocumentType(() => ({
  name: 'Service',
  filePathPattern: `services/**/*.mdx`,
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    seoTitle: { type: 'string' },
    seoDescription: { type: 'string' },
    summary: { type: 'string' },
    order: { type: 'number' },
    faq: { type: 'list', of: { type: 'json' } },
  },
  computedFields: {
    slug: { type: 'string', resolve: (doc) => doc._raw.flattenedPath.replace(/^services\//, '') },
  },
}))

const Location = defineDocumentType(() => ({
  name: 'Location',
  filePathPattern: `locations/**/*.mdx`,
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    town: { type: 'string', required: true },
    county: { type: 'string' },
    seoTitle: { type: 'string' },
    seoDescription: { type: 'string' },
    priority: { type: 'number' },
    faq: { type: 'list', of: { type: 'json' } },
  },
  computedFields: {
    slug: { type: 'string', resolve: (doc) => doc._raw.flattenedPath.replace(/^locations\//, '') },
  },
}))

export default makeSource({
  contentDirPath: 'content',
  documentTypes: [Service, Location],
})
