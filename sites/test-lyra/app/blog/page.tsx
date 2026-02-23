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
      {/* Section: Global site navigation with logo, primary CTA button, and hamburger menu, present on every page — from navigation-top-bar */}
      <TopNavigation />

      {/* Section: Full-width page title banner identifying the current section with decorative icon or slash marks — from hero-page-title-banner */}
      <PageTitleBanner />

      {/* Section: Displays blog post cards in a two-column grid with thumbnail, title, date, excerpt, and read more CTA — from blog-cards-two-column */}
      <BlogPostGrid />

      {/* Section: Email newsletter subscription section encouraging visitors to sign up for event news and articles — from cta-newsletter-inline-form */}
      <NewsletterSubscribeCTA />

      {/* Section: Global site footer with categorised navigation links, social media icons, logo, and copyright — from footer-multi-column-links */}
      <SiteFooter />

    </div>
  );
}
