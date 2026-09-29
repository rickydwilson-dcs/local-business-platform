import { describe, expect, it } from "vitest";

import { assessSubmission, SPAM_PRESETS, type SpamRulesConfig } from "../api/spam-score";
import { CONTACT_CORPUS, type CorpusEntry } from "./fixtures/contact-submissions";

/**
 * Corpus-driven calibration gate for the contact-form spam scorer.
 *
 * ## The error weighting is deliberately asymmetric
 *
 * A false positive costs a real enquiry — on a lead-generation form for a
 * one-person business that is money. A missed spam costs five seconds in an
 * inbox. So:
 *
 *   - **Every ham scoring at or above its threshold fails this suite.** There is
 *     no allowance. If a genuine enquiry starts being flagged, that is a defect.
 *   - **A missed spam is reported with its score** so the gap is visible. The
 *     correct response to one is to add a signal that catches it, never to lower
 *     the threshold — lowering the threshold trades a visible miss for an
 *     invisible false positive.
 *
 * ## Per-site resolution
 *
 * Each fixture is scored through the same preset its own site would resolve, so
 * a failure names the site and the entry rather than a global pass/fail. That is
 * what keeps this tractable as more sites opt in.
 */

/** Mirrors how `app/api/contact/route.ts` on each site resolves its preset. */
const SITE_PRESET: Record<CorpusEntry["site"], SpamRulesConfig | undefined> = {
  // businessType: 'ProfessionalService' — sells the vocabulary spammers use.
  dcs: SPAM_PRESETS.ProfessionalService,
  // businessType: 'HomeAndConstructionBusiness' — no preset, bare baseline.
  "colossus-scaffolding": undefined,
};

const ham = CONTACT_CORPUS.filter((e) => e.label === "ham");
const spam = CONTACT_CORPUS.filter((e) => e.label === "spam");

describe("assessSubmission — corpus calibration", () => {
  it("has a corpus with both labels and real production samples", () => {
    expect(ham.length).toBeGreaterThan(0);
    expect(spam.length).toBeGreaterThan(0);
    // Guards against the corpus silently degrading into hand-written cases.
    expect(CONTACT_CORPUS.filter((e) => e.source === "production").length).toBeGreaterThanOrEqual(
      7
    );
  });

  describe("no genuine enquiry is ever flagged", () => {
    for (const entry of ham) {
      it(`[${entry.site}] ${entry.id}`, () => {
        const result = assessSubmission(entry, {}, SITE_PRESET[entry.site]);
        expect(
          result.isSpam,
          `FALSE POSITIVE — a genuine enquiry was flagged.\n` +
            `  score ${result.score} >= threshold ${result.threshold}\n` +
            `  signals: ${result.signals.map((s) => `${s.id}("${s.matched}")+${s.weight}`).join(", ")}\n` +
            `  why this fixture exists: ${entry.note}`
        ).toBe(false);
      });
    }
  });

  describe("known spam is caught", () => {
    for (const entry of spam) {
      it(`[${entry.site}] ${entry.id}`, () => {
        const result = assessSubmission(entry, {}, SITE_PRESET[entry.site]);
        expect(
          result.isSpam,
          `MISSED — scored ${result.score}, threshold ${result.threshold}. ` +
            `Add a signal that catches it; do not lower the threshold.`
        ).toBe(true);
      });
    }
  });
});

describe("assessSubmission — specific regressions", () => {
  const church = CONTACT_CORPUS.find((e) => e.id === "ham-church-scaffolding")!;

  it('"more than happy to send over some marked up photos" is not read as a sales offer', () => {
    const result = assessSubmission(church);
    expect(result.signals.map((s) => s.id)).not.toContain("sales-offer");
  });

  it("a generic opener alone can never reach the threshold", () => {
    const result = assessSubmission({
      email: "someone@example.com",
      phone: "07000 000000",
      message: "Hi, I hope you are doing well. Could you quote for a loft conversion please?",
    });
    expect(result.signals.map((s) => s.id)).toEqual(["generic-opener"]);
    expect(result.isSpam).toBe(false);
  });

  it("the jargon-dense pitch is caught by more than one independent group", () => {
    const pitch = CONTACT_CORPUS.find((e) => e.id === "spam-link-building-pitch")!;
    const groups = new Set(assessSubmission(pitch).signals.map((s) => s.id));
    expect(groups.size).toBeGreaterThanOrEqual(3);
  });

  it("the jargon-free pitch is caught without any pitch vocabulary at all", () => {
    const subtle = CONTACT_CORPUS.find((e) => e.id === "spam-seo-proposal-no-jargon")!;
    const result = assessSubmission(subtle);
    expect(result.signals.map((s) => s.id)).not.toContain("pitch-vocabulary");
    expect(result.isSpam).toBe(true);
  });

  it("no single signal group can exceed the per-group cap", () => {
    const result = assessSubmission({
      email: "x@example.com",
      phone: null,
      message:
        "guest posting link-building do-follow backlinks domain authority high-authority " +
        "organic traffic off-page white-hat SERP niche edits",
    });
    const pitchTotal = result.signals
      .filter((s) => s.id === "pitch-vocabulary")
      .reduce((t, s) => t + s.weight, 0);
    expect(pitchTotal).toBeLessThanOrEqual(6);
  });
});

describe("assessSubmission — the layering is what isolates one site from another", () => {
  const dcsCustomer = CONTACT_CORPUS.find((e) => e.id === "ham-dcs-customer-using-seo-vocabulary")!;

  it("a DCS customer asking for SEO work is ham under the ProfessionalService preset", () => {
    const result = assessSubmission(dcsCustomer, {}, SPAM_PRESETS.ProfessionalService);
    expect(result.isSpam).toBe(false);
  });

  it("the same message IS flagged under the bare trades baseline — the preset is doing real work", () => {
    const result = assessSubmission(dcsCustomer);
    expect(
      result.isSpam,
      "If this stops flagging, the preset has become decorative and the layering is untested."
    ).toBe(true);
  });

  it("allowSignals switches a whole group off", () => {
    const pitch = CONTACT_CORPUS.find((e) => e.id === "spam-link-building-pitch")!;
    const result = assessSubmission(pitch, { allowSignals: ["pitch-vocabulary"] });
    expect(result.signals.map((s) => s.id)).not.toContain("pitch-vocabulary");
  });

  it("a site delta composes on top of its preset rather than replacing it", () => {
    const result = assessSubmission(
      dcsCustomer,
      { allowSignals: ["generic-opener"] },
      SPAM_PRESETS.ProfessionalService
    );
    // The preset's allowTerms still apply alongside the site's allowSignals.
    expect(result.signals).toHaveLength(0);
  });

  it("threshold is configurable per site", () => {
    const church = CONTACT_CORPUS.find((e) => e.id === "ham-church-scaffolding")!;
    expect(assessSubmission(church, { threshold: 1 }).isSpam).toBe(true);
    expect(assessSubmission(church, { threshold: 5 }).isSpam).toBe(false);
  });
});

describe("assessSubmission — signals in isolation", () => {
  it("links in the body contribute, capped", () => {
    const result = assessSubmission({
      email: "a@example.com",
      phone: null,
      message: "See https://one.example https://two.example www.three.example and www.four.example",
    });
    const urlWeight = result.signals
      .filter((s) => s.id === "body-urls")
      .reduce((t, s) => t + s.weight, 0);
    expect(urlWeight).toBe(4);
  });

  it("a non-UK international dialling prefix contributes, a UK one does not", () => {
    const base = { email: "a@example.com", message: "Please quote for a job." };
    expect(assessSubmission({ ...base, phone: "+91 90000 00000" }).score).toBe(2);
    expect(assessSubmission({ ...base, phone: "+44 7700 900000" }).score).toBe(0);
    expect(assessSubmission({ ...base, phone: "0044 7700 900000" }).score).toBe(0);
    expect(assessSubmission({ ...base, phone: "07700 900000" }).score).toBe(0);
    expect(assessSubmission({ ...base, phone: "0800 000 0000" }).score).toBe(0);
  });

  it("is unfazed by an empty submission", () => {
    const result = assessSubmission({ email: "", phone: null, message: "" });
    expect(result.score).toBe(0);
    expect(result.isSpam).toBe(false);
  });
});
