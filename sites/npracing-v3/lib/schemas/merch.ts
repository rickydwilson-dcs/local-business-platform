import { z } from 'zod';

/**
 * Merch product image schema.
 * `src` is intentionally a plain string, not a URL — during this phase it holds an
 * R2-shaped placeholder path (e.g. "/npracing-v3/merch/np-racing-t-shirt.jpg") that a
 * later image-pipeline phase resolves to a real hosted asset.
 */
const MerchImageSchema = z.object({
  src: z.string().min(1, 'Image src is required'),
  alt: z.string().min(3, 'Image alt text must be at least 3 characters'),
  width: z.number().int().positive('Image width must be a positive integer'),
  height: z.number().int().positive('Image height must be a positive integer'),
});

export const MerchCategory = z.enum(['t-shirt', 'beanie', 'cap', 'hoodie', 'robe']);

/**
 * Merch MDX frontmatter schema
 * Used to validate all files in content/merch/
 *
 * Merch products are fulfilled externally (The Clothing Kings) — there is no
 * internal checkout, so `externalUrl` is the retailer product page and
 * `priceAmount`/`displayPrice` mirror the retailer's own pricing rather than
 * driving a cart or payment flow on this site.
 */
export const MerchFrontmatterSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be less than 100 characters'),

  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(300, 'Description must be less than 300 characters'),

  externalUrl: z.url('externalUrl must be a valid URL'),

  /** Price in minor GBP units (pence), e.g. £25.00 -> 2500. Always non-negative. */
  priceAmount: z.number().int().nonnegative('priceAmount must be a non-negative integer (pence)'),

  /** Retailer's own display formatting, e.g. "£25.00". Not derived from priceAmount. */
  displayPrice: z.string().min(1, 'displayPrice is required'),

  currency: z.literal('GBP'),

  image: MerchImageSchema,

  category: MerchCategory,

  sortOrder: z.number().int('sortOrder must be an integer'),

  featured: z.boolean(),

  available: z.boolean(),

  /** ISO date (YYYY-MM-DD) the price/availability was last verified against the retailer. */
  capturedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'capturedAt must be YYYY-MM-DD format'),
});

export type MerchFrontmatter = z.infer<typeof MerchFrontmatterSchema>;
export type MerchCategoryValue = z.infer<typeof MerchCategory>;
