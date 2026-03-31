/**
 * Rigel Theme — Showcase Registry
 *
 * Auto-generated ElementDefinition entries for the showcase site.
 */

import type { ReactNode } from 'react';

import { TopNavigation } from './components/top-navigation';
import { NewsletterSignupCTA } from './components/newsletter-signup-cta';
import { SiteFooter } from './components/site-footer';
import { HeroHeadline } from './components/hero-headline';
import { EventDetailsBanner } from './components/event-details-banner';
import { PageTitleBanner } from './components/page-title-banner';
import { CallForSpeakersCTA } from './components/call-for-speakers-cta';
import { CallForSponsorsCTA } from './components/call-for-sponsors-cta';
import { CallForVolunteersCTA } from './components/call-for-volunteers-cta';
import { BlogPreviewCards } from './components/blog-preview-cards';
import { BlogPostArticle } from './components/blog-post-article';
import { ColorCodeEventsAbout } from './components/colorcode-events-about';
import { HowItStarted } from './components/how-it-started';
import { TeamBioBlock } from './components/team-bio-block';
import { EventPhotoGallery } from './components/event-photo-gallery';
import { EventStatsBlock } from './components/event-stats-block';
import { SponsorsGrid } from './components/sponsors-grid';
import { GetTicketsCTA } from './components/get-tickets-cta';
import { RegistrationErrorCard } from './components/registration-error-card';
import { LegalContent } from './components/legal-content';
import { CheckoutContent } from './components/checkout-content';
import { TeamBioBenDunkle } from './components/content-team-bio-green';
import { TeamBioRonBrennan } from './components/content-team-bio-orange';
import { TeamBioTimBouchard } from './components/content-team-bio-blue';
import { BlogPostGrid } from './components/blog-card-grid-two-col';
import { BlogPageBanner } from './components/hero-blog-banner';
import { BlogPostBody } from './components/content-blog-post-body';
import { NewsletterSignupBar } from './components/cta-newsletter-signup-bar';
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
import { NavigationJumpTo } from './components/navigation-jump-to';
import { ContentPrivacyPolicy } from './components/content-privacy-policy';
import { ContentWhoops } from './components/content-whoops';

export interface ShowcaseElementEntry {
  slug: string;
  name: string;
  category: string;
  description: string;
  themeName: string;
  render: () => ReactNode;
}

export const rigelElements: ShowcaseElementEntry[] = [
  {
    slug: "navigation-top-bar",
    name: "TopNavigation",
    category: "Navigation",
    description: "Site-wide navigation bar with logo, primary CTA button, and hamburger menu for mobile",
    themeName: "rigel",
    render: () => <TopNavigation />,
  },
  {
    slug: "cta-newsletter-signup",
    name: "NewsletterSignupCTA",
    category: "CTA",
    description: "Captures email addresses for newsletter subscription with heading, subtext, email input, and submit button",
    themeName: "rigel",
    render: () => <NewsletterSignupCTA />,
  },
  {
    slug: "footer-multi-column-links",
    name: "SiteFooter",
    category: "Footer",
    description: "Site-wide footer with navigation links grouped by category, brand logo, social media icons, and copyright notice",
    themeName: "rigel",
    render: () => <SiteFooter />,
  },
  {
    slug: "hero-full-bleed-text",
    name: "HeroHeadline",
    category: "Hero",
    description: "Large typographic hero statement introducing the conference brand and value proposition with inline coloured graphic accents",
    themeName: "rigel",
    render: () => <HeroHeadline />,
  },
  {
    slug: "hero-event-details-split",
    name: "EventDetailsBanner",
    category: "Hero",
    description: "Displays key event details (date, time, venue) alongside a speaker or stage photo",
    themeName: "rigel",
    render: () => <EventDetailsBanner />,
  },
  {
    slug: "hero-page-title-banner",
    name: "PageTitleBanner",
    category: "Hero",
    description: "Page-level banner identifying the current section with decorative slash marks and a large heading",
    themeName: "rigel",
    render: () => <PageTitleBanner />,
  },
  {
    slug: "cta-call-for-speakers-yellow",
    name: "CallForSpeakersCTA",
    category: "CTA",
    description: "Encourages designers, developers, and marketers to apply as conference speakers",
    themeName: "rigel",
    render: () => <CallForSpeakersCTA />,
  },
  {
    slug: "cta-call-for-sponsors-blue",
    name: "CallForSponsorsCTA",
    category: "CTA",
    description: "Invites potential sponsors to support the event with a link to sponsor levels",
    themeName: "rigel",
    render: () => <CallForSponsorsCTA />,
  },
  {
    slug: "cta-call-for-volunteers-green",
    name: "CallForVolunteersCTA",
    category: "CTA",
    description: "Recruits volunteers to help support the conference event",
    themeName: "rigel",
    render: () => <CallForVolunteersCTA />,
  },
  {
    slug: "blog-cards-grid",
    name: "BlogPreviewCards",
    category: "Blog",
    description: "Showcases recent or listed blog posts with thumbnail, title, date, excerpt, and read more CTA",
    themeName: "rigel",
    render: () => <BlogPreviewCards />,
  },
  {
    slug: "blog-post-article-body",
    name: "BlogPostArticle",
    category: "Blog",
    description: "Full blog post content including title, date, body copy, inline images, ordered list, and back-to-blog link",
    themeName: "rigel",
    render: () => <BlogPostArticle />,
  },
  {
    slug: "content-about-colorcode-events",
    name: "ColorCodeEventsAbout",
    category: "Content",
    description: "Describes the ColorCode Events organisation, its history, and mission",
    themeName: "rigel",
    render: () => <ColorCodeEventsAbout />,
  },
  {
    slug: "content-two-column-origin-story",
    name: "HowItStarted",
    category: "Content",
    description: "Describes the founding story of ColorCode Events with decorative arrow elements",
    themeName: "rigel",
    render: () => <HowItStarted />,
  },
  {
    slug: "content-team-bio",
    name: "TeamBioBlock",
    category: "Content",
    description: "Team member bio card with name, title, description, and external links (LinkedIn, company)",
    themeName: "rigel",
    render: () => <TeamBioBlock />,
  },
  {
    slug: "social-proof-photo-gallery",
    name: "EventPhotoGallery",
    category: "Social Proof",
    description: "Visual gallery of past event photos to build credibility and excitement",
    themeName: "rigel",
    render: () => <EventPhotoGallery />,
  },
  {
    slug: "stats-event-details",
    name: "EventStatsBlock",
    category: "Stats",
    description: "Displays key event statistics and details such as schedule, venue, speakers, and Saturday highlights",
    themeName: "rigel",
    render: () => <EventStatsBlock />,
  },
  {
    slug: "cards-sponsors",
    name: "SponsorsGrid",
    category: "Cards",
    description: "Displays sponsor logos or cards in a grid layout",
    themeName: "rigel",
    render: () => <SponsorsGrid />,
  },
  {
    slug: "cta-get-tickets",
    name: "GetTicketsCTA",
    category: "CTA",
    description: "Drives ticket purchases for the event with a prominent CTA button and optional form",
    themeName: "rigel",
    render: () => <GetTicketsCTA />,
  },
  {
    slug: "custom-error-centered-card",
    name: "RegistrationErrorCard",
    category: "Custom",
    description: "Displays an error or whoops message indicating no purchase was made, with a link back home",
    themeName: "rigel",
    render: () => <RegistrationErrorCard />,
  },
  {
    slug: "content-legal",
    name: "LegalContent",
    category: "Content",
    description: "Displays long-form legal or policy content such as Privacy Policy with heading and body",
    themeName: "rigel",
    render: () => <LegalContent />,
  },
  {
    slug: "content-checkout",
    name: "CheckoutContent",
    category: "Content",
    description: "Displays the ticket checkout flow content with heading and body",
    themeName: "rigel",
    render: () => <CheckoutContent />,
  },
  {
    slug: "content-team-bio-green",
    name: "TeamBioBenDunkle",
    category: "Content",
    description: "Team member bio card for Ben Dunkle with name, title, description and LinkedIn link",
    themeName: "rigel",
    render: () => <TeamBioBenDunkle />,
  },
  {
    slug: "content-team-bio-orange",
    name: "TeamBioRonBrennan",
    category: "Content",
    description: "Team member bio card for Ron Brennan with name, title, description and external links",
    themeName: "rigel",
    render: () => <TeamBioRonBrennan />,
  },
  {
    slug: "content-team-bio-blue",
    name: "TeamBioTimBouchard",
    category: "Content",
    description: "Team member bio card for Tim Bouchard with name, title, description and external links",
    themeName: "rigel",
    render: () => <TeamBioTimBouchard />,
  },
  {
    slug: "blog-card-grid-two-col",
    name: "BlogPostGrid",
    category: "Blog",
    description: "Displays a grid of blog post cards with thumbnail image, title, date, excerpt, and read more CTA",
    themeName: "rigel",
    render: () => <BlogPostGrid />,
  },
  {
    slug: "hero-blog-banner",
    name: "BlogPageBanner",
    category: "Hero",
    description: "Page-level banner identifying the Blog section with decorative slash marks",
    themeName: "rigel",
    render: () => <BlogPageBanner />,
  },
  {
    slug: "content-blog-post-body",
    name: "BlogPostBody",
    category: "Blog",
    description: "Full blog post content including title, date, body text, inline images, and numbered list",
    themeName: "rigel",
    render: () => <BlogPostBody />,
  },
  {
    slug: "cta-newsletter-signup-bar",
    name: "NewsletterSignupBar",
    category: "CTA",
    description: "Email newsletter subscription section with headline, description, email input, and submit button",
    themeName: "rigel",
    render: () => <NewsletterSignupBar />,
  },
  {
    slug: "hero",
    name: "Hero",
    category: "Hero",
    description: "Hero section",
    themeName: "rigel",
    render: () => <Hero />,
  },
  {
    slug: "navigation-buffalo-2025",
    name: "NavigationBuffalo2025",
    category: "Navigation",
    description: "Navigation section: Buffalo 2025",
    themeName: "rigel",
    render: () => <NavigationBuffalo2025 />,
  },
  {
    slug: "stats-saturday",
    name: "StatsSaturday",
    category: "Stats",
    description: "Stats section: Saturday",
    themeName: "rigel",
    render: () => <StatsSaturday />,
  },
  {
    slug: "stats",
    name: "Stats",
    category: "Stats",
    description: "Stats section",
    themeName: "rigel",
    render: () => <Stats />,
  },
  {
    slug: "stats-venue",
    name: "StatsVenue",
    category: "Stats",
    description: "Stats section: Venue",
    themeName: "rigel",
    render: () => <StatsVenue />,
  },
  {
    slug: "stats-schedule",
    name: "StatsSchedule",
    category: "Stats",
    description: "Stats section: Schedule",
    themeName: "rigel",
    render: () => <StatsSchedule />,
  },
  {
    slug: "stats-speakers",
    name: "StatsSpeakers",
    category: "Stats",
    description: "Stats section: Speakers",
    themeName: "rigel",
    render: () => <StatsSpeakers />,
  },
  {
    slug: "cta-subscribe-to-our-newsletter",
    name: "CtaSubscribeToOurNewsletter",
    category: "CTA",
    description: "CTA section: Subscribe to our Newsletter",
    themeName: "rigel",
    render: () => <CtaSubscribeToOurNewsletter />,
  },
  {
    slug: "content",
    name: "Content",
    category: "Content",
    description: "Content section",
    themeName: "rigel",
    render: () => <Content />,
  },
  {
    slug: "cta-colorcode-buffalo-tickets-comi",
    name: "CtaColorcodeBuffaloTicketsComi",
    category: "CTA",
    description: "CTA section: ColorCode: Buffalo Tickets Coming Soon!",
    themeName: "rigel",
    render: () => <CtaColorcodeBuffaloTicketsComi />,
  },
  {
    slug: "navigation-jump-to",
    name: "NavigationJumpTo",
    category: "Navigation",
    description: "Navigation section: Jump to:",
    themeName: "rigel",
    render: () => <NavigationJumpTo />,
  },
  {
    slug: "content-privacy-policy",
    name: "ContentPrivacyPolicy",
    category: "Content",
    description: "Content section: Privacy Policy",
    themeName: "rigel",
    render: () => <ContentPrivacyPolicy />,
  },
  {
    slug: "content-whoops",
    name: "ContentWhoops",
    category: "Content",
    description: "Content section: Whoops!",
    themeName: "rigel",
    render: () => <ContentWhoops />,
  },
];
