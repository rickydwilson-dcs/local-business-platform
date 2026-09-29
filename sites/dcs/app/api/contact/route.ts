/**
 * Contact Form API Endpoint
 *
 * POST /api/contact
 * Uses shared createContactHandler factory from core-components.
 */

import { createContactHandler } from '@platform/core-components/lib/api/contact-route';
import { siteConfig } from '@/site.config';
import { BUSINESS_EMAIL, BUSINESS_NAME } from '@/lib/contact-info';
import { themeConfig } from '@/theme.config';

/**
 * The notification/confirmation emails are branded from the r9 palette
 * (`themeConfig.colors.custom` — ink/paper/magenta/grey), not from
 * `colors.brand.*`, which still holds the pre-r9 solaris teal used by the
 * inner routes that haven't been reskinned yet. Emails are the one surface
 * that can't read the CSS custom properties, so the hex has to be resolved
 * here at call time.
 */
const r9 = themeConfig.colors?.custom ?? {};

export const POST = createContactHandler({
  siteSlug: siteConfig.slug,
  businessName: BUSINESS_NAME,
  businessEmail: BUSINESS_EMAIL,
  fromEmail: process.env.RESEND_FROM_EMAIL || 'noreply@resend.dev',
  themeColors: {
    brandPrimary: r9.magenta ?? '#D6006B',
    textPrimary: r9.ink ?? '#0E0E12',
    background: r9.paper ?? '#ECEBE9',
    textMuted: r9.grey ?? '#70707B',
  },
  rateLimit: siteConfig.features.rateLimit,
});
