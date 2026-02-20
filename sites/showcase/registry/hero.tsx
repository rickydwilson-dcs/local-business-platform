import { HeroSection, HeroWithImage, PageHero } from '@platform/core-components';
import type { ElementDefinition } from './index';

export const heroElements: ElementDefinition[] = [
  {
    slug: 'hero-homepage',
    name: 'Hero — Homepage',
    category: 'Hero',
    description: 'Orion: full-bleed image with dark overlay. Vega: split layout with trust badges.',
    renders: {
      orion: () => (
        <HeroWithImage
          imageSrc="https://placehold.co/1200x600/1a1a1a/ffffff?text=Hero+Image"
          imageAlt="Professional electrician at work"
          heading={
            <h1 className="text-5xl font-bold text-white">
              Expert Electrical Services
            </h1>
          }
          subheading="NICEIC Approved Contractor — Covering the South East"
          ctaPrimary={{ label: 'Get Free Quote', href: '/contact' }}
          ctaSecondary={{ label: 'Our Services', href: '/services' }}
          overlay="dark"
        />
      ),
      vega: () => (
        <HeroSection
          title="Professional Services You Can Trust"
          description="Award-winning local services with over 20 years of experience."
          trustBadges={['Industry Certified', 'Fully Insured', 'Free Quotes']}
          ctaText="Get Free Quote"
          ctaUrl="/contact"
          phone="020 1234 5678"
        />
      ),
    },
  },
  {
    slug: 'page-hero',
    name: 'Page Hero',
    category: 'Hero',
    description: 'Gradient hero for interior pages with optional badges and CTA',
    renders: {
      orion: () => (
        <PageHero
          title="Our Services"
          description="From emergency callouts to planned installations, we deliver reliable, high-quality workmanship every time."
          badges={['24/7 Support', 'Free Estimates', 'Guaranteed Work']}
          ctaText="View All Services"
          ctaLink="/services"
        />
      ),
      vega: () => (
        <PageHero
          title="Our Services"
          description="From emergency callouts to planned installations, we deliver reliable, high-quality workmanship every time."
          badges={['24/7 Support', 'Free Estimates', 'Guaranteed Work']}
          ctaText="View All Services"
          ctaLink="/services"
        />
      ),
    },
  },
];
