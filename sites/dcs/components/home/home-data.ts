/**
 * DCS homepage copy and pricing — typed data extracted verbatim from the r9
 * prototype (`output/sessions/2026-08/2026-08-17_dcs-homepage-redesign/prototype/r9-kota-level.html`).
 *
 * Every string below is asserted present in the prototype's own source by
 * `sites/dcs/test/home-data.test.ts`, which reads the prototype file live
 * (after HTML-entity and JS \uXXXX decoding) — so a transcription slip,
 * especially in a price figure, fails the test rather than landing silently.
 *
 * This file holds data only. Rendering concerns (fonts, `tabular-nums`,
 * markup) belong to the Phase 5 components — comma'd price figures below are
 * plain strings for that reason.
 *
 * Media references are logical keys into `sites/dcs/lib/home-assets.ts`
 * (the single source of truth for R2 URLs) — never a raw URL here.
 */

import type { HomeAssetName } from '@/lib/home-assets';
import { BUSINESS_EMAIL, PHONE_SCHEMA } from '@/lib/contact-info';

// ============ work ============

export interface WorkLink {
  label: string;
  href: string;
}

export interface WorkItem {
  index: string;
  name: string;
  description: string;
  /** All five work items carry an outbound link to the live site. */
  link: WorkLink;
  video: HomeAssetName;
  poster: HomeAssetName;
}

export const WORK: WorkItem[] = [
  {
    index: '01 / 05',
    name: 'The Clothing Kings',
    description:
      'A workwear store where the price changes with the job — embroidery or vinyl, front, back or sleeve — and the customer uploads their logo at checkout.',
    link: { label: 'theclothingkings.co.uk →', href: 'https://www.theclothingkings.co.uk' },
    video: 'work-clothing-kings.video',
    poster: 'work-clothing-kings.poster',
  },
  {
    index: '02 / 05',
    name: 'Cuddle Plush Fabrics',
    description:
      'With me since 2014. Products now load automatically from their wholesalers’ sites, and backorders are handled — so a catalogue that size stays accurate without anyone keying it in.',
    link: { label: 'cuddleplushfabrics.co.uk →', href: 'https://www.cuddleplushfabrics.co.uk' },
    video: 'work-cuddle-plush.video',
    poster: 'work-cuddle-plush.poster',
  },
  {
    index: '03 / 05',
    name: 'NP Racing',
    description:
      'A British Superbike team site carrying race reports, rider profiles and season gallery, updated through the racing calendar.',
    link: { label: 'npracingbsb.co.uk →', href: 'https://npracingbsb.co.uk' },
    video: 'work-np-racing.video',
    poster: 'work-np-racing.poster',
  },
  {
    index: '04 / 05',
    name: 'SM Commercial',
    description:
      'Bespoke commercial upholstery and fabrication since 2009. A portfolio built to win enquiries for custom work rather than to sell products.',
    link: { label: 'smcommercial.uk →', href: 'https://www.smcommercial.uk' },
    video: 'work-sm-commercial.video',
    poster: 'work-sm-commercial.poster',
  },
  {
    index: '05 / 05',
    name: 'Colossus Scaffolding',
    description:
      '78 pages of localised content, every image generated rather than photographed. They came with a logo, a few Instagram posts and a list of nearby towns. First enquiry inside two weeks.',
    link: { label: 'colossus-scaffolding.co.uk →', href: 'https://www.colossus-scaffolding.co.uk' },
    video: 'work-colossus.video',
    poster: 'work-colossus.poster',
  },
];

// ============ services ============

export type ServiceColor = 'ink' | 'magenta' | 'white' | 'navy' | 'aqua';

export type ServiceMedia =
  | { kind: 'video'; video: HomeAssetName; poster: HomeAssetName }
  | { kind: 'image'; image: HomeAssetName };

export interface ServiceCard {
  index: string;
  title: string;
  description: string;
  linkLabel: string;
  color: ServiceColor;
  media: ServiceMedia;
}

export const SERVICES: ServiceCard[] = [
  {
    index: '01 — DESIGN',
    title: 'Website design',
    description:
      'Designed around your business, not picked off a shelf. No template to fiddle with, no builder to learn, nothing left half-finished.',
    linkLabel: 'Start a project →',
    color: 'ink',
    media: { kind: 'video', video: 'work-ink.video', poster: 'work-ink.poster' },
  },
  {
    index: '02 — SELLING',
    title: 'eCommerce',
    description:
      'Start selling online properly. I build the store, load your products, set up payments and delivery, and show you how the orders arrive.',
    linkLabel: 'Sell online →',
    color: 'magenta',
    media: { kind: 'video', video: 'work-ecommerce.video', poster: 'work-ecommerce.poster' },
  },
  {
    index: '03 — BEING FOUND',
    title: 'Local SEO',
    description:
      "Service pages, location pages and structured data, built in from the start rather than bolted on later. A site nobody can find isn't worth having.",
    linkLabel: 'Get found →',
    color: 'white',
    media: { kind: 'image', image: 'web-phone-on-site' },
  },
  {
    index: '04 — LOOKING AFTER IT',
    title: 'Ongoing management',
    description:
      'Hosting, security, updates and changes, all handled. No login, no CMS, no dashboard to learn. You send a message; I make the change.',
    linkLabel: "See what's included →",
    color: 'navy',
    media: { kind: 'image', image: 'web-laptop-store' },
  },
  {
    index: '05 — KNOWING',
    title: 'Analytics & reporting',
    description:
      "What's actually working, in plain English, once a month. Where people came from, what they clicked, and what to do about it.",
    linkLabel: 'See a sample report →',
    color: 'aqua',
    media: { kind: 'image', image: 'web-abstract-mesh' },
  },
  {
    index: '06 — EVERY DAY',
    title: 'Business email',
    description:
      "Professional email on your own domain, set up properly and moved over without losing anything. No more addresses ending in a provider's name.",
    linkLabel: 'Sort my email →',
    color: 'white',
    media: { kind: 'image', image: 'web-sector-office' },
  },
];

// ============ process ============

export interface ProcessStep {
  key: string;
  title: string;
  body: string;
}

export const STEPS: ProcessStep[] = [
  {
    key: '01',
    title: 'We talk',
    body: 'No brief needed, no copy to write, no idea of what you want required. I ask the questions.',
  },
  {
    key: '02',
    title: 'I write it',
    body: "The words, the structure, the pages. You don't have to know what to say about your own business.",
  },
  {
    key: '03',
    title: 'I design and build it',
    body: 'You see it before it goes anywhere. Changes are a message, not a ticket.',
  },
  {
    key: '04',
    title: 'I look after it',
    body: 'Hosting, security, updates, changes. It keeps working and you keep working.',
  },
];

// ============ questions ============

export interface Faq {
  question: string;
  answer: string;
  /** The prototype's first <details> carries the `open` attribute. */
  open?: boolean;
}

export const FAQS: Faq[] = [
  {
    question: 'Do I own my website?',
    answer:
      'Yes, if you paid upfront. Pay-monthly clients own all their content, and the hosting arrangement transfers to you if you cancel after your minimum term.',
    open: true,
  },
  {
    question: 'Is there a contract?',
    answer:
      'Pay-monthly has a 24-month minimum term, after which it rolls monthly. Upfront clients have no ongoing commitment beyond the monthly hosting fee.',
  },
  {
    question: 'What happens if I want to cancel?',
    answer:
      "Give me 30 days' notice after your minimum term and I'll export all your content so you can take it elsewhere. No fuss.",
  },
  {
    question: "What's actually included in the monthly fee?",
    answer:
      'Hosting on fast UK servers, SSL certificate, domain renewal, security monitoring and uptime alerts — all managed for you.',
  },
  {
    question: 'Can I move up a tier later?',
    answer:
      "Yes, at any time. I'll quote for the extra pages and work out the most cost-effective route rather than starting again.",
  },
  {
    question: 'Do I need to know what I want first?',
    answer:
      "No. That's the part most people dread and it's the part I handle. One conversation, and I write the content and make the design decisions from there.",
  },
];

// ============ pricing ============
// Transcribed exactly from the prototype's inline `TIERS` script object
// (£ = £, — = —). Comma'd price figures (£1,495, £2,995) are plain
// strings — never format them in a mono face or with `tabular-nums`, see
// CLAUDE.md's CSS Syntax trap on comma corruption.

export interface TierPrice {
  fig: string;
  sub: string;
  /** Absent for ecom's `monthly` entry — that state is unreachable in the UI. */
  head?: string;
}

export type TierKey = 'starter' | 'pro' | 'growth' | 'ecom';

export interface PricingTier {
  key: TierKey;
  name: string;
  /** The tier__s line shown next to the tier name (page count / positioning). */
  subtitle: string;
  upfrontOnly: boolean;
  upfront: TierPrice;
  monthly: TierPrice;
  description: string;
  bullets: string[];
}

export const TIERS: PricingTier[] = [
  {
    key: 'starter',
    name: 'Starter',
    subtitle: 'Up to 5 pages',
    upfrontOnly: false,
    upfront: { fig: '£750', sub: '+ £10/mo', head: '£750 upfront, then £10 a month' },
    monthly: { fig: '£45', sub: 'per month', head: '£45 a month, nothing upfront' },
    description:
      'Up to five pages, all designed and written for you. Everything a business needs to look credible and get found.',
    bullets: ['Bespoke design — no template', 'Local SEO built in', 'Hosting, SSL and security'],
  },
  {
    key: 'pro',
    name: 'Professional',
    subtitle: 'Up to 20 pages · most land here',
    upfrontOnly: false,
    upfront: { fig: '£1,495', sub: '+ £15/mo', head: '£1,495 upfront, then £15 a month' },
    monthly: { fig: '£85', sub: 'per month', head: '£85 a month, nothing upfront' },
    description:
      'Up to twenty pages, and the one most small businesses land on. Room for the pages Google takes seriously.',
    bullets: [
      'Everything in Starter, plus:',
      'Service and location pages',
      'Monthly plain-English reporting',
    ],
  },
  {
    key: 'growth',
    name: 'Growth',
    subtitle: 'Up to 100 pages',
    upfrontOnly: false,
    upfront: { fig: '£2,995', sub: '+ £25/mo', head: '£2,995 upfront, then £25 a month' },
    monthly: { fig: '£150', sub: 'per month', head: '£150 a month, nothing upfront' },
    description:
      'Up to a hundred pages — every service you offer, in every town you cover, each with a page of its own.',
    bullets: [
      'Everything in Professional, plus:',
      'Every service in every town',
      'Priority support',
    ],
  },
  {
    key: 'ecom',
    name: 'eCommerce',
    subtitle: 'Online store · upfront only',
    upfrontOnly: true,
    upfront: {
      fig: 'From £2,995',
      sub: '+ £50/mo',
      head: 'From £2,995 upfront, then £50 a month',
    },
    // Placeholder state: the prototype's click handler switches the pay-mode
    // to upfront the moment this tier is selected, so this monthly panel is
    // never actually shown — it is transcribed for fidelity, not display.
    monthly: { fig: 'N/A', sub: 'upfront only' },
    description:
      'An online store, built and loaded. Products, payments and delivery set up and handed over working.',
    bullets: [
      'Store built and products loaded',
      'Payments and delivery set up',
      'Stock and orders handled',
    ],
  },
];

// ============ quote ============

export const QUOTE = {
  text: '“When I want something added I just text Ricky and it gets done. It’s so easy.”',
  author: 'Martin',
  context: '· The Clothing Kings, Polegate',
};

// ============ contact ============
// KNOWN MISMATCHES (see Phase 4 report): sites/dcs/lib/contact-info.ts's
// formatPhoneDisplay() and formatAddressSingleLine() both compute differently
// from the prototype's literal text, computed from sites/dcs/site.config.ts's
// business.phone / business.address. This is a verbatim port of the
// prototype, so the mismatched fields below are the prototype's own literal
// strings, not the computed exports. BUSINESS_EMAIL and PHONE_SCHEMA DO match
// the prototype exactly and are reused rather than forked.

export const CONTACT = {
  email: BUSINESS_EMAIL,
  mailtoHref: `mailto:${BUSINESS_EMAIL}`,
  /**
   * MISMATCH: contact-info.ts's formatPhoneDisplay() computes "07383 666 268"
   * (5+3+3 digit grouping, two spaces) from site.config.ts's business.phone.
   * The prototype's original number displayed as "07395 063764" (5+6
   * grouping, one space) — kept here in that grouping after the number
   * changed (2026-08-24), rather than switching to the factory's grouping.
   */
  phoneDisplay: '07383 666268',
  /** Derived from site.config.ts's business.phone via PHONE_SCHEMA. */
  phoneHref: `tel:${PHONE_SCHEMA}`,
  /**
   * MISMATCH: contact-info.ts's formatAddressSingleLine() includes "Dittons
   * Road" (present in site.config.ts's business.address.street) and inserts
   * a comma before the postcode, producing "Unit H3, Chaucer Business Park,
   * Dittons Road, Polegate, East Sussex, BN26 6QH". The prototype's footer
   * omits "Dittons Road" and that comma: "Unit H3, Chaucer Business Park,
   * Polegate, East Sussex BN26 6QH". Using the prototype's literal text here.
   */
  address: 'Unit H3, Chaucer Business Park, Polegate, East Sussex BN26 6QH',
} as const;
