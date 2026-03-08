/**
 * ESLint rule: no-hardcoded-tailwind-colors
 *
 * Bans hardcoded Tailwind color-scale classes in JSX className attributes.
 * Use theme tokens instead (e.g., bg-brand-primary, text-surface-foreground).
 *
 * Does not catch dynamically constructed className values (cn(), template literal expressions).
 * Covers string literals and template literal static parts.
 *
 * See docs/standards/styling.md for the token reference.
 */

const BANNED_COLOR_PATTERN =
  /\b(text|bg|border|ring|outline|shadow|from|via|to|divide|accent|caret|fill|stroke|decoration)-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d{1,3}\b/g;

/** @type {import("eslint").Rule.RuleModule} */
const rule = {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Disallow hardcoded Tailwind color-scale classes in JSX className attributes. Use theme tokens instead.",
      url: "docs/standards/styling.md",
    },
    messages: {
      noHardcodedColor:
        "Hardcoded Tailwind color class '{{class}}' found. Use theme tokens instead (e.g., bg-brand-primary, text-surface-foreground). See docs/standards/styling.md.",
    },
    schema: [],
  },

  create(context) {
    function checkClassString(node, value) {
      const matches = [...value.matchAll(BANNED_COLOR_PATTERN)];
      for (const match of matches) {
        context.report({
          node,
          messageId: "noHardcodedColor",
          data: { class: match[0] },
        });
      }
    }

    return {
      "JSXAttribute[name.name='className']"(node) {
        const { value } = node;
        if (!value) return;

        // className="some-class text-gray-500 ..."
        if (value.type === "Literal" && typeof value.value === "string") {
          checkClassString(value, value.value);
          return;
        }

        // className={`some-class text-gray-500 ${dynamic}`}
        if (
          value.type === "JSXExpressionContainer" &&
          value.expression.type === "TemplateLiteral"
        ) {
          for (const quasi of value.expression.quasis) {
            checkClassString(quasi, quasi.value.raw);
          }
        }
      },
    };
  },
};

export default rule;
