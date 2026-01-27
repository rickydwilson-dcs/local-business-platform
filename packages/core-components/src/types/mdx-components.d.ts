/**
 * Type declaration stub for @/mdx-components
 *
 * This file provides type definitions for the mdx-components module
 * that is provided by consuming sites. It allows the core-components
 * package to type-check independently while the actual implementation
 * comes from each site's mdx-components.tsx file.
 *
 * Note: The actual files that use this (src/lib/mdx.tsx and
 * src/components/templates/content-page.tsx) are excluded from
 * standalone type-checking as they depend on site-specific implementations.
 */

import type { MDXComponents } from "mdx/types";

declare const mdxComponents: MDXComponents;
export default mdxComponents;

export declare function useMDXComponents(components: MDXComponents): MDXComponents;
