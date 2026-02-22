/**
 * About Page
 *
 * Generated from site analysis blueprint.
 * Path: /about
 */

import { HowItStartedSection, NewsletterSignup, PageTitleBanner, SiteFooter, TeamMemberBenDunkle, TeamMemberRonBrennan, TeamMemberTimBouchard, TopNavigation } from "@platform/themes/lyra/components";

export default function Page() {
  return (
    <div className="min-h-screen">
      {/* Section: Global site navigation with logo, primary CTA button, and hamburger menu, present on every page — from navigation-top-bar */}
      <TopNavigation />

      {/* Section: Full-width page title banner identifying the current section with decorative icon or slash marks — from hero-page-title-banner */}
      <PageTitleBanner />

      {/* Section: Explains the origin story of ColorCode Events and its founding partners with decorative arrows — from content-origin-story */}
      <HowItStartedSection />

      {/* Section: Founder bio card for Ben Dunkle with title, description and LinkedIn link — from custom-team-member-green */}
      <TeamMemberBenDunkle />

      {/* Section: Founder bio card for Ron Brennan with title, description and external links — from custom-team-member-orange */}
      <TeamMemberRonBrennan />

      {/* Section: Founder bio card for Tim Bouchard with title, description and external links — from custom-team-member-blue */}
      <TeamMemberTimBouchard />

      {/* Section: Full-width newsletter subscription band capturing email addresses for event updates, present on every page — from cta-newsletter-signup */}
      <NewsletterSignup />

      {/* Section: Global site footer with navigation links grouped by category, logo, social icons, and copyright, present on every page — from footer-multi-column */}
      <SiteFooter />

    </div>
  );
}
