/**
 * Contact Form API Endpoint
 *
 * POST /api/contact
 * Uses shared createContactHandler factory from core-components.
 */

import { createContactHandler } from '@platform/core-components/lib/api/contact-route';
import { defaultTheme } from '@platform/theme-system';
import { siteConfig } from '@/site.config';
import { BUSINESS_EMAIL, BUSINESS_NAME } from '@/lib/contact-info';
import { themeConfig } from '@/theme.config';

// HTML email can't reference CSS variables, so these have to be literal
// colours — but they still come from the theme rather than being written
// here. `themeConfig` is a deep-partial, so the theme-system defaults supply
// the fallback instead of a hardcoded hex.
export const POST = createContactHandler({
  siteSlug: siteConfig.slug,
  businessName: BUSINESS_NAME,
  businessEmail: BUSINESS_EMAIL,
  fromEmail: process.env.RESEND_FROM_EMAIL || 'noreply@resend.dev',
  themeColors: {
    brandPrimary: themeConfig.colors?.brand?.primary ?? defaultTheme.colors.brand.primary,
    textPrimary: themeConfig.colors?.surface?.foreground ?? defaultTheme.colors.surface.foreground,
    background: themeConfig.colors?.surface?.muted ?? defaultTheme.colors.surface.muted,
    textMuted:
      themeConfig.colors?.surface?.mutedForeground ?? defaultTheme.colors.surface.mutedForeground,
  },
  rateLimit: siteConfig.features.rateLimit,
});
