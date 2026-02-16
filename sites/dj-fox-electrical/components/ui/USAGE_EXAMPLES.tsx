/**
 * Usage Examples for DJ Fox Electrical Hero Components
 *
 * This file contains ready-to-use examples demonstrating the hero components.
 * Copy-paste these examples into your pages.
 */

import { HeroWithImage } from './hero-with-image';
import { PageHero } from './page-hero';
import { AccentUnderline } from '@platform/core-components';

// ============================================================================
// HOMEPAGE HERO EXAMPLES
// ============================================================================

/**
 * Homepage Hero - Main Landing Page
 * Full-width background with accent underline on keyword
 */
export function HomePageHeroExample() {
  return (
    <HeroWithImage
      imageSrc="/images/electrician-working-panel.jpg"
      imageAlt="Professional electrician working on electrical panel"
      heading={
        <AccentUnderline as="h1" className="text-5xl md:text-6xl font-bold text-white">
          High Quality **Electrical** Services
        </AccentUnderline>
      }
      subheading="NICEIC Approved Contractor in Eastbourne"
      ctaPrimary={{
        label: 'Get Free Quote',
        href: '/contact',
      }}
      ctaSecondary={{
        label: 'Our Services',
        href: '/services',
      }}
      overlay="dark"
    />
  );
}

/**
 * Emergency Services Landing Page
 * Darker overlay for emphasis, phone CTA
 */
export function EmergencyServicesHeroExample() {
  return (
    <HeroWithImage
      imageSrc="/images/emergency-electrical-services.jpg"
      imageAlt="Emergency electrical services available 24/7"
      heading={
        <AccentUnderline as="h1" className="text-5xl md:text-6xl font-bold text-white">
          24/7 **Emergency** Electrical Services
        </AccentUnderline>
      }
      subheading="Fast Response Across East Sussex"
      ctaPrimary={{
        label: 'Call Now: 01323 123456',
        href: 'tel:01323123456',
      }}
      ctaSecondary={{
        label: 'View Emergency Services',
        href: '/services/emergency',
      }}
      overlay="darker"
      breadcrumbs={[
        { name: 'Home', href: '/' },
        { name: 'Services', href: '/services' },
        { name: 'Emergency Services', href: '/services/emergency', current: true },
      ]}
    />
  );
}

/**
 * About Us Hero
 * Red overlay for brand emphasis
 */
export function AboutUsHeroExample() {
  return (
    <HeroWithImage
      imageSrc="/images/dj-fox-team-photo.jpg"
      imageAlt="DJ Fox Electrical team of qualified electricians"
      heading={
        <h1 className="text-5xl md:text-6xl font-bold text-white">
          Your Local <span className="text-brand-accent">Electrical</span> Experts
        </h1>
      }
      subheading="Serving East Sussex Since 2005"
      ctaPrimary={{
        label: 'Meet the Team',
        href: '/about',
      }}
      ctaSecondary={{
        label: 'Our Accreditations',
        href: '/about#accreditations',
      }}
      overlay="red"
      minHeight="min-h-[70vh]"
    />
  );
}

// ============================================================================
// PAGE HERO EXAMPLES (Interior Pages)
// ============================================================================

/**
 * Service Page Hero
 * Standard interior page hero with breadcrumbs
 */
export function ServicePageHeroExample() {
  return (
    <PageHero
      title="Electrical Installation Services"
      subtitle="Professional installation services across East Sussex"
      imageSrc="/images/electrical-installation.jpg"
      imageAlt="Electrical installation work in progress"
      breadcrumbs={[
        { name: 'Home', href: '/' },
        { name: 'Services', href: '/services' },
        { name: 'Installation', href: '/services/installation', current: true },
      ]}
    />
  );
}

/**
 * Location Page Hero
 * Location-specific hero with town name
 */
export function LocationPageHeroExample() {
  return (
    <PageHero
      title="Electrician in Eastbourne"
      subtitle="Trusted electrical services throughout Eastbourne and surrounding areas"
      imageSrc="/images/eastbourne-electrical-services.jpg"
      imageAlt="Electrical services in Eastbourne"
      breadcrumbs={[
        { name: 'Home', href: '/' },
        { name: 'Coverage Areas', href: '/coverage' },
        { name: 'Eastbourne', href: '/coverage/eastbourne', current: true },
      ]}
      minHeight="min-h-[35vh]"
    />
  );
}

/**
 * Blog Post Hero
 * Shorter hero for blog content
 */
export function BlogPostHeroExample() {
  return (
    <PageHero
      title="Understanding EICR Certificates"
      subtitle="A complete guide to Electrical Installation Condition Reports"
      imageSrc="/images/eicr-certificate-guide.jpg"
      imageAlt="EICR electrical safety certificate"
      breadcrumbs={[
        { name: 'Home', href: '/' },
        { name: 'Blog', href: '/blog' },
        { name: 'EICR Guide', href: '/blog/eicr-guide', current: true },
      ]}
      minHeight="min-h-[25vh]"
    />
  );
}

/**
 * Contact Page Hero
 * Simple hero for contact page
 */
export function ContactPageHeroExample() {
  return (
    <PageHero
      title="Contact DJ Fox Electrical"
      subtitle="Get in touch for a free, no-obligation quote"
      imageSrc="/images/contact-us.jpg"
      imageAlt="Contact DJ Fox Electrical for electrical services"
      breadcrumbs={[
        { name: 'Home', href: '/' },
        { name: 'Contact', href: '/contact', current: true },
      ]}
    />
  );
}

// ============================================================================
// ACCENT UNDERLINE VARIATIONS
// ============================================================================

/**
 * Multiple Accent Words
 * Underline multiple keywords in the same heading
 */
export function MultipleAccentsExample() {
  return (
    <HeroWithImage
      imageSrc="/images/professional-electrical-work.jpg"
      imageAlt="Professional electrical work and solutions"
      heading={
        <AccentUnderline as="h1" className="text-5xl md:text-6xl font-bold text-white">
          **Professional** Electrical **Solutions**
        </AccentUnderline>
      }
      subheading="Quality workmanship you can trust"
      ctaPrimary={{
        label: 'Get Started',
        href: '/contact',
      }}
      overlay="dark"
    />
  );
}

/**
 * Custom Underline Styling
 * Thicker underline with more offset
 */
export function CustomUnderlineExample() {
  return (
    <HeroWithImage
      imageSrc="/images/electrical-testing.jpg"
      imageAlt="Electrical testing and inspection services"
      heading={
        <AccentUnderline
          as="h1"
          className="text-5xl md:text-6xl font-bold text-white"
          underlineThickness={6}
          underlineOffset={12}
        >
          Electrical Testing & **Inspection** Services
        </AccentUnderline>
      }
      subheading="Ensuring your electrical systems are safe and compliant"
      ctaPrimary={{
        label: 'Book Inspection',
        href: '/contact',
      }}
      overlay="dark"
    />
  );
}

/**
 * H2 Accent in Section Heading
 * Using AccentUnderline in page sections (not hero)
 */
export function SectionHeadingAccentExample() {
  return (
    <section className="section-standard bg-white">
      <div className="container-standard">
        <div className="text-center mb-12">
          <AccentUnderline as="h2" className="text-4xl md:text-5xl font-bold">
            Our Latest **Useful** News
          </AccentUnderline>
          <p className="text-xl text-gray-700 mt-4">
            Expert advice and updates from DJ Fox Electrical
          </p>
        </div>
        {/* Blog post cards would go here */}
      </div>
    </section>
  );
}

// ============================================================================
// COMPLETE PAGE EXAMPLES
// ============================================================================

/**
 * Complete Homepage Structure
 * Shows hero + content sections
 */
export function CompleteHomePageExample() {
  return (
    <>
      {/* Hero Section */}
      <HeroWithImage
        imageSrc="/images/dj-fox-electrical-hero.jpg"
        imageAlt="Professional electrician working on modern electrical panel"
        heading={
          <AccentUnderline as="h1" className="text-5xl md:text-6xl font-bold text-white">
            High Quality **Electrical** Services
          </AccentUnderline>
        }
        subheading="NICEIC Approved Contractor in Eastbourne"
        ctaPrimary={{
          label: 'Get Free Quote',
          href: '/contact',
        }}
        ctaSecondary={{
          label: 'Our Services',
          href: '/services',
        }}
        overlay="dark"
      />

      {/* Service Cards Section */}
      <section className="section-standard bg-gray-50">
        <div className="container-standard">
          <div className="text-center mb-12">
            <AccentUnderline as="h2" className="text-4xl font-bold">
              Our **Electrical** Services
            </AccentUnderline>
          </div>
          {/* Service cards would go here */}
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-standard bg-brand-primary text-white">
        <div className="container-standard text-center">
          <h2 className="text-4xl font-bold mb-4">Need an Electrician?</h2>
          <p className="text-xl mb-8">Contact us today for a free, no-obligation quote</p>
          <a href="/contact" className="btn-secondary-lg">
            Get in Touch
          </a>
        </div>
      </section>
    </>
  );
}

/**
 * Complete Service Page Structure
 * Shows page hero + service content
 */
export function CompleteServicePageExample() {
  return (
    <>
      {/* Page Hero */}
      <PageHero
        title="Electrical Installation Services"
        subtitle="Professional installation services across East Sussex"
        imageSrc="/images/electrical-installation.jpg"
        imageAlt="Electrical installation work in progress"
        breadcrumbs={[
          { name: 'Home', href: '/' },
          { name: 'Services', href: '/services' },
          { name: 'Installation', href: '/services/installation', current: true },
        ]}
      />

      {/* Service Content */}
      <section className="section-standard bg-white">
        <div className="container-standard">
          <div className="prose lg:prose-lg max-w-4xl mx-auto">
            {/* Service description content */}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-standard bg-gray-50">
        <div className="container-standard">
          <AccentUnderline as="h2" className="text-4xl font-bold text-center mb-12">
            Frequently Asked **Questions**
          </AccentUnderline>
          {/* FAQ items would go here */}
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-standard bg-brand-primary text-white">
        <div className="container-standard text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Start Your Project?</h2>
          <p className="text-xl mb-8">Get a free quote for your electrical installation</p>
          <a href="/contact" className="btn-secondary-lg">
            Contact Us
          </a>
        </div>
      </section>
    </>
  );
}
