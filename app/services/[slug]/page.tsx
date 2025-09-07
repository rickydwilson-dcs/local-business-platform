// app/services/[slug]/page.tsx
import path from "path";
import { promises as fs } from "fs";
import matter from "gray-matter";
import { MDXRemote } from "next-mdx-remote/rsc";
import type { Metadata } from "next";

// If you have custom MDX components, import them here:
import MDXComponents from "@/components/mdx-components";

export const dynamic = "force-static";
export const dynamicParams = false; // only build the slugs we generate

const DIR = path.join(process.cwd(), "content", "services");

type Params = { slug: string };

async function getMdx(slug: string) {
  const file = path.join(DIR, `${slug}.mdx`);
  const raw = await fs.readFile(file, "utf8");
  const { data, content } = matter(raw);
  const title = (data.title as string) || slug;
  const description = (data.description as string) || "";
  return { title, description, content };
}

export async function generateStaticParams() {
  const entries = await fs.readdir(DIR);
  return entries
    .filter((f) => f.toLowerCase().endsWith(".mdx"))
    .map((f) => ({ slug: f.replace(/\.mdx$/i, "") }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { title, description } = await getMdx(params.slug);
  return {
    title,
    description,
    openGraph: { title, description },
  };
}

export default async function Page({ params }: { params: Params }) {
  const { title, content } = await getMdx(params.slug);

  return (
    <main className="container mx-auto px-4 py-10 prose max-w-none">
      <h1>{title}</h1>
      <MDXRemote source={content} components={MDXComponents as any} />
    </main>
  );
}
