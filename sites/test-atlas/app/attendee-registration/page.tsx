/**
 * Custom Page
 *
 * Generated from site analysis blueprint.
 * Path: /attendee-registration
 */

import { NewsletterSignup, RegistrationErrorState, SiteFooter, TopNavigation } from "@platform/themes/atlas/components";

export default function Page() {
  return (
    <div className="min-h-screen">
      {/* Section: Global site navigation with logo, event info button, and hamburger menu — from navigation-top-bar */}
      <TopNavigation />

      {/* Section: Displays an error/empty state message indicating no purchase was made during attendee registration flow — from custom-error-message-centered */}
      <RegistrationErrorState />

      {/* Section: Captures email addresses for newsletter subscription — from cta-newsletter-signup */}
      <NewsletterSignup />

      {/* Section: Global site footer with categorised navigation links, logo, social icons, and copyright — from footer-multi-column */}
      <SiteFooter />

    </div>
  );
}
