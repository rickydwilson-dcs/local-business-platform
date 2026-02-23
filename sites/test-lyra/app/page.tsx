/**
 * Home Page
 *
 * Generated from site analysis blueprint.
 * Path: /
 */

import { BlogPostGrid, CallForSpeakersCTA, CallForSponsorsCTA, CallForVolunteersCTA, ColorCodeEventsAbout, EventDetailsBanner, EventPhotoGallery, HeroHeadline, NewsletterSignup, SiteFooter, TopNavigation } from "@platform/themes/lyra/components";

export default function Page() {
  return (
    <div className="min-h-screen">
      {/* Section: Global site navigation with logo, primary CTA button, and hamburger menu, present on every page — from navigation-top-bar */}
      <TopNavigation />

      {/* Section: Large typographic hero statement introducing the conference brand and value proposition with inline colour highlights and decorative shapes — from hero-full-bleed-text */}
      <HeroHeadline />

      {/* Section: Displays key event details — date, time, venue — alongside a speaker photo with CTA button — from hero-event-details-split */}
      <EventDetailsBanner />

      {/* Section: Encourages speakers to apply with a brief description and apply button on a yellow background — from cta-call-for-speakers-yellow */}
      <CallForSpeakersCTA />

      {/* Section: Encourages sponsors to support the event with a brief description and view sponsor levels button on a blue background — from cta-call-for-sponsors-blue */}
      <CallForSponsorsCTA />

      {/* Section: Encourages volunteers to apply with a brief description and apply button on a green background — from cta-call-for-volunteers-green */}
      <CallForVolunteersCTA />

      {/* Section: Displays recent blog post cards with thumbnail, title, date, excerpt, and read more CTA in a two-column grid — from blog-cards-grid */}
      <BlogPostGrid />

      {/* Section: Describes the ColorCode Events organisation, its history and mission with a learn more CTA on a dark background — from content-about-events-dark */}
      <ColorCodeEventsAbout />

      {/* Section: Visual gallery of past event photos to build credibility and excitement — from social-proof-photo-gallery */}
      <EventPhotoGallery />

      {/* Section: Full-width newsletter subscription band capturing email addresses for event updates, present on every page — from cta-newsletter-signup */}
      <NewsletterSignup />

      {/* Section: Global site footer with navigation links grouped by category, logo, social icons, and copyright, present on every page — from footer-multi-column */}
      <SiteFooter />

    </div>
  );
}
