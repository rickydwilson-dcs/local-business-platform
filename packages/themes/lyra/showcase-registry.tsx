/**
 * Lyra Theme — Showcase Registry
 *
 * Auto-generated ElementDefinition entries for the showcase site.
 */

import type { ReactNode } from "react";

import { AnnouncementBar } from "./components/announcement-bar";
import { PrimaryNavigation } from "./components/primary-navigation";
import { HeroSplit } from "./components/hero-split";
import { CenteredPageHero } from "./components/centered-page-hero";
import { ClientLogoStrip } from "./components/client-logo-strip";
import { TeamAvatarRow } from "./components/team-avatar-row";
import { CustomerCountBanner } from "./components/customer-count-banner";
import { TestimonialsGrid } from "./components/testimonials-grid";
import { ServicesGrid } from "./components/services-grid";
import { FilteredCardsGrid } from "./components/filtered-cards-grid";
import { FeaturedBlogPost } from "./components/featured-blog-post";
import { GradientDividerBand } from "./components/gradient-divider-band";
import { HelpCTABanner } from "./components/help-cta-banner";
import { FAQAccordion } from "./components/faq-accordion";
import { ContactInformation } from "./components/contact-information";
import { ContactFormPanel } from "./components/contact-form-panel";
import { LogoDesignQuestionnaireForm } from "./components/logo-design-questionnaire-form";
import { SiteFooter } from "./components/site-footer";
import { SupportCTABanner } from "./components/cta-dark-support-banner";
import { TopNavigation } from "./components/navigation-top-bar";
import { AboutHero } from "./components/hero-split-about";
import { TeamAvatarCarousel } from "./components/social-proof-logo-carousel";
import { BlogArticleGrid } from "./components/blog-cards-grid-filtered";
import { ContactHero } from "./components/hero-split-contact-intro";
import { EmergencyHelpCTA } from "./components/cta-dark-split-emergency-help";
import { WebsiteHelpCTA } from "./components/cta-dark-banner";

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
    slug: "navigation-announcement-bar",
    name: "AnnouncementBar",
    category: "Navigation",
    description: "Top-of-page announcement strip promoting the award-winning team with a CTA link",
    themeName: "lyra",
    render: () => <AnnouncementBar />,
  },
  {
    slug: "navigation-primary-header",
    name: "PrimaryNavigation",
    category: "Navigation",
    description: "Main site navigation with logo, nav links, search icon and contact CTA button",
    themeName: "lyra",
    render: () => <PrimaryNavigation />,
  },
  {
    slug: "hero-split-text-media",
    name: "HeroSplit",
    category: "Hero",
    description:
      "Primary hero section introducing the page with headline, body text, CTAs and a right-side media element (illustration or image)",
    themeName: "lyra",
    render: () => <HeroSplit />,
  },
  {
    slug: "hero-centered-light",
    name: "CenteredPageHero",
    category: "Hero",
    description:
      "Centered page header introducing an interior page with eyebrow label, large heading and subheading",
    themeName: "lyra",
    render: () => <CenteredPageHero />,
  },
  {
    slug: "social-proof-client-logo-strip",
    name: "ClientLogoStrip",
    category: "Social Proof",
    description:
      "Displays logos of notable clients in a horizontal row to build trust and credibility",
    themeName: "lyra",
    render: () => <ClientLogoStrip />,
  },
  {
    slug: "social-proof-team-avatar-row",
    name: "TeamAvatarRow",
    category: "Social Proof",
    description:
      "Displays circular avatar indicators for team members or clients in a horizontal row",
    themeName: "lyra",
    render: () => <TeamAvatarRow />,
  },
  {
    slug: "social-proof-customer-count",
    name: "CustomerCountBanner",
    category: "Social Proof",
    description:
      "Highlights the number of satisfied customers to build trust, with a link to more reviews",
    themeName: "lyra",
    render: () => <CustomerCountBanner />,
  },
  {
    slug: "social-proof-testimonials-grid",
    name: "TestimonialsGrid",
    category: "Social Proof",
    description:
      "Displays customer testimonials with star ratings and reviewer names to build trust",
    themeName: "lyra",
    render: () => <TestimonialsGrid />,
  },
  {
    slug: "cards-services-grid",
    name: "ServicesGrid",
    category: "Cards",
    description:
      "Showcases the agency's core service offerings in a grid of icon cards with descriptions and arrow links",
    themeName: "lyra",
    render: () => <ServicesGrid />,
  },
  {
    slug: "cards-filtered-grid",
    name: "FilteredCardsGrid",
    category: "Cards",
    description:
      "Filterable grid of cards (case studies or blog articles) with category filter tabs, card image, tags, title, description, author and pagination",
    themeName: "lyra",
    render: () => <FilteredCardsGrid />,
  },
  {
    slug: "blog-featured-post-split",
    name: "FeaturedBlogPost",
    category: "Blog",
    description:
      "Highlights the latest or featured blog post with image, tags, title, excerpt and author",
    themeName: "lyra",
    render: () => <FeaturedBlogPost />,
  },
  {
    slug: "cta-full-bleed-gradient",
    name: "GradientDividerBand",
    category: "CTA",
    description:
      "Full-width decorative gradient wave band acting as a visual break between content sections",
    themeName: "lyra",
    render: () => <GradientDividerBand />,
  },
  {
    slug: "cta-dark-help-banner",
    name: "HelpCTABanner",
    category: "CTA",
    description:
      "Encourages visitors who have website problems to contact the agency for help, with supporting illustration of avatars",
    themeName: "lyra",
    render: () => <HelpCTABanner />,
  },
  {
    slug: "content-faq-accordion",
    name: "FAQAccordion",
    category: "Content",
    description:
      "Answers common customer questions using an accordion layout with links to full FAQ and support centre",
    themeName: "lyra",
    render: () => <FAQAccordion />,
  },
  {
    slug: "content-contact-information",
    name: "ContactInformation",
    category: "Content",
    description:
      "Displays physical address, opening hours, phone number, support centre link and additional contact resource links",
    themeName: "lyra",
    render: () => <ContactInformation />,
  },
  {
    slug: "custom-contact-form",
    name: "ContactFormPanel",
    category: "Custom",
    description:
      "Primary contact form allowing users to submit name, company, email, phone, service selection, additional info and file attachments",
    themeName: "lyra",
    render: () => <ContactFormPanel />,
  },
  {
    slug: "custom-logo-questionnaire-form",
    name: "LogoDesignQuestionnaireForm",
    category: "Custom",
    description:
      "Multi-field questionnaire form collecting business info, design preferences, target audience, logo style, colour preferences and signature for a logo design brief",
    themeName: "lyra",
    render: () => <LogoDesignQuestionnaireForm />,
  },
  {
    slug: "footer-site-footer",
    name: "SiteFooter",
    category: "Footer",
    description:
      "Full site footer with contact details, company links, quick links, legal links, company registration, certifications, partner logos and social icons",
    themeName: "lyra",
    render: () => <SiteFooter />,
  },
  {
    slug: "cta-dark-support-banner",
    name: "SupportCTABanner",
    category: "CTA",
    description: "Encourages users who have broken their website to contact the agency for help",
    themeName: "lyra",
    render: () => <SupportCTABanner />,
  },
  {
    slug: "navigation-top-bar",
    name: "TopNavigation",
    category: "Navigation",
    description: "Primary site navigation with logo, nav links, search and contact CTA",
    themeName: "lyra",
    render: () => <TopNavigation />,
  },
  {
    slug: "hero-split-about",
    name: "AboutHero",
    category: "Hero",
    description:
      "Introduces the About Us page with headline, tagline, CTA button and a bookshelf image",
    themeName: "lyra",
    render: () => <AboutHero />,
  },
  {
    slug: "social-proof-logo-carousel",
    name: "TeamAvatarCarousel",
    category: "Social Proof",
    description:
      "Displays circular avatar/profile indicators, likely team members or client logos in a horizontal row",
    themeName: "lyra",
    render: () => <TeamAvatarCarousel />,
  },
  {
    slug: "blog-cards-grid-filtered",
    name: "BlogArticleGrid",
    category: "Blog",
    description:
      "Displays a filterable grid of blog article cards with category filters, pagination",
    themeName: "lyra",
    render: () => <BlogArticleGrid />,
  },
  {
    slug: "hero-split-contact-intro",
    name: "ContactHero",
    category: "Hero",
    description:
      "Introduces the contact page with a headline and subtext encouraging visitors to get in touch",
    themeName: "lyra",
    render: () => <ContactHero />,
  },
  {
    slug: "cta-dark-split-emergency-help",
    name: "EmergencyHelpCTA",
    category: "CTA",
    description:
      "Reassurance section for users who have broken their website, encouraging them to contact Fountain Digital for help",
    themeName: "lyra",
    render: () => <EmergencyHelpCTA />,
  },
  {
    slug: "cta-dark-banner",
    name: "WebsiteHelpCTA",
    category: "CTA",
    description: "Bottom-of-page CTA encouraging users to get help with their website",
    themeName: "lyra",
    render: () => <WebsiteHelpCTA />,
  },
];
