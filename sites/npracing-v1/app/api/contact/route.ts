/**
 * Contact Form API Endpoint
 *
 * POST /api/contact
 * Uses shared createContactHandler factory from core-components.
 */

import { createContactHandler } from '@platform/core-components/lib/api/contact-route';
import { siteConfig } from '@/site.config';
import { BUSINESS_NAME } from '@/lib/contact-info';
import { emailThemeColors } from '@/theme.config';

// Enquiries are routed to the team inbox, not the publicly displayed
// npracingbsb@hotmail.com address (BUSINESS_EMAIL) — that address stays
// on the site as-is per the client's request.
const ENQUIRY_INBOX = 'team@npracingbsb.co.uk';

export const POST = createContactHandler({
  siteSlug: siteConfig.slug,
  businessName: BUSINESS_NAME,
  businessEmail: ENQUIRY_INBOX,
  fromEmail: process.env.RESEND_FROM_EMAIL || 'noreply@resend.dev',
  // Literal hex belongs in theme.config.ts, not here — see `emailThemeColors`.
  themeColors: emailThemeColors,
  rateLimit: siteConfig.features.rateLimit,
});
