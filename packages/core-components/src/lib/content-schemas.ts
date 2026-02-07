import { z } from "zod";

/**
 * Image path schema that supports both:
 * - Local paths starting with / (e.g., /images/hero.webp)
 * - R2 CDN paths without leading / (e.g., colossus-reference/hero/location/brighton.webp)
 */
const ImagePathSchema = z
  .string()
  .refine(
    (val) => val.startsWith("/") || /^[\w-]+\//.test(val),
    "Image path must start with / (local) or be a valid R2 path (site-name/...)"
  );

/**
 * Shared schemas used across different content types
 */
const FaqSchema = z.object({
  question: z.string().min(10, "FAQ question must be at least 10 characters"),
  answer: z.string().min(20, "FAQ answer must be at least 20 characters"),
});

const HeroCtaSchema = z.object({
  label: z.string().min(1, "CTA label is required"),
  href: z.string().startsWith("/", "CTA href must start with /"),
});

const BreadcrumbSchema = z.object({
  title: z.string().min(1, "Breadcrumb title is required"),
  href: z.string().startsWith("/", "Breadcrumb href must start with /"),
});

/**
 * Service MDX frontmatter schema
 * Used to validate all files in content/services/
 */
export const ServiceFrontmatterSchema = z.object({
  title: z
    .string()
    .min(5, "Service title must be at least 5 characters")
    .max(100, "Service title must be less than 100 characters"),

  seoTitle: z
    .string()
    .min(10, "SEO title must be at least 10 characters")
    .max(60, "SEO title should be under 60 characters for optimal display")
    .optional(),

  description: z
    .string()
    .min(50, "Description must be at least 50 characters for good SEO")
    .max(200, "Description should be under 200 characters - ideally 160 for Google")
    .optional(), // Optional to allow stub pages

  keywords: z
    .array(z.string().min(2, "Keywords must be at least 2 characters"))
    .min(3, "At least 3 keywords required for SEO")
    .max(10, "Maximum 10 keywords recommended")
    .optional(),

  hero: z
    .object({
      heading: z.string().min(5, "Hero heading is required").optional(),
      subheading: z.string().min(10, "Hero subheading is required").optional(),
      image: ImagePathSchema,
      cta: HeroCtaSchema.optional(),
    })
    .optional(),

  breadcrumbs: z
    .array(BreadcrumbSchema)
    .min(2, "At least 2 breadcrumbs required (Home + current)")
    .optional(),

  faqs: z
    .array(FaqSchema)
    .min(3, "At least 3 FAQs required for good SEO")
    .max(15, "Maximum 15 FAQs recommended for page performance"),

  benefits: z.array(z.string().min(10, "Benefits must be at least 10 characters")).optional(),

  about: z
    .object({
      whatIs: z.string().min(50, "About 'whatIs' description must be at least 50 characters"),
      whenNeeded: z
        .array(z.string().min(10, "When needed item must be at least 10 characters"))
        .min(4, "At least 4 'when needed' items required"),
      whatAchieve: z
        .array(z.string().min(10, "Achievement item must be at least 10 characters"))
        .min(4, "At least 4 'what achieve' items required"),
      keyPoints: z
        .array(z.string().min(10, "Key point must be at least 10 characters"))
        .min(3, "At least 3 key points required")
        .optional(),
    })
    .optional(),

  heroImage: ImagePathSchema.optional(),

  galleryImages: z.array(ImagePathSchema).optional(),

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

  localContact: z
    .object({
      phone: z.string().regex(/^[\d\s\+\-\(\)]+$/, "Phone must be a valid phone number"),
      email: z.string().email("Must be a valid email address"),
      address: z.string().optional(),
    })
    .optional(),
});

/**
 * Location MDX frontmatter schema
 * Used to validate all files in content/locations/
 */
export const LocationFrontmatterSchema = z.object({
  title: z
    .string()
    .min(2, "Location title must be at least 2 characters")
    .max(50, "Location title must be less than 50 characters"),

  seoTitle: z
    .string()
    .min(10, "SEO title must be at least 10 characters")
    .max(80, "SEO title should be under 80 characters - ideally 60 for Google"),

  description: z
    .string()
    .min(50, "Description must be at least 50 characters")
    .max(200, "Description should be under 200 characters - ideally 160 for Google"),

  keywords: z
    .array(z.string().min(2, "Keywords must be at least 2 characters"))
    .min(3, "At least 3 keywords required")
    .optional(),

  // Geographic and county metadata (for map markers and navigation)
  county: z.enum(["East Sussex", "West Sussex", "Kent", "Surrey"]).optional(),

  coords: z.tuple([z.number().min(-90).max(90), z.number().min(-180).max(180)]).optional(),

  mapDescription: z.string().max(100, "Map description should be under 100 characters").optional(),

  countyDescription: z
    .string()
    .max(300, "County description should be under 300 characters")
    .optional(),

  countyHighlights: z.array(z.string()).optional(),

  heroImage: ImagePathSchema.optional(),

  hero: z.object({
    title: z.string().min(5, "Hero title is required"),
    description: z.string().min(20, "Hero description must be at least 20 characters"),
    phone: z.string().regex(/^[\d\s\+\-\(\)]+$/, "Phone must be valid"),
    trustBadges: z
      .array(z.string().min(3, "Trust badge text too short"))
      .min(1, "At least 1 trust badge required")
      .optional(),
    ctaText: z.string().min(5, "CTA text is required").optional(),
    ctaUrl: z.string().startsWith("/", "CTA URL must start with /").optional(),
  }),

  specialists: z
    .object({
      title: z.string().min(5, "Specialists title is required"),
      description: z.string().min(50, "Specialists description must be at least 50 characters"),
      columns: z.number().int().min(1).max(4).optional(),
      backgroundColor: z.enum(["white", "gray", "blue"]).optional(),
      showBottomCTA: z.boolean().optional(),
      cards: z
        .array(
          z.object({
            title: z.string().min(3, "Card title too short"),
            description: z.string().min(20, "Card description must be at least 20 characters"),
            details: z
              .array(z.string().min(5, "Detail text too short"))
              .min(1, "At least 1 detail required")
              .optional(),
          })
        )
        .min(1, "At least 1 specialist card required"),
    })
    .optional(),

  services: z
    .object({
      title: z.string().min(5, "Services section title is required").optional(),
      description: z.string().min(20, "Services description is required").optional(),
      items: z
        .array(
          z.object({
            title: z.string().min(3, "Service title is required"),
            description: z.string().min(20, "Service description is required"),
            link: z.string().startsWith("/services/", "Service link must start with /services/"),
            icon: z.string().optional(),
          })
        )
        .min(3, "At least 3 services should be listed")
        .optional(),
    })
    .optional(),

  faqs: z
    .array(FaqSchema)
    .min(5, "At least 5 location-specific FAQs recommended")
    .max(20, "Maximum 20 FAQs recommended")
    .optional(),
});

/**
 * Blog MDX frontmatter schema
 * Used to validate all files in content/blog/
 */
const BlogAuthorSchema = z.object({
  name: z.string().min(2, "Author name must be at least 2 characters"),
  role: z.string().optional(),
  avatar: ImagePathSchema.optional(),
});

export const BlogCategory = z.enum([
  "industry-tips",
  "how-to-guide",
  "case-study",
  "seasonal",
  "news",
]);

export const BlogFrontmatterSchema = z.object({
  title: z
    .string()
    .min(10, "Blog title must be at least 10 characters")
    .max(100, "Blog title must be less than 100 characters"),

  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase with hyphens")
    .optional(), // Can be derived from filename

  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD format"),

  author: BlogAuthorSchema,

  seoTitle: z
    .string()
    .min(10, "SEO title must be at least 10 characters")
    .max(60, "SEO title should be under 60 characters")
    .optional(),

  description: z
    .string()
    .min(50, "Description must be at least 50 characters")
    .max(200, "Description should be under 200 characters"),

  keywords: z
    .array(z.string().min(2, "Keywords must be at least 2 characters"))
    .min(3, "At least 3 keywords required")
    .max(10, "Maximum 10 keywords")
    .optional(),

  category: BlogCategory,

  tags: z
    .array(z.string().min(2, "Tag must be at least 2 characters"))
    .min(1, "At least 1 tag required")
    .max(10, "Maximum 10 tags"),

  heroImage: ImagePathSchema.optional(),

  readingTime: z.number().int().positive().optional(),

  excerpt: z
    .string()
    .min(50, "Excerpt must be at least 50 characters")
    .max(300, "Excerpt should be under 300 characters"),

  featured: z.boolean().optional().default(false),

  relatedServices: z.array(z.string()).optional(),

  relatedLocations: z.array(z.string()).optional(),
});

/**
 * Project MDX frontmatter schema
 * Used to validate all files in content/projects/
 */
const ProjectImageSchema = z.object({
  path: ImagePathSchema,
  caption: z.string().min(5, "Caption must be at least 5 characters"),
  order: z.number().int().positive(),
});

const ProjectClientSchema = z.object({
  type: z.enum(["Private Homeowner", "Property Developer", "Local Authority", "Business"]),
  industry: z.string().optional(),
  testimonial: z.string().min(20, "Testimonial must be at least 20 characters").optional(),
  rating: z.number().int().min(1).max(5).optional(),
});

const ProjectScopeSchema = z.object({
  buildingType: z.string().min(3, "Building type is required"),
  storeys: z.number().int().positive().optional(),
  squareMetres: z.number().int().positive().optional(),
  challenges: z.array(z.string().min(5, "Challenge must be at least 5 characters")).optional(),
});

export const ProjectType = z.enum(["residential", "commercial", "industrial", "heritage"]);

export const ProjectCategory = z.enum([
  "heritage",
  "new-build",
  "renovation",
  "maintenance",
  "emergency",
]);

export const ProjectFrontmatterSchema = z.object({
  title: z
    .string()
    .min(10, "Project title must be at least 10 characters")
    .max(100, "Project title must be less than 100 characters"),

  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase with hyphens")
    .optional(),

  description: z
    .string()
    .min(50, "Description must be at least 50 characters")
    .max(200, "Description should be under 200 characters"),

  seoTitle: z
    .string()
    .min(10, "SEO title must be at least 10 characters")
    .max(70, "SEO title should be under 70 characters")
    .optional(),

  keywords: z
    .array(z.string().min(2, "Keywords must be at least 2 characters"))
    .min(3, "At least 3 keywords required")
    .max(10, "Maximum 10 keywords")
    .optional(),

  projectType: ProjectType,

  category: ProjectCategory,

  status: z.enum(["completed", "in-progress", "featured"]).optional().default("completed"),

  location: z.string().min(2, "Location slug is required"),

  locationName: z.string().min(2, "Location name is required"),

  region: z.string().min(2, "Region is required").optional(),

  address: z.string().optional(),

  completionDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Completion date must be YYYY-MM-DD format"),

  year: z.number().int().min(2000).max(2100),

  duration: z.string().optional(),

  services: z
    .array(z.string().min(2, "Service slug must be at least 2 characters"))
    .min(1, "At least 1 service required"),

  client: ProjectClientSchema.optional(),

  scope: ProjectScopeSchema.optional(),

  heroImage: ImagePathSchema,

  images: z.array(ProjectImageSchema).min(1, "At least 1 project image required").optional(),

  results: z
    .array(z.string().min(10, "Result must be at least 10 characters"))
    .min(1, "At least 1 result required")
    .optional(),

  faqs: z.array(FaqSchema).optional(),
});

/**
 * Testimonial MDX frontmatter schema
 * Used to validate all files in content/testimonials/
 */
export const TestimonialPlatform = z.enum(["internal", "google", "trustpilot", "reviews.io"]);

export const TestimonialFrontmatterSchema = z.object({
  customerName: z
    .string()
    .min(2, "Customer name must be at least 2 characters")
    .max(100, "Customer name must be less than 100 characters"),

  customerRole: z.string().max(100, "Role must be less than 100 characters").optional(),

  customerCompany: z.string().max(100, "Company name must be less than 100 characters").optional(),

  rating: z.number().int().min(1, "Rating must be at least 1").max(5, "Rating must be at most 5"),

  text: z
    .string()
    .min(20, "Testimonial text must be at least 20 characters")
    .max(1000, "Testimonial text must be less than 1000 characters"),

  excerpt: z.string().max(200, "Excerpt must be less than 200 characters").optional(),

  photo: ImagePathSchema.optional(),

  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD format"),

  service: z.string().min(2, "Service name must be at least 2 characters").optional(),

  serviceSlug: z
    .string()
    .regex(/^[a-z0-9-]+$/, "Service slug must be lowercase with hyphens")
    .optional(),

  location: z.string().min(2, "Location must be at least 2 characters").optional(),

  locationSlug: z
    .string()
    .regex(/^[a-z0-9-]+$/, "Location slug must be lowercase with hyphens")
    .optional(),

  projectType: z.enum(["residential", "commercial", "industrial"]).optional(),

  featured: z.boolean().default(false),

  verified: z.boolean().default(true),

  platform: TestimonialPlatform.default("internal"),
});

/**
 * Type exports for TypeScript usage
 */
export type ServiceFrontmatter = z.infer<typeof ServiceFrontmatterSchema>;
export type LocationFrontmatter = z.infer<typeof LocationFrontmatterSchema>;
export type FAQ = z.infer<typeof FaqSchema>;
export type BlogFrontmatter = z.infer<typeof BlogFrontmatterSchema>;
export type BlogAuthor = z.infer<typeof BlogAuthorSchema>;
export type BlogCategoryType = z.infer<typeof BlogCategory>;
export type ProjectFrontmatter = z.infer<typeof ProjectFrontmatterSchema>;
export type ProjectImage = z.infer<typeof ProjectImageSchema>;
export type ProjectClient = z.infer<typeof ProjectClientSchema>;
export type ProjectTypeValue = z.infer<typeof ProjectType>;
export type ProjectCategoryValue = z.infer<typeof ProjectCategory>;
export type TestimonialFrontmatter = z.infer<typeof TestimonialFrontmatterSchema>;
export type TestimonialPlatformType = z.infer<typeof TestimonialPlatform>;
