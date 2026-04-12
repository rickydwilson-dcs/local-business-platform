/**
 * Component barrel file — re-exports all theme components.
 */

export { TopNavBar } from "./top-nav-bar";
export { HeroFullBleedText } from "./hero-full-bleed-text";
export { EventDetailsBanner } from "./hero-event-details-split";
export { PageTitleBanner } from "./hero-page-title-banner";
export { CallForSpeakersCTA } from "./cta-call-for-speakers-yellow";
export { CallForSponsorsCTA } from "./cta-call-for-sponsors-blue";
export { CallForVolunteersCTA } from "./cta-call-for-volunteers-green";
export { NewsletterSignupCTA } from "./cta-newsletter-signup";
export { BlogPreviewGrid } from "./blog-card-grid";
export { BlogPostBody } from "./blog-post-content-single";
export { ColorCodeEventsAbout } from "./content-about-events-dark";
export { HowItStartedSection } from "./content-two-column-origin-story";
export { ContentBlock } from "./content-generic";
export { ContentPrivacyPolicy } from "./content-privacy-policy";
export { ContentCheckout } from "./content-checkout";
export { OrderErrorMessage } from "./custom-error-message-centered";
export { TeamMemberCard } from "./cards-team-member";
export { CardsSponsors } from "./cards-sponsors";
export { EventPhotoGallery } from "./social-proof-photo-gallery";
export { EventStats } from "./stats-event";
export { SiteFooter } from "./footer-multi-column";
export { TeamMemberBenDunkle } from "./cards-team-member-green";
export { TeamMemberRonBrennan } from "./cards-team-member-orange";
export { TeamMemberTimBouchard } from "./cards-team-member-blue";
export { BlogPageBanner } from "./hero-blog-banner";
export { Hero } from "./hero";
export { StatsSaturday } from "./stats-saturday";
export { Stats } from "./stats";
export { StatsVenue } from "./stats-venue";
export { StatsSchedule } from "./stats-schedule";
export { StatsSpeakers } from "./stats-speakers";
export { Content } from "./content";
export { ContentWhoops } from "./content-whoops";

// Theme-scoped aliases required by TPV-002
export { TopNavBar as CorvusHeader } from "./top-nav-bar";
export type { TopNavBarProps as CorvusHeaderProps } from "./top-nav-bar";
export { SiteFooter as CorvusFooter } from "./footer-multi-column";
export type { SiteFooterProps as CorvusFooterProps } from "./footer-multi-column";
