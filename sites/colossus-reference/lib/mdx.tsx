// /lib/mdx.tsx
import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import type { ReactElement } from "react";
import mdxComponents from "@/mdx-components";

type LoadOpts = {
  baseDir: "services" | "locations";
  slug: string;
};

export type MdxFrontmatter = {
  title?: string;
  description?: string;
  date?: string;
  [key: string]: unknown;
};

export async function listSlugs(baseDir: LoadOpts["baseDir"]): Promise<string[]> {
  const dir = path.join(process.cwd(), "content", baseDir);
  let files: string[] = [];
  try {
    files = await fs.readdir(dir);
  } catch {
    return [];
  }
  return files
    .filter((f) => f.endsWith(".md") || f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx?$/, ""));
}

export async function loadMdx({
  baseDir,
  slug,
}: LoadOpts): Promise<{ frontmatter: MdxFrontmatter; content: ReactElement }> {
  const filePath = path.join(process.cwd(), "content", baseDir, `${slug}.mdx`);
  const raw = await fs.readFile(filePath, "utf8");
  const { content, data } = matter(raw);

  const el = (
    <MDXRemote
      source={content}
      components={mdxComponents}
      options={{
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: "wrap" }]],
        },
      }}
    />
  );

  return { frontmatter: (data as MdxFrontmatter) || {}, content: el };
}

/**
 * Get the hero image path from a content file's frontmatter
 * Used for sitemap image generation
 * @param baseDir - The content directory ('services' or 'locations')
 * @param slug - The slug of the content file
 * @returns The hero image path or null if not found
 */
export async function getPageImage(
  baseDir: LoadOpts["baseDir"],
  slug: string
): Promise<string | null> {
  try {
    const filePath = path.join(process.cwd(), "content", baseDir, `${slug}.mdx`);
    const raw = await fs.readFile(filePath, "utf8");
    const { data } = matter(raw);

    // Services use hero.image, locations use heroImage
    if (baseDir === "services") {
      const heroData = data?.hero as { image?: string } | undefined;
      return heroData?.image || null;
    }
    return (data?.heroImage as string) || null;
  } catch {
    return null;
  }
}
