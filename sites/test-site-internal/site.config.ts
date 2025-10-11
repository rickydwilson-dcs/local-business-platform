import { SiteConfig } from '@platform/core-components';

export const siteConfig: SiteConfig = {
  name: 'Colossus Scaffolding',
  slug: 'test-site-internal',
  description: 'Professional scaffolding services across South East England',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',

  business: {
    name: 'Colossus Scaffolding',
    tagline: 'Professional Scaffolding Solutions',
    phone: '01323 123456',
    email: 'info@colossusscaffolding.com',
    address: {
      street: '123 Main Street',
      city: 'Eastbourne',
      county: 'East Sussex',
      postcode: 'BN21 1AA',
    },
  },

  // Component variants (will be used in future versions)
  components: {
    hero: 'default',
    serviceCard: 'default',
    contactForm: 'default',
  },

  // Colors (will override Tailwind theme)
  theme: {
    primary: '#1e40af', // blue-800
    secondary: '#0f172a', // slate-900
    accent: '#f59e0b', // amber-500
  },

  // SEO defaults
  seo: {
    defaultTitle: 'Colossus Scaffolding - Professional Scaffolding Services',
    titleTemplate: '%s | Colossus Scaffolding',
    defaultDescription: 'Professional scaffolding services across South East England',
    keywords: ['scaffolding', 'construction', 'eastbourne', 'sussex'],
  },

  // Social media
  social: {
    facebook: 'https://facebook.com/colossusscaffolding',
    twitter: 'https://twitter.com/colossusscaff',
    instagram: 'https://instagram.com/colossusscaffolding',
  },

  // Features
  features: {
    blog: true,
    projects: true,
    testimonials: true,
    gallery: true,
  },
};

export default siteConfig;
