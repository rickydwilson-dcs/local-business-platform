/**
 * BlogList Page
 *
 * Generated from site analysis blueprint.
 * Path: /blog
 */

import { BlogPostGrid, NewsletterSubscribeCTA, PageTitleBanner, SiteFooter, TopNavigation } from "@platform/themes/lyra/components";

export default function Page() {
  return (
    <div className="min-h-screen">
      {/* Section: Primary site-wide navigation with logo, event info CTA button, and hamburger menu for mobile — from navigation-top-bar */}
      <TopNavigation />

      {/* Section: Page title banner identifying interior pages with decorative icon and large heading — from hero-page-title-banner */}
      <PageTitleBanner />

      {/* Section: Displays a grid of blog post cards with thumbnail image, title, date, excerpt, and read more CTA — from blog-cards-two-column-grid */}
      <BlogPostGrid />

      {/* Section: Encourages visitors to subscribe to the newsletter with an inline email form — from cta-newsletter-inline-form */}
      <NewsletterSubscribeCTA />

      {/* Section: Site-wide footer with navigation links grouped by category (Events, Support, Legal, Company), logo, social icons, and copyright — from footer-multi-column-links */}
      <SiteFooter />

    </div>
  );
}
