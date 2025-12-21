# MDX Content Styling Session

**Date:** 2025-12-17
**Objective:** Document MDX body content elements for future restyling
**Status:** Initial styling complete, may need refinement

---

## Overview

The service pages now render MDX body content through custom components defined in `mdx-components.tsx`. This content appears in a dedicated section on each service page.

## File Locations

| File                                                    | Purpose                                |
| ------------------------------------------------------- | -------------------------------------- |
| `sites/colossus-reference/mdx-components.tsx`           | Custom MDX element renderers           |
| `sites/colossus-reference/app/services/[slug]/page.tsx` | Service page template (line 300-304)   |
| `sites/colossus-reference/content/services/*.mdx`       | 25 service MDX files with body content |

---

## MDX Content Section Location

In `app/services/[slug]/page.tsx`, the MDX body content renders at **line 300-304**:

```tsx
{
  /* MDX Body Content - Process sections, location grids, related services */
}
<section className="section-standard bg-white">
  <div className="container-standard">
    <div>{mdxContent}</div>
  </div>
</section>;
```

This section appears between:

- **Above:** `<ServiceAbout>` component
- **Below:** `<ServiceBenefits>` component

---

## MDX Elements & Current Styling

### 1. H2 - Section Heading

**Usage:** Main section titles in MDX body (e.g., "Safe, Reliable Access for Every Project")

```tsx
h2: (p) => (
  <h2 className={`text-2xl sm:text-3xl font-bold text-gray-900 mt-12 mb-6 ${p.className || ""}`}>
    {p.children}
  </h2>
);
```

**Current Classes:**

- `text-2xl sm:text-3xl` - Responsive font size
- `font-bold` - Bold weight
- `text-gray-900` - Dark gray color (NOT blue)
- `mt-12 mb-6` - Top/bottom margins

---

### 2. H3 - Subsection Heading

**Usage:** Smaller section headings within MDX

```tsx
h3: (p) => (
  <h3 className={`text-xl font-semibold text-gray-900 mt-8 mb-4 ${p.className || ""}`}>
    {p.children}
  </h3>
);
```

**Current Classes:**

- `text-xl` - Medium-large font
- `font-semibold` - Semi-bold weight
- `text-gray-900` - Dark gray
- `mt-8 mb-4` - Margins

---

### 3. Paragraph (p)

**Usage:** Body text throughout MDX content

```tsx
p: (p) => <p className={`text-gray-700 leading-relaxed my-4 ${p.className || ""}`}>{p.children}</p>;
```

**Current Classes:**

- `text-gray-700` - Medium gray text
- `leading-relaxed` - 1.625 line height
- `my-4` - Vertical margins

---

### 4. Unordered List (ul)

**Usage:** Bullet lists, feature lists, benefit lists

```tsx
ul: (p) => <ul className={`space-y-3 my-6 ${p.className || ""}`}>{p.children}</ul>;
```

**Current Classes:**

- `space-y-3` - 12px gap between items
- `my-6` - Vertical margins

---

### 5. Ordered List (ol)

**Usage:** Numbered process steps (e.g., "How Our Process Works")

```tsx
ol: (p) => (
  <ol className={`space-y-4 my-6 ${p.className || ""}`} style={{ counterReset: "item" }}>
    {p.children}
  </ol>
);
```

**Current Classes:**

- `space-y-4` - 16px gap between items
- `my-6` - Vertical margins
- CSS counter reset (not currently used for numbering)

---

### 6. List Item (li)

**Usage:** Individual items in both ul and ol lists

```tsx
li: (p) => (
  <li className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg list-none">
    <div className="flex-shrink-0 w-2 h-2 bg-brand-blue rounded-full mt-2" />
    <div className="text-gray-800">{p.children}</div>
  </li>
);
```

**Current Classes:**

- Container: `flex items-start gap-3 p-4 bg-gray-50 rounded-lg list-none`
- Icon: `flex-shrink-0 w-2 h-2 bg-brand-blue rounded-full mt-2` (8px blue dot)
- Text: `text-gray-800`

**Note:** Both ul and ol use the same li styling (blue dot). Consider different styling for ordered lists (numbered badges).

---

### 7. Link (a)

**Usage:** Internal and external links within MDX content

```tsx
a: (props) => {
  const href = typeof props.href === "string" ? props.href : "";
  const isInternal = href.startsWith("/");
  // Returns <Link> for internal, <a> for external
  // Both use same classes
};
```

**Current Classes:**

- `text-brand-blue` - Blue color (#005A9E)
- `hover:text-brand-blue-hover` - Hover state
- `font-medium` - Medium weight
- `underline underline-offset-2` - Underline with offset
- `transition-colors` - Smooth color transition

---

### 8. Strong/Bold (strong)

**Usage:** Bold text within paragraphs

```tsx
strong: (p) => (
  <strong className={`font-semibold text-gray-900 ${p.className || ""}`}>{p.children}</strong>
);
```

**Current Classes:**

- `font-semibold` - Semi-bold weight
- `text-gray-900` - Dark gray (darker than surrounding text)

---

### 9. Horizontal Rule (hr)

**Usage:** Section dividers

```tsx
hr: () => <hr className="my-10 border-t border-gray-200" />;
```

**Current Classes:**

- `my-10` - Large vertical margins
- `border-t border-gray-200` - Light gray top border

---

### 10. Image (img)

**Usage:** Images embedded in MDX

```tsx
img: (p) => {
  const { src = "", alt = "", width, height, ...rest } = p;
  const w = typeof width === "number" ? width : 1200;
  const h = typeof height === "number" ? height : 800;
  return (
    <Image
      src={src}
      alt={alt}
      width={w}
      height={h}
      {...rest}
      className={`rounded-xl ${p.className || ""}`}
    />
  );
};
```

**Current Classes:**

- `rounded-xl` - Large border radius

---

## Example MDX Content Structure

From `content/services/access-scaffolding.mdx`:

```mdx
## Safe, Reliable Access for Every Project

Whether you're undertaking routine maintenance...

## Why Choose Our Access Scaffolding?

- **TG20:21 Compliant Design** - All our scaffolding...
- **CISRS Qualified Teams** - Our scaffolders hold...
- **Comprehensive Insurance** - £10 million public...

## How Our Process Works

1. **Free Site Survey** - We assess your project...
2. **Custom Design** - Our team creates...
3. **Professional Installation** - CISRS qualified...

## Access Scaffolding Across the South East

We provide professional access scaffolding throughout...

[Brighton](/locations/brighton) | [Eastbourne](/locations/eastbourne) | ...

## Related Services

- [Residential Scaffolding](/services/residential-scaffolding)
- [Commercial Scaffolding](/services/commercial-scaffolding-brighton)
```

---

## Styling Considerations for Future Updates

### Current Issues to Address

1. **Ordered lists show dots instead of numbers** - Process steps ("1. Free Site Survey") render with blue dots, not numbered badges

2. **No visual hierarchy between ul/ol** - Both list types look identical

3. **Link sections could be improved** - Location grids and related services could benefit from card-based layouts

### Suggested Improvements

| Element         | Current       | Suggested                   |
| --------------- | ------------- | --------------------------- |
| `ol > li`       | Blue dot      | Numbered badge (1, 2, 3...) |
| `ul` with links | Text list     | Card grid layout            |
| Process steps   | Single column | Could add icons per step    |

### CSS Classes Reference

Key Tailwind utilities used:

- `text-gray-900` / `text-gray-800` / `text-gray-700` - Text colors
- `bg-gray-50` - Light background for cards
- `bg-brand-blue` - Primary blue (#005A9E)
- `rounded-lg` / `rounded-xl` - Border radius
- `space-y-*` - Vertical spacing
- `leading-relaxed` - Line height

---

## Related Files

- `sites/colossus-reference/app/globals.css` - Base styles, utility classes
- `sites/colossus-reference/components/ui/service-benefits.tsx` - Similar card styling pattern
- `sites/colossus-reference/components/ui/coverage-areas.tsx` - Similar list styling pattern

---

**Next Steps:** When restyling, modify `mdx-components.tsx` and test on `/services/access-scaffolding` page.
