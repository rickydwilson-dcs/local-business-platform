// mdx-components.tsx (PROJECT ROOT)
import Link from "next/link";
import Image from "next/image";
import type { MDXComponents as MDXMap } from "mdx/types";
import Schema from "@/components/Schema";

// Default components map used by both native MDX pages (app/*.mdx)
// and by next-mdx-remote (we'll also import this in [slug] pages)
const mdxComponents: MDXMap = {
  // Links - blue with underline
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

  // H2 - Large bold heading (NOT blue, NOT underlined)
  h2: (p) => (
    <h2 className={`text-2xl sm:text-3xl font-bold text-gray-900 mt-12 mb-6 ${p.className || ""}`}>
      {p.children}
    </h2>
  ),

  // H3 - Medium heading
  h3: (p) => (
    <h3 className={`text-xl font-semibold text-gray-900 mt-8 mb-4 ${p.className || ""}`}>
      {p.children}
    </h3>
  ),

  // Paragraph
  p: (p) => (
    <p className={`text-gray-700 leading-relaxed my-4 ${p.className || ""}`}>{p.children}</p>
  ),

  // Unordered list - vertical stack
  ul: (p) => <ul className={`space-y-3 my-6 ${p.className || ""}`}>{p.children}</ul>,

  // Ordered list - vertical stack with counter
  ol: (p) => (
    <ol className={`space-y-4 my-6 ${p.className || ""}`} style={{ counterReset: "item" }}>
      {p.children}
    </ol>
  ),

  // List item - card with blue dot indicator
  li: (p) => (
    <li className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg list-none">
      <div className="flex-shrink-0 w-2 h-2 bg-brand-blue rounded-full mt-2" />
      <div className="text-gray-800">{p.children}</div>
    </li>
  ),

  // Strong/bold text
  strong: (p) => (
    <strong className={`font-semibold text-gray-900 ${p.className || ""}`}>{p.children}</strong>
  ),

  // Horizontal rule
  hr: () => <hr className="my-10 border-t border-gray-200" />,

  // Images
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

  Schema,
};

export default mdxComponents;

// This hook is how Next's native MDX discovers your components map.
// It MUST be exported from a file named exactly "mdx-components.(js|tsx)" at the project root.
export function useMDXComponents(components: MDXMap): MDXMap {
  return { ...mdxComponents, ...components };
}
