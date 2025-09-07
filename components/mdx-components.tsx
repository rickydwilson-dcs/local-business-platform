// components/mdx-components.tsx
import Link from "next/link";
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
  p: (p) => <p {...p} className={`my-4 ${p.className || ""}`} />,
  ul: (p) => <ul {...p} className={`list-disc pl-6 my-4 ${p.className || ""}`} />,
  ol: (p) => <ol {...p} className={`list-decimal pl-6 my-4 ${p.className || ""}`} />,
  // eslint-disable-next-line @next/next/no-img-element
  img: (p) => (
    <img {...p} alt={p.alt ?? ""} loading="lazy" className={`rounded-xl ${p.className || ""}`} />
  ),
  Schema,
};

export default mdxComponents;
