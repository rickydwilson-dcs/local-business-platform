// mdx-components.tsx (PROJECT ROOT)
import Link from "next/link";
import Image from "next/image";
import type { MDXComponents as MDXMap } from "mdx/types";
import Schema from "@/components/Schema";

// Default components map used by both native MDX pages (app/*.mdx)
// and by next-mdx-remote (we'll also import this in [slug] pages)
const mdxComponents: MDXMap = {
  a: (props) => {
    const href = typeof props.href === "string" ? props.href : "";
    const isInternal = href.startsWith("/");
    if (isInternal) {
      return (
        <Link
          href={href}
          className="text-brand-blue hover:text-brand-blue-hover font-medium underline underline-offset-2 transition-colors"
        >
          {props.children}
        </Link>
      );
    }
    return (
      <a
        {...props}
        className="text-brand-blue hover:text-brand-blue-hover font-medium underline underline-offset-2 transition-colors"
      />
    );
  },
  h2: (p) => (
    <h2
      {...p}
      className={`text-2xl sm:text-3xl font-bold text-gray-900 mt-10 mb-4 pb-2 border-b border-gray-200 ${p.className || ""}`}
    />
  ),
  h3: (p) => (
    <h3 {...p} className={`text-xl font-semibold text-gray-900 mt-8 mb-3 ${p.className || ""}`} />
  ),
  p: (p) => <p {...p} className={`text-gray-700 leading-relaxed my-4 ${p.className || ""}`} />,
  ul: (p) => (
    <ul {...p} className={`list-disc pl-6 my-4 space-y-2 text-gray-700 ${p.className || ""}`} />
  ),
  ol: (p) => (
    <ol {...p} className={`list-decimal pl-6 my-4 space-y-2 text-gray-700 ${p.className || ""}`} />
  ),
  li: (p) => <li {...p} className={`leading-relaxed ${p.className || ""}`} />,
  strong: (p) => <strong {...p} className={`font-semibold text-gray-900 ${p.className || ""}`} />,
  hr: () => <hr className="my-8 border-t border-gray-200" />,
  img: (p) => {
    const { src = "", alt = "", width, height, ...rest } = p;
    const w = typeof width === "number" ? width : 1200;
    const h = typeof height === "number" ? height : 800;
    return (
      <Image
        src={src}
        alt={alt}
        width={w}
        height={h}
        {...rest}
        className={`rounded-xl ${p.className || ""}`}
      />
    );
  },
  Schema, // <-- makes <Schema /> available to all native MDX files
};

export default mdxComponents;

// This hook is how Next’s native MDX discovers your components map.
// It MUST be exported from a file named exactly "mdx-components.(js|tsx)" at the project root.
export function useMDXComponents(components: MDXMap): MDXMap {
  return { ...mdxComponents, ...components };
}
