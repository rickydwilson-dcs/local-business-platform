/**
 * Lyra Theme — Showcase Registry
 *
 * Auto-generated ElementDefinition entries for the showcase site.
 */

import type { ReactNode } from 'react';

import { TopNavigation } from './components/top-navigation';
import { HeroHeadline } from './components/hero-headline';
import { EventDetailsBanner } from './components/event-details-banner';
import { PageTitleBanner } from './components/page-title-banner';
import { NewsletterSignup } from './components/newsletter-signup';
import { CallForSpeakersCTA } from './components/call-for-speakers-cta';
import { CallForSponsorsCTA } from './components/call-for-sponsors-cta';
import { CallForVolunteersCTA } from './components/call-for-volunteers-cta';
import { BlogPostGrid } from './components/blog-post-grid';
import { ColorCodeEventsAbout } from './components/colorcode-events-about';
import { HowItStarted } from './components/how-it-started';
import { TeamMemberCard } from './components/team-member-card';
import { EventPhotoGallery } from './components/event-photo-gallery';
import { ErrorMessageCard } from './components/error-message-card';
import { SiteFooter } from './components/site-footer';
import { BlogStats } from './components/blog-stats';
import { TeamMemberBenDunkle } from './components/cards-team-member-green';
import { TeamMemberRonBrennan } from './components/cards-team-member-orange';
import { TeamMemberTimBouchard } from './components/cards-team-member-blue';
import { NewsletterSubscribeCTA } from './components/cta-newsletter-inline-form';
import { RegistrationErrorState } from './components/custom-error-message-centered';
import { NewsletterSubscribeBanner } from './components/cta-newsletter-banner';
import { Hero } from './components/hero';
import { ContentCheckout } from './components/content-checkout';
import { CtaSubscribeToOurNewsletter } from './components/cta-subscribe-to-our-newsletter';
import { Content } from './components/content';
import { CtaColorcodeBuffaloTicketsComi } from './components/cta-colorcode-buffalo-tickets-comi';
import { NavigationJumpTo } from './components/navigation-jump-to';
import { ContentWhoops } from './components/content-whoops';

export interface ShowcaseElementEntry {
  slug: string;
  name: string;
  category: string;
  description: string;
  themeName: string;
  render: () => ReactNode;
}

export const lyraElements: ShowcaseElementEntry[] = [
  {
    slug: "navigation-top-bar",
    name: "TopNavigation",
    category: "Navigation",
    description: "Primary site-wide navigation with logo, event info CTA button, and hamburger menu for mobile",
    themeName: "lyra",
    render: () => <TopNavigation />,
  },
  {
    slug: "hero-full-bleed-text",
    name: "HeroHeadline",
    category: "Hero",
    description: "Large typographic hero statement introducing the conference brand and value proposition with inline coloured graphic accents",
    themeName: "lyra",
    render: () => <HeroHeadline />,
  },
  {
    slug: "hero-event-details-split",
    name: "EventDetailsBanner",
    category: "Hero",
    description: "Displays key event logistics — date, time, venue — alongside a speaker photo with a CTA button",
    themeName: "lyra",
    render: () => <EventDetailsBanner />,
  },
  {
    slug: "hero-page-title-banner",
    name: "PageTitleBanner",
    category: "Hero",
    description: "Page title banner identifying interior pages with decorative icon and large heading",
    themeName: "lyra",
    render: () => <PageTitleBanner />,
  },
  {
    slug: "cta-newsletter-signup",
    name: "NewsletterSignup",
    category: "CTA",
    description: "Captures email addresses for newsletter subscription with heading, subtext, email input and submit button",
    themeName: "lyra",
    render: () => <NewsletterSignup />,
  },
  {
    slug: "cta-call-for-speakers-yellow",
    name: "CallForSpeakersCTA",
    category: "CTA",
    description: "Encourages speakers to apply to present at the conference",
    themeName: "lyra",
    render: () => <CallForSpeakersCTA />,
  },
  {
    slug: "cta-call-for-sponsors-blue",
    name: "CallForSponsorsCTA",
    category: "CTA",
    description: "Invites potential sponsors to support the event",
    themeName: "lyra",
    render: () => <CallForSponsorsCTA />,
  },
  {
    slug: "cta-call-for-volunteers-green",
    name: "CallForVolunteersCTA",
    category: "CTA",
    description: "Recruits volunteers to help run the conference",
    themeName: "lyra",
    render: () => <CallForVolunteersCTA />,
  },
  {
    slug: "blog-cards-grid",
    name: "BlogPostGrid",
    category: "Blog",
    description: "Displays a grid of blog post cards with thumbnail image, title, date, excerpt, and read more CTA",
    themeName: "lyra",
    render: () => <BlogPostGrid />,
  },
  {
    slug: "content-about-colorcode-events",
    name: "ColorCodeEventsAbout",
    category: "Content",
    description: "Describes the ColorCode Events organisation and its mission with heading, body copy and learn more CTA",
    themeName: "lyra",
    render: () => <ColorCodeEventsAbout />,
  },
  {
    slug: "content-origin-story",
    name: "HowItStarted",
    category: "Content",
    description: "Describes the founding story and mission of ColorCode Events with decorative arrows and multi-paragraph text",
    themeName: "lyra",
    render: () => <HowItStarted />,
  },
  {
    slug: "cards-team-member",
    name: "TeamMemberCard",
    category: "Cards",
    description: "Full-width profile card for a team member or co-founder with bio and external links",
    themeName: "lyra",
    render: () => <TeamMemberCard />,
  },
  {
    slug: "social-proof-photo-gallery",
    name: "EventPhotoGallery",
    category: "Social Proof",
    description: "Visual gallery of past event photos to build credibility and excitement",
    themeName: "lyra",
    render: () => <EventPhotoGallery />,
  },
  {
    slug: "custom-error-card-centered",
    name: "ErrorMessageCard",
    category: "Custom",
    description: "Displays an error or empty state message indicating no purchase was made, with a link back home",
    themeName: "lyra",
    render: () => <ErrorMessageCard />,
  },
  {
    slug: "footer-multi-column-links",
    name: "SiteFooter",
    category: "Footer",
    description: "Site-wide footer with navigation links grouped by category (Events, Support, Legal, Company), logo, social icons, and copyright",
    themeName: "lyra",
    render: () => <SiteFooter />,
  },
  {
    slug: "stats-blog",
    name: "BlogStats",
    category: "Stats",
    description: "Displays blog post metadata or stats such as read time and publication info",
    themeName: "lyra",
    render: () => <BlogStats />,
  },
  {
    slug: "cards-team-member-green",
    name: "TeamMemberBenDunkle",
    category: "Cards",
    description: "Profile card for co-founder Ben Dunkle with bio and LinkedIn link",
    themeName: "lyra",
    render: () => <TeamMemberBenDunkle />,
  },
  {
    slug: "cards-team-member-orange",
    name: "TeamMemberRonBrennan",
    category: "Cards",
    description: "Profile card for co-founder Ron Brennan with bio and external links",
    themeName: "lyra",
    render: () => <TeamMemberRonBrennan />,
  },
  {
    slug: "cards-team-member-blue",
    name: "TeamMemberTimBouchard",
    category: "Cards",
    description: "Profile card for co-founder Tim Bouchard with bio and external links",
    themeName: "lyra",
    render: () => <TeamMemberTimBouchard />,
  },
  {
    slug: "cta-newsletter-inline-form",
    name: "NewsletterSubscribeCTA",
    category: "CTA",
    description: "Encourages visitors to subscribe to the newsletter with an inline email form",
    themeName: "lyra",
    render: () => <NewsletterSubscribeCTA />,
  },
  {
    slug: "custom-error-message-centered",
    name: "RegistrationErrorState",
    category: "Custom",
    description: "Displays an error/empty state message indicating no purchase was made during attendee registration flow",
    themeName: "lyra",
    render: () => <RegistrationErrorState />,
  },
  {
    slug: "cta-newsletter-banner",
    name: "NewsletterSubscribeBanner",
    category: "CTA",
    description: "Email newsletter subscription form with submit button",
    themeName: "lyra",
    render: () => <NewsletterSubscribeBanner />,
  },
  {
    slug: "hero",
    name: "Hero",
    category: "Hero",
    description: "Hero section",
    themeName: "lyra",
    render: () => <Hero />,
  },
  {
    slug: "content-checkout",
    name: "ContentCheckout",
    category: "Content",
    description: "Content section: Checkout",
    themeName: "lyra",
    render: () => <ContentCheckout />,
  },
  {
    slug: "cta-subscribe-to-our-newsletter",
    name: "CtaSubscribeToOurNewsletter",
    category: "CTA",
    description: "CTA section: Subscribe to our Newsletter",
    themeName: "lyra",
    render: () => <CtaSubscribeToOurNewsletter />,
  },
  {
    slug: "content",
    name: "Content",
    category: "Content",
    description: "Content section",
    themeName: "lyra",
    render: () => <Content />,
  },
  {
    slug: "cta-colorcode-buffalo-tickets-comi",
    name: "CtaColorcodeBuffaloTicketsComi",
    category: "CTA",
    description: "CTA section: ColorCode: Buffalo Tickets Coming Soon!",
    themeName: "lyra",
    render: () => <CtaColorcodeBuffaloTicketsComi />,
  },
  {
    slug: "navigation-jump-to",
    name: "NavigationJumpTo",
    category: "Navigation",
    description: "Navigation section: Jump to:",
    themeName: "lyra",
    render: () => <NavigationJumpTo />,
  },
  {
    slug: "content-whoops",
    name: "ContentWhoops",
    category: "Content",
    description: "Content section: Whoops!",
    themeName: "lyra",
    render: () => <ContentWhoops />,
  },
];
