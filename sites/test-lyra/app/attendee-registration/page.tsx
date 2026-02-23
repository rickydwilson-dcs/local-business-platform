/**
 * Custom Page
 *
 * Generated from site analysis blueprint.
 * Path: /attendee-registration
 */

import { NewsletterSignup, RegistrationErrorState, SiteFooter, TopNavigation } from "@platform/themes/lyra/components";

export default function Page() {
  return (
    <div className="min-h-screen">
      {/* Section: Global site navigation with logo, primary CTA button, and hamburger menu, present on every page — from navigation-top-bar */}
      <TopNavigation />

      {/* Section: Displays an error/empty state message indicating no purchase was made during attendee registration flow — from custom-error-message-centered */}
      <RegistrationErrorState />

      {/* Section: Full-width newsletter subscription band capturing email addresses for event updates, present on every page — from cta-newsletter-signup */}
      <NewsletterSignup />

      {/* Section: Global site footer with navigation links grouped by category, logo, social icons, and copyright, present on every page — from footer-multi-column */}
      <SiteFooter />

    </div>
  );
}
