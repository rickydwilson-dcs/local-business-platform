/**
 * `.prose.measure` — the service long-form body.
 *
 * Deliberately NOT `lib/mdx.tsx`'s shared `loadMdx()`, for exactly the reason
 * `components/projects/project-prose.tsx` and `components/blog/blog-prose.tsx`
 * already give: that factory is bound at module-creation time to
 * `mdx-components.tsx`'s Tailwind/solaris component map, whose `li` is a
 * `bg-surface-subtle` pill with its own dot `<div>` and whose `a` is
 * `text-brand-primary … underline`. `inner-pages.css`'s `.prose` rules (§31)
 * style bare `p`/`ul`/`li`/`h2`/`a` directly, so the two stack instead of one
 * winning — the "half r9, half solaris" collision root `CLAUDE.md` warns about.
 *
 * That is not theoretical. Live on `/services/google-workspace` it rendered
 * every list item with THREE competing bullets (kit.css's 6px magenta square
 * at the li's left edge, the map's own 8px pink dot `<div>`, and the grey
 * rounded pill behind both), and — because `lib/mdx.tsx` also ran
 * `rehype-autolink-headings` with `behavior:"wrap"` — every `<h2>` as a
 * magenta, underlined link with `target="_blank"` on a `#fragment` href.
 * The r9 port fixed this for /blog and /projects and left /services and
 * /locations on the old map; this file finishes it for /services.
 *
 * `rehype-slug` is kept (heading `id`s stay, so a section is still
 * deep-linkable) and `rehype-autolink-headings` is dropped (the wrap is what
 * turned a heading into a link — the ids never came from it).
 *
 * `h1` is DEMOTED, not dropped. Unlike `content/projects/*.mdx` and most of
 * `content/blog/*.mdx`, none of the six `content/services/*.mdx` bodies opens
 * with a `# ` line — they all start at `##` — so there is nothing to strip,
 * and `() => null` here would silently delete a future author's content. The
 * masthead already renders the page's one `<h1>`, so a stray `#` renders as a
 * section heading instead of a second document-outline root.
 */

import type { ComponentPropsWithoutRef } from 'react';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import { Tier, TierItem, Tiers } from './service-tiers';

const proseComponents = {
  h1: (props: ComponentPropsWithoutRef<'h1'>) => <h2 className="res" {...props} />,
  h2: (props: ComponentPropsWithoutRef<'h2'>) => <h2 className="res" {...props} />,
  h3: (props: ComponentPropsWithoutRef<'h3'>) => <h3 {...props} />,
  p: (props: ComponentPropsWithoutRef<'p'>) => <p {...props} />,
  ul: (props: ComponentPropsWithoutRef<'ul'>) => <ul {...props} />,
  ol: (props: ComponentPropsWithoutRef<'ol'>) => <ol {...props} />,
  li: (props: ComponentPropsWithoutRef<'li'>) => <li {...props} />,
  strong: (props: ComponentPropsWithoutRef<'strong'>) => <strong {...props} />,
  em: (props: ComponentPropsWithoutRef<'em'>) => <em {...props} />,
  a: (props: ComponentPropsWithoutRef<'a'>) => <a {...props} />,
  blockquote: (props: ComponentPropsWithoutRef<'blockquote'>) => <blockquote {...props} />,
  hr: () => <hr />,
  // F-06: `.cscroll` is the overflow wrapper a wide table needs on mobile.
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
  // Kit §J — the in-prose tier band. Content stays in the MDX file; this only
  // gives it markup to render into.
  Tiers,
  Tier,
  TierItem,
};

export interface ServiceProseProps {
  /** Raw MDX body text — `getService(slug)`'s own `content` field. */
  content: string;
}

/**
 * Renders the body ONLY — no `<article class="prose measure">` wrapper. Unlike
 * `/blog/[slug]` and `/projects/[slug]`, whose prose components own their
 * wrapper, `ServiceDetailPage.tsx` already renders one around `mdxContent`
 * (and around the testimonial blockquote that follows it). Wrapping again
 * nested `.prose` inside `.prose`, which is not merely redundant: every
 * `.prose>*+*` and `.prose>:first-child` rule (kit:1511-1512) then resolves
 * against the inner article instead of the real first block.
 */
export async function ServiceProse({ content }: ServiceProseProps) {
  return (
    <MDXRemote
      source={content}
      components={proseComponents}
      options={{ mdxOptions: { remarkPlugins: [remarkGfm], rehypePlugins: [rehypeSlug] } }}
    />
  );
}
