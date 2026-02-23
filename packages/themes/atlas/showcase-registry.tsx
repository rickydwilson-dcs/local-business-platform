/**
 * Atlas Theme — Showcase Registry
 *
 * Auto-generated ElementDefinition entries for the showcase site.
 */

import type { ReactNode } from 'react';

import { DirectoryListing } from './components/custom-directory-listing';

export interface ShowcaseElementEntry {
  slug: string;
  name: string;
  category: string;
  description: string;
  themeName: string;
  render: () => ReactNode;
}

export const atlasElements: ShowcaseElementEntry[] = [
  {
    slug: "custom-directory-listing",
    name: "DirectoryListing",
    category: "Custom",
    description: "Displays a server-generated directory index listing folders with name, last modified date, and size columns",
    themeName: "atlas",
    render: () => <DirectoryListing />,
  },
];
