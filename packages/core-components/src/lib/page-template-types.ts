import type React from "react";
import type { BreadcrumbItem as _BreadcrumbItem } from "../components/ui/breadcrumbs";
export type { BreadcrumbItem } from "../components/ui/breadcrumbs";
type BreadcrumbItem = _BreadcrumbItem;

// ─── Sub-object types ─────────────────────────────────────────────────────────

export interface ServiceSummary {
  slug: string;
  title: string;
  description?: string;
  icon?: string;
}

export interface LocationSummary {
  slug: string;
  title: string;
  description?: string;
}

export interface BlogPostSummary {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  heroImage?: string;
  readingTime?: number;
  author?: { name: string };
}

export interface ProjectSummary {
  slug: string;
  title: string;
  description?: string;
  heroImage?: string;
  date?: string;
  tags?: string[];
}

export interface TestimonialSummary {
  slug: string;
  name: string;
  rating: number;
  body: string;
  platform?: string;
  date?: string;
}

/** Minimal site config subset needed for page template rendering */
export interface SiteConfigSummary {
  name: string;
  tagline: string;
  phone: string;
  phoneDisplay: string;
  address: {
    city: string;
    county?: string;
  };
  cta: {
    primary: { label: string; href: string };
    phone: { show: boolean };
  };
  stats?: Array<{ value: string; label: string; icon?: string }>;
}

// ─── Tradesperson page props ──────────────────────────────────────────────────

export interface HomePageTemplateProps {
  siteConfig: SiteConfigSummary;
  services: ServiceSummary[];
  locations: LocationSummary[];
  heroImage?: string;
  heroHeadline?: string;
  heroSubheading?: string;
  schemaNodes?: React.ReactNode;
}

export interface ServicesPageTemplateProps {
  siteConfig: SiteConfigSummary;
  services: ServiceSummary[];
}

export interface ServiceDetailPageTemplateProps {
  siteConfig: SiteConfigSummary;
  frontmatter: {
    title: string;
    description?: string;
    badge?: string;
    heroImage?: string;
    benefits?: string[];
    faqs?: Array<{ question: string; answer: string }>;
  };
  mdxContent: React.ReactNode;
  breadcrumbs: BreadcrumbItem[];
  schemaNodes?: React.ReactNode;
}

export interface LocationsPageTemplateProps {
  siteConfig: SiteConfigSummary;
  locations: LocationSummary[];
}

export interface LocationDetailPageTemplateProps {
  siteConfig: SiteConfigSummary;
  frontmatter: {
    title: string;
    description?: string;
    heroImage?: string;
    faqs?: Array<{ question: string; answer: string }>;
    hero?: { title?: string; description?: string };
  };
  mdxContent: React.ReactNode;
  breadcrumbs: BreadcrumbItem[];
  schemaNodes?: React.ReactNode;
}

export interface BlogPageTemplateProps {
  siteConfig: SiteConfigSummary;
  posts: BlogPostSummary[];
}

export interface BlogPostPageTemplateProps {
  siteConfig: SiteConfigSummary;
  frontmatter: {
    title: string;
    description: string;
    date: string;
    category: string;
    heroImage?: string;
    author: { name: string; role?: string };
    tags?: string[];
    relatedServices?: string[];
  };
  mdxContent: React.ReactNode;
  relatedPosts: BlogPostSummary[];
  readingTime?: number;
  breadcrumbs: BreadcrumbItem[];
  schemaNodes?: React.ReactNode;
}

export interface ProjectsPageTemplateProps {
  siteConfig: SiteConfigSummary;
  projects: ProjectSummary[];
}

export interface ProjectDetailPageTemplateProps {
  siteConfig: SiteConfigSummary;
  frontmatter: {
    title: string;
    description?: string;
    heroImage?: string;
    date?: string;
    tags?: string[];
    outcomes?: string[];
  };
  mdxContent: React.ReactNode;
  breadcrumbs: BreadcrumbItem[];
}

export interface ReviewsPageTemplateProps {
  siteConfig: SiteConfigSummary;
  testimonials: TestimonialSummary[];
}

export interface AboutPageTemplateProps {
  siteConfig: SiteConfigSummary;
}

export interface ContactPageTemplateProps {
  siteConfig: SiteConfigSummary;
}

// ─── Rigel event page props ───────────────────────────────────────────────────

export interface SpeakerSummary {
  slug: string;
  name: string;
  title: string;
  topic: string;
  description: string;
  day: "saturday" | "sunday";
  time: string;
  stage: string;
  featured?: boolean;
  imageAlt?: string;
  social?: { twitter?: string; linkedin?: string; website?: string };
}

export interface RigelHomePageTemplateProps {
  siteConfig: SiteConfigSummary;
  featuredSpeakers: SpeakerSummary[];
  testimonials: TestimonialSummary[];
  schemaNodes?: React.ReactNode;
}

export interface RigelSpeakersPageTemplateProps {
  siteConfig: SiteConfigSummary;
  speakers: SpeakerSummary[];
}

export interface RigelSpeakerDetailPageTemplateProps {
  siteConfig: SiteConfigSummary;
  frontmatter: SpeakerSummary;
  mdxContent: React.ReactNode;
  breadcrumbs: BreadcrumbItem[];
}

export interface RigelSchedulePageTemplateProps {
  siteConfig: SiteConfigSummary;
}

export interface RigelVenuePageTemplateProps {
  siteConfig: SiteConfigSummary;
}

export interface RigelSponsorsPageTemplateProps {
  siteConfig: SiteConfigSummary;
}

export interface RigelBlogPageTemplateProps {
  siteConfig: SiteConfigSummary;
  posts: BlogPostSummary[];
}

export interface RigelBlogPostPageTemplateProps {
  siteConfig: SiteConfigSummary;
  frontmatter: {
    title: string;
    description: string;
    date: string;
    category: string;
    heroImage?: string;
    author: { name: string; role?: string };
    tags?: string[];
  };
  mdxContent: React.ReactNode;
  relatedPosts: BlogPostSummary[];
  breadcrumbs: BreadcrumbItem[];
}

export interface RigelContactPageTemplateProps {
  siteConfig: SiteConfigSummary;
}
