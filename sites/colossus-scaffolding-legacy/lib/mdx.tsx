import { createMdxLoader } from "@platform/core-components/lib/mdx";
import mdxComponents from "@/mdx-components";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

export const {
  getMdxFiles,
  getMdxContent,
  getAllServices,
  getAllLocations,
  listSlugs,
  loadMdx,
  getPageImage,
} = createMdxLoader(mdxComponents, {
  remarkPlugins: [remarkGfm],
  rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: "wrap" }]],
});

export type { MdxFrontmatter } from "@platform/core-components/lib/mdx";
