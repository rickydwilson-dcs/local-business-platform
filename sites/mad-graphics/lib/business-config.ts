import { siteConfig } from '@/site.config';

export const businessType = siteConfig.business.type;

export const businessConfig = {
  name: siteConfig.business.name,
  legalName: siteConfig.business.legalName,
  description: `${siteConfig.business.name} provides vehicle graphics, signs, banners and print services across East Sussex. Est. 2004. Based in ${siteConfig.business.address.city}.`,
  slogan: siteConfig.tagline,
  email: siteConfig.business.email,
  telephone: siteConfig.business.phone,
  address: {
    streetAddress: siteConfig.business.address.street,
    addressLocality: siteConfig.business.address.city,
    addressRegion: siteConfig.business.address.region,
    postalCode: siteConfig.business.address.postalCode,
    addressCountry: 'GB',
  },
  geo: {
    latitude: String(siteConfig.business.geo?.latitude ?? 0),
    longitude: String(siteConfig.business.geo?.longitude ?? 0),
  },
  openingHours: [
    {
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '08:00',
      closes: '17:30',
    },
  ],
  areaServed: [
    'Eastbourne', 'Hastings', 'Lewes', 'Bexhill-on-Sea', 'Uckfield',
    'Crowborough', 'Seaford', 'Hailsham', 'Newhaven', 'Polegate',
    'Peacehaven', 'Battle', 'St Leonards-on-Sea', 'Heathfield',
    'Pevensey', 'Ringmer', 'Herstmonceux', 'Wadhurst', 'Alfriston',
  ],
  credentials: [
    { name: 'Est. 2004', description: 'Over 20 years serving East Sussex businesses', category: 'certification' as const },
  ],
  offerCatalog: [
    { name: 'Vehicle Graphics', description: 'Fleet graphics, van graphics, and vehicle livery for businesses', url: '/services/vehicle-graphics' },
    { name: 'Signs & Signage', description: 'Shop signs, building signs, and outdoor signage', url: '/services/signs-signage' },
    { name: 'Banners & PVC', description: 'Printed banners, PVC banners, and roller banners', url: '/services/banners' },
    { name: 'Graphic Design', description: 'Logo design, brand identity, and artwork preparation', url: '/services/graphic-design' },
    { name: 'Large Format Print', description: 'Wide format digital printing for any application', url: '/services/large-format-print' },
    { name: 'Window Graphics', description: 'Window stickers, frosted vinyl, and promotional graphics', url: '/services/window-graphics' },
  ],
  socialProfiles: [siteConfig.business.socialMedia.instagram].filter(Boolean) as string[],
};
