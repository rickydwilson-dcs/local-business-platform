import type React from 'react';
import { heroElements } from './hero';
import { cardElements } from './cards';
import { socialProofElements } from './social-proof';
import { ctaElements } from './cta';
import { contentElements } from './content';
import { navigationElements } from './navigation';
import { blogElements } from './blog';
import { statsElements } from './stats';
import { typographyElements } from './typography';
import { tokenElements } from './tokens';
import { loadThemeManifestElements } from './from-theme-manifest';

export type ElementCategory =
  | 'Hero'
  | 'Cards'
  | 'Social Proof'
  | 'CTAs'
  | 'Content'
  | 'Navigation'
  | 'Blog'
  | 'Stats'
  | 'Typography'
  | 'Tokens';

export interface ElementDefinition {
  slug: string;
  name: string;
  category: ElementCategory;
  description: string;
  renders: Record<string, () => React.ReactNode>;
}

export const elements: ElementDefinition[] = [
  ...heroElements,
  ...cardElements,
  ...socialProofElements,
  ...ctaElements,
  ...contentElements,
  ...navigationElements,
  ...blogElements,
  ...statsElements,
  ...typographyElements,
  ...tokenElements,
  ...loadThemeManifestElements(),
];

export const elementsBySlug = new Map(elements.map(e => [e.slug, e]));
export const categories = [...new Set(elements.map(e => e.category))] as ElementCategory[];
