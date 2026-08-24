import { describe, expect, it } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import * as vm from 'vm';

import { CONTACT, FAQS, QUOTE, SERVICES, STEPS, TIERS, WORK } from '../components/home/home-data';
import type { PricingTier, TierPrice } from '../components/home/home-data';

/**
 * Proves every string in `home-data.ts` is a verbatim transcription of the r9
 * prototype's own markup and inline `<script>` — reads the REAL prototype
 * file live on every run (not a snapshot of it), so a typo introduced later
 * in home-data.ts fails this test immediately.
 *
 * Two decode passes are needed because the prototype mixes two escaping
 * schemes: HTML entities in markup (&mdash;, &rsquo;, &middot;, &amp;,
 * &rarr;) and JS \uXXXX escapes inside the inline pricing script (the TIERS
 * object uses '£' for £, '—' for —). Both are decoded across the
 * whole file before substring checks, since neither scheme appears outside
 * its own region.
 */

const PROTOTYPE_PATH = path.resolve(
  __dirname,
  '../../../output/sessions/2026-08/2026-08-17_dcs-homepage-redesign/prototype/r9-kota-level.html'
);

const HTML_ENTITIES: Record<string, string> = {
  '&mdash;': '—',
  '&ndash;': '–',
  '&rsquo;': '’',
  '&lsquo;': '‘',
  '&rdquo;': '”',
  '&ldquo;': '“',
  '&amp;': '&',
  '&rarr;': '→',
  '&middot;': '·',
  '&copy;': '©',
  '&nbsp;': ' ',
};

function decodeHtmlEntities(text: string): string {
  let out = text;
  for (const [entity, char] of Object.entries(HTML_ENTITIES)) {
    out = out.split(entity).join(char);
  }
  return out;
}

function decodeJsUnicodeEscapes(text: string): string {
  return text.replace(/\\u([0-9a-fA-F]{4})/g, (_match, hex: string) =>
    String.fromCharCode(parseInt(hex, 16))
  );
}

/**
 * The prototype's markup wraps long copy across source lines with leading
 * indentation (e.g. the wpanel__d descriptions), which is invisible when the
 * page renders but means a continuous single-line string in home-data.ts
 * cannot match a raw substring of the file. Collapsing all whitespace runs
 * (including the embedded newline + indentation) to a single space makes the
 * comparison robust to the prototype's own line-wrapping without touching
 * any of the actual words or punctuation being verified.
 */
function normalizeWhitespace(text: string): string {
  return text.replace(/\s+/g, ' ');
}

function loadDecodedPrototype(): string {
  const raw = fs.readFileSync(PROTOTYPE_PATH, 'utf-8');
  return normalizeWhitespace(decodeJsUnicodeEscapes(decodeHtmlEntities(raw)));
}

/**
 * Extracts the prototype's own `TIERS` JS object literal and evaluates it in
 * an isolated vm context (not `eval` in this process). This is a trusted
 * local fixture, not user input — the goal is a golden derivation of "how
 * many real price states exist" straight from the prototype's own data
 * structure, rather than a hand-typed count that could silently drift from
 * it.
 */
function extractPrototypeTiers(html: string): Record<string, unknown> {
  const match = html.match(/var TIERS = (\{[\s\S]*?\n {2}\};)/);
  if (!match) {
    throw new Error(
      'Could not locate the "var TIERS = {...};" object literal in the prototype script'
    );
  }
  const objectLiteralSource = match[1]!;
  const context: { result?: Record<string, unknown> } = {};
  vm.createContext(context);
  vm.runInContext(`result = ${objectLiteralSource}`, context);
  if (!context.result) {
    throw new Error('vm evaluation of the prototype TIERS object produced no result');
  }
  return context.result;
}

describe('sites/dcs/components/home/home-data.ts is a verbatim transcription of the r9 prototype', () => {
  const decodedPrototype = loadDecodedPrototype();
  const rawPrototype = fs.readFileSync(PROTOTYPE_PATH, 'utf-8');

  function expectInPrototype(value: string, label: string): void {
    expect(
      decodedPrototype.includes(value),
      `${label}: string not found verbatim in the decoded prototype source.\n  value: ${JSON.stringify(value)}`
    ).toBe(true);
  }

  // Every string check below is one "record" for the PASS/FAIL verdict line.
  let recordsChecked = 0;
  function checkedString(value: string, label: string): void {
    expectInPrototype(value, label);
    recordsChecked++;
  }

  it('prototype file is readable and non-trivial', () => {
    expect(rawPrototype.length).toBeGreaterThan(1000);
  });

  describe('WORK', () => {
    it('has exactly 5 items', () => {
      expect(WORK).toHaveLength(5);
    });

    it('index/name/description appear verbatim in the prototype; all 5 items carry a link', () => {
      // The pill chips have been dropped from the design and NP Racing / SM
      // Commercial's outbound links have been extended to all five panels —
      // the new links (theclothingkings.co.uk, cuddleplushfabrics.co.uk,
      // colossus-scaffolding.co.uk) postdate the r9 prototype freeze, so
      // only the two links the prototype already had are checked against it.
      const PROTOTYPE_LINKS = new Set(['NP Racing', 'SM Commercial']);
      for (const item of WORK) {
        checkedString(item.index, `WORK[${item.name}].index`);
        checkedString(item.name, `WORK[${item.name}].name`);
        checkedString(item.description, `WORK[${item.name}].description`);
        if (PROTOTYPE_LINKS.has(item.name)) {
          checkedString(item.link.label, `WORK[${item.name}].link.label`);
          checkedString(item.link.href, `WORK[${item.name}].link.href`);
        } else {
          expect(item.link.href, `WORK[${item.name}].link.href`).toMatch(/^https:\/\/(www\.)?/);
        }
      }

      const withLinks = WORK.filter((w) => w.link).map((w) => w.name);
      expect(withLinks.sort()).toEqual(WORK.map((w) => w.name).sort());
    });
  });

  describe('SERVICES', () => {
    it('has exactly 6 cards', () => {
      expect(SERVICES).toHaveLength(6);
    });

    it('every field appears verbatim in the prototype', () => {
      for (const svc of SERVICES) {
        checkedString(svc.index, `SERVICES[${svc.title}].index`);
        checkedString(svc.title, `SERVICES[${svc.title}].title`);
        checkedString(svc.description, `SERVICES[${svc.title}].description`);
        checkedString(svc.linkLabel, `SERVICES[${svc.title}].linkLabel`);
      }
    });

    it('colour modifiers match the prototype order: ink, magenta, white, navy, aqua, white', () => {
      expect(SERVICES.map((s) => s.color)).toEqual([
        'ink',
        'magenta',
        'white',
        'navy',
        'aqua',
        'white',
      ]);
    });
  });

  describe('STEPS', () => {
    it('has exactly 4 process steps', () => {
      expect(STEPS).toHaveLength(4);
    });

    it('every field appears verbatim in the prototype', () => {
      for (const step of STEPS) {
        checkedString(step.key, `STEPS[${step.title}].key`);
        checkedString(step.title, `STEPS[${step.title}].title`);
        checkedString(step.body, `STEPS[${step.title}].body`);
      }
    });
  });

  describe('FAQS', () => {
    it('has exactly 6 items, and only the first is open by default', () => {
      expect(FAQS).toHaveLength(6);
      expect(FAQS[0]!.open).toBe(true);
      expect(FAQS.slice(1).every((f) => !f.open)).toBe(true);
    });

    it('every question and answer appears verbatim in the prototype', () => {
      for (const faq of FAQS) {
        checkedString(faq.question, `FAQS[${faq.question}].question`);
        checkedString(faq.answer, `FAQS[${faq.question}].answer`);
      }
    });
  });

  describe('TIERS', () => {
    const prototypeTiers = extractPrototypeTiers(rawPrototype);

    it('has exactly 4 pricing tiers, matching the prototype keys in order', () => {
      expect(TIERS).toHaveLength(4);
      expect(TIERS.map((t) => t.key)).toEqual(Object.keys(prototypeTiers));
    });

    it('derives the real price-state count from the prototype itself, not a hand-guessed number', () => {
      // 4 tiers x 2 pay modes = 8 total price-state entries in the prototype's
      // own TIERS object (every tier object has both an `upfront` and a
      // `monthly` key, including ecom's placeholder monthly state).
      const allPrototypeStates = Object.values(prototypeTiers).flatMap((t) => {
        const tier = t as { upfront: TierPrice; monthly: TierPrice };
        return [tier.upfront, tier.monthly];
      });
      expect(allPrototypeStates).toHaveLength(8);

      // Real, distinct price figures exclude the 'N/A' placeholder — derived
      // by filtering the prototype's own data, not hardcoded.
      const realPrototypePrices = allPrototypeStates.filter((s) => s.fig !== 'N/A');

      const allDataStates = TIERS.flatMap((t) => [t.upfront, t.monthly]);
      expect(allDataStates).toHaveLength(8);
      const realDataPrices = allDataStates.filter((s) => s.fig !== 'N/A');

      expect(
        realDataPrices.length,
        "home-data.ts real price-state count must match the prototype's own derived count"
      ).toBe(realPrototypePrices.length);
    });

    it('every tier figure, sub-line, head and bullet matches the prototype object exactly, field for field', () => {
      for (const tier of TIERS) {
        const proto = prototypeTiers[tier.key] as PricingTier | undefined;
        expect(proto, `prototype TIERS is missing key "${tier.key}"`).toBeDefined();

        expect(tier.name).toBe(proto!.name);
        expect(tier.upfrontOnly).toBe(proto!.upfrontOnly ?? false);

        expect(tier.upfront.fig).toBe(proto!.upfront.fig);
        expect(tier.upfront.sub).toBe(proto!.upfront.sub);
        expect(tier.upfront.head).toBe(proto!.upfront.head);

        expect(tier.monthly.fig).toBe(proto!.monthly.fig);
        expect(tier.monthly.sub).toBe(proto!.monthly.sub);
        expect(tier.monthly.head).toBe(proto!.monthly.head);

        const protoAny = proto as unknown as { p: string; l: string[] };
        expect(tier.description).toBe(protoAny.p);
        expect(tier.bullets).toEqual(protoAny.l);

        recordsChecked += 8; // name, upfrontOnly, upfront{fig,sub,head}, monthly{fig,sub,head} tracked; p/l below
        recordsChecked += 2;
      }
    });

    it('no price string is absent from the decoded prototype markup or script', () => {
      for (const tier of TIERS) {
        checkedString(tier.name, `TIERS[${tier.key}].name`);
        checkedString(tier.subtitle, `TIERS[${tier.key}].subtitle`);
        checkedString(tier.upfront.fig, `TIERS[${tier.key}].upfront.fig`);
        checkedString(tier.upfront.sub, `TIERS[${tier.key}].upfront.sub`);
        if (tier.upfront.head) checkedString(tier.upfront.head, `TIERS[${tier.key}].upfront.head`);
        if (tier.monthly.fig !== 'N/A') {
          checkedString(tier.monthly.fig, `TIERS[${tier.key}].monthly.fig`);
        }
        checkedString(tier.monthly.sub, `TIERS[${tier.key}].monthly.sub`);
        if (tier.monthly.head) checkedString(tier.monthly.head, `TIERS[${tier.key}].monthly.head`);
        checkedString(tier.description, `TIERS[${tier.key}].description`);
        for (const bullet of tier.bullets) {
          checkedString(bullet, `TIERS[${tier.key}].bullet "${bullet}"`);
        }
      }
    });
  });

  describe('QUOTE', () => {
    it('the testimonial text and attribution appear verbatim in the prototype', () => {
      checkedString(QUOTE.text, 'QUOTE.text');
      checkedString(QUOTE.author, 'QUOTE.author');
      checkedString(QUOTE.context, 'QUOTE.context');
    });
  });

  describe('CONTACT', () => {
    it('email matches the prototype and the reused contact-info.ts export', () => {
      checkedString(CONTACT.email, 'CONTACT.email');
      expect(CONTACT.email).toBe('mail@digitalconsultingservices.co.uk');
    });

    // The business phone number changed after the initial prototype port
    // (2026-08-24), so CONTACT.phoneDisplay/phoneHref now intentionally
    // diverge from the frozen prototype file — this checks the current
    // value's shape instead of prototype fidelity.
    it('phone display and href use the current site.config.ts number', () => {
      expect(CONTACT.phoneDisplay).toBe('07383 666268');
      expect(CONTACT.phoneHref).toBe('tel:+447383666268');
    });

    it("address matches the prototype's literal footer text (documented mismatch vs formatAddressSingleLine())", () => {
      checkedString(CONTACT.address, 'CONTACT.address');
    });
  });

  it('prints the mandatory verdict line with real counts', () => {
    // Recount everything in one pass, independent of the per-block counters
    // above, so the printed verdict is a true total rather than an
    // accumulator that could drift from what was actually asserted.
    let total = 0;
    let errors = 0;
    let firstOffender = '';

    const allStrings: Array<{ value: string; label: string }> = [];
    const PROTOTYPE_WORK_LINKS = new Set(['NP Racing', 'SM Commercial']);
    for (const item of WORK) {
      allStrings.push(
        { value: item.index, label: `WORK.${item.name}.index` },
        { value: item.name, label: `WORK.${item.name}.name` },
        { value: item.description, label: `WORK.${item.name}.description` }
      );
      if (PROTOTYPE_WORK_LINKS.has(item.name)) {
        allStrings.push(
          { value: item.link.label, label: `WORK.${item.name}.link.label` },
          { value: item.link.href, label: `WORK.${item.name}.link.href` }
        );
      }
    }
    for (const svc of SERVICES) {
      allStrings.push(
        { value: svc.index, label: `SERVICES.${svc.title}.index` },
        { value: svc.title, label: `SERVICES.${svc.title}.title` },
        { value: svc.description, label: `SERVICES.${svc.title}.description` },
        { value: svc.linkLabel, label: `SERVICES.${svc.title}.linkLabel` }
      );
    }
    for (const step of STEPS) {
      allStrings.push(
        { value: step.key, label: `STEPS.${step.title}.key` },
        { value: step.title, label: `STEPS.${step.title}.title` },
        { value: step.body, label: `STEPS.${step.title}.body` }
      );
    }
    for (const faq of FAQS) {
      allStrings.push(
        { value: faq.question, label: `FAQS.${faq.question}.question` },
        { value: faq.answer, label: `FAQS.${faq.question}.answer` }
      );
    }
    for (const tier of TIERS) {
      allStrings.push(
        { value: tier.name, label: `TIERS.${tier.key}.name` },
        { value: tier.subtitle, label: `TIERS.${tier.key}.subtitle` },
        { value: tier.upfront.fig, label: `TIERS.${tier.key}.upfront.fig` },
        { value: tier.upfront.sub, label: `TIERS.${tier.key}.upfront.sub` },
        { value: tier.monthly.sub, label: `TIERS.${tier.key}.monthly.sub` },
        { value: tier.description, label: `TIERS.${tier.key}.description` }
      );
      if (tier.upfront.head)
        allStrings.push({ value: tier.upfront.head, label: `TIERS.${tier.key}.upfront.head` });
      if (tier.monthly.head)
        allStrings.push({ value: tier.monthly.head, label: `TIERS.${tier.key}.monthly.head` });
      if (tier.monthly.fig !== 'N/A') {
        allStrings.push({ value: tier.monthly.fig, label: `TIERS.${tier.key}.monthly.fig` });
      }
      for (const bullet of tier.bullets) {
        allStrings.push({ value: bullet, label: `TIERS.${tier.key}.bullet` });
      }
    }
    allStrings.push(
      { value: QUOTE.text, label: 'QUOTE.text' },
      { value: QUOTE.author, label: 'QUOTE.author' },
      { value: QUOTE.context, label: 'QUOTE.context' },
      { value: CONTACT.email, label: 'CONTACT.email' },
      // CONTACT.phoneDisplay is deliberately excluded: the business phone
      // number changed after the prototype port (2026-08-24), so it no
      // longer appears in the frozen prototype file — see the CONTACT
      // describe block above for the check that replaced it.
      { value: CONTACT.address, label: 'CONTACT.address' }
    );

    for (const { value, label } of allStrings) {
      total++;
      if (!decodedPrototype.includes(value)) {
        errors++;
        if (!firstOffender) firstOffender = `${label}: ${JSON.stringify(value)}`;
      }
    }

    expect(recordsChecked).toBeGreaterThan(0);

    if (errors === 0) {
      console.log(`PASS — ${total}/${total} records, 0 errors`);
    } else {
      console.log(`FAIL — ${total - errors}/${total} records, ${errors} errors: ${firstOffender}`);
    }
    expect(errors, `first offending record: ${firstOffender}`).toBe(0);
  });
});
