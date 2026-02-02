import { z } from 'zod';

/**
 * Content Schemas for Base Template
 * =================================
 * Zod validation schemas for all MDX content types.
 * These schemas ensure content consistency and provide TypeScript types.
 *
 * Content Types:
 * - Services: Business service offerings
 * - Locations: Service areas/geographic coverage
 * - Blog: Articles, guides, and news
 * - Projects: Portfolio/case studies
 * - Testimonials: Customer reviews and ratings
 */

/**
 * Image path schema that supports both:
 * - Local paths starting with / (e.g., /images/hero.webp)
 * - R2 CDN paths without leading / (e.g., site-name/hero/location/city.webp)
 *
 * @example
 * // Local image
 * heroImage: "/images/services/plumbing-hero.webp"
 *
 * // R2 CDN image
 * heroImage: "my-site/hero/services/plumbing.webp"
 */
const ImagePathSchema = z
  .string()
  .refine(
    (val) => val.startsWith('/') || /^[\w-]+\//.test(val),
    'Image path must start with / (local) or be a valid R2 path (site-name/...)'
  );

/**
 * FAQ (Frequently Asked Question) schema
 * Used across services, locations, and projects for structured Q&A content.
 *
 * @example
 * faqs:
 *   - question: "How long does a typical service take?"
 *     answer: "Most services are completed within 2-4 hours depending on complexity."
 */
const FaqSchema = z.object({
  /** The question being answered - should be a complete question */
  question: z.string().min(10, 'FAQ question must be at least 10 characters'),
  /** Comprehensive answer to the question */
  answer: z.string().min(20, 'FAQ answer must be at least 20 characters'),
});

/**
 * Hero section CTA (Call-to-Action) button schema
 *
 * @example
 * cta:
 *   label: "Get a Free Quote"
 *   href: "/contact"
 */
const HeroCtaSchema = z.object({
  /** Button text displayed to users */
  label: z.string().min(1, 'CTA label is required'),
  /** Internal link path - must start with / */
  href: z.string().startsWith('/', 'CTA href must start with /'),
});

/**
 * Breadcrumb navigation item schema
 *
 * @example
 * breadcrumbs:
 *   - title: "Home"
 *     href: "/"
 *   - title: "Services"
 *     href: "/services"
 */
const BreadcrumbSchema = z.object({
  /** Display text for the breadcrumb link */
  title: z.string().min(1, 'Breadcrumb title is required'),
  /** Navigation path - must start with / */
  href: z.string().startsWith('/', 'Breadcrumb href must start with /'),
});

// ============================================================================
// SERVICE SCHEMA
// ============================================================================

/**
 * Service MDX frontmatter schema
 * Used to validate all files in content/services/
 *
 * Services represent the core offerings of your business.
 * Each service should have comprehensive content for SEO.
 *
 * @example
 * ---
 * title: "Emergency Plumbing"
 * seoTitle: "24/7 Emergency Plumbing Services | Your Business"
 * description: "Fast, reliable emergency plumbing services available 24/7."
 * keywords: ["emergency plumber", "24 hour plumber", "urgent plumbing"]
 * hero:
 *   heading: "Emergency Plumbing When You Need It"
 *   subheading: "Available 24/7, 365 days a year"
 *   image: "/images/emergency-plumbing.webp"
 * faqs:
 *   - question: "How quickly can you respond?"
 *     answer: "We aim to arrive within 60 minutes for emergencies."
 * ---
 */
export const ServiceFrontmatterSchema = z.object({
  /** Main service title - displayed as H1 */
  title: z
    .string()
    .min(5, 'Service title must be at least 5 characters')
    .max(100, 'Service title must be less than 100 characters'),

  /** SEO-optimized title for search engines - appears in browser tab and search results */
  seoTitle: z
    .string()
    .min(10, 'SEO title must be at least 10 characters')
    .max(60, 'SEO title should be under 60 characters for optimal display')
    .optional(),

  /** Meta description for search results - aim for 150-160 characters */
  description: z
    .string()
    .min(50, 'Description must be at least 50 characters for good SEO')
    .max(200, 'Description should be under 200 characters - ideally 160 for Google')
    .optional(),

  /** SEO keywords for the service - used in meta tags and content optimization */
  keywords: z
    .array(z.string().min(2, 'Keywords must be at least 2 characters'))
    .min(3, 'At least 3 keywords required for SEO')
    .max(10, 'Maximum 10 keywords recommended')
    .optional(),

  /** Hero section configuration */
  hero: z
    .object({
      /** Main heading in the hero section */
      heading: z.string().min(5, 'Hero heading is required').optional(),
      /** Supporting text below the heading */
      subheading: z.string().min(10, 'Hero subheading is required').optional(),
      /** Hero background or feature image */
      image: ImagePathSchema,
      /** Optional call-to-action button */
      cta: HeroCtaSchema.optional(),
    })
    .optional(),

  /** Breadcrumb navigation trail */
  breadcrumbs: z
    .array(BreadcrumbSchema)
    .min(2, 'At least 2 breadcrumbs required (Home + current)')
    .optional(),

  /** Frequently asked questions - important for SEO and user engagement */
  faqs: z
    .array(FaqSchema)
    .min(3, 'At least 3 FAQs required for good SEO')
    .max(15, 'Maximum 15 FAQs recommended for page performance'),

  /** List of service benefits/features */
  benefits: z.array(z.string().min(10, 'Benefits must be at least 10 characters')).optional(),

  /** Structured about section for comprehensive service description */
  about: z
    .object({
      /** What is this service? Detailed explanation */
      whatIs: z.string().min(50, "About 'whatIs' description must be at least 50 characters"),
      /** When do customers typically need this service? */
      whenNeeded: z
        .array(z.string().min(10, 'When needed item must be at least 10 characters'))
        .min(4, "At least 4 'when needed' items required"),
      /** What outcomes/results does this service achieve? */
      whatAchieve: z
        .array(z.string().min(10, 'Achievement item must be at least 10 characters'))
        .min(4, "At least 4 'what achieve' items required"),
      /** Key selling points or differentiators */
      keyPoints: z
        .array(z.string().min(10, 'Key point must be at least 10 characters'))
        .min(3, 'At least 3 key points required')
        .optional(),
    })
    .optional(),

  /** Hero/feature image for the service */
  heroImage: ImagePathSchema.optional(),

  /** Gallery of service-related images */
  galleryImages: z.array(ImagePathSchema).optional(),

  /** Business hours specific to this service (if different from default) */
  businessHours: z
    .object({
      monday: z.string(),
      tuesday: z.string(),
      wednesday: z.string(),
      thursday: z.string(),
      friday: z.string(),
      saturday: z.string(),
      sunday: z.string(),
    })
    .optional(),

  /** Local contact information for this service */
  localContact: z
    .object({
      phone: z.string().regex(/^[\d\s\+\-\(\)]+$/, 'Phone must be a valid phone number'),
      email: z.string().email('Must be a valid email address'),
      address: z.string().optional(),
    })
    .optional(),
});

// ============================================================================
// LOCATION SCHEMA
// ============================================================================

/**
 * Location MDX frontmatter schema
 * Used to validate all files in content/locations/
 *
 * Locations represent geographic service areas.
 * Each location page targets local SEO for that area.
 *
 * @example
 * ---
 * title: "Canterbury"
 * seoTitle: "Professional Services in Canterbury | Your Business"
 * description: "Trusted local services in Canterbury and surrounding areas."
 * hero:
 *   title: "Your Trusted Canterbury Experts"
 *   description: "Serving Canterbury and Kent for over 20 years"
 *   phone: "01234 567890"
 * ---
 */
export const LocationFrontmatterSchema = z.object({
  /** Location name (city, town, or area) */
  title: z
    .string()
    .min(2, 'Location title must be at least 2 characters')
    .max(50, 'Location title must be less than 50 characters'),

  /** SEO-optimized title including location and business */
  seoTitle: z
    .string()
    .min(10, 'SEO title must be at least 10 characters')
    .max(80, 'SEO title should be under 80 characters - ideally 60 for Google'),

  /** Meta description targeting local search */
  description: z
    .string()
    .min(50, 'Description must be at least 50 characters')
    .max(200, 'Description should be under 200 characters - ideally 160 for Google'),

  /** Local SEO keywords for this location */
  keywords: z
    .array(z.string().min(2, 'Keywords must be at least 2 characters'))
    .min(3, 'At least 3 keywords required')
    .optional(),

  /** Hero/feature image for the location */
  heroImage: ImagePathSchema.optional(),

  /** Hero section configuration */
  hero: z.object({
    /** Main heading - typically includes location name */
    title: z.string().min(5, 'Hero title is required'),
    /** Location-specific value proposition */
    description: z.string().min(20, 'Hero description must be at least 20 characters'),
    /** Local contact phone number */
    phone: z.string().regex(/^[\d\s\+\-\(\)]+$/, 'Phone must be valid'),
    /** Trust signals specific to this location */
    trustBadges: z
      .array(z.string().min(3, 'Trust badge text too short'))
      .min(1, 'At least 1 trust badge required')
      .optional(),
    /** CTA button text */
    ctaText: z.string().min(5, 'CTA text is required').optional(),
    /** CTA button destination */
    ctaUrl: z.string().startsWith('/', 'CTA URL must start with /').optional(),
  }),

  /** Team/specialists section for location-specific staff */
  specialists: z
    .object({
      /** Section heading */
      title: z.string().min(5, 'Specialists title is required'),
      /** Section introduction */
      description: z.string().min(50, 'Specialists description must be at least 50 characters'),
      /** Grid column count (1-4) */
      columns: z.number().int().min(1).max(4).optional(),
      /** Section background color */
      backgroundColor: z.enum(['white', 'gray', 'blue']).optional(),
      /** Whether to show CTA at bottom of section */
      showBottomCTA: z.boolean().optional(),
      /** Individual specialist/team member cards */
      cards: z
        .array(
          z.object({
            title: z.string().min(3, 'Card title too short'),
            description: z.string().min(20, 'Card description must be at least 20 characters'),
            details: z
              .array(z.string().min(5, 'Detail text too short'))
              .min(1, 'At least 1 detail required')
              .optional(),
          })
        )
        .min(1, 'At least 1 specialist card required'),
    })
    .optional(),

  /** Services available in this location */
  services: z
    .object({
      /** Section heading */
      title: z.string().min(5, 'Services section title is required').optional(),
      /** Section introduction */
      description: z.string().min(20, 'Services description is required').optional(),
      /** List of services with links */
      items: z
        .array(
          z.object({
            title: z.string().min(3, 'Service title is required'),
            description: z.string().min(20, 'Service description is required'),
            link: z.string().startsWith('/services/', 'Service link must start with /services/'),
            icon: z.string().optional(),
          })
        )
        .min(3, 'At least 3 services should be listed')
        .optional(),
    })
    .optional(),

  /** Location-specific FAQs */
  faqs: z
    .array(FaqSchema)
    .min(5, 'At least 5 location-specific FAQs recommended')
    .max(20, 'Maximum 20 FAQs recommended')
    .optional(),
});

// ============================================================================
// BLOG SCHEMA
// ============================================================================

/**
 * Blog author schema
 */
const BlogAuthorSchema = z.object({
  /** Author's display name */
  name: z.string().min(2, 'Author name must be at least 2 characters'),
  /** Author's role/title (e.g., "Senior Engineer", "Content Writer") */
  role: z.string().optional(),
  /** Author's avatar/photo */
  avatar: ImagePathSchema.optional(),
});

/**
 * Blog category enum
 * Customize these categories to match your content strategy.
 *
 * Default categories:
 * - industry-tips: Expert advice and best practices
 * - how-to-guide: Step-by-step tutorials
 * - case-study: Real-world examples and success stories
 * - seasonal: Time-sensitive or seasonal content
 * - news: Company news and industry updates
 */
export const BlogCategory = z.enum([
  'industry-tips',
  'how-to-guide',
  'case-study',
  'seasonal',
  'news',
]);

/**
 * Blog MDX frontmatter schema
 * Used to validate all files in content/blog/
 *
 * @example
 * ---
 * title: "10 Tips for Choosing the Right Service Provider"
 * date: "2024-01-15"
 * author:
 *   name: "John Smith"
 *   role: "Senior Consultant"
 * description: "Expert advice on selecting a reliable service provider."
 * category: "industry-tips"
 * tags: ["tips", "advice", "hiring"]
 * excerpt: "Choosing the right service provider can be challenging..."
 * featured: true
 * ---
 */
export const BlogFrontmatterSchema = z.object({
  /** Article title - should be compelling and SEO-friendly */
  title: z
    .string()
    .min(10, 'Blog title must be at least 10 characters')
    .max(100, 'Blog title must be less than 100 characters'),

  /** URL slug - derived from filename if not specified */
  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens')
    .optional(),

  /** Publication date in YYYY-MM-DD format */
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD format'),

  /** Article author information */
  author: BlogAuthorSchema,

  /** SEO title - if different from main title */
  seoTitle: z
    .string()
    .min(10, 'SEO title must be at least 10 characters')
    .max(60, 'SEO title should be under 60 characters')
    .optional(),

  /** Meta description for search results */
  description: z
    .string()
    .min(50, 'Description must be at least 50 characters')
    .max(200, 'Description should be under 200 characters'),

  /** SEO keywords */
  keywords: z
    .array(z.string().min(2, 'Keywords must be at least 2 characters'))
    .min(3, 'At least 3 keywords required')
    .max(10, 'Maximum 10 keywords')
    .optional(),

  /** Content category */
  category: BlogCategory,

  /** Content tags for filtering and related content */
  tags: z
    .array(z.string().min(2, 'Tag must be at least 2 characters'))
    .min(1, 'At least 1 tag required')
    .max(10, 'Maximum 10 tags'),

  /** Featured/hero image */
  heroImage: ImagePathSchema.optional(),

  /** Estimated reading time in minutes - auto-calculated if not provided */
  readingTime: z.number().int().positive().optional(),

  /** Short excerpt for listings and social sharing */
  excerpt: z
    .string()
    .min(50, 'Excerpt must be at least 50 characters')
    .max(300, 'Excerpt should be under 300 characters'),

  /** Whether to feature this post prominently */
  featured: z.boolean().optional().default(false),

  /** Related service slugs for cross-linking */
  relatedServices: z.array(z.string()).optional(),

  /** Related location slugs for local relevance */
  relatedLocations: z.array(z.string()).optional(),
});

// ============================================================================
// PROJECT SCHEMA
// ============================================================================

/**
 * Project image with caption and ordering
 */
const ProjectImageSchema = z.object({
  /** Image path */
  path: ImagePathSchema,
  /** Image caption/description */
  caption: z.string().min(5, 'Caption must be at least 5 characters'),
  /** Display order (1-based) */
  order: z.number().int().positive(),
});

/**
 * Project client information
 */
const ProjectClientSchema = z.object({
  /** Client type - customize based on your industry */
  type: z.enum(['Private Homeowner', 'Property Developer', 'Local Authority', 'Business']),
  /** Client's industry (for B2B) */
  industry: z.string().optional(),
  /** Client testimonial about this project */
  testimonial: z.string().min(20, 'Testimonial must be at least 20 characters').optional(),
  /** Client rating (1-5 stars) */
  rating: z.number().int().min(1).max(5).optional(),
});

/**
 * Project scope/details
 */
const ProjectScopeSchema = z.object({
  /** Type of building/property */
  buildingType: z.string().min(3, 'Building type is required'),
  /** Number of floors/levels */
  storeys: z.number().int().positive().optional(),
  /** Project size in square metres */
  squareMetres: z.number().int().positive().optional(),
  /** Technical challenges overcome */
  challenges: z.array(z.string().min(5, 'Challenge must be at least 5 characters')).optional(),
});

/**
 * Project type enum
 * Customize these types to match your industry.
 */
export const ProjectType = z.enum(['residential', 'commercial', 'industrial', 'heritage']);

/**
 * Project category enum
 * Customize these categories to match your service types.
 */
export const ProjectCategory = z.enum([
  'heritage',
  'new-build',
  'renovation',
  'maintenance',
  'emergency',
]);

/**
 * Project MDX frontmatter schema
 * Used to validate all files in content/projects/
 *
 * Projects are portfolio items / case studies showcasing completed work.
 *
 * @example
 * ---
 * title: "Victorian Home Renovation - Brighton"
 * description: "Complete renovation of a 4-bedroom Victorian property."
 * projectType: "residential"
 * category: "renovation"
 * location: "brighton"
 * locationName: "Brighton"
 * completionDate: "2024-01-15"
 * year: 2024
 * services: ["plumbing", "heating"]
 * heroImage: "/images/projects/brighton-victorian.webp"
 * ---
 */
export const ProjectFrontmatterSchema = z.object({
  /** Project title - should be descriptive and include location */
  title: z
    .string()
    .min(10, 'Project title must be at least 10 characters')
    .max(100, 'Project title must be less than 100 characters'),

  /** URL slug - derived from filename if not specified */
  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens')
    .optional(),

  /** Meta description for search results */
  description: z
    .string()
    .min(50, 'Description must be at least 50 characters')
    .max(200, 'Description should be under 200 characters'),

  /** SEO title - if different from main title */
  seoTitle: z
    .string()
    .min(10, 'SEO title must be at least 10 characters')
    .max(70, 'SEO title should be under 70 characters')
    .optional(),

  /** SEO keywords */
  keywords: z
    .array(z.string().min(2, 'Keywords must be at least 2 characters'))
    .min(3, 'At least 3 keywords required')
    .max(10, 'Maximum 10 keywords')
    .optional(),

  /** Project type classification */
  projectType: ProjectType,

  /** Project category */
  category: ProjectCategory,

  /** Project status */
  status: z.enum(['completed', 'in-progress', 'featured']).optional().default('completed'),

  /** Location slug (links to location content) */
  location: z.string().min(2, 'Location slug is required'),

  /** Location display name */
  locationName: z.string().min(2, 'Location name is required'),

  /** Region/county */
  region: z.string().min(2, 'Region is required').optional(),

  /** Full address (optional for privacy) */
  address: z.string().optional(),

  /** Project completion date in YYYY-MM-DD format */
  completionDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Completion date must be YYYY-MM-DD format'),

  /** Completion year for filtering */
  year: z.number().int().min(2000).max(2100),

  /** Project duration (e.g., "3 weeks", "2 months") */
  duration: z.string().optional(),

  /** Service slugs used in this project */
  services: z
    .array(z.string().min(2, 'Service slug must be at least 2 characters'))
    .min(1, 'At least 1 service required'),

  /** Client information */
  client: ProjectClientSchema.optional(),

  /** Project scope details */
  scope: ProjectScopeSchema.optional(),

  /** Main project image */
  heroImage: ImagePathSchema,

  /** Gallery of project images */
  images: z.array(ProjectImageSchema).min(1, 'At least 1 project image required').optional(),

  /** Key results/outcomes achieved */
  results: z
    .array(z.string().min(10, 'Result must be at least 10 characters'))
    .min(1, 'At least 1 result required')
    .optional(),

  /** Project-specific FAQs */
  faqs: z.array(FaqSchema).optional(),
});

// ============================================================================
// TESTIMONIAL SCHEMA
// ============================================================================

/**
 * Testimonial platform/source enum
 * Track where reviews come from for credibility and schema markup.
 */
export const TestimonialPlatform = z.enum(['internal', 'google', 'trustpilot', 'reviews.io']);

/**
 * Testimonial MDX frontmatter schema
 * Used to validate all files in content/testimonials/
 *
 * @example
 * ---
 * customerName: "John Smith"
 * customerRole: "Homeowner"
 * rating: 5
 * text: "Excellent service from start to finish. Highly recommended!"
 * date: "2024-01-15"
 * service: "Emergency Plumbing"
 * serviceSlug: "emergency-plumbing"
 * location: "Canterbury"
 * locationSlug: "canterbury"
 * featured: true
 * platform: "google"
 * ---
 */
export const TestimonialFrontmatterSchema = z.object({
  /** Customer's name (can be partial for privacy, e.g., "John S.") */
  customerName: z
    .string()
    .min(2, 'Customer name must be at least 2 characters')
    .max(100, 'Customer name must be less than 100 characters'),

  /** Customer's role or title */
  customerRole: z.string().max(100, 'Role must be less than 100 characters').optional(),

  /** Customer's company (for B2B testimonials) */
  customerCompany: z.string().max(100, 'Company name must be less than 100 characters').optional(),

  /** Star rating (1-5) */
  rating: z.number().int().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),

  /** Full testimonial text */
  text: z
    .string()
    .min(20, 'Testimonial text must be at least 20 characters')
    .max(1000, 'Testimonial text must be less than 1000 characters'),

  /** Short excerpt for listings */
  excerpt: z.string().max(200, 'Excerpt must be less than 200 characters').optional(),

  /** Customer photo (optional) */
  photo: ImagePathSchema.optional(),

  /** Date of testimonial in YYYY-MM-DD format */
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD format'),

  /** Service name this testimonial relates to */
  service: z.string().min(2, 'Service name must be at least 2 characters').optional(),

  /** Service slug for linking */
  serviceSlug: z
    .string()
    .regex(/^[a-z0-9-]+$/, 'Service slug must be lowercase with hyphens')
    .optional(),

  /** Location name */
  location: z.string().min(2, 'Location must be at least 2 characters').optional(),

  /** Location slug for linking */
  locationSlug: z
    .string()
    .regex(/^[a-z0-9-]+$/, 'Location slug must be lowercase with hyphens')
    .optional(),

  /** Project type (for filtering) */
  projectType: z.enum(['residential', 'commercial', 'industrial']).optional(),

  /** Whether to feature this testimonial prominently */
  featured: z.boolean().default(false),

  /** Whether this is a verified review */
  verified: z.boolean().default(true),

  /** Source platform for the review */
  platform: TestimonialPlatform.default('internal'),
});

// ============================================================================
// TYPE EXPORTS
// ============================================================================

/** Service page frontmatter type */
export type ServiceFrontmatter = z.infer<typeof ServiceFrontmatterSchema>;

/** Location page frontmatter type */
export type LocationFrontmatter = z.infer<typeof LocationFrontmatterSchema>;

/** FAQ item type */
export type FAQ = z.infer<typeof FaqSchema>;

/** Blog post frontmatter type */
export type BlogFrontmatter = z.infer<typeof BlogFrontmatterSchema>;

/** Blog author type */
export type BlogAuthor = z.infer<typeof BlogAuthorSchema>;

/** Blog category values */
export type BlogCategoryType = z.infer<typeof BlogCategory>;

/** Project frontmatter type */
export type ProjectFrontmatter = z.infer<typeof ProjectFrontmatterSchema>;

/** Project image type */
export type ProjectImage = z.infer<typeof ProjectImageSchema>;

/** Project client type */
export type ProjectClient = z.infer<typeof ProjectClientSchema>;

/** Project type values */
export type ProjectTypeValue = z.infer<typeof ProjectType>;

/** Project category values */
export type ProjectCategoryValue = z.infer<typeof ProjectCategory>;

/** Testimonial frontmatter type */
export type TestimonialFrontmatter = z.infer<typeof TestimonialFrontmatterSchema>;

/** Testimonial platform values */
export type TestimonialPlatformType = z.infer<typeof TestimonialPlatform>;
