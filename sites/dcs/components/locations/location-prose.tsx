/**
 * `.prose.measure` — the town page's long-form body.
 *
 * Deliberately NOT `lib/mdx.tsx`'s shared `loadMdx()`. `/locations/[slug]` was
 * the last of the five MDX-rendering routes still bound to that factory's
 * `mdx-components.tsx` Tailwind/solaris component map, for the reason
 * `components/projects/project-prose.tsx`, `components/blog/blog-prose.tsx`
 * and `components/services/service-prose.tsx` each already give: that map
 * styles `h2`/`p`/`ul`/`li`/`a` with its own utilities, and
 * `inner-pages.css`'s `.prose` rules (§31) style the same bare tags, so the
 * two stack instead of one winning.
 *
 * What it looked like here, live, before this file: `rehype-autolink-headings`
 * with `behavior:"wrap"` turned each town's single `##` into an `<a href="#…">`
 * and the map painted it `text-brand-primary … underline` — a magenta,
 * underlined heading carrying `target="_blank"` on a same-page fragment link,
 * on all 8 town pages. The map's `bg-surface-subtle` list pill never showed
 * only because no `content/locations/*.mdx` body contains a list today; it
 * would have appeared the first time anyone added a bullet.
 *
 * `rehype-slug` is kept, so heading `id`s survive and a section stays
 * deep-linkable; the autolink wrap is dropped, since the ids never came from
 * it. `h2` takes `.res` to match `/blog`, `/projects` and `/services` — the
 * muted-until-revealed heading the kit specifies (kit:200-203), latched by
 * `SiteChrome`'s `.sec` observer.
 *
 * `h1` is DEMOTED rather than dropped, as in `service-prose.tsx`: no town body
 * opens with a `# ` line today (all 8 start at `##`), so `() => null` would
 * only ever delete a future author's content, and the masthead already renders
 * the page's one `<h1>`.
 *
 * No wrapper element — `location-detail-page.tsx` already renders the
 * `<article class="prose measure">` this content goes inside.
 */

import type { ComponentPropsWithoutRef } from 'react';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';

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
};

export interface LocationProseProps {
  /** Raw MDX body text — `getLocation(slug)`'s own `content` field. */
  content: string;
}

export async function LocationProse({ content }: LocationProseProps) {
  return (
    <MDXRemote
      source={content}
      components={proseComponents}
      options={{ mdxOptions: { remarkPlugins: [remarkGfm], rehypePlugins: [rehypeSlug] } }}
    />
  );
}
