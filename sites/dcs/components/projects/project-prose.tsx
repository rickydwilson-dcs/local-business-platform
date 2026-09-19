/**
 * `.prose.measure` — the case-study long-form body, ported from
 * `prototype/project-detail.html:158-227`.
 *
 * Deliberately NOT `lib/mdx.tsx`'s shared `loadMdx()`. That factory is bound
 * at module-creation time to `mdx-components.tsx`'s Tailwind/solaris
 * component map (`h2` -> `text-2xl … text-surface-foreground`, `li` -> a
 * `bg-surface-subtle` pill, etc.) — the RIGHT map for every OTHER content
 * type this site renders, and shared across services/blog/locations too, so
 * changing it here would restyle all of them. `inner-pages.css`'s `.prose`
 * rules (§31) target bare `p`/`ul`/`li`/`h2` tags directly; layering
 * Tailwind utility classes with their own `color`/`margin` on top of that
 * would fight kit.css's cascade in exactly the "half r9, half solaris"
 * way root `CLAUDE.md`'s CSS-syntax traps warn about. This file is a small,
 * separate `MDXRemote` call, scoped to `/projects/[slug]` only, with a
 * components map that renders the bare markup the prototype's own CSS
 * expects.
 *
 * `h1` renders nothing: every one of the 13 `content/projects/*.mdx` bodies
 * opens with its own `# Title` line, and the masthead (`project-detail-page.tsx`)
 * already renders the page's one h1 — keeping the MDX's own would be a
 * second h1, a document-outline bug rather than a design choice
 * (`project-detail.html:154-156`'s own note on this, made for Colossus,
 * generalised here to all 13).
 *
 * VOICE: this renders the real MDX body content, unedited — including its
 * first-person plural ("we built"). Converting that to first-person singular
 * is Phase 6 of the inner-pages port brief, not this route; this component
 * only restyles, it does not rewrite.
 */

import type { ComponentPropsWithoutRef } from 'react';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';

const proseComponents = {
  h1: () => null,
  h2: (props: ComponentPropsWithoutRef<'h2'>) => <h2 className="res" {...props} />,
  h3: (props: ComponentPropsWithoutRef<'h3'>) => <h3 {...props} />,
  p: (props: ComponentPropsWithoutRef<'p'>) => <p {...props} />,
  ul: (props: ComponentPropsWithoutRef<'ul'>) => <ul {...props} />,
  ol: (props: ComponentPropsWithoutRef<'ol'>) => <ol {...props} />,
  li: (props: ComponentPropsWithoutRef<'li'>) => <li {...props} />,
  strong: (props: ComponentPropsWithoutRef<'strong'>) => <strong {...props} />,
  a: (props: ComponentPropsWithoutRef<'a'>) => <a {...props} />,
  blockquote: (props: ComponentPropsWithoutRef<'blockquote'>) => <blockquote {...props} />,
  hr: () => <hr />,
};

export interface ProjectProseProps {
  /** Raw MDX body text — `getProject(slug)`'s own `content` field, not yet
   *  compiled. */
  content: string;
}

export async function ProjectProse({ content }: ProjectProseProps) {
  return (
    <article className="prose measure">
      <MDXRemote
        source={content}
        components={proseComponents}
        options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
      />
    </article>
  );
}
