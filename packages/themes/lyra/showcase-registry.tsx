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
import { HowItStartedSection } from './components/how-it-started-section';
import { EventPhotoGallery } from './components/event-photo-gallery';
import { TeamMemberBio } from './components/team-member-bio';
import { ErrorStateCentered } from './components/error-state-centered';
import { BlogStats } from './components/blog-stats';
import { SiteFooter } from './components/site-footer';
import { TeamMemberBenDunkle } from './components/custom-team-member-green';
import { TeamMemberRonBrennan } from './components/custom-team-member-orange';
import { TeamMemberTimBouchard } from './components/custom-team-member-blue';
import { NewsletterSubscribeCTA } from './components/cta-newsletter-inline-form';
import { RegistrationErrorState } from './components/custom-error-message-centered';
import { OrderErrorMessage } from './components/custom-error-card-centered';
import { NewsletterSubscribeBanner } from './components/cta-newsletter-banner';
import { OrderErrorCard } from './components/content-error-card-centered';
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
    description: "Global site navigation with logo, primary CTA button, and hamburger menu, present on every page",
    themeName: "lyra",
    render: () => <TopNavigation />,
  },
  {
    slug: "hero-full-bleed-text",
    name: "HeroHeadline",
    category: "Hero",
    description: "Large typographic hero statement introducing the conference brand and value proposition with inline colour highlights and decorative shapes",
    themeName: "lyra",
    render: () => <HeroHeadline />,
  },
  {
    slug: "hero-event-details-split",
    name: "EventDetailsBanner",
    category: "Hero",
    description: "Displays key event details — date, time, venue — alongside a speaker photo with CTA button",
    themeName: "lyra",
    render: () => <EventDetailsBanner />,
  },
  {
    slug: "hero-page-title-banner",
    name: "PageTitleBanner",
    category: "Hero",
    description: "Full-width page title banner identifying the current section with decorative icon or slash marks",
    themeName: "lyra",
    render: () => <PageTitleBanner />,
  },
  {
    slug: "cta-newsletter-signup",
    name: "NewsletterSignup",
    category: "CTA",
    description: "Full-width newsletter subscription band capturing email addresses for event updates, present on every page",
    themeName: "lyra",
    render: () => <NewsletterSignup />,
  },
  {
    slug: "cta-call-for-speakers-yellow",
    name: "CallForSpeakersCTA",
    category: "CTA",
    description: "Encourages speakers to apply with a brief description and apply button on a yellow background",
    themeName: "lyra",
    render: () => <CallForSpeakersCTA />,
  },
  {
    slug: "cta-call-for-sponsors-blue",
    name: "CallForSponsorsCTA",
    category: "CTA",
    description: "Encourages sponsors to support the event with a brief description and view sponsor levels button on a blue background",
    themeName: "lyra",
    render: () => <CallForSponsorsCTA />,
  },
  {
    slug: "cta-call-for-volunteers-green",
    name: "CallForVolunteersCTA",
    category: "CTA",
    description: "Encourages volunteers to apply with a brief description and apply button on a green background",
    themeName: "lyra",
    render: () => <CallForVolunteersCTA />,
  },
  {
    slug: "blog-cards-grid",
    name: "BlogPostGrid",
    category: "Blog",
    description: "Displays recent blog post cards with thumbnail, title, date, excerpt, and read more CTA in a two-column grid",
    themeName: "lyra",
    render: () => <BlogPostGrid />,
  },
  {
    slug: "content-about-events-dark",
    name: "ColorCodeEventsAbout",
    category: "Content",
    description: "Describes the ColorCode Events organisation, its history and mission with a learn more CTA on a dark background",
    themeName: "lyra",
    render: () => <ColorCodeEventsAbout />,
  },
  {
    slug: "content-origin-story",
    name: "HowItStartedSection",
    category: "Content",
    description: "Explains the origin story of ColorCode Events and its founding partners with decorative arrows",
    themeName: "lyra",
    render: () => <HowItStartedSection />,
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
    slug: "team-member-bio",
    name: "TeamMemberBio",
    category: "Custom",
    description: "Full-width founder bio card with name, title, description, and external links on a coloured background",
    themeName: "lyra",
    render: () => <TeamMemberBio />,
  },
  {
    slug: "error-state-centered",
    name: "ErrorStateCentered",
    category: "Custom",
    description: "Displays an error or empty state message indicating no purchase was made, with a link back home",
    themeName: "lyra",
    render: () => <ErrorStateCentered />,
  },
  {
    slug: "stats-blog",
    name: "BlogStats",
    category: "Stats",
    description: "Displays blog post metadata and stats such as read time or post count",
    themeName: "lyra",
    render: () => <BlogStats />,
  },
  {
    slug: "footer-multi-column",
    name: "SiteFooter",
    category: "Footer",
    description: "Global site footer with navigation links grouped by category, logo, social icons, and copyright, present on every page",
    themeName: "lyra",
    render: () => <SiteFooter />,
  },
  {
    slug: "custom-team-member-green",
    name: "TeamMemberBenDunkle",
    category: "Custom",
    description: "Founder bio card for Ben Dunkle with title, description and LinkedIn link",
    themeName: "lyra",
    render: () => <TeamMemberBenDunkle />,
  },
  {
    slug: "custom-team-member-orange",
    name: "TeamMemberRonBrennan",
    category: "Custom",
    description: "Founder bio card for Ron Brennan with title, description and external links",
    themeName: "lyra",
    render: () => <TeamMemberRonBrennan />,
  },
  {
    slug: "custom-team-member-blue",
    name: "TeamMemberTimBouchard",
    category: "Custom",
    description: "Founder bio card for Tim Bouchard with title, description and external links",
    themeName: "lyra",
    render: () => <TeamMemberTimBouchard />,
  },
  {
    slug: "cta-newsletter-inline-form",
    name: "NewsletterSubscribeCTA",
    category: "CTA",
    description: "Email newsletter subscription section encouraging visitors to sign up for event news and articles",
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
    slug: "custom-error-card-centered",
    name: "OrderErrorMessage",
    category: "Custom",
    description: "Displays an error message indicating no purchase was made, with a link back home",
    themeName: "lyra",
    render: () => <OrderErrorMessage />,
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
    slug: "content-error-card-centered",
    name: "OrderErrorCard",
    category: "Content",
    description: "Displays an error message indicating no purchase was made, with a link back home",
    themeName: "lyra",
    render: () => <OrderErrorCard />,
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
