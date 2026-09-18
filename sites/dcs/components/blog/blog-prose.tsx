/**
 * `.prose.measure` — the long-form post body, ported from
 * `prototype/blog-post.html:154-289`. Deliberately NOT `lib/mdx.tsx`'s shared
 * `loadMdx()`, for the same reason `components/projects/project-prose.tsx`
 * isn't: that factory is bound to the solaris Tailwind component map, and
 * `inner-pages.css`'s `.prose` rules (kit.css §31, extended by F-06 for
 * tables) target bare tags directly. This is a second small, separate
 * `MDXRemote` call, scoped to `/blog/[slug]` only.
 *
 * `h1` renders nothing. Sixteen of the twenty-one `content/blog/*.mdx` files
 * open their body with a `# ` line that duplicates the frontmatter `title`
 * exactly (the masthead already renders it) — notes-f.md §3 counted this and
 * says the port has to strip it or ship two `<h1>`s. Dropping it
 * unconditionally, for all 21, is the same generalisation
 * `components/projects/project-prose.tsx` makes for `content/projects/*.mdx`
 * (whose bodies all open the same way): correct for the 16 that duplicate
 * the title, and a no-op for the 5 that don't (they carry no `#` at all).
 * Phase 4b of the port brief additionally strips the duplicate line from the
 * 16 MDX files themselves — that's a separate, later fix to the content;
 * this component's job is only to guarantee one `<h1>` per page regardless
 * of what the current MDX body contains.
 *
 * `remarkGfm` is required, not optional: three of the twenty-one posts
 * contain a markdown table (`| Metric | Score |`), and `.prose table` has no
 * rule to render into without it (F-06).
 */

import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { isValidElement } from 'react';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import { slugify } from '@/lib/blog-headings';

/** Flattens a heading's children to plain text so `slugify()` can turn it
 *  into the SAME id `lib/blog-headings.ts`'s `extractHeadings()` computes
 *  from the raw MDX source — see that file's header for why this, and not
 *  `rehype-slug`, is the source of truth for both sides. */
function textOf(node: ReactNode): string {
  if (node == null || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(textOf).join('');
  if (isValidElement(node)) {
    const props = node.props as { children?: ReactNode };
    return textOf(props.children);
  }
  return '';
}

const proseComponents = {
  h1: () => null,
  h2: (props: ComponentPropsWithoutRef<'h2'>) => (
    <h2 className="res" {...props} id={slugify(textOf(props.children))} />
  ),
  h3: (props: ComponentPropsWithoutRef<'h3'>) => (
    <h3 {...props} id={slugify(textOf(props.children))} />
  ),
  p: (props: ComponentPropsWithoutRef<'p'>) => <p {...props} />,
  ul: (props: ComponentPropsWithoutRef<'ul'>) => <ul {...props} />,
  ol: (props: ComponentPropsWithoutRef<'ol'>) => <ol {...props} />,
  li: (props: ComponentPropsWithoutRef<'li'>) => <li {...props} />,
  strong: (props: ComponentPropsWithoutRef<'strong'>) => <strong {...props} />,
  em: (props: ComponentPropsWithoutRef<'em'>) => <em {...props} />,
  a: (props: ComponentPropsWithoutRef<'a'>) => <a {...props} />,
  blockquote: (props: ComponentPropsWithoutRef<'blockquote'>) => <blockquote {...props} />,
  hr: () => <hr />,
  // F-06: `.prose` had no table rule at all until kit-additions-f.css added
  // one. `.cscroll` is the overflow wrapper a wide table needs on mobile
  // (only when the table genuinely cannot fit — see notes-f.md §3.7 on why
  // no `min-width` is set here).
  table: (props: ComponentPropsWithoutRef<'table'>) => (
    <div className="cscroll">
      <table {...props} />
    </div>
  ),
  thead: (props: ComponentPropsWithoutRef<'thead'>) => <thead {...props} />,
  tbody: (props: ComponentPropsWithoutRef<'tbody'>) => <tbody {...props} />,
  tr: (props: ComponentPropsWithoutRef<'tr'>) => <tr {...props} />,
  th: (props: ComponentPropsWithoutRef<'th'>) => <th scope="col" {...props} />,
  td: (props: ComponentPropsWithoutRef<'td'>) => <td {...props} />,
};

export interface BlogProseProps {
  /** Raw MDX body text — `getBlogPost(slug)`'s own `content` field, unedited
   *  (voice conversion to first-person singular is Phase 6 of the port
   *  brief, not this route; this component only restyles). */
  content: string;
}

export async function BlogProse({ content }: BlogProseProps) {
  return (
    <article className="prose">
      <MDXRemote
        source={content}
        components={proseComponents}
        options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
      />
    </article>
  );
}
