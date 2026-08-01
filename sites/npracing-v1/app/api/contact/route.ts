/**
 * Contact Form API Endpoint
 *
 * POST /api/contact
 * Uses shared createContactHandler factory from core-components.
 */

import { createContactHandler } from '@platform/core-components/lib/api/contact-route';
import { siteConfig } from '@/site.config';
import { BUSINESS_EMAIL, BUSINESS_NAME } from '@/lib/contact-info';
import { emailThemeColors } from '@/theme.config';

export const POST = createContactHandler({
  siteSlug: siteConfig.slug,
  businessName: BUSINESS_NAME,
  businessEmail: BUSINESS_EMAIL,
  fromEmail: process.env.RESEND_FROM_EMAIL || 'noreply@resend.dev',
  // Literal hex belongs in theme.config.ts, not here — see `emailThemeColors`.
  themeColors: emailThemeColors,
  rateLimit: siteConfig.features.rateLimit,
});
