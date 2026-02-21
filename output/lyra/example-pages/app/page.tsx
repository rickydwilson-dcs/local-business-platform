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
      {/* Section: Primary site-wide navigation with logo, event info CTA button, and hamburger menu for mobile — from navigation-top-bar */}
      <TopNavigation />

      {/* Section: Large typographic hero statement introducing the conference brand and value proposition with inline coloured graphic accents — from hero-full-bleed-text */}
      <HeroHeadline />

      {/* Section: Displays key event logistics — date, time, venue — alongside a speaker photo with a CTA button — from hero-event-details-split */}
      <EventDetailsBanner />

      {/* Section: Encourages speakers to apply to present at the conference — from cta-call-for-speakers-yellow */}
      <CallForSpeakersCTA />

      {/* Section: Invites potential sponsors to support the event — from cta-call-for-sponsors-blue */}
      <CallForSponsorsCTA />

      {/* Section: Recruits volunteers to help run the conference — from cta-call-for-volunteers-green */}
      <CallForVolunteersCTA />

      {/* Section: Displays a grid of blog post cards with thumbnail image, title, date, excerpt, and read more CTA — from blog-cards-grid */}
      <BlogPostGrid />

      {/* Section: Describes the ColorCode Events organisation and its mission with heading, body copy and learn more CTA — from content-about-colorcode-events */}
      <ColorCodeEventsAbout />

      {/* Section: Visual gallery of past event photos to build credibility and excitement — from social-proof-photo-gallery */}
      <EventPhotoGallery />

      {/* Section: Captures email addresses for newsletter subscription with heading, subtext, email input and submit button — from cta-newsletter-signup */}
      <NewsletterSignup />

      {/* Section: Site-wide footer with navigation links grouped by category (Events, Support, Legal, Company), logo, social icons, and copyright — from footer-multi-column-links */}
      <SiteFooter />

    </div>
  );
}
