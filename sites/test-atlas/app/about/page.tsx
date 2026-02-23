/**
 * About Page
 *
 * Generated from site analysis blueprint.
 * Path: /about
 */

import { HowItStartedSection, NewsletterSignup, PageTitleBanner, SiteFooter, TeamBioBenDunkle, TeamBioRonBrennan, TeamBioTimBouchard, TopNavigation } from "@platform/themes/atlas/components";

export default function Page() {
  return (
    <div className="min-h-screen">
      {/* Section: Global site navigation with logo, event info button, and hamburger menu — from navigation-top-bar */}
      <TopNavigation />

      {/* Section: Page title banner identifying this as the About page — from hero-page-title-banner */}
      <PageTitleBanner />

      {/* Section: Explains the origin story of ColorCode Events with descriptive text — from content-two-column-origin-story */}
      <HowItStartedSection />

      {/* Section: Team member bio card for Ben Dunkle with role, description and LinkedIn link — from custom-team-bio-green */}
      <TeamBioBenDunkle />

      {/* Section: Team member bio card for Ron Brennan with role, description and external links — from custom-team-bio-orange */}
      <TeamBioRonBrennan />

      {/* Section: Team member bio card for Tim Bouchard with role, description and external links — from custom-team-bio-blue */}
      <TeamBioTimBouchard />

      {/* Section: Captures email addresses for newsletter subscription — from cta-newsletter-signup */}
      <NewsletterSignup />

      {/* Section: Site-wide footer with navigation links grouped by category, logo, and copyright — from footer-multi-column-links */}
      <SiteFooter />

    </div>
  );
}
