/**
 * BlogList Page
 *
 * Generated from site analysis blueprint.
 * Path: /blog
 */

import { BlogPreview, NewsletterSignup, PageBanner, SiteFooter, TopNavigation } from "@platform/themes/atlas/components";

export default function Page() {
  return (
    <div className="min-h-screen">
      {/* Section: Global site navigation with logo, event info button, and hamburger menu — from navigation-top-bar */}
      <TopNavigation />

      {/* Section: Page title banner identifying this as the Blog section — from hero-page-banner */}
      <PageBanner />

      {/* Section: Showcases recent blog posts with thumbnail, title, date, excerpt and read more link — from blog-card-grid */}
      <BlogPreview />

      {/* Section: Captures email addresses for newsletter subscription — from cta-newsletter-signup */}
      <NewsletterSignup />

      {/* Section: Global site footer with categorised navigation links, logo, social icons, and copyright — from footer-multi-column */}
      <SiteFooter />

    </div>
  );
}
