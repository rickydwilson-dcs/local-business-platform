/**
 * Corvus Theme — Showcase Registry
 *
 * Auto-generated ElementDefinition entries for the showcase site.
 */

import type { ReactNode } from "react";

import { TopNavBar } from "./components/top-nav-bar";
import { HeroFullBleedText } from "./components/hero-full-bleed-text";
import { EventDetailsBanner } from "./components/hero-event-details-split";
import { PageTitleBanner } from "./components/hero-page-title-banner";
import { CallForSpeakersCTA } from "./components/cta-call-for-speakers-yellow";
import { CallForSponsorsCTA } from "./components/cta-call-for-sponsors-blue";
import { CallForVolunteersCTA } from "./components/cta-call-for-volunteers-green";
import { NewsletterSignupCTA } from "./components/cta-newsletter-signup";
import { CtaGetTickets } from "./components/cta-get-tickets";
import { BlogPreviewGrid } from "./components/blog-card-grid";
import { BlogPostBody } from "./components/blog-post-content-single";
import { ColorCodeEventsAbout } from "./components/content-about-events-dark";
import { HowItStartedSection } from "./components/content-two-column-origin-story";
import { ContentBlock } from "./components/content-generic";
import { ContentPrivacyPolicy } from "./components/content-privacy-policy";
import { ContentCheckout } from "./components/content-checkout";
import { OrderErrorMessage } from "./components/custom-error-message-centered";
import { TeamMemberCard } from "./components/cards-team-member";
import { CardsSponsors } from "./components/cards-sponsors";
import { EventPhotoGallery } from "./components/social-proof-photo-gallery";
import { EventStats } from "./components/stats-event";
import { SiteFooter } from "./components/footer-multi-column";
import { NavigationJumpTo } from "./components/navigation-jump-to";
import { TeamMemberBenDunkle } from "./components/cards-team-member-green";
import { TeamMemberRonBrennan } from "./components/cards-team-member-orange";
import { TeamMemberTimBouchard } from "./components/cards-team-member-blue";
import { BlogPageBanner } from "./components/hero-blog-banner";
import { Hero } from "./components/hero";
import { NavigationBuffalo2025 } from "./components/navigation-buffalo-2025";
import { StatsSaturday } from "./components/stats-saturday";
import { Stats } from "./components/stats";
import { StatsVenue } from "./components/stats-venue";
import { StatsSchedule } from "./components/stats-schedule";
import { StatsSpeakers } from "./components/stats-speakers";
import { CtaSubscribeToOurNewsletter } from "./components/cta-subscribe-to-our-newsletter";
import { Content } from "./components/content";
import { CtaColorcodeBuffaloTicketsComi } from "./components/cta-colorcode-buffalo-tickets-comi";
import { ContentWhoops } from "./components/content-whoops";

export interface ShowcaseElementEntry {
  slug: string;
  name: string;
  category: string;
  description: string;
  themeName: string;
  render: () => ReactNode;
}

export const corvusElements: ShowcaseElementEntry[] = [
  {
    slug: "navigation-top-bar",
    name: "TopNavBar",
    category: "Navigation",
    description:
      "Site-wide navigation with logo, primary nav links, CTA button, and hamburger menu for mobile",
    themeName: "corvus",
    render: () => <TopNavBar />,
  },
  {
    slug: "hero-full-bleed-text",
    name: "HeroFullBleed",
    category: "Hero",
    description:
      "Primary hero with large typographic headline introducing the conference brand using coloured inline highlights and decorative shapes",
    themeName: "corvus",
    render: () => <HeroFullBleedText />,
  },
  {
    slug: "hero-event-details-split",
    name: "EventDetailsBanner",
    category: "Hero",
    description: "Displays event date, time, and venue details alongside a speaker or event photo",
    themeName: "corvus",
    render: () => <EventDetailsBanner />,
  },
  {
    slug: "hero-page-title-banner",
    name: "PageTitleBanner",
    category: "Hero",
    description:
      "Full-width page title banner identifying the current section with decorative slash marks and large heading text",
    themeName: "corvus",
    render: () => <PageTitleBanner />,
  },
  {
    slug: "cta-call-for-speakers-yellow",
    name: "CallForSpeakersCTA",
    category: "CTA",
    description:
      "Encourages speakers to apply with a description and apply button on a yellow background",
    themeName: "corvus",
    render: () => <CallForSpeakersCTA />,
  },
  {
    slug: "cta-call-for-sponsors-blue",
    name: "CallForSponsorsCTA",
    category: "CTA",
    description:
      "Encourages sponsors to support the event with a description and view levels button on a blue background",
    themeName: "corvus",
    render: () => <CallForSponsorsCTA />,
  },
  {
    slug: "cta-call-for-volunteers-green",
    name: "CallForVolunteersCTA",
    category: "CTA",
    description:
      "Encourages volunteers to apply with a description and apply button on a green background",
    themeName: "corvus",
    render: () => <CallForVolunteersCTA />,
  },
  {
    slug: "cta-newsletter-signup",
    name: "NewsletterSignupCTA",
    category: "CTA",
    description:
      "Captures email addresses for newsletter subscription with headline, subtext, email input, and submit button",
    themeName: "corvus",
    render: () => <NewsletterSignupCTA />,
  },
  {
    slug: "cta-get-tickets",
    name: "CtaGetTickets",
    category: "CTA",
    description: "Ticket purchase CTA with heading, description, and ticket form or button",
    themeName: "corvus",
    render: () => <CtaGetTickets />,
  },
  {
    slug: "blog-card-grid",
    name: "BlogPreviewGrid",
    category: "Blog",
    description:
      "Displays a grid of blog post cards with thumbnail image, title, date, excerpt, and read more CTA button",
    themeName: "corvus",
    render: () => <BlogPreviewGrid />,
  },
  {
    slug: "blog-post-content-single",
    name: "BlogPostBody",
    category: "Blog",
    description:
      "Full blog post content including title, date, body text, inline images, ordered list, author signature, and back-to-blog link",
    themeName: "corvus",
    render: () => <BlogPostBody />,
  },
  {
    slug: "content-about-events-dark",
    name: "ColorCodeEventsAbout",
    category: "Content",
    description:
      "Describes the ColorCode Events brand history and mission with a learn more CTA on a dark background",
    themeName: "corvus",
    render: () => <ColorCodeEventsAbout />,
  },
  {
    slug: "content-two-column-origin-story",
    name: "HowItStartedSection",
    category: "Content",
    description:
      "Explains the origin story of ColorCode Events with a large heading, decorative arrows, and multi-paragraph body text",
    themeName: "corvus",
    render: () => <HowItStartedSection />,
  },
  {
    slug: "content-generic",
    name: "ContentBlock",
    category: "Content",
    description: "Generic content section with body text and optional image",
    themeName: "corvus",
    render: () => <ContentBlock />,
  },
  {
    slug: "content-privacy-policy",
    name: "ContentPrivacyPolicy",
    category: "Content",
    description: "Displays the full privacy policy text with heading and body",
    themeName: "corvus",
    render: () => <ContentPrivacyPolicy />,
  },
  {
    slug: "content-checkout",
    name: "ContentCheckout",
    category: "Content",
    description: "Checkout content area with heading and form body for ticket purchase flow",
    themeName: "corvus",
    render: () => <ContentCheckout />,
  },
  {
    slug: "custom-error-message-centered",
    name: "OrderErrorMessage",
    category: "Custom",
    description: "Displays an error message indicating no purchase was made with a link back home",
    themeName: "corvus",
    render: () => <OrderErrorMessage />,
  },
  {
    slug: "cards-team-member",
    name: "TeamMemberCard",
    category: "Cards",
    description:
      "Full-width profile card for a team member or co-founder with name, title, bio, and external links",
    themeName: "corvus",
    render: () => <TeamMemberCard />,
  },
  {
    slug: "cards-sponsors",
    name: "CardsSponsors",
    category: "Cards",
    description: "Displays sponsor logos or cards in a grid layout",
    themeName: "corvus",
    render: () => <CardsSponsors />,
  },
  {
    slug: "social-proof-photo-gallery",
    name: "EventPhotoGallery",
    category: "Social Proof",
    description: "Visual gallery of past event photos to build credibility and excitement",
    themeName: "corvus",
    render: () => <EventPhotoGallery />,
  },
  {
    slug: "stats-event",
    name: "EventStats",
    category: "Stats",
    description:
      "Displays key event statistics such as speaker count, attendee count, schedule highlights, or venue details",
    themeName: "corvus",
    render: () => <EventStats />,
  },
  {
    slug: "footer-multi-column",
    name: "SiteFooter",
    category: "Footer",
    description:
      "Global site footer with navigation links grouped by category, brand logo, social media icons, and copyright notice",
    themeName: "corvus",
    render: () => <SiteFooter />,
  },
  {
    slug: "navigation-jump-to",
    name: "NavigationJumpTo",
    category: "Navigation",
    description:
      "In-page jump navigation allowing users to skip to named sections within a long page",
    themeName: "corvus",
    render: () => <NavigationJumpTo />,
  },
  {
    slug: "cards-team-member-green",
    name: "TeamMemberBenDunkle",
    category: "Cards",
    description: "Profile card for co-founder Ben Dunkle with bio and LinkedIn link",
    themeName: "corvus",
    render: () => <TeamMemberBenDunkle />,
  },
  {
    slug: "cards-team-member-orange",
    name: "TeamMemberRonBrennan",
    category: "Cards",
    description: "Profile card for co-founder Ron Brennan with bio and external links",
    themeName: "corvus",
    render: () => <TeamMemberRonBrennan />,
  },
  {
    slug: "cards-team-member-blue",
    name: "TeamMemberTimBouchard",
    category: "Cards",
    description: "Profile card for co-founder Tim Bouchard with bio and external links",
    themeName: "corvus",
    render: () => <TeamMemberTimBouchard />,
  },
  {
    slug: "hero-blog-banner",
    name: "BlogPageBanner",
    category: "Hero",
    description: "Page-level banner identifying the Blog section with decorative slash marks",
    themeName: "corvus",
    render: () => <BlogPageBanner />,
  },
  {
    slug: "hero",
    name: "Hero",
    category: "Hero",
    description: "Hero section",
    themeName: "corvus",
    render: () => <Hero />,
  },
  {
    slug: "navigation-buffalo-2025",
    name: "NavigationBuffalo2025",
    category: "Navigation",
    description: "Navigation section: Buffalo 2025",
    themeName: "corvus",
    render: () => <NavigationBuffalo2025 />,
  },
  {
    slug: "stats-saturday",
    name: "StatsSaturday",
    category: "Stats",
    description: "Stats section: Saturday",
    themeName: "corvus",
    render: () => <StatsSaturday />,
  },
  {
    slug: "stats",
    name: "Stats",
    category: "Stats",
    description: "Stats section",
    themeName: "corvus",
    render: () => <Stats />,
  },
  {
    slug: "stats-venue",
    name: "StatsVenue",
    category: "Stats",
    description: "Stats section: Venue",
    themeName: "corvus",
    render: () => <StatsVenue />,
  },
  {
    slug: "stats-schedule",
    name: "StatsSchedule",
    category: "Stats",
    description: "Stats section: Schedule",
    themeName: "corvus",
    render: () => <StatsSchedule />,
  },
  {
    slug: "stats-speakers",
    name: "StatsSpeakers",
    category: "Stats",
    description: "Stats section: Speakers",
    themeName: "corvus",
    render: () => <StatsSpeakers />,
  },
  {
    slug: "cta-subscribe-to-our-newsletter",
    name: "CtaSubscribeToOurNewsletter",
    category: "CTA",
    description: "CTA section: Subscribe to our Newsletter",
    themeName: "corvus",
    render: () => <CtaSubscribeToOurNewsletter />,
  },
  {
    slug: "content",
    name: "Content",
    category: "Content",
    description: "Content section",
    themeName: "corvus",
    render: () => <Content />,
  },
  {
    slug: "cta-colorcode-buffalo-tickets-comi",
    name: "CtaColorcodeBuffaloTicketsComi",
    category: "CTA",
    description: "CTA section: ColorCode: Buffalo Tickets Coming Soon!",
    themeName: "corvus",
    render: () => <CtaColorcodeBuffaloTicketsComi />,
  },
  {
    slug: "content-whoops",
    name: "ContentWhoops",
    category: "Content",
    description: "Content section: Whoops!",
    themeName: "corvus",
    render: () => <ContentWhoops />,
  },
];
