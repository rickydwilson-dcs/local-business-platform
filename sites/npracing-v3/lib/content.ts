/**
 * Content utilities for npracing-v3.
 *
 * NPRacing has no services/locations/blog/projects/testimonials content —
 * this site's real content types (merch/news/brand) are handled by
 * `lib/mdx.tsx`, not this file.
 *
 * This shim is kept minimal (rather than deleted) because shared
 * `@platform/core-components` internals (`components/ui/footer.tsx`,
 * `components/ui/content-grid.tsx`) import `getContentItems` / `ContentItem`
 * from `@/lib/content` and expect every site to provide this path — see
 * `packages/core-components/src/lib/content.ts`'s "DEFAULT INSTANCE" comment.
 * Those components aren't used by npracing-v3 at runtime (this site renders
 * its own `SiteHeader`/`SiteFooter`), but they're still part of the
 * `@platform/core-components` barrel's type surface, so this file must keep
 * exporting a type-compatible `getContentItems`/`ContentItem`. No location
 * filtering is configured since there's no locations content type here.
 */

import { createContentUtils } from '@platform/core-components/lib/content';

const utils = createContentUtils();

export const { getContentItems, getContentItem, generateContentParams } = utils;

// Re-export types needed by consuming shared components
export type {
  ContentType,
  ContentItem,
  ContentUtilsOptions,
} from '@platform/core-components/lib/content';
