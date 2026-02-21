/**
 * About Page
 *
 * Generated from site analysis blueprint.
 * Path: /about
 */

import { HowItStarted, NewsletterSignup, PageTitleBanner, SiteFooter, TeamMemberBenDunkle, TeamMemberRonBrennan, TeamMemberTimBouchard, TopNavigation } from "@platform/themes/lyra/components";

export default function Page() {
  return (
    <div className="min-h-screen">
      {/* Section: Primary site-wide navigation with logo, event info CTA button, and hamburger menu for mobile — from navigation-top-bar */}
      <TopNavigation />

      {/* Section: Page title banner identifying interior pages with decorative icon and large heading — from hero-page-title-banner */}
      <PageTitleBanner />

      {/* Section: Describes the founding story and mission of ColorCode Events with decorative arrows and multi-paragraph text — from content-origin-story */}
      <HowItStarted />

      {/* Section: Profile card for co-founder Ben Dunkle with bio and LinkedIn link — from cards-team-member-green */}
      <TeamMemberBenDunkle />

      {/* Section: Profile card for co-founder Ron Brennan with bio and external links — from cards-team-member-orange */}
      <TeamMemberRonBrennan />

      {/* Section: Profile card for co-founder Tim Bouchard with bio and external links — from cards-team-member-blue */}
      <TeamMemberTimBouchard />

      {/* Section: Captures email addresses for newsletter subscription with heading, subtext, email input and submit button — from cta-newsletter-signup */}
      <NewsletterSignup />

      {/* Section: Global site footer with categorised navigation links, logo and copyright — from footer-site-links */}
      <SiteFooter />

    </div>
  );
}
