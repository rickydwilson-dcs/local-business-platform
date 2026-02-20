import { CTASection } from '@platform/core-components';
import type { ElementDefinition } from './index';

const renderCta = () => (
  <CTASection
    title="Ready to Get Started?"
    description="Contact us today for a free, no-obligation quote. Our team is standing by to help with your project."
    primaryButtonText="Get Free Quote"
    primaryButtonUrl="/contact"
    secondaryButtonText="Call Us Now"
    secondaryButtonUrl="tel:+442012345678"
    trustBadges={['Industry Certified', 'Fully Accredited', 'Fully Insured']}
  />
);

export const ctaElements: ElementDefinition[] = [
  {
    slug: 'cta-section',
    name: 'CTA Section',
    category: 'CTAs',
    description: 'Full-width call-to-action with primary/secondary buttons and trust badges',
    renders: {
      orion: renderCta,
      vega: renderCta,
    },
  },
];
