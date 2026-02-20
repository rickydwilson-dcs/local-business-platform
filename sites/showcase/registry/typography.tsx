import type { ElementDefinition } from './index';

const renderTypographyScale = () => (
  <div className="space-y-4 p-6">
    <p className="text-hero">Hero Text</p>
    <p className="text-h1">Heading 1</p>
    <p className="text-h2">Heading 2</p>
    <p className="text-h3">Heading 3</p>
    <p className="text-h4">Heading 4</p>
    <p className="text-body">Body text — the quick brown fox jumps over the lazy dog.</p>
    <p className="text-small">Small text — supplementary information and fine print.</p>
    <p className="text-caption">Caption text — image credits, timestamps, metadata.</p>
  </div>
);

export const typographyElements: ElementDefinition[] = [
  {
    slug: 'typography-scale',
    name: 'Typography Scale',
    category: 'Typography',
    description: 'Complete typography scale from hero to caption sizes',
    renders: {
      orion: renderTypographyScale,
      vega: renderTypographyScale,
    },
  },
];
