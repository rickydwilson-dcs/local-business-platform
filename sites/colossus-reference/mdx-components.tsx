// mdx-components.tsx (PROJECT ROOT)
import Link from "next/link";
import Image from "next/image";
import type { MDXComponents as MDXMap } from "mdx/types";
import Schema from "@/components/Schema";

// Checkmark icon component for list items (matches service-benefits.tsx pattern)
const CheckIcon = () => (
  <div className="flex-shrink-0 w-6 h-6 bg-brand-blue rounded-full flex items-center justify-center mt-0.5">
    <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  </div>
);

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
      className={`text-2xl sm:text-3xl font-bold text-gray-900 mt-12 mb-6 ${p.className || ""}`}
    />
  ),
  h3: (p) => (
    <h3 {...p} className={`text-xl font-semibold text-gray-900 mt-8 mb-4 ${p.className || ""}`} />
  ),
  p: (p) => <p {...p} className={`text-gray-700 leading-relaxed my-4 ${p.className || ""}`} />,
  // Unordered list - renders as a grid of card items (matches service-benefits.tsx)
  ul: (p) => (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 my-6 ${p.className || ""}`}>
      {p.children}
    </div>
  ),
  // Ordered list - renders as numbered steps with card styling
  ol: (p) => <div className={`space-y-4 my-6 ${p.className || ""}`}>{p.children}</div>,
  // List item - renders as a card with checkmark icon (matches coverage-areas.tsx:44-62)
  li: (p) => (
    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
      <CheckIcon />
      <span className="text-gray-900 font-medium text-sm">{p.children}</span>
    </div>
  ),
  strong: (p) => <strong {...p} className={`font-semibold text-gray-900 ${p.className || ""}`} />,
  hr: () => <hr className="my-10 border-t border-gray-200" />,
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

// This hook is how Next's native MDX discovers your components map.
// It MUST be exported from a file named exactly "mdx-components.(js|tsx)" at the project root.
export function useMDXComponents(components: MDXMap): MDXMap {
  return { ...mdxComponents, ...components };
}
