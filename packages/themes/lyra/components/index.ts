/**
 * Component barrel file — re-exports all theme components.
 */

export { AnnouncementBar } from "./announcement-bar";
export { PrimaryNavigation } from "./primary-navigation";
export { HeroSplit } from "./hero-split";
export { CenteredPageHero } from "./centered-page-hero";
export { ClientLogoStrip } from "./client-logo-strip";
export { TeamAvatarRow } from "./team-avatar-row";
export { CustomerCountBanner } from "./customer-count-banner";
export { TestimonialsGrid } from "./testimonials-grid";
export { ServicesGrid } from "./services-grid";
export { FilteredCardsGrid } from "./filtered-cards-grid";
export { FeaturedBlogPost } from "./featured-blog-post";
export { GradientDividerBand } from "./gradient-divider-band";
export { HelpCTABanner } from "./help-cta-banner";
export { FAQAccordion } from "./faq-accordion";
export { ContactInformation } from "./contact-information";
export { ContactFormPanel } from "./contact-form-panel";
export { LogoDesignQuestionnaireForm } from "./logo-design-questionnaire-form";
export { SiteFooter } from "./site-footer";
export { SupportCTABanner } from "./cta-dark-support-banner";
export { TopNavigation } from "./navigation-top-bar";
export { AboutHero } from "./hero-split-about";
export { TeamAvatarCarousel } from "./social-proof-logo-carousel";
export { BlogArticleGrid } from "./blog-cards-grid-filtered";
export { ContactHero } from "./hero-split-contact-intro";
export { EmergencyHelpCTA } from "./cta-dark-split-emergency-help";
export { WebsiteHelpCTA } from "./cta-dark-banner";

// Theme contract aliases (TPV-002)
export { AnnouncementBar as LyraHeader } from "./announcement-bar";
export type { AnnouncementBarProps as LyraHeaderProps } from "./announcement-bar";
export { SiteFooter as LyraFooter } from "./site-footer";
export type { SiteFooterProps as LyraFooterProps } from "./site-footer";
