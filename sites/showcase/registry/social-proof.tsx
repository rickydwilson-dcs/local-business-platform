import { TestimonialCard, StarRating } from '@platform/core-components';
import type { ElementDefinition } from './index';

const renderTestimonial = () => (
  <TestimonialCard
    name="Jane Smith"
    location="Homeowner, Brighton"
    rating={5}
    text="Absolutely first-class work. The team arrived on time, were professional throughout, and left everything spotless. Would recommend to anyone."
    title="Exceptional Service"
    featured
  />
);

const renderStarRating = () => (
  <div className="space-y-4 p-4">
    <div className="flex items-center gap-4">
      <StarRating rating={5} size="lg" showValue />
      <span className="text-sm text-surface-muted-foreground">Large</span>
    </div>
    <div className="flex items-center gap-4">
      <StarRating rating={4} size="md" showValue />
      <span className="text-sm text-surface-muted-foreground">Medium</span>
    </div>
    <div className="flex items-center gap-4">
      <StarRating rating={3.5} size="sm" showValue />
      <span className="text-sm text-surface-muted-foreground">Small</span>
    </div>
  </div>
);

export const socialProofElements: ElementDefinition[] = [
  {
    slug: 'testimonial-card',
    name: 'Testimonial Card',
    category: 'Social Proof',
    description: 'Customer review with star rating and attribution',
    renders: {
      orion: renderTestimonial,
      vega: renderTestimonial,
    },
  },
  {
    slug: 'star-rating',
    name: 'Star Rating',
    category: 'Social Proof',
    description: 'Configurable star rating display with size variants',
    renders: {
      orion: renderStarRating,
      vega: renderStarRating,
    },
  },
];
