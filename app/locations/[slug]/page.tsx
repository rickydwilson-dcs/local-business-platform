// app/locations/[slug]/page.tsx
import path from "path";
import { promises as fs } from "fs";
import matter from "gray-matter";
import { MDXRemote } from "next-mdx-remote/rsc";
import type { Metadata } from "next";

import mdxComponents from "@/mdx-components"; // shared map at project root

export const dynamic = "force-static";
export const dynamicParams = false;

type Params = { slug: string };

const DIR = path.join(process.cwd(), "content", "locations");

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

export async function generateMetadata(
  { params }: { params: Promise<Params> }
): Promise<Metadata> {
  const { slug } = await params;
  const { title, description } = await getMdx(slug);
  return { title, description, openGraph: { title, description } };
}

export default async function Page(
  { params }: { params: Promise<Params> }
) {
  const { slug } = await params;
  const { title, content } = await getMdx(slug); // ✅ defines `content`

  return (
    <main className="container mx-auto px-4 py-10 prose max-w-none">
      <h1>{title}</h1>
      <MDXRemote source={content} components={mdxComponents} /> {/* ✅ uses defined `content` */}
    </main>
  );
}
