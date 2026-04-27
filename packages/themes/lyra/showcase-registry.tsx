/**
 * Lyra Theme — Showcase Registry
 *
 * Auto-generated ElementDefinition entries for the showcase site.
 */

import type { ReactNode } from "react";

import { AnnouncementBar } from "./components/announcement-bar";
import { HeroSplit } from "./components/hero-split";
import { HeroCentered } from "./components/hero-centered";
import { ClientLogoStrip } from "./components/client-logo-strip";
import { ClientLogoCarousel } from "./components/client-logo-carousel";
import { TestimonialsStrip } from "./components/testimonials-strip";
import { ServicesGrid } from "./components/services-grid";
import { CaseStudiesGrid } from "./components/case-studies-grid";
import { MidPageCTABanner } from "./components/mid-page-cta-banner";
import { HelpCTABanner } from "./components/help-cta-banner";
import { CustomerCountBanner } from "./components/customer-count-banner";
import { FAQSection } from "./components/faq-section";
import { FeaturedBlogPost } from "./components/featured-blog-post";
import { BlogArticleGrid } from "./components/blog-article-grid";
import { ContactFormPanel } from "./components/contact-form-panel";
import { LogoDesignQuestionnaireForm } from "./components/logo-design-questionnaire-form";
import { SiteFooter } from "./components/site-footer";
import { SupportCTABanner } from "./components/cta-dark-support-banner";
import { PrimaryNavigation } from "./components/navigation-horizontal-logo-links";
import { AboutHero } from "./components/hero-split-text-image";
import { ContentSpacer } from "./components/content-blank-spacer";
import { BlogHero } from "./components/hero-blog-centered";
import { ContactHero } from "./components/hero-split-contact-intro";
import { CaseStudiesHero } from "./components/hero-centered-light";
import { EmergencyCTABanner } from "./components/cta-dark-full-bleed";
import { Navigation } from "./components/navigation";

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
    description: "Top-of-page promotional announcement strip with centered text and a CTA link",
    themeName: "lyra",
    render: () => <AnnouncementBar />,
  },
  {
    slug: "hero-split",
    name: "HeroSplit",
    category: "Hero",
    description:
      "Primary two-column hero with headline, subtext, CTA buttons on the left and a supporting image or illustration on the right",
    themeName: "lyra",
    render: () => <HeroSplit />,
  },
  {
    slug: "hero-centered",
    name: "HeroCentered",
    category: "Hero",
    description:
      "Centered page-header hero introducing a section with an eyebrow label, large heading and subheading",
    themeName: "lyra",
    render: () => <HeroCentered />,
  },
  {
    slug: "social-proof-logo-strip",
    name: "ClientLogoStrip",
    category: "Social Proof",
    description:
      "Displays logos of notable clients in a horizontal row to build trust and credibility",
    themeName: "lyra",
    render: () => <ClientLogoStrip />,
  },
  {
    slug: "social-proof-logo-carousel",
    name: "ClientLogoCarousel",
    category: "Social Proof",
    description:
      "Displays client or partner logos in a horizontal scrolling carousel to build trust",
    themeName: "lyra",
    render: () => <ClientLogoCarousel />,
  },
  {
    slug: "social-proof-testimonials-strip",
    name: "TestimonialsStrip",
    category: "Social Proof",
    description:
      "Displays customer testimonials with star ratings and reviewer names in a horizontal grid",
    themeName: "lyra",
    render: () => <TestimonialsStrip />,
  },
  {
    slug: "cards-services-grid",
    name: "ServicesGrid",
    category: "Cards",
    description:
      "Showcases core services with icon, title, description and arrow link in a card grid",
    themeName: "lyra",
    render: () => <ServicesGrid />,
  },
  {
    slug: "cards-filter-grid",
    name: "CaseStudiesGrid",
    category: "Cards",
    description: "Filterable grid of case study cards with image, title, description and author",
    themeName: "lyra",
    render: () => <CaseStudiesGrid />,
  },
  {
    slug: "cta-mid-page-gradient",
    name: "MidPageCTABanner",
    category: "CTA",
    description: "Full-width decorative gradient band acting as a visual break and implicit CTA",
    themeName: "lyra",
    render: () => <MidPageCTABanner />,
  },
  {
    slug: "cta-dark-help-banner",
    name: "HelpCTABanner",
    category: "CTA",
    description:
      "Dark full-width banner encouraging users to contact the team if they have website issues, with a CTA button and illustrated team avatars",
    themeName: "lyra",
    render: () => <HelpCTABanner />,
  },
  {
    slug: "stats-customer-count",
    name: "CustomerCountBanner",
    category: "Stats",
    description:
      "Highlights the number of satisfied customers to build social proof with a reviews CTA",
    themeName: "lyra",
    render: () => <CustomerCountBanner />,
  },
  {
    slug: "content-faq-two-column",
    name: "FAQSection",
    category: "Content",
    description:
      "Answers common customer questions via an accordion and links to support resources",
    themeName: "lyra",
    render: () => <FAQSection />,
  },
  {
    slug: "blog-featured-split",
    name: "FeaturedBlogPost",
    category: "Blog",
    description:
      "Highlights the latest or featured blog post with image, category tags, title, excerpt and author",
    themeName: "lyra",
    render: () => <FeaturedBlogPost />,
  },
  {
    slug: "blog-grid-filtered",
    name: "BlogArticleGrid",
    category: "Blog",
    description:
      "Displays a filterable grid of blog article cards with category filter tabs and pagination",
    themeName: "lyra",
    render: () => <BlogArticleGrid />,
  },
  {
    slug: "custom-contact-form-panel",
    name: "ContactFormPanel",
    category: "Custom",
    description:
      "Multi-field contact form allowing users to submit enquiries with optional file attachments",
    themeName: "lyra",
    render: () => <ContactFormPanel />,
  },
  {
    slug: "custom-form-logo-questionnaire",
    name: "LogoDesignQuestionnaireForm",
    category: "Custom",
    description:
      "Multi-field form collecting client information for a logo design brief including business details, target audience, style preferences, colour preferences, visual examples and signature",
    themeName: "lyra",
    render: () => <LogoDesignQuestionnaireForm />,
  },
  {
    slug: "footer-multi-column",
    name: "SiteFooter",
    category: "Footer",
    description:
      "Site-wide footer with contact details, company links, quick links, legal info, partner certification logos and social media icons",
    themeName: "lyra",
    render: () => <SiteFooter />,
  },
  {
    slug: "cta-dark-support-banner",
    name: "SupportCTABanner",
    category: "CTA",
    description: "Encourages users who have broken their website to contact the team for help",
    themeName: "lyra",
    render: () => <SupportCTABanner />,
  },
  {
    slug: "navigation-horizontal-logo-links",
    name: "PrimaryNavigation",
    category: "Navigation",
    description: "Main site navigation with logo, nav links, search and contact CTA",
    themeName: "lyra",
    render: () => <PrimaryNavigation />,
  },
  {
    slug: "hero-split-text-image",
    name: "AboutHero",
    category: "Hero",
    description:
      "Introduces the About Us page with headline, subtext, CTA button and a supporting image of portfolio/books on shelves",
    themeName: "lyra",
    render: () => <AboutHero />,
  },
  {
    slug: "content-blank-spacer",
    name: "ContentSpacer",
    category: "Content",
    description:
      "Large white space section likely intended for team bios, values or additional about content that is not rendering in the screenshot",
    themeName: "lyra",
    render: () => <ContentSpacer />,
  },
  {
    slug: "hero-blog-centered",
    name: "BlogHero",
    category: "Hero",
    description: "Introduces the blog section with a headline and subheading",
    themeName: "lyra",
    render: () => <BlogHero />,
  },
  {
    slug: "hero-split-contact-intro",
    name: "ContactHero",
    category: "Hero",
    description: "Left-side heading and contact information panel introducing the contact page",
    themeName: "lyra",
    render: () => <ContactHero />,
  },
  {
    slug: "hero-centered-light",
    name: "CaseStudiesHero",
    category: "Hero",
    description: "Page header introducing the case studies section with headline and subtext",
    themeName: "lyra",
    render: () => <CaseStudiesHero />,
  },
  {
    slug: "cta-dark-full-bleed",
    name: "EmergencyCTABanner",
    category: "CTA",
    description: "Dark bottom CTA encouraging users to contact for website help",
    themeName: "lyra",
    render: () => <EmergencyCTABanner />,
  },
  {
    slug: "navigation",
    name: "Navigation",
    category: "Navigation",
    description: "Navigation section",
    themeName: "lyra",
    render: () => <Navigation />,
  },
];
