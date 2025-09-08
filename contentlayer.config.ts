// contentlayer.config.ts
import { defineDocumentType, makeSource } from "contentlayer/source-files";

// Shared frontmatter fields for your MDX docs
const sharedFields = {
  title: { type: "string", required: true },
  description: { type: "string", required: true },

  // keywords: ["a", "b", "c"]
  keywords: { type: "list", of: { type: "string" } },

  // hero: { heading, subheading, image, cta: { label, href } }
  // Using json keeps the schema simple; switch to nested types later if desired.
  hero: { type: "json", required: true },

  // breadcrumbs: [{ title, href }]
  breadcrumbs: { type: "list", of: { type: "json" }, required: true },
} as const;

export const Service = defineDocumentType(() => ({
  name: "Service",
  filePathPattern: `services/*.mdx`,
  contentType: "mdx",
  fields: sharedFields,
  computedFields: {
    slug: {
      type: "string",
      resolve: (doc) => doc._raw.flattenedPath.replace(/^services\//, ""),
    },
  },
}));

export const Location = defineDocumentType(() => ({
  name: "Location",
  filePathPattern: `locations/*.mdx`,
  contentType: "mdx",
  fields: sharedFields,
  computedFields: {
    slug: {
      type: "string",
      resolve: (doc) => doc._raw.flattenedPath.replace(/^locations\//, ""),
    },
  },
}));

export default makeSource({
  contentDirPath: "content",
  documentTypes: [Service, Location],
});
