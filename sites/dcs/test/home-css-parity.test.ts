import { describe, expect, it } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Proves `styles/home-r9.css` is a verbatim port of the r9 prototype's
 * <style> block, except for two documented classes of edit (font-stack vars,
 * palette vars). Reads the REAL prototype file live on every run — this is
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

describe('sites/dcs/styles/home-r9.css is a verbatim port of the r9 prototype stylesheet', () => {
  const html = fs.readFileSync(PROTOTYPE_PATH, 'utf-8');
  const prototypeCss = extractStyleBlock(html);
  const portCss = fs.readFileSync(PORT_PATH, 'utf-8');

  const prototypeRules = parseCss(prototypeCss);
  const portRules = parseCss(portCss);

  it('parses a non-trivial number of rules from both the prototype and the port', () => {
    expect(prototypeRules.length).toBeGreaterThan(0);
    expect(portRules.length).toBeGreaterThan(0);
  });

  it('has the same rule count, in the same document order, as the prototype', () => {
    expect(
      portRules.length,
      `prototype has ${prototypeRules.length} rules, port has ${portRules.length} — a rule was added, removed, or split differently`
    ).toBe(prototypeRules.length);
  });

  it('every selector present in the prototype is present in the port, and vice versa', () => {
    const key = (r: Rule) => `${r.context}|${r.selector}`;
    const protoKeys = new Set(prototypeRules.map(key));
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
  });

  it('every rule matches selector, context and declarations byte-for-byte except the documented allow-list', () => {
    const total = prototypeRules.length;
    let comparedDeclarations = 0;

    for (let i = 0; i < total; i++) {
      const protoRule = prototypeRules[i]!;
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

    // eslint-disable-next-line no-console
    console.log(
      `PASS — ${total}/${total} records, 0 errors (${comparedDeclarations} declarations compared)`
    );
  });

  it('the allow-list itself is accurate: every entry appears in both :root blocks with the documented values', () => {
    const rootRule = prototypeRules.find((r) => r.context === '' && r.selector === ':root');
    const portRootRule = portRules.find((r) => r.context === '' && r.selector === ':root');
    expect(rootRule, 'prototype has no top-level :root rule').toBeDefined();
    expect(portRootRule, 'port has no top-level :root rule').toBeDefined();

    for (const entry of ALLOWLIST) {
      const protoDecl = rootRule!.declarations.find((d) => d.property === entry.property);
      const portDecl = portRootRule!.declarations.find((d) => d.property === entry.property);
      expect(protoDecl, `prototype :root missing "${entry.property}"`).toBeDefined();
      expect(portDecl, `port :root missing "${entry.property}"`).toBeDefined();
      expect(
        protoDecl!.value,
        `prototype :root "${entry.property}" does not match the documented before-value`
      ).toBe(entry.prototypeValue);
      expect(
        portDecl!.value,
        `port :root "${entry.property}" does not match the documented after-value`
      ).toBe(entry.portValue);
    }
  });
});
