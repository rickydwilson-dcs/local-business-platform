/**
 * Content Stripper
 *
 * Pattern-based replacement of business-specific content (text, images)
 * in converted JSX files with component props. Auto-generates TypeScript
 * props interfaces.
 */

// ── Types ────────────────────────────────────────────────────────────────────

export interface ContentStrippingConfig {
  businessName: string;
  phone?: string;
  email?: string;
  address?: { city: string; postcode: string };
}

export interface StrippedComponent {
  tsx: string;
  propsInterface: string;
  propCount: number;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function phonePattern(phone: string): RegExp {
  // Match the raw digits of the phone number with optional separators
  const digits = phone.replace(/\D/g, "");
  if (!digits) return /(?!)/; // never matches
  // Allow spaces, dashes, dots between digit groups
  const flexible = digits.split("").join("[\\s\\-\\.\\(\\)]*");
  return new RegExp(`[\\+\\(]?${flexible}[\\s\\-\\.\\(\\)]*(?:\\d[\\s\\-\\.]*)*`, "g");
}

// ── Prop name generator ──────────────────────────────────────────────────────

class PropNameGenerator {
  private used = new Map<string, number>();

  get(base: string): string {
    const count = this.used.get(base) ?? 0;
    this.used.set(base, count + 1);
    if (count === 0) return base;
    // Generate suffixes: heading → sectionTitle → subheading → heading2 ...
    const suffixes: Record<string, string[]> = {
      heading: ["sectionTitle", "subheading", "cardHeading"],
      body: ["description", "bodyText", "paragraph"],
      imageSrc: ["heroImageSrc", "cardImageSrc", "sectionImageSrc"],
    };
    const altList = suffixes[base];
    if (altList && altList[count - 1]) return altList[count - 1];
    return `${base}${count + 1}`;
  }
}

// ── Tag content replacer ─────────────────────────────────────────────────────

function replaceTagContent(
  jsx: string,
  tagPattern: RegExp,
  propName: string,
  props: Record<string, string>
): string {
  return jsx.replace(tagPattern, (match, _open, content, _close) => {
    const trimmed = content.trim();
    // Skip if already a prop reference, empty, or very short label
    if (trimmed.startsWith("{props.") || trimmed.length === 0 || trimmed.length < 20) {
      return match;
    }
    props[propName] = "string";
    return match.replace(content, `{props.${propName}}`);
  });
}

// ── Main ─────────────────────────────────────────────────────────────────────

export function stripContent(jsx: string, config: ContentStrippingConfig): StrippedComponent {
  let result = jsx;
  const props: Record<string, string> = {}; // propName → TypeScript type
  const nameGen = new PropNameGenerator();

  // 1. Business name — case-insensitive exact match
  if (config.businessName) {
    const nameRe = new RegExp(escapeRegex(config.businessName), "gi");
    if (nameRe.test(result)) {
      result = result.replace(nameRe, `{props.businessName}`);
      props["businessName"] = "string";
    }
  }

  // 2. Phone number
  if (config.phone) {
    const phoneRe = phonePattern(config.phone);
    if (phoneRe.test(result)) {
      result = result.replace(phoneRe, `{props.phone}`);
      props["phone"] = "string";
    }
  }

  // 3. Email
  if (config.email) {
    const emailRe = new RegExp(escapeRegex(config.email), "gi");
    if (emailRe.test(result)) {
      result = result.replace(emailRe, `{props.email}`);
      props["email"] = "string";
    }
  }
  // Also replace any generic email pattern near the configured one
  const genericEmailRe = /[\w.+-]+@[\w-]+\.[a-zA-Z]{2,}/g;
  if (genericEmailRe.test(result) && config.email) {
    result = result.replace(/[\w.+-]+@[\w-]+\.[a-zA-Z]{2,}/g, `{props.email}`);
    props["email"] = "string";
  }

  // 4. Address — city and postcode
  if (config.address) {
    if (config.address.city) {
      const cityRe = new RegExp(escapeRegex(config.address.city), "gi");
      if (cityRe.test(result)) {
        result = result.replace(cityRe, `{props.addressCity}`);
        props["addressCity"] = "string";
      }
    }
    if (config.address.postcode) {
      const postcodeRe = new RegExp(escapeRegex(config.address.postcode), "gi");
      if (postcodeRe.test(result)) {
        result = result.replace(postcodeRe, `{props.addressPostcode}`);
        props["addressPostcode"] = "string";
      }
    }
  }

  // 5. Headings — h1 through h6
  for (const tag of ["h1", "h2", "h3", "h4", "h5", "h6"]) {
    // Match opening tag (with optional attrs), content, closing tag
    const tagRe = new RegExp(`(<${tag}(?:\\s[^>]*)?>)([\\s\\S]*?)(<\\/${tag}>)`, "gi");
    result = result.replace(tagRe, (match, open, content, close) => {
      const trimmed = content.trim();
      if (
        trimmed.startsWith("{props.") ||
        trimmed.length === 0 ||
        trimmed.length < 3 ||
        trimmed.startsWith("<") // nested elements
      ) {
        return match;
      }
      const base = tag === "h1" ? "heading" : "sectionTitle";
      const propName = nameGen.get(base);
      props[propName] = "string";
      return `${open}{props.${propName}}${close}`;
    });
  }

  // 6. Long paragraphs (>50 chars of text content)
  const pRe = /(<p(?:\s[^>]*)?>)([\s\S]*?)(<\/p>)/gi;
  result = result.replace(pRe, (match, open, content, close) => {
    const textContent = content.replace(/<[^>]+>/g, "").trim();
    if (
      textContent.startsWith("{props.") ||
      textContent.length <= 50 ||
      textContent.startsWith("<")
    ) {
      return match;
    }
    const propName = nameGen.get("body");
    props[propName] = "string";
    return `${open}{props.${propName}}${close}`;
  });

  // 7. Image src pointing to assets/images/
  const imgRe = /(<img(?:\s[^>]*)?\ssrc=")([^"]*assets\/images\/[^"]*)(")/gi;
  result = result.replace(imgRe, (match, pre, _src, post) => {
    const propName = nameGen.get("imageSrc");
    props[propName] = "string";
    return `${pre}{props.${propName} as string}${post}`.replace(
      `${pre}{props.${propName} as string}${post}`,
      (_, ...__) => `${pre.replace(/"$/, "{")}props.${propName}${post.replace(/^"/, "}")}`
    );
  });
  // Simpler rewrite: replace src="...assets/images/..." with src={props.imageSrc}
  result = result.replace(/src="[^"]*assets\/images\/[^"]*"/gi, () => {
    const propName = nameGen.get("imageSrc");
    props[propName] = "string";
    return `src={props.${propName}}`;
  });

  // Remove duplicate props that may have been added above
  const dedupedProps = { ...props };

  // Build props interface
  const propCount = Object.keys(dedupedProps).length;
  const interfaceLines = Object.entries(dedupedProps).map(([name, type]) => `  ${name}: ${type};`);
  const propsInterface =
    propCount > 0
      ? `interface ComponentProps {\n${interfaceLines.join("\n")}\n}`
      : "interface ComponentProps {}";

  return { tsx: result, propsInterface, propCount };
}
