import type { ElementDefinition } from './index';

const renderColorTokens = () => (
  <div className="space-y-6 p-6">
    <div>
      <p className="text-sm font-semibold text-surface-muted-foreground mb-2">Brand</p>
      <div className="flex gap-3">
        <div className="w-12 h-12 rounded-lg bg-brand-primary" title="brand-primary" />
        <div className="w-12 h-12 rounded-lg bg-brand-primary-hover" title="brand-primary-hover" />
        <div className="w-12 h-12 rounded-lg bg-brand-secondary" title="brand-secondary" />
        <div className="w-12 h-12 rounded-lg bg-brand-accent" title="brand-accent" />
      </div>
    </div>
    <div>
      <p className="text-sm font-semibold text-surface-muted-foreground mb-2">Surface</p>
      <div className="flex gap-3">
        <div className="w-12 h-12 rounded-lg bg-surface-background border border-surface-card-border" title="surface-background" />
        <div className="w-12 h-12 rounded-lg bg-surface-muted border border-surface-card-border" title="surface-muted" />
        <div className="w-12 h-12 rounded-lg bg-surface-card border border-surface-card-border" title="surface-card" />
      </div>
    </div>
    <div>
      <p className="text-sm font-semibold text-surface-muted-foreground mb-2">Semantic</p>
      <div className="flex gap-3">
        <div className="w-12 h-12 rounded-lg bg-success" title="success" />
        <div className="w-12 h-12 rounded-lg bg-warning" title="warning" />
        <div className="w-12 h-12 rounded-lg bg-error" title="error" />
        <div className="w-12 h-12 rounded-lg bg-info" title="info" />
      </div>
    </div>
    <div>
      <p className="text-sm font-semibold text-surface-muted-foreground mb-2">Buttons</p>
      <div className="flex gap-3 items-center">
        <button className="btn-primary">Primary</button>
        <button className="btn-secondary">Secondary</button>
        <button className="btn-ghost">Ghost</button>
      </div>
    </div>
    <div>
      <p className="text-sm font-semibold text-surface-muted-foreground mb-2">Surface Extended</p>
      <div className="flex gap-3">
        <div className="w-12 h-12 rounded-lg bg-surface-subtle border border-surface-card-border" title="surface-subtle" />
        <div className="w-12 h-12 rounded-lg bg-surface-inverse" title="surface-inverse" />
        <div className="w-12 h-12 rounded-lg bg-surface-card border border-surface-card-border" title="surface-card" />
      </div>
      <div className="flex gap-4 mt-2">
        <span className="text-surface-foreground text-sm">foreground</span>
        <span className="text-surface-secondary text-sm">secondary</span>
        <span className="text-surface-tertiary text-sm">tertiary</span>
        <span className="text-surface-muted-foreground text-sm">muted</span>
      </div>
    </div>
    <div>
      <p className="text-sm font-semibold text-surface-muted-foreground mb-2">Text on Brand</p>
      <div className="flex gap-3">
        <div className="flex items-center justify-center w-24 h-12 rounded-lg bg-brand-primary">
          <span className="text-on-brand-primary text-sm font-medium">on-primary</span>
        </div>
        <div className="flex items-center justify-center w-24 h-12 rounded-lg bg-surface-inverse">
          <span className="text-on-brand-primary text-sm font-medium">on-inverse</span>
        </div>
      </div>
    </div>
  </div>
);

export const tokenElements: ElementDefinition[] = [
  {
    slug: 'color-tokens',
    name: 'Color Tokens',
    category: 'Tokens',
    description: 'All brand, surface, semantic, and overlay color tokens',
    renders: {
      orion: renderColorTokens,
      vega: renderColorTokens,
    },
  },
];
