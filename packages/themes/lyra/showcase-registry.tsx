/**
 * Lyra Theme — Showcase Registry
 *
 * Auto-generated ElementDefinition entries for the showcase site.
 */

import { Hero } from './components/hero';
import { Content } from './components/content';
import { StatsSaturday } from './components/stats-saturday';
import { StatsCallForSpeakers } from './components/stats-call-for-speakers';
import { StatsColorcodeEvents } from './components/stats-colorcode-events';
import { Stats } from './components/stats';
import { CtaSubscribeToOurNewsletter } from './components/cta-subscribe-to-our-newsletter';
import { CtaColorcodeBuffaloTicketsComi } from './components/cta-colorcode-buffalo-tickets-comi';
import { NavigationJumpTo } from './components/navigation-jump-to';
import { ContentAbout } from './components/content-about';
import { SocialProofHowItStarted } from './components/social-proof-how-it-started';
import { StatsBenDunkle } from './components/stats-ben-dunkle';
import { StatsBlog } from './components/stats-blog';
import { CtaAttendeeRegistration } from './components/cta-attendee-registration';
import { NavigationBuffalo2025 } from './components/navigation-buffalo-2025';
import { CtaGetTickets } from './components/cta-get-tickets';
import { StatsVenue } from './components/stats-venue';
import { StatsSchedule } from './components/stats-schedule';
import { StatsSpeakers } from './components/stats-speakers';
import { CardsSponsors } from './components/cards-sponsors';
import { ContentPrivacyPolicy } from './components/content-privacy-policy';
import { ContentCheckout } from './components/content-checkout';
import { ContentWhoops } from './components/content-whoops';

export interface ShowcaseElementEntry {
  slug: string;
  name: string;
  category: string;
  description: string;
  themeName: string;
  render: () => React.ReactNode;
}

export const lyraElements: ShowcaseElementEntry[] = [
  {
    slug: "hero",
    name: "Hero",
    category: "Hero",
    description: "Hero section",
    themeName: "lyra",
    render: () => <Hero />,
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
    slug: "stats-saturday",
    name: "StatsSaturday",
    category: "Stats",
    description: "Stats section: Saturday",
    themeName: "lyra",
    render: () => <StatsSaturday />,
  },
  {
    slug: "stats-call-for-speakers",
    name: "StatsCallForSpeakers",
    category: "Stats",
    description: "Stats section: Call For Speakers",
    themeName: "lyra",
    render: () => <StatsCallForSpeakers />,
  },
  {
    slug: "stats-colorcode-events",
    name: "StatsColorcodeEvents",
    category: "Stats",
    description: "Stats section: ColorCode Events",
    themeName: "lyra",
    render: () => <StatsColorcodeEvents />,
  },
  {
    slug: "stats",
    name: "Stats",
    category: "Stats",
    description: "Stats section",
    themeName: "lyra",
    render: () => <Stats />,
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
    slug: "content-about",
    name: "ContentAbout",
    category: "Content",
    description: "Content section: About",
    themeName: "lyra",
    render: () => <ContentAbout />,
  },
  {
    slug: "social-proof-how-it-started",
    name: "SocialProofHowItStarted",
    category: "Social Proof",
    description: "Social Proof section: How It Started",
    themeName: "lyra",
    render: () => <SocialProofHowItStarted />,
  },
  {
    slug: "stats-ben-dunkle",
    name: "StatsBenDunkle",
    category: "Stats",
    description: "Stats section: Ben Dunkle",
    themeName: "lyra",
    render: () => <StatsBenDunkle />,
  },
  {
    slug: "stats-blog",
    name: "StatsBlog",
    category: "Stats",
    description: "Stats section: Blog",
    themeName: "lyra",
    render: () => <StatsBlog />,
  },
  {
    slug: "cta-attendee-registration",
    name: "CtaAttendeeRegistration",
    category: "CTA",
    description: "CTA section: Attendee Registration",
    themeName: "lyra",
    render: () => <CtaAttendeeRegistration />,
  },
  {
    slug: "navigation-buffalo-2025",
    name: "NavigationBuffalo2025",
    category: "Navigation",
    description: "Navigation section: Buffalo 2025",
    themeName: "lyra",
    render: () => <NavigationBuffalo2025 />,
  },
  {
    slug: "cta-get-tickets",
    name: "CtaGetTickets",
    category: "CTA",
    description: "CTA section: Get Tickets!",
    themeName: "lyra",
    render: () => <CtaGetTickets />,
  },
  {
    slug: "stats-venue",
    name: "StatsVenue",
    category: "Stats",
    description: "Stats section: Venue",
    themeName: "lyra",
    render: () => <StatsVenue />,
  },
  {
    slug: "stats-schedule",
    name: "StatsSchedule",
    category: "Stats",
    description: "Stats section: Schedule",
    themeName: "lyra",
    render: () => <StatsSchedule />,
  },
  {
    slug: "stats-speakers",
    name: "StatsSpeakers",
    category: "Stats",
    description: "Stats section: Speakers",
    themeName: "lyra",
    render: () => <StatsSpeakers />,
  },
  {
    slug: "cards-sponsors",
    name: "CardsSponsors",
    category: "Cards",
    description: "Cards section: Sponsors",
    themeName: "lyra",
    render: () => <CardsSponsors />,
  },
  {
    slug: "content-privacy-policy",
    name: "ContentPrivacyPolicy",
    category: "Content",
    description: "Content section: Privacy Policy",
    themeName: "lyra",
    render: () => <ContentPrivacyPolicy />,
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
    slug: "content-whoops",
    name: "ContentWhoops",
    category: "Content",
    description: "Content section: Whoops!",
    themeName: "lyra",
    render: () => <ContentWhoops />,
  },
];
