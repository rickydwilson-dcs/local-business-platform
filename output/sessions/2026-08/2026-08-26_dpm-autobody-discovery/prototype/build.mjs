#!/usr/bin/env node
/**
 * build.mjs — one source, two prototypes.
 *
 * There are two audiences for this prototype and they need different pages.
 * David needs to see the site; Ricky needs to see the site plus the reasoning,
 * the provenance of every photograph, and what is still a placeholder. Keeping
 * two hand-edited copies in step is exactly the sort of thing that silently
 * stops being true after the third revision, so there is one source and this
 * generates both from it.
 *
 *   prototype/src/*.html   ← edit these, and only these
 *   prototype/client/      ← generated. Clean. This is what David sees.
 *   prototype/annotated/   ← generated. Clean page + the working notes.
 *
 * Marking convention, applied in the source:
 *
 *   data-note     this element is a working note. Annotated build only.
 *   data-client   this element replaces a note for the client. Client build
 *                 only. Use it where the annotated page needs to say more than
 *                 the client page rather than merely say it differently.
 *
 * Everything unmarked appears in both. That is deliberate: the default is that
 * a change lands in both builds, so forgetting to mark something makes the
 * client page too honest rather than the working page too thin.
 *
 * Usage:  node build.mjs          (from anywhere)
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const SRC = join(HERE, 'src');

const VOID = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
  'link', 'meta', 'param', 'source', 'track', 'wbr',
]);

/**
 * Remove every element carrying `attr`, including its children.
 *
 * This walks tags rather than parsing to a tree, which is fine because it only
 * ever runs over HTML authored in this folder. Two things it relies on:
 * marked elements are never void (there is nothing to strip inside an <img>),
 * and the source contains no `<` inside an attribute value. Both are asserted
 * rather than assumed — a marked void element throws.
 */
function stripMarked(html, attr) {
  const open = new RegExp(`<([a-zA-Z][\\w-]*)((?:"[^"]*"|'[^']*'|[^>"'])*?)\\s${attr}(?=[\\s=>/])`, 'g');
  let out = html;

  for (;;) {
    open.lastIndex = 0;
    const m = open.exec(out);
    if (!m) break;

    const tag = m[1].toLowerCase();
    if (VOID.has(tag)) {
      throw new Error(`${attr} on void element <${tag}> — nothing to strip; put it on a wrapper instead`);
    }

    const start = m.index;
    /* Find the end of this opening tag, respecting quoted attribute values. */
    let i = start + 1;
    let quote = null;
    while (i < out.length) {
      const ch = out[i];
      if (quote) {
        if (ch === quote) quote = null;
      } else if (ch === '"' || ch === "'") {
        quote = ch;
      } else if (ch === '>') break;
      i++;
    }
    if (i >= out.length) throw new Error(`unterminated <${tag}> at ${start}`);

    /* Walk forward counting same-name tags until the matching close. */
    const openRe = new RegExp(`<${tag}(?=[\\s>/])`, 'gi');
    const closeRe = new RegExp(`</${tag}\\s*>`, 'gi');
    let depth = 1;
    let cursor = i + 1;
    let end = -1;
    while (depth > 0) {
      openRe.lastIndex = cursor;
      closeRe.lastIndex = cursor;
      const o = openRe.exec(out);
      const c = closeRe.exec(out);
      if (!c) throw new Error(`no closing </${tag}> for ${attr} element at ${start}`);
      if (o && o.index < c.index) {
        depth++;
        cursor = o.index + 1;
      } else {
        depth--;
        cursor = c.index + c[0].length;
        end = cursor;
      }
    }

    /* Take the whitespace-only line the element sat on with it, so the output
       does not accumulate blank gaps where notes used to be. */
    let from = start;
    while (from > 0 && (out[from - 1] === ' ' || out[from - 1] === '\t')) from--;
    let to = end;
    if (out.slice(to).startsWith('\n')) to++;
    out = out.slice(0, from) + out.slice(to);
  }
  return out;
}

/** Drop the marker attributes themselves from whatever survived. */
function dropAttrs(html) {
  return html.replace(/\s(?:data-note|data-client)(?==?)(?:="[^"]*")?/g, '');
}

function build(file, { keep }) {
  const drop = keep === 'note' ? 'data-client' : 'data-note';
  let html = readFileSync(join(SRC, file), 'utf8');
  html = stripMarked(html, drop);
  html = dropAttrs(html);
  html = html.replace('<html lang="en-GB">', `<html lang="en-GB" data-build="${keep === 'note' ? 'annotated' : 'client'}">`);
  return html;
}

const files = readdirSync(SRC).filter((f) => f.endsWith('.html')).sort();
const targets = [
  { dir: 'annotated', keep: 'note' },
  { dir: 'client', keep: 'client' },
];

for (const t of targets) {
  mkdirSync(join(HERE, t.dir), { recursive: true });
  for (const f of files) {
    const name = f === 'home.html' ? 'index.html' : f;
    const html = build(f, t);
    writeFileSync(join(HERE, t.dir, name), html);
    console.log(`${t.dir}/${name}  ${(html.length / 1024).toFixed(1)} KB`);
  }
}

/* A generated page that still contains a marker means the stripper missed
   something, which would put a working note in front of the client. */
for (const t of targets) {
  for (const f of files) {
    const name = f === 'home.html' ? 'index.html' : f;
    const html = readFileSync(join(HERE, t.dir, name), 'utf8');
    if (/data-(note|client)/.test(html)) {
      throw new Error(`${t.dir}/${name} still contains a marker attribute`);
    }
  }
}
console.log('ok — no marker attributes survived into either build');
