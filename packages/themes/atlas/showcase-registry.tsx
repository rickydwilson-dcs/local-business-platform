/**
 * Atlas Theme — Showcase Registry
 *
 * Auto-generated ElementDefinition entries for the showcase site.
 */

import type { ReactNode } from 'react';

import { TopNavBar } from './components/top-nav-bar';
import { HeroFullBleed } from './components/hero-full-bleed-text';
import { EventDetailsBanner } from './components/hero-event-details-split';
import { PageTitleBanner } from './components/hero-page-title-banner';
import { NewsletterSignup } from './components/cta-newsletter-signup';
import { SiteFooter } from './components/footer-multi-column';
import { CallForSpeakers } from './components/cta-call-for-speakers';
import { CallForSponsors } from './components/cta-call-for-sponsors';
import { CallForVolunteers } from './components/cta-call-for-volunteers';
import { CtaGetTickets } from './components/cta-get-tickets';
import { BlogPreviewGrid } from './components/blog-cards-grid';
import { BlogPostArticle } from './components/blog-post-article';
import { ColorCodeEventsAbout } from './components/content-about-events';
import { HowItStartedSection } from './components/content-two-column-origin-story';
import { TeamMemberCard } from './components/cards-team-member';
import { SponsorsGrid } from './components/cards-sponsors';
import { EventStats } from './components/stats-event';
import { PhotoGalleryStrip } from './components/custom-photo-gallery-strip';
import { RegistrationErrorState } from './components/custom-error-message-centered';
import { ContentBlock } from './components/content-generic';
import { NavigationJumpTo } from './components/navigation-jump-to';
import { TeamMemberBenDunkle } from './components/cards-team-member-green';
import { TeamMemberRonBrennan } from './components/cards-team-member-orange';
import { TeamMemberTimBouchard } from './components/cards-team-member-blue';
import { BlogPostGrid } from './components/blog-cards-two-column';
import { NewsletterSubscribeCTA } from './components/cta-newsletter-inline-form';
import { PageBanner } from './components/hero-page-banner';
import { Hero } from './components/hero';
import { NavigationBuffalo2025 } from './components/navigation-buffalo-2025';
import { StatsSaturday } from './components/stats-saturday';
import { Stats } from './components/stats';
import { StatsVenue } from './components/stats-venue';
import { StatsSchedule } from './components/stats-schedule';
import { StatsSpeakers } from './components/stats-speakers';
import { CtaSubscribeToOurNewsletter } from './components/cta-subscribe-to-our-newsletter';
import { Content } from './components/content';
import { CtaColorcodeBuffaloTicketsComi } from './components/cta-colorcode-buffalo-tickets-comi';
import { ContentPrivacyPolicy } from './components/content-privacy-policy';
import { ContentCheckout } from './components/content-checkout';
import { ContentWhoops } from './components/content-whoops';

export interface ShowcaseElementEntry {
  slug: string;
  name: string;
  category: string;
  description: string;
  themeName: string;
  render: () => ReactNode;
}

export const atlasElements: ShowcaseElementEntry[] = [
  {
    slug: "navigation-top-bar",
    name: "TopNavBar",
    category: "Navigation",
    description: "Global site navigation with logo, primary CTA button, and hamburger menu, present on every page",
    themeName: "atlas",
    render: () => <TopNavBar />,
  },
  {
    slug: "hero-full-bleed-text",
    name: "HeroFullBleed",
    category: "Hero",
    description: "Primary hero with large typographic headline introducing the conference brand and value proposition",
    themeName: "atlas",
    render: () => <HeroFullBleed />,
  },
  {
    slug: "hero-event-details-split",
    name: "EventDetailsBanner",
    category: "Hero",
    description: "Displays key event logistics — date, time, venue — alongside a speaker photo with event info CTA",
    themeName: "atlas",
    render: () => <EventDetailsBanner />,
  },
  {
    slug: "hero-page-title-banner",
    name: "PageTitleBanner",
    category: "Hero",
    description: "Full-width page-level banner identifying interior sections with decorative slash marks and large heading",
    themeName: "atlas",
    render: () => <PageTitleBanner />,
  },
  {
    slug: "cta-newsletter-signup",
    name: "NewsletterSignup",
    category: "CTA",
    description: "Captures email addresses for newsletter subscription, appears site-wide above the footer",
    themeName: "atlas",
    render: () => <NewsletterSignup />,
  },
  {
    slug: "footer-multi-column",
    name: "SiteFooter",
    category: "Footer",
    description: "Global site footer with categorised navigation link columns, logo, social icons, and copyright bar",
    themeName: "atlas",
    render: () => <SiteFooter />,
  },
  {
    slug: "cta-call-for-speakers",
    name: "CallForSpeakers",
    category: "CTA",
    description: "Encourages speakers to apply to present at the conference",
    themeName: "atlas",
    render: () => <CallForSpeakers />,
  },
  {
    slug: "cta-call-for-sponsors",
    name: "CallForSponsors",
    category: "CTA",
    description: "Invites potential sponsors to support the event",
    themeName: "atlas",
    render: () => <CallForSponsors />,
  },
  {
    slug: "cta-call-for-volunteers",
    name: "CallForVolunteers",
    category: "CTA",
    description: "Recruits volunteers for the conference",
    themeName: "atlas",
    render: () => <CallForVolunteers />,
  },
  {
    slug: "cta-get-tickets",
    name: "CtaGetTickets",
    category: "CTA",
    description: "Drives ticket purchases for the event with a prominent CTA and optional form",
    themeName: "atlas",
    render: () => <CtaGetTickets />,
  },
  {
    slug: "blog-cards-grid",
    name: "BlogPreviewGrid",
    category: "Blog",
    description: "Showcases recent or all blog posts with thumbnail, title, date, excerpt, and read-more link in a card grid",
    themeName: "atlas",
    render: () => <BlogPreviewGrid />,
  },
  {
    slug: "blog-post-article",
    name: "BlogPostArticle",
    category: "Blog",
    description: "Full blog post content including title, date, body text, inline images, ordered lists, and back-to-blog link",
    themeName: "atlas",
    render: () => <BlogPostArticle />,
  },
  {
    slug: "content-about-events",
    name: "ColorCodeEventsAbout",
    category: "Content",
    description: "Describes the ColorCode Events organisation and its mission with a CTA",
    themeName: "atlas",
    render: () => <ColorCodeEventsAbout />,
  },
  {
    slug: "content-two-column-origin-story",
    name: "HowItStartedSection",
    category: "Content",
    description: "Explains the origin story of ColorCode Events with decorative arrow row and body text",
    themeName: "atlas",
    render: () => <HowItStartedSection />,
  },
  {
    slug: "cards-team-member",
    name: "TeamMemberCard",
    category: "Cards",
    description: "Full-width profile card for a co-founder or team member with bio and external links",
    themeName: "atlas",
    render: () => <TeamMemberCard />,
  },
  {
    slug: "cards-sponsors",
    name: "SponsorsGrid",
    category: "Cards",
    description: "Displays sponsor logos in a card grid layout",
    themeName: "atlas",
    render: () => <SponsorsGrid />,
  },
  {
    slug: "stats-event",
    name: "EventStats",
    category: "Stats",
    description: "Displays key event statistics such as attendee count, session count, or schedule highlights",
    themeName: "atlas",
    render: () => <EventStats />,
  },
  {
    slug: "custom-photo-gallery-strip",
    name: "PhotoGalleryStrip",
    category: "Custom",
    description: "Visual photo strip showcasing past event atmosphere and attendees",
    themeName: "atlas",
    render: () => <PhotoGalleryStrip />,
  },
  {
    slug: "custom-error-message-centered",
    name: "RegistrationErrorState",
    category: "Custom",
    description: "Displays an error or empty state message with a link back to home",
    themeName: "atlas",
    render: () => <RegistrationErrorState />,
  },
  {
    slug: "content-generic",
    name: "ContentBlock",
    category: "Content",
    description: "Generic content section with body text and optional image, used for legal pages, checkout, and utility pages",
    themeName: "atlas",
    render: () => <ContentBlock />,
  },
  {
    slug: "navigation-jump-to",
    name: "NavigationJumpTo",
    category: "Navigation",
    description: "In-page jump navigation allowing users to skip to named sections within a long page",
    themeName: "atlas",
    render: () => <NavigationJumpTo />,
  },
  {
    slug: "cards-team-member-green",
    name: "TeamMemberBenDunkle",
    category: "Cards",
    description: "Profile card for co-founder Ben Dunkle with bio and LinkedIn link",
    themeName: "atlas",
    render: () => <TeamMemberBenDunkle />,
  },
  {
    slug: "cards-team-member-orange",
    name: "TeamMemberRonBrennan",
    category: "Cards",
    description: "Profile card for co-founder Ron Brennan with bio and external links",
    themeName: "atlas",
    render: () => <TeamMemberRonBrennan />,
  },
  {
    slug: "cards-team-member-blue",
    name: "TeamMemberTimBouchard",
    category: "Cards",
    description: "Profile card for co-founder Tim Bouchard with bio and external links",
    themeName: "atlas",
    render: () => <TeamMemberTimBouchard />,
  },
  {
    slug: "blog-cards-two-column",
    name: "BlogPostGrid",
    category: "Blog",
    description: "Displays a grid of blog post cards with thumbnail image, title, date, excerpt, and read more CTA",
    themeName: "atlas",
    render: () => <BlogPostGrid />,
  },
  {
    slug: "cta-newsletter-inline-form",
    name: "NewsletterSubscribeCTA",
    category: "CTA",
    description: "Encourages visitors to subscribe to the newsletter with an inline email form",
    themeName: "atlas",
    render: () => <NewsletterSubscribeCTA />,
  },
  {
    slug: "hero-page-banner",
    name: "PageBanner",
    category: "Hero",
    description: "Page-level banner identifying the Blog section with decorative slash marks",
    themeName: "atlas",
    render: () => <PageBanner />,
  },
  {
    slug: "hero",
    name: "Hero",
    category: "Hero",
    description: "Hero section",
    themeName: "atlas",
    render: () => <Hero />,
  },
  {
    slug: "navigation-buffalo-2025",
    name: "NavigationBuffalo2025",
    category: "Navigation",
    description: "Navigation section: Buffalo 2025",
    themeName: "atlas",
    render: () => <NavigationBuffalo2025 />,
  },
  {
    slug: "stats-saturday",
    name: "StatsSaturday",
    category: "Stats",
    description: "Stats section: Saturday",
    themeName: "atlas",
    render: () => <StatsSaturday />,
  },
  {
    slug: "stats",
    name: "Stats",
    category: "Stats",
    description: "Stats section",
    themeName: "atlas",
    render: () => <Stats />,
  },
  {
    slug: "stats-venue",
    name: "StatsVenue",
    category: "Stats",
    description: "Stats section: Venue",
    themeName: "atlas",
    render: () => <StatsVenue />,
  },
  {
    slug: "stats-schedule",
    name: "StatsSchedule",
    category: "Stats",
    description: "Stats section: Schedule",
    themeName: "atlas",
    render: () => <StatsSchedule />,
  },
  {
    slug: "stats-speakers",
    name: "StatsSpeakers",
    category: "Stats",
    description: "Stats section: Speakers",
    themeName: "atlas",
    render: () => <StatsSpeakers />,
  },
  {
    slug: "cta-subscribe-to-our-newsletter",
    name: "CtaSubscribeToOurNewsletter",
    category: "CTA",
    description: "CTA section: Subscribe to our Newsletter",
    themeName: "atlas",
    render: () => <CtaSubscribeToOurNewsletter />,
  },
  {
    slug: "content",
    name: "Content",
    category: "Content",
    description: "Content section",
    themeName: "atlas",
    render: () => <Content />,
  },
  {
    slug: "cta-colorcode-buffalo-tickets-comi",
    name: "CtaColorcodeBuffaloTicketsComi",
    category: "CTA",
    description: "CTA section: ColorCode: Buffalo Tickets Coming Soon!",
    themeName: "atlas",
    render: () => <CtaColorcodeBuffaloTicketsComi />,
  },
  {
    slug: "content-privacy-policy",
    name: "ContentPrivacyPolicy",
    category: "Content",
    description: "Content section: Privacy Policy",
    themeName: "atlas",
    render: () => <ContentPrivacyPolicy />,
  },
  {
    slug: "content-checkout",
    name: "ContentCheckout",
    category: "Content",
    description: "Content section: Checkout",
    themeName: "atlas",
    render: () => <ContentCheckout />,
  },
  {
    slug: "content-whoops",
    name: "ContentWhoops",
    category: "Content",
    description: "Content section: Whoops!",
    themeName: "atlas",
    render: () => <ContentWhoops />,
  },
];
