/**
 * Contact Form API Endpoint
 *
 * POST /api/contact
 * Uses shared createContactHandler factory from core-components.
 */

import { createContactHandler } from "@platform/core-components/lib/api/contact-route";
import { siteConfig } from "@/site.config";
import { BUSINESS_EMAIL, BUSINESS_NAME } from "@/lib/contact-info";
import { themeConfig } from "@/theme.config";

export const POST = createContactHandler({
  siteSlug: siteConfig.slug,
  businessName: BUSINESS_NAME,
  businessEmail: BUSINESS_EMAIL,
  fromEmail: process.env.RESEND_FROM_EMAIL || "noreply@resend.dev",
  themeColors: {
    brandPrimary: themeConfig.colors?.brand?.primary ?? "#3b82f6",
    textPrimary: themeConfig.colors?.surface?.foreground ?? "#374151",
    background: themeConfig.colors?.surface?.muted ?? "#f9fafb",
    textMuted: themeConfig.colors?.surface?.mutedForeground ?? "#6b7280",
  },
  rateLimit: siteConfig.features.rateLimit,
});
