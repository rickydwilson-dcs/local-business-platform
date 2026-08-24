import { describe, expect, it } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Proves `styles/home-r9.css` is a verbatim port of the r9 prototype's
 * <style> block, except for three documented classes of edit (font-stack
 * vars, palette vars, and rules intentionally removed after the prototype
 * was frozen). Reads the REAL prototype file live on every run — this is
 * not a snapshot of it — so drift in either file is caught immediately.
 *
 * The CSS "parser" below is deliberately minimal: it tracks brace depth to
 * split "prelude { block }" pairs, recursing into at-rules that carry a
 * block (@media, @keyframes, @supports) so nested rules get a
 * context-qualified position, and splits declaration blocks on top-level
 * ';'. It is not a full CSS AST parser — this stylesheet doesn't need one
 * (no nested rules beyond one level, no ';' inside declaration values) — but
 * it does structurally compare selectors and declarations, not raw text.
 *
 * Rules are compared BY POSITION (same index in document order) rather than
 * by a selector->declaration map, because this stylesheet legitimately
 * repeats the same selector with different declarations in different places
 * (e.g. two separate `@media (max-width:900px)` blocks both containing
 * `.hero__head`, and a literal duplicated block under `@media
 * (max-height:1040px)`). A map keyed by selector would silently collapse
 * those into "last one wins" and could miss a corruption in an earlier
 * occurrence. Since the port is a straight-line edit of the prototype with
 * only two substitutions, rule order is guaranteed identical if the
 * transcription is faithful — positional comparison is the correct, and
 * simpler, check.
 */

interface Declaration {
  property: string;
  value: string;
}

interface Rule {
  context: string; // joined stack of enclosing @-rule preludes; '' if top-level
  selector: string; // this rule's own prelude (selector list, or keyframe selector)
  declarations: Declaration[];
}

function stripComments(css: string): string {
  return css.replace(/\/\*[\s\S]*?\*\//g, '');
}

function normalizeWhitespace(s: string): string {
  return s.replace(/\s+/g, ' ').trim();
}

function parseDeclarations(block: string): Declaration[] {
  const decls: Declaration[] = [];
  for (const part of block.split(';')) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    const colonIdx = trimmed.indexOf(':');
    if (colonIdx === -1) continue;
    const property = trimmed.slice(0, colonIdx).trim();
    const value = normalizeWhitespace(trimmed.slice(colonIdx + 1));
    decls.push({ property, value });
  }
  return decls;
}

function parseBlock(css: string, contextStack: string[], out: Rule[]): void {
  let i = 0;
  const n = css.length;
  while (i < n) {
    while (i < n && /\s/.test(css[i]!)) i++;
    if (i >= n) break;
    const preludeStart = i;
    while (i < n && css[i] !== '{') i++;
    if (i >= n) break; // trailing whitespace/garbage after the last rule
    const prelude = normalizeWhitespace(css.slice(preludeStart, i));
    i++; // consume '{'
    const blockStart = i;
    let depth = 1;
    while (i < n && depth > 0) {
      if (css[i] === '{') depth++;
      else if (css[i] === '}') depth--;
      i++;
    }
    if (depth !== 0) {
      throw new Error(`Unbalanced braces while parsing rule starting with "${prelude}"`);
    }
    const blockContent = css.slice(blockStart, i - 1);

    if (prelude.startsWith('@')) {
      // At-rule with a block (@media, @keyframes, @supports): recurse so its
      // nested rules are recorded with this prelude in their context stack.
      parseBlock(blockContent, [...contextStack, prelude], out);
    } else {
      out.push({
        context: contextStack.join(' > '),
        selector: prelude,
        declarations: parseDeclarations(blockContent),
      });
    }
  }
}

function parseCss(css: string): Rule[] {
  const rules: Rule[] = [];
  parseBlock(stripComments(css), [], rules);
  return rules;
}

function extractStyleBlock(html: string): string {
  const match = html.match(/<style>([\s\S]*?)<\/style>/);
  if (!match) {
    throw new Error(
      'No <style>...</style> block found in the prototype HTML — extraction target is missing'
    );
  }
  return match[1]!;
}

const PROTOTYPE_PATH = path.resolve(
  __dirname,
  '../../../output/sessions/2026-08/2026-08-17_dcs-homepage-redesign/prototype/r9-kota-level.html'
);
const PORT_PATH = path.resolve(__dirname, '../styles/home-r9.css');

/**
 * The ONLY declarations permitted to differ between prototype and port, per
 * the Phase 3 brief: the `--f`/`--f-logo` font-stack values (now pointing at
 * next/font CSS variables from app/layout.tsx) and the seven r9 palette
 * values (now pointing at the Phase 2 theme-system CSS variables emitted
 * from sites/dcs/theme.config.ts `colors.custom`). Both sides of every entry
 * are asserted, not just "different" — an undocumented value on either side
 * fails the test.
 */
interface AllowlistEntry {
  context: string;
  selector: string;
  property: string;
  prototypeValue: string;
  portValue: string;
}

const ALLOWLIST: AllowlistEntry[] = [
  {
    context: '',
    selector: ':root',
    property: '--f',
    prototypeValue: "'Archivo',system-ui,-apple-system,sans-serif",
    portValue: 'var(--font-archivo), system-ui, -apple-system, sans-serif',
  },
  {
    context: '',
    selector: ':root',
    property: '--f-logo',
    prototypeValue: "'Poppins',var(--f)",
    portValue: 'var(--font-poppins), var(--f)',
  },
  {
    context: '',
    selector: ':root',
    property: '--ink',
    prototypeValue: '#0E0E12',
    portValue: 'var(--color-ink)',
  },
  {
    context: '',
    selector: ':root',
    property: '--paper',
    prototypeValue: '#ECEBE9',
    portValue: 'var(--color-paper)',
  },
  {
    context: '',
    selector: ':root',
    property: '--white',
    prototypeValue: '#fff',
    portValue: 'var(--color-white)',
  },
  {
    context: '',
    selector: ':root',
    property: '--magenta',
    prototypeValue: '#D6006B',
    portValue: 'var(--color-magenta)',
  },
  {
    context: '',
    selector: ':root',
    property: '--aqua',
    prototypeValue: '#00D2D8',
    portValue: 'var(--color-aqua)',
  },
  {
    context: '',
    selector: ':root',
    property: '--navy',
    prototypeValue: '#17265E',
    portValue: 'var(--color-navy)',
  },
  {
    context: '',
    selector: ':root',
    property: '--grey',
    prototypeValue: '#70707B',
    portValue: 'var(--color-grey)',
  },
  // 2026-08-24: real WCAG AA color-contrast failures on the magenta/aqua
  // panels (Lighthouse accessibility audit) — dimmed white/ink text on
  // vivid backgrounds fell as low as 2.46:1 against the 4.5:1 minimum for
  // body text. Opacity raised just enough to clear 4.5:1 with a small
  // margin; verified by re-running Lighthouse (accessibility 96 -> 100).
  {
    context: '',
    selector: '.lead',
    property: 'opacity',
    prototypeValue: '.82',
    portValue: '.94',
  },
  {
    context: '',
    selector: '.svccard__ix',
    property: 'opacity',
    prototypeValue: '.55',
    portValue: '.97',
  },
  {
    context: '@media (max-width:900px)',
    selector: '.svccard__ix',
    property: 'opacity',
    prototypeValue: '.6',
    portValue: '.97',
  },
  {
    context: '',
    selector: '.svccard__d',
    property: 'opacity',
    prototypeValue: '.84',
    portValue: '.97',
  },
  {
    context: '',
    selector: '.qa__a p',
    property: 'opacity',
    prototypeValue: '.8',
    portValue: '.97',
  },
  // Same audit: headings/quotes carrying `.res` (the scroll-reveal fade)
  // measured 1.51:1-2.92:1 against the 3:1 large-text minimum at rest,
  // before their IntersectionObserver-driven reveal fires — the exact bug
  // already documented and fixed for mobile-only below; this raises the
  // same rest-state colors for every viewport since Lighthouse's headless
  // render (like a real user mid-scroll) can catch below-the-fold text in
  // that state at any width, not just <=900px.
  {
    context: '',
    selector: '.p--ink .res,.p--magenta .res,.p--navy .res',
    property: 'color',
    prototypeValue: 'rgba(255,255,255,.34)',
    portValue: 'rgba(255,255,255,.72)',
  },
  {
    context: '',
    selector: '.p--aqua .res',
    property: 'color',
    prototypeValue: 'rgba(14,14,18,.34)',
    portValue: 'rgba(14,14,18,.66)',
  },
];

function findAllowlistEntry(
  context: string,
  selector: string,
  property: string
): AllowlistEntry | undefined {
  return ALLOWLIST.find(
    (e) => e.context === context && e.selector === selector && e.property === property
  );
}

/**
 * Rules present in the prototype but intentionally dropped from the port
 * entirely (not a changed value — the whole rule no longer exists), because
 * a product decision made after the prototype was frozen removed the UI it
 * styled. Each entry records why, so a future removal has to be deliberate
 * and documented the same way.
 */
interface RemovedRuleEntry {
  context: string;
  selector: string;
}

const REMOVED_RULES: RemovedRuleEntry[] = [
  // 2026-08-24: the work-panel pill/chip UI was dropped in favour of an
  // outbound link on every panel — see CHANGELOG.md 2026-08-24.
  { context: '', selector: '.wchip' },
  // 2026-08-24 (same Lighthouse accessibility pass as the ALLOWLIST .res
  // entries above): these two rules were a mobile-only (<=900px) override of
  // the base .res rest-state colors, needed only because the base values
  // were then too dim to be legible. Now that the base values themselves
  // carry the fix, the mobile-only override is a no-op duplicate and was
  // folded away rather than left duplicating the (now-identical) base rule.
  {
    context: '@media (max-width:900px)',
    selector: '.p--ink .res,.p--magenta .res,.p--navy .res',
  },
  { context: '@media (max-width:900px)', selector: '.p--aqua .res' },
];

function isRemovedRule(r: Rule): boolean {
  return REMOVED_RULES.some((e) => e.context === r.context && e.selector === r.selector);
}

describe('sites/dcs/styles/home-r9.css is a verbatim port of the r9 prototype stylesheet', () => {
  const html = fs.readFileSync(PROTOTYPE_PATH, 'utf-8');
  const prototypeCss = extractStyleBlock(html);
  const portCss = fs.readFileSync(PORT_PATH, 'utf-8');

  const prototypeRules = parseCss(prototypeCss);
  const portRules = parseCss(portCss);
  // The comparison set below excludes REMOVED_RULES from the prototype side,
  // so a rule intentionally dropped from the port doesn't shift every
  // subsequent positional comparison out of alignment.
  const comparableProtoRules = prototypeRules.filter((r) => !isRemovedRule(r));

  it('parses a non-trivial number of rules from both the prototype and the port', () => {
    expect(prototypeRules.length).toBeGreaterThan(0);
    expect(portRules.length).toBeGreaterThan(0);
  });

  it('has the same rule count as the prototype, minus the documented removed rules, in the same document order', () => {
    expect(
      portRules.length,
      `prototype has ${prototypeRules.length} rules (${comparableProtoRules.length} after removed-rule allowances), port has ${portRules.length} — a rule was added, removed, or split differently`
    ).toBe(comparableProtoRules.length);
  });

  it('every selector present in the prototype is present in the port, and vice versa, aside from documented removals', () => {
    const key = (r: Rule) => `${r.context}|${r.selector}`;
    const protoKeys = new Set(comparableProtoRules.map(key));
    const portKeys = new Set(portRules.map(key));

    const missingFromPort = [...protoKeys].filter((k) => !portKeys.has(k));
    const missingFromPrototype = [...portKeys].filter((k) => !protoKeys.has(k));

    expect(
      missingFromPort,
      `Selectors in prototype but missing from port:\n${missingFromPort.join('\n')}`
    ).toEqual([]);
    expect(
      missingFromPrototype,
      `Selectors in port but not in prototype:\n${missingFromPrototype.join('\n')}`
    ).toEqual([]);

    // Sanity-check REMOVED_RULES itself: every entry must be real (present in
    // the actual prototype) and actually gone from the port — otherwise the
    // allowance is either stale or hiding an unrelated selector mismatch.
    for (const removed of REMOVED_RULES) {
      const k = `${removed.context}|${removed.selector}`;
      expect(
        new Set(prototypeRules.map(key)).has(k),
        `REMOVED_RULES entry "${removed.selector}" does not appear in the prototype — stale allowance`
      ).toBe(true);
      expect(
        new Set(portRules.map(key)).has(k),
        `REMOVED_RULES entry "${removed.selector}" still appears in the port — remove it or drop the allowance`
      ).toBe(false);
    }
  });

  it('every rule matches selector, context and declarations byte-for-byte except the documented allow-list', () => {
    const total = comparableProtoRules.length;
    let comparedDeclarations = 0;

    for (let i = 0; i < total; i++) {
      const protoRule = comparableProtoRules[i]!;
      const portRule = portRules[i]!;

      expect(
        portRule.context,
        `Rule #${i}: context mismatch. prototype selector "${protoRule.selector}" ` +
          `(context "${protoRule.context}") vs port "${portRule.selector}" (context "${portRule.context}")`
      ).toBe(protoRule.context);

      expect(
        portRule.selector,
        `Rule #${i}: selector mismatch in context "${protoRule.context}". ` +
          `prototype "${protoRule.selector}" vs port "${portRule.selector}"`
      ).toBe(protoRule.selector);

      expect(
        portRule.declarations.length,
        `Rule #${i} (${protoRule.selector}): declaration count differs — ` +
          `prototype has ${protoRule.declarations.length}, port has ${portRule.declarations.length}`
      ).toBe(protoRule.declarations.length);

      for (let d = 0; d < protoRule.declarations.length; d++) {
        const protoDecl = protoRule.declarations[d]!;
        const portDecl = portRule.declarations[d]!;
        comparedDeclarations++;

        expect(
          portDecl.property,
          `Rule #${i} (${protoRule.selector}), declaration #${d}: property mismatch — ` +
            `prototype "${protoDecl.property}" vs port "${portDecl.property}"`
        ).toBe(protoDecl.property);

        const allow = findAllowlistEntry(protoRule.context, protoRule.selector, protoDecl.property);
        if (allow) {
          expect(
            protoDecl.value,
            `Allow-listed declaration "${protoDecl.property}" in "${protoRule.selector}": ` +
              `prototype value does not match the documented before-value`
          ).toBe(allow.prototypeValue);
          expect(
            portDecl.value,
            `Allow-listed declaration "${protoDecl.property}" in "${protoRule.selector}": ` +
              `port value does not match the documented after-value`
          ).toBe(allow.portValue);
        } else {
          expect(
            portDecl.value,
            `Rule #${i} (${protoRule.selector}), declaration "${protoDecl.property}": undocumented ` +
              `value difference — prototype "${protoDecl.value}" vs port "${portDecl.value}"`
          ).toBe(protoDecl.value);
        }
      }
    }

    console.log(
      `PASS — ${total}/${total} records, 0 errors (${comparedDeclarations} declarations compared)`
    );
  });

  it("the allow-list itself is accurate: every entry's rule exists in both files with the documented values", () => {
    for (const entry of ALLOWLIST) {
      const protoRule = prototypeRules.find(
        (r) => r.context === entry.context && r.selector === entry.selector
      );
      const portRule = portRules.find(
        (r) => r.context === entry.context && r.selector === entry.selector
      );
      const where = entry.context ? `${entry.context} > ${entry.selector}` : entry.selector;
      expect(protoRule, `prototype has no rule "${where}"`).toBeDefined();
      expect(portRule, `port has no rule "${where}"`).toBeDefined();

      const protoDecl = protoRule!.declarations.find((d) => d.property === entry.property);
      const portDecl = portRule!.declarations.find((d) => d.property === entry.property);
      expect(protoDecl, `prototype "${where}" missing "${entry.property}"`).toBeDefined();
      expect(portDecl, `port "${where}" missing "${entry.property}"`).toBeDefined();
      expect(
        protoDecl!.value,
        `prototype "${where}" "${entry.property}" does not match the documented before-value`
      ).toBe(entry.prototypeValue);
      expect(
        portDecl!.value,
        `port "${where}" "${entry.property}" does not match the documented after-value`
      ).toBe(entry.portValue);
    }
  });
});
