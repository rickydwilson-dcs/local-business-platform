/**
 * Accent Underline Component
 *
 * Adds a colored underline to specific words or phrases in headings.
 * Useful for emphasizing key terms with brand color accent.
 *
 * @example
 * <AccentUnderline>Latest Useful News</AccentUnderline>
 * // Renders: Latest <span className="accent-underline">Useful</span> News
 */

import React from "react";

export interface AccentUnderlineProps {
  /**
   * The text content with optional markup for which word(s) to underline
   * Use double asterisks ** ** to mark text for underlining
   * Example: "Latest **Useful** News"
   */
  children: string;
  /**
   * HTML tag to render as (h1, h2, h3, p, span, etc.)
   * @default 'h2'
   */
  as?: React.ElementType;
  /**
   * Additional CSS classes for the container element
   */
  className?: string;
  /**
   * Thickness of the underline in pixels
   * @default 4
   */
  underlineThickness?: number;
  /**
   * Offset of the underline from text baseline in pixels
   * @default 8
   */
  underlineOffset?: number;
}

/**
 * Parse text with **marked** sections and convert to React elements
 */
const parseText = (
  text: string,
  underlineThickness: number,
  underlineOffset: number
): React.ReactNode[] => {
  // Split by ** markers
  const parts = text.split(/\*\*(.*?)\*\*/g);

  return parts.map((part, index) => {
    // Every odd index is the content between ** **
    if (index % 2 === 1) {
      return (
        <span
          key={index}
          className="accent-underline underline decoration-[var(--color-brand-primary)]"
          style={{
            textDecorationThickness: `${underlineThickness}px`,
            textUnderlineOffset: `${underlineOffset}px`,
          }}
        >
          {part}
        </span>
      );
    }
    // Even indexes are regular text
    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
};

export const AccentUnderline: React.FC<AccentUnderlineProps> = ({
  children,
  as: Component = "h2",
  className = "",
  underlineThickness = 4,
  underlineOffset = 8,
}) => {
  const parsedContent = parseText(children, underlineThickness, underlineOffset);

  return <Component className={className}>{parsedContent}</Component>;
};

