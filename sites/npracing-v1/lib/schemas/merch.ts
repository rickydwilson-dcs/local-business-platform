import { z } from 'zod';

/**
 * Merch MDX frontmatter schema
 * Used to validate all files in content/merch/
 *
 * Merch products are sold via an external retailer (theclothingkings.co.uk) —
 * this site only renders product cards from frontmatter and links out via
 * `externalUrl`. No MDX body rendering is required for this content type.
 */

const MerchImageSchema = z.object({
  /** R2 key path, e.g. "npracing-v1/merch/tshirt.jpg" — NOT a local /public path. */
  src: z
    .string()
    .min(1, 'Image src is required')
    .refine(
      (val) => !val.startsWith('/'),
      'Image src must be an R2 key path (site-name/...), not a local /public path'
    ),
  alt: z.string().min(1, 'Image alt text is required'),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});

export const MerchCategory = z.enum(['t-shirt', 'beanie', 'cap', 'hoodie', 'robe']);

export const MerchFrontmatterSchema = z.object({
  title: z.string().min(1, 'Title is required'),

  description: z.string().min(1, 'Description is required'),

  /** Retailer product page — cards link out to this URL. */
  externalUrl: z.string().url('externalUrl must be a valid URL'),

  /** Price in minor GBP units (pence), nonnegative integer. */
  priceAmount: z.number().int().nonnegative('priceAmount must be a nonnegative integer'),

  /** Retailer's own formatted price string, e.g. "£25.00". */
  displayPrice: z.string().min(1, 'displayPrice is required'),

  currency: z.literal('GBP'),

  image: MerchImageSchema,

  category: MerchCategory,

  sortOrder: z.number().int(),

  featured: z.boolean(),

  available: z.boolean(),

  /** ISO date (YYYY-MM-DD) the product data was sourced/verified. */
  capturedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'capturedAt must be YYYY-MM-DD format'),
});

export type MerchFrontmatter = z.infer<typeof MerchFrontmatterSchema>;
export type MerchCategoryValue = z.infer<typeof MerchCategory>;
