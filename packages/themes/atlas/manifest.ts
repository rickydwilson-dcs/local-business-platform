/**
 * Atlas Theme — Component Manifest
 *
 * Auto-generated from reference analysis.
 * Maps blueprint metadata for tooling and showcase integration.
 */

import type { ComponentCategory } from '../../theme-system/src/types';

export interface ThemeComponentEntry {
  slug: string;
  name: string;
  category: ComponentCategory;
  exportName: string;
  importPath: string;
}

export const manifest: ThemeComponentEntry[] = [
  {
    slug: "custom-directory-listing",
    name: "DirectoryListing",
    category: "Custom",
    exportName: "DirectoryListing",
    importPath: "./components/custom-directory-listing",
  },
];
