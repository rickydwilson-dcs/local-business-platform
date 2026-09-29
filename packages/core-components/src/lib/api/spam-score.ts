/**
 * Contact-form Spam Scoring
 *
 * Scores a contact submission and lets the caller TAG it, never block it. A
 * false positive on a lead-generation form costs a real enquiry; a missed spam
 * costs five seconds in an inbox. Every threshold here is set with that
 * asymmetry in mind, and nothing in this module can cause a submission to be
 * rejected — `createContactHandler` only uses the verdict to prefix the
 * business notification's subject, so a misjudged genuine enquiry still lands.
 *
 * ## Why this scores grammar, not topic
 *
 * The obvious approach — ban "SEO", "web design", "marketing" — breaks the
 * moment a site sells those things. On `colossus-scaffolding` an enquiry
 * mentioning SEO is spam; on `dcs` it is a customer describing what they want
 * to buy. Topic keywords therefore need a different list per site, which does
 * not scale past a handful of sites.
 *
 * What actually separates the two, in every sample observed so far, is
 * DIRECTION: a genuine enquirer *requests* something, a spammer *offers*
 * something. "Can you quote for scaffolding" versus "I would like to send you a
 * proposal". That distinction is site-independent, so the baseline below is
 * highly portable and the per-site layer stays nearly empty.
 *
 * ## Layering
 *
 * baseline (this file) → preset by `businessType` → per-site delta.
 * A site that needs no tuning configures nothing.
 *
 * ## Calibration
 *
 * Weights are calibrated against a real, labelled corpus — see
 * `__tests__/spam-score.test.ts`. Two findings from it are load-bearing and
 * would not have been guessed:
 *
 *  - A GENUINE enquiry opened "I hope you're well" and went on to say "more
 *    than happy to send over some marked up photos". A naive "generic opener"
 *    or "happy to send" rule flags a real customer. So the opener signal is
 *    weighted 1 (never decisive alone) and the sales-offer patterns require a
 *    selling OBJECT — a proposal, pricing, a site list — not just the verb.
 *  - The two spam samples shared almost no vocabulary with each other. One was
 *    saturated with link-building jargon; the other used none of it and was
 *    caught only by offer grammar and its sender address. A single signal group
 *    would have missed one of them, which is why scoring is additive across
 *    independent groups rather than a keyword match.
 */

export interface SpamSignal {
  /** Stable id, so a site can exempt one group without editing the baseline. */
  id: string;
  weight: number;
  /** The text that matched, for the audit trail in logs. */
  matched: string;
}

export interface SpamAssessment {
  score: number;
  threshold: number;
  isSpam: boolean;
  signals: SpamSignal[];
}

export interface SpamRulesConfig {
  /** Score at or above which the notification is tagged. Default 5. */
  threshold?: number;
  /**
   * Signal ids to switch off for this site (e.g. `['pitch-vocabulary']` on a
   * site whose customers legitimately talk in SEO terms).
   */
  allowSignals?: string[];
  /**
   * Literal terms this site's customers use legitimately. Matched
   * case-insensitively against the term a baseline pattern caught, so a site
   * can keep a group enabled while exempting one phrase from it.
   */
  allowTerms?: string[];
  /** Site-specific additions, on top of the baseline. */
  extraPatterns?: SpamPattern[];
}

export interface SpamPattern {
  id: string;
  weight: number;
  pattern: RegExp;
}

/**
 * The submission fields this module reads. A structural subset of
 * `ContactSubmission` so the scorer stays independent of the route factory.
 */
export interface ScorableSubmission {
  email: string;
  phone: string | null;
  message: string;
}

/**
 * Per-group contribution cap. Without it a single jargon-dense message scores
 * in the dozens, which makes the threshold meaningless and hides whether the
 * verdict rested on one group or several.
 */
const GROUP_CAP = 6;

/**
 * Link-building / SEO-reselling jargon. Nobody buying a website or a scaffold
 * writes "do-follow" or "DA, DR"; these are trade terms of the outreach
 * industry itself.
 */
const PITCH_VOCABULARY: SpamPattern[] = [
  { id: "pitch-vocabulary", weight: 3, pattern: /guest[\s-]?post(ing|s)?\b/i },
  { id: "pitch-vocabulary", weight: 3, pattern: /link[\s-]?building\b/i },
  { id: "pitch-vocabulary", weight: 3, pattern: /\bdo[\s-]?follow\b/i },
  { id: "pitch-vocabulary", weight: 3, pattern: /\bbacklinks?\b/i },
  { id: "pitch-vocabulary", weight: 3, pattern: /\bdomain authority\b/i },
  { id: "pitch-vocabulary", weight: 3, pattern: /high[\s-]authority\b/i },
  // "strong DA, DR and organic traffic" — the two initialisms together. Either
  // alone is far too short to match safely.
  { id: "pitch-vocabulary", weight: 3, pattern: /\bDA\b[^.!?]{0,14}\bDR\b/ },
  { id: "pitch-vocabulary", weight: 3, pattern: /\borganic traffic\b/i },
  { id: "pitch-vocabulary", weight: 3, pattern: /\boff[\s-]page\b/i },
  { id: "pitch-vocabulary", weight: 3, pattern: /\bwhite[\s-]hat\b/i },
  { id: "pitch-vocabulary", weight: 3, pattern: /\bSERPs?\b/ },
  { id: "pitch-vocabulary", weight: 3, pattern: /\bniche edits?\b/i },
];

/**
 * Inbound-sales grammar: the sender offering to supply something, rather than
 * asking for something. Each pattern requires a selling object, because the
 * bare verb appears in genuine enquiries — see the calibration note above.
 */
const SALES_OFFER: SpamPattern[] = [
  {
    id: "sales-offer",
    weight: 3,
    pattern:
      /(send|sending)\s+(you\s+)?(a|our|over\s+our)\s+(proposal|pricing|price\s+list|site\s+lists?|quotation for our)/i,
  },
  {
    id: "sales-offer",
    weight: 3,
    pattern:
      /happy to send\s+(you\s+)?(a|our|over our)\s+(proposal|pricing|price\s+list|site\s+lists?|samples?|details of our)/i,
  },
  { id: "sales-offer", weight: 3, pattern: /let me know if you (are|'re|\u2019re) interested/i },
  { id: "sales-offer", weight: 3, pattern: /if you (are|'re|\u2019re) interested,?\s+(i|we)\b/i },
  {
    id: "sales-offer",
    weight: 3,
    pattern:
      /\b(i|we)\s+(provide|offer|can offer)\s+(high[\s-]quality|professional|affordable|premium|cheap)/i,
  },
  { id: "sales-offer", weight: 3, pattern: /our (placements|packages|services)\s+include/i },
  {
    id: "sales-offer",
    weight: 3,
    pattern: /\b(i|we)\s+would\s+(love|like)\s+to\s+(support|help with|promote)\s+your\b/i,
  },
  {
    id: "sales-offer",
    weight: 3,
    pattern: /\b(i|we)\s+can help you\s+(rank|grow|increase|scale)/i,
  },
  {
    id: "sales-offer",
    weight: 3,
    pattern: /interested in\s+(a\s+)?(collaboration|partnership|guest\s+post|link\s+exchange)/i,
  },
];

/**
 * Tokens in the sender's local part that advertise the outreach trade. Weighted
 * 2, below the threshold, because a genuine customer could work at an agency —
 * it should contribute, never decide.
 */
const SENDER_TELL: SpamPattern[] = [
  {
    id: "sender-tell",
    weight: 2,
    pattern: /(seo|backlink|guest-?post|link-?build|strategist|webpromo|ppcexpert)/i,
  },
];

const GENERIC_OPENER: SpamPattern[] = [
  { id: "generic-opener", weight: 1, pattern: /hope you are doing well/i },
  { id: "generic-opener", weight: 1, pattern: /hope this (email|message) finds you/i },
  { id: "generic-opener", weight: 1, pattern: /hope you(?:'|\u2019)?re? (doing )?well/i },
];

/**
 * Presets keyed by the `businessType` every site already declares in
 * `site.config.ts` for schema.org. Reuses that classifier rather than inventing
 * a parallel taxonomy.
 *
 * A professional-services site may sell the very things the pitch vocabulary
 * describes, so its customers can legitimately ask for them — "I want more
 * organic traffic" is a request, not an offer. The offer-grammar group stays on
 * for such sites, because direction is what actually distinguishes the two.
 */
export const SPAM_PRESETS: Record<string, SpamRulesConfig> = {
  ProfessionalService: {
    allowTerms: ["organic traffic", "serp", "serps", "domain authority"],
  },
};

function resolveConfig(
  config: SpamRulesConfig,
  preset?: SpamRulesConfig
): Required<SpamRulesConfig> {
  return {
    threshold: config.threshold ?? preset?.threshold ?? 5,
    allowSignals: [...(preset?.allowSignals ?? []), ...(config.allowSignals ?? [])],
    allowTerms: [...(preset?.allowTerms ?? []), ...(config.allowTerms ?? [])].map((t) =>
      t.toLowerCase()
    ),
    extraPatterns: [...(preset?.extraPatterns ?? []), ...(config.extraPatterns ?? [])],
  };
}

function countUrls(text: string): number {
  const matches = text.match(/https?:\/\/|\bwww\./gi);
  return matches ? matches.length : 0;
}

/**
 * True for a number that declares an international dialling prefix other than
 * the UK's. A bare `0…` number is treated as domestic — it may be spoofed, but
 * that is not evidence either way.
 */
function isNonUkInternational(phone: string): boolean {
  const normalised = phone.replace(/[\s()-]/g, "");
  if (normalised.startsWith("+")) return !normalised.startsWith("+44");
  if (normalised.startsWith("00")) return !normalised.startsWith("0044");
  return false;
}

/**
 * Score a submission. Never throws and never blocks; the caller decides what to
 * do with the verdict.
 */
export function assessSubmission(
  submission: ScorableSubmission,
  config: SpamRulesConfig = {},
  preset?: SpamRulesConfig
): SpamAssessment {
  const resolved = resolveConfig(config, preset);
  const { message, email, phone } = submission;
  const localPart = email.split("@")[0] ?? "";

  const groups: Array<{ patterns: SpamPattern[]; haystack: string }> = [
    { patterns: PITCH_VOCABULARY, haystack: message },
    { patterns: SALES_OFFER, haystack: message },
    { patterns: GENERIC_OPENER, haystack: message },
    { patterns: SENDER_TELL, haystack: localPart },
    { patterns: resolved.extraPatterns, haystack: message },
  ];

  const signals: SpamSignal[] = [];
  const groupTotals = new Map<string, number>();

  const record = (signal: SpamSignal): void => {
    const current = groupTotals.get(signal.id) ?? 0;
    if (current >= GROUP_CAP) return;
    const weight = Math.min(signal.weight, GROUP_CAP - current);
    groupTotals.set(signal.id, current + weight);
    signals.push({ ...signal, weight });
  };

  for (const { patterns, haystack } of groups) {
    for (const { id, weight, pattern } of patterns) {
      if (resolved.allowSignals.includes(id)) continue;
      const found = haystack.match(pattern);
      if (!found) continue;
      const matched = found[0];
      if (resolved.allowTerms.includes(matched.toLowerCase().trim())) continue;
      record({ id, weight, matched });
    }
  }

  if (!resolved.allowSignals.includes("body-urls")) {
    const urls = countUrls(message);
    if (urls > 0) {
      record({ id: "body-urls", weight: Math.min(urls * 2, 4), matched: `${urls} link(s)` });
    }
  }

  if (phone && !resolved.allowSignals.includes("non-uk-phone") && isNonUkInternational(phone)) {
    record({ id: "non-uk-phone", weight: 2, matched: phone });
  }

  const score = signals.reduce((total, s) => total + s.weight, 0);

  return { score, threshold: resolved.threshold, isSpam: score >= resolved.threshold, signals };
}
