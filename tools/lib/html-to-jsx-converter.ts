/**
 * HTML-to-JSX Converter
 *
 * Mechanical conversion of HTML to JSX. Preserves exact DOM structure
 * without AI interpretation. Uses node-html-parser for deterministic parsing.
 */

import { parse as parseHtml, HTMLElement, Node, NodeType } from "node-html-parser";
import type { AssetManifest } from "./asset-downloader";

// ── Tracking patterns for removal ───────────────────────────────────────────

const TRACKING_ID_PATTERNS = [/^gtm-/, /^ga-/, /^fb-pixel/, /^_hjid/, /^intercom-/];

// ── Attribute mapping ────────────────────────────────────────────────────────

const ATTR_MAP: Record<string, string> = {
  class: "className",
  for: "htmlFor",
  tabindex: "tabIndex",
  autocomplete: "autoComplete",
  maxlength: "maxLength",
  minlength: "minLength",
  readonly: "readOnly",
  colspan: "colSpan",
  rowspan: "rowSpan",
  crossorigin: "crossOrigin",
  accesskey: "accessKey",
  contenteditable: "contentEditable",
  enctype: "encType",
  usemap: "useMap",
  frameborder: "frameBorder",
  allowfullscreen: "allowFullScreen",
};

const BOOLEAN_ATTRS = new Set([
  "checked",
  "disabled",
  "required",
  "selected",
  "multiple",
  "autofocus",
  "autoplay",
  "controls",
  "loop",
  "muted",
  "open",
  "defer",
  "async",
  "novalidate",
  "formnovalidate",
  "hidden",
  "reversed",
  "scoped",
  "seamless",
  "allowfullscreen",
]);

// Void elements that must be self-closed
const VOID_ELEMENTS = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
]);

// SVG attribute camelCase map
const SVG_ATTR_MAP: Record<string, string> = {
  "stroke-width": "strokeWidth",
  "stroke-linecap": "strokeLinecap",
  "stroke-linejoin": "strokeLinejoin",
  "stroke-dasharray": "strokeDasharray",
  "stroke-dashoffset": "strokeDashoffset",
  "fill-rule": "fillRule",
  "clip-rule": "clipRule",
  "clip-path": "clipPath",
  "text-anchor": "textAnchor",
  "font-size": "fontSize",
  "font-family": "fontFamily",
  "font-weight": "fontWeight",
  "letter-spacing": "letterSpacing",
  "word-spacing": "wordSpacing",
  "baseline-shift": "baselineShift",
  "dominant-baseline": "dominantBaseline",
  "alignment-baseline": "alignmentBaseline",
  "stop-color": "stopColor",
  "stop-opacity": "stopOpacity",
  "flood-color": "floodColor",
  "flood-opacity": "floodOpacity",
  "lighting-color": "lightingColor",
  "color-interpolation": "colorInterpolation",
  "color-interpolation-filters": "colorInterpolationFilters",
  "color-rendering": "colorRendering",
  "image-rendering": "imageRendering",
  "shape-rendering": "shapeRendering",
  "text-rendering": "textRendering",
  "vector-effect": "vectorEffect",
  "writing-mode": "writingMode",
  viewbox: "viewBox",
  gradientunits: "gradientUnits",
  gradienttransform: "gradientTransform",
  patterntransform: "patternTransform",
  patternunits: "patternUnits",
  filterunits: "filterUnits",
  primitiveunits: "primitiveUnits",
  spreadmethod: "spreadMethod",
  markerwidth: "markerWidth",
  markerheight: "markerHeight",
  markerunits: "markerUnits",
  refx: "refX",
  refy: "refY",
  kernelmatrix: "kernelMatrix",
  stddeviation: "stdDeviation",
  tablevalues: "tableValues",
  numoctaves: "numOctaves",
  basefrequency: "baseFrequency",
  lengthadjust: "lengthAdjust",
  edgemode: "edgeMode",
  preserveaspectratio: "preserveAspectRatio",
  textlength: "textLength",
  xchannelselector: "xChannelSelector",
  ychannelselector: "yChannelSelector",
};

// ── Style string converter ───────────────────────────────────────────────────

export function convertStyleString(style: string): Record<string, string> {
  const result: Record<string, string> = {};
  const declarations = style.split(";").filter((s) => s.trim());
  for (const decl of declarations) {
    const colonIdx = decl.indexOf(":");
    if (colonIdx === -1) continue;
    const prop = decl.slice(0, colonIdx).trim();
    const value = decl.slice(colonIdx + 1).trim();
    if (!prop || !value) continue;
    // Convert kebab-case to camelCase
    const camel = prop.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
    result[camel] = value;
  }
  return result;
}

// ── Attribute converter ──────────────────────────────────────────────────────

function convertAttributeName(name: string, isSvg: boolean): string {
  if (isSvg) {
    const svgMapped = SVG_ATTR_MAP[name.toLowerCase()];
    if (svgMapped) return svgMapped;
  }
  return ATTR_MAP[name.toLowerCase()] ?? name;
}

function convertAttributeValue(name: string, value: string, manifest: AssetManifest): string {
  // Rewrite asset URLs
  if (name === "src" || name === "href") {
    const localPath = manifest[value];
    if (localPath) return localPath;
    // Try with base domain stripped
    for (const [original, local] of Object.entries(manifest)) {
      if (original.endsWith(value) || value.endsWith(new URL(original).pathname)) {
        return local;
      }
    }
  }
  return value;
}

function convertSrcset(srcset: string, manifest: AssetManifest): string {
  return srcset
    .split(",")
    .map((s) => {
      const parts = s.trim().split(/\s+/);
      const url = parts[0];
      const descriptor = parts[1] ?? "";
      const local = manifest[url] ?? url;
      return descriptor ? `${local} ${descriptor}` : local;
    })
    .join(", ");
}

// ── Node converter ───────────────────────────────────────────────────────────

function isSvgElement(tagName: string): boolean {
  return [
    "svg",
    "path",
    "circle",
    "rect",
    "line",
    "polyline",
    "polygon",
    "ellipse",
    "g",
    "defs",
    "use",
    "symbol",
    "clipPath",
    "mask",
    "pattern",
    "linearGradient",
    "radialGradient",
    "stop",
    "filter",
    "feBlend",
    "feColorMatrix",
    "feComposite",
    "feFlood",
    "feGaussianBlur",
    "feMerge",
    "feMergeNode",
    "feOffset",
    "text",
    "tspan",
    "textPath",
  ].includes(tagName);
}

function shouldStrip(el: HTMLElement): boolean {
  const tag = el.tagName?.toLowerCase() ?? "";
  if (["script", "noscript"].includes(tag)) return true;
  // Strip cross-origin iframes (tracking, embeds)
  if (tag === "iframe") {
    const src = el.getAttribute("src") ?? "";
    if (!src || src.startsWith("http")) return true; // cross-origin
    return false;
  }
  // Strip tracking elements by id
  const id = el.id ?? "";
  if (id && TRACKING_ID_PATTERNS.some((re) => re.test(id))) return true;
  return false;
}

let extractedStyles: string[] = [];

function convertNode(node: Node, manifest: AssetManifest, inSvg = false, indent = 0): string {
  const pad = "  ".repeat(indent);

  if (node.nodeType === NodeType.TEXT_NODE) {
    const text = node.rawText;
    if (!text.trim()) return text.includes("\n") ? "\n" : "";
    // Escape JSX special chars
    return text.replace(/{/g, "&#123;").replace(/}/g, "&#125;");
  }

  if (node.nodeType === NodeType.COMMENT_NODE) {
    return ""; // Strip all comments
  }

  if (node.nodeType !== NodeType.ELEMENT_NODE) {
    return "";
  }

  const el = node as HTMLElement;
  const tag = el.tagName?.toLowerCase() ?? "";

  if (!tag) return "";

  if (shouldStrip(el)) return "";

  // Extract inline <style> blocks
  if (tag === "style") {
    extractedStyles.push(el.innerHTML);
    return "";
  }

  const nowInSvg = inSvg || isSvgElement(tag);
  const isVoid = VOID_ELEMENTS.has(tag);

  // Build attributes
  const attrs: string[] = [];
  const rawAttrs = el.attributes;

  for (const [attrName, attrValue] of Object.entries(rawAttrs)) {
    const jsxName = convertAttributeName(attrName, nowInSvg);

    if (BOOLEAN_ATTRS.has(attrName.toLowerCase())) {
      attrs.push(`${jsxName}={true}`);
      continue;
    }

    if (jsxName === "style") {
      const styleObj = convertStyleString(attrValue);
      const entries = Object.entries(styleObj)
        .map(([k, v]) => `${k}: "${v}"`)
        .join(", ");
      attrs.push(`style={{ ${entries} }}`);
      continue;
    }

    if (jsxName === "srcSet" || attrName === "srcset") {
      const converted = convertSrcset(attrValue, manifest);
      attrs.push(`srcSet="${converted}"`);
      continue;
    }

    const converted = convertAttributeValue(jsxName, attrValue, manifest);
    attrs.push(`${jsxName}="${converted}"`);
  }

  const attrsStr = attrs.length > 0 ? " " + attrs.join(" ") : "";

  if (isVoid) {
    return `${pad}<${tag}${attrsStr} />`;
  }

  const children = el.childNodes
    .map((child) => convertNode(child, manifest, nowInSvg, indent + 1))
    .filter((s) => s !== "")
    .join("");

  if (!children.trim()) {
    return `${pad}<${tag}${attrsStr}></${tag}>`;
  }

  return `${pad}<${tag}${attrsStr}>\n${children}\n${pad}</${tag}>`;
}

// ── Layout extractor ─────────────────────────────────────────────────────────

export function extractLayout(htmls: string[]): string {
  // Find common <html>, <head>, <body> wrapper from first page
  const first = htmls[0];
  if (!first) return "<html><body>{children}</body></html>";

  const root = parseHtml(first, { parseNoneClosedTags: true });
  const head = root.querySelector("head");
  const bodyEl = root.querySelector("body");
  const bodyClass = bodyEl?.getAttribute("class") ?? "";
  const bodyStyle = bodyEl?.getAttribute("style") ?? "";

  const headContent = head
    ? head.childNodes
        .filter((n) => n.nodeType === NodeType.ELEMENT_NODE)
        .map((n) => {
          const el = n as HTMLElement;
          const tag = el.tagName?.toLowerCase() ?? "";
          if (["script", "title", "base"].includes(tag)) return "";
          return el.toString();
        })
        .filter(Boolean)
        .join("\n    ")
    : "";

  const bodyAttrs = [
    bodyClass ? `className="${bodyClass}"` : "",
    bodyStyle ? `style={${JSON.stringify(convertStyleString(bodyStyle))}}` : "",
  ]
    .filter(Boolean)
    .join(" ");

  return `export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        ${headContent}
      </head>
      <body${bodyAttrs ? " " + bodyAttrs : ""}>
        {children}
      </body>
    </html>
  );
}
`;
}

// ── Main converter ───────────────────────────────────────────────────────────

export function convertHtmlToJsx(
  html: string,
  assetManifest: AssetManifest,
  pageName: string
): string {
  // Reset extracted styles for this conversion
  extractedStyles = [];

  const root = parseHtml(html, { parseNoneClosedTags: true });

  // Find main content (body if present, else root)
  const body = root.querySelector("body") ?? root;

  const jsxBody = body.childNodes
    .map((node) => convertNode(node, assetManifest, false, 2))
    .filter((s) => s.trim() !== "")
    .join("\n");

  const componentName = pageName.replace(/[^a-zA-Z0-9]/g, "") + "Page";

  const parts = [
    `export function ${componentName}() {`,
    `  return (`,
    `    <>`,
    jsxBody,
    `    </>`,
    `  );`,
    `}`,
  ];

  if (extractedStyles.length > 0) {
    parts.unshift(`// Extracted inline styles:\n// ${extractedStyles.join("\n// ")}\n`);
  }

  return parts.join("\n");
}
