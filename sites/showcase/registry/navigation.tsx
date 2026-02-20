import { SiteHeader } from '@platform/core-components';
import type { ElementDefinition } from './index';

export const navigationElements: ElementDefinition[] = [
  {
    slug: 'site-header',
    name: 'Site Header',
    category: 'Navigation',
    description: 'Orion: dark header with white text. Vega: light header with gray text.',
    renders: {
      orion: () => (
        <SiteHeader
          appearance="dark"
          siteName="DJ Fox Electrical"
          phoneDisplay="020 1234 5678"
          phoneTel="02012345678"
          primaryCta={{ label: 'Get Free Quote', href: '/contact' }}
          navigation={[
            { label: 'Services', href: '/services' },
            { label: 'Locations', href: '/locations' },
            { label: 'About', href: '/about' },
            { label: 'Blog', href: '/blog' },
          ]}
          sticky={false}
        />
      ),
      vega: () => (
        <SiteHeader
          appearance="light"
          siteName="Colossus Scaffolding"
          phoneDisplay="020 1234 5678"
          phoneTel="02012345678"
          primaryCta={{ label: 'Get Free Quote', href: '/contact' }}
          navigation={[
            { label: 'Services', href: '/services' },
            { label: 'Locations', href: '/locations' },
            { label: 'About', href: '/about' },
            { label: 'Blog', href: '/blog' },
          ]}
          sticky={false}
        />
      ),
    },
  },
];
