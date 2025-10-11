import { z } from "zod";

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
      image: z.string().startsWith("/", "Hero image path must start with /"),
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

  heroImage: z.string().startsWith("/", "Hero image path must start with /").optional(),

  galleryImages: z
    .array(z.string().startsWith("/", "Gallery image paths must start with /"))
    .optional(),

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

  heroImage: z.string().startsWith("/", "Hero image path must start with /").optional(),

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
 * Type exports for TypeScript usage
 */
export type ServiceFrontmatter = z.infer<typeof ServiceFrontmatterSchema>;
export type LocationFrontmatter = z.infer<typeof LocationFrontmatterSchema>;
export type FAQ = z.infer<typeof FaqSchema>;
