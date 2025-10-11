import { MDXRemote } from "next-mdx-remote/rsc";
import mdxComponents from "@/mdx-components";

interface ContentPageProps {
  title: string;
  content: string;
}

export function ContentPage({ title, content }: ContentPageProps) {
  return (
    <main className="container mx-auto px-4 py-10 prose max-w-none">
      <h1>{title}</h1>
      <MDXRemote source={content} components={mdxComponents} />
    </main>
  );
}