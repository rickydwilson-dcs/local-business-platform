import { ServiceCards, CircularIconCard } from '@platform/core-components';
import { Zap, Shield, Clock } from 'lucide-react';
import type { ElementDefinition } from './index';

export const cardElements: ElementDefinition[] = [
  {
    slug: 'service-cards',
    name: 'Service Cards',
    category: 'Cards',
    description: 'Orion: circular icon badges. Vega: standard card grid with features.',
    renders: {
      orion: () => (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 p-8 bg-surface-background">
          <CircularIconCard
            icon={Zap}
            title="Emergency Callout"
            description="Fast response 24/7 when you need it most."
            linkText="Learn More"
            linkHref="/services/emergency"
          />
          <CircularIconCard
            icon={Shield}
            title="Full Installation"
            description="Complete installation from planning to handover."
            linkText="Learn More"
            linkHref="/services/installation"
          />
          <CircularIconCard
            icon={Clock}
            title="Maintenance Plans"
            description="Regular inspection and maintenance contracts."
            linkText="Learn More"
            linkHref="/services/maintenance"
          />
        </div>
      ),
      vega: () => (
        <ServiceCards
          title="Our Core Services"
          description="Professional solutions tailored to your needs"
          cards={[
            {
              title: 'Scaffolding',
              subtitle: 'Residential & Commercial',
              description: 'Residential and commercial scaffold erection.',
              features: ['Free site survey', 'Rapid turnaround', 'CISRS trained'],
              href: '/services/scaffolding',
              ctaText: 'Learn More',
            },
            {
              title: 'Propping',
              subtitle: 'Structural Support',
              description: 'Structural propping for safe demolition and renovation.',
              features: ['Engineered solutions', 'Emergency response', 'Full insurance'],
              href: '/services/propping',
              ctaText: 'Learn More',
            },
            {
              title: 'Hoarding',
              subtitle: 'Site Security',
              description: 'Secure site hoarding for public safety.',
              features: ['Custom branding', 'Rapid install', 'Council compliant'],
              href: '/services/hoarding',
              ctaText: 'Learn More',
            },
          ]}
        />
      ),
    },
  },
];
