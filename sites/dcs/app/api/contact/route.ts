/**
 * Contact Form API Endpoint
 *
 * POST /api/contact
 * Uses shared createContactHandler factory from core-components.
 */

import { createContactHandler } from '@platform/core-components/lib/api/contact-route';
import { SPAM_PRESETS } from '@platform/core-components/lib/api/spam-score';
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
  /**
   * DCS is the only site opted in to spam tagging. Client sites deliberately
   * are not: their owners run their own mail filtering and read their own
   * inbox, so tagging on their behalf would alter mail nobody asked us to
   * touch. Opting one in later is this block, copied.
   *
   * `ProfessionalService` matches `siteConfig.business.businessType`. It exempts
   * the SEO vocabulary from scoring, because DCS *sells* those services — a
   * customer writing "we'd like more organic traffic" is describing what they
   * want to buy, whereas on a trades site the same words are a pitch. The
   * offer-grammar signals stay active either way, since what actually separates
   * a customer from a spammer is direction: a customer asks, a spammer offers.
   *
   * `rules: {}` is an explicit "no site-specific delta needed yet" rather than
   * an oversight. Anything added here wants a corpus fixture proving the case
   * was real — see `spam-score.ts` and its test.
   */
  spamTagging: {
    preset: SPAM_PRESETS.ProfessionalService,
    rules: {},
  },
});
