// components/mdx-components.tsx
import Link from "next/link";
import Image from "next/image";
import type { MDXComponents as MDXMap } from "mdx/types";
import Schema from "@/components/Schema";

const mdxComponents: MDXMap = {
  a: (props) => {
    const href = typeof props.href === "string" ? props.href : "";
    const isInternal = href.startsWith("/");
    return isInternal ? <Link href={href}>{props.children}</Link> : <a {...props} />;
  },
  h1: (p) => <h1 {...p} className={`text-3xl font-bold mt-6 mb-3 ${p.className || ""}`} />,
  h2: (p) => <h2 {...p} className={`text-2xl font-semibold mt-6 mb-3 ${p.className || ""}`} />,
  h3: (p) => <h3 {...p} className={`text-xl font-semibold mt-5 mb-2 ${p.className || ""}`} />,
  p:  (p) => <p {...p} className={`my-4 ${p.className || ""}`} />,
  ul: (p) => <ul {...p} className={`list-disc pl-6 my-4 ${p.className || ""}`} />,
  ol: (p) => <ol {...p} className={`list-decimal pl-6 my-4 ${p.className || ""}`} />,
  img: (p) => {
    const { src = "", alt = "", width, height, ...rest } = p;
    const w = typeof width === "number" ? width : 1200;
    const h = typeof height === "number" ? height : 800;
    return <Image src={src} alt={alt} width={w} height={h} {...rest} className={`rounded-xl ${p.className || ""}`} />;
  },
  // <-- This makes <Schema .../> usable directly in any MDX file
  Schema,
};

// Default export: used by next-mdx-remote pages (your [slug] routes)
export default mdxComponents;

// 👇 NEW: Hook for Next.js native MDX so app/*.mdx can see your components
export function useMDXComponents(components: MDXMap): MDXMap {
  // components = any MDX-level overrides; we merge them with our defaults
  return { ...mdxComponents, ...components };
}
