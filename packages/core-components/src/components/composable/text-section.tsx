import { CheckCircle2 } from "lucide-react";

export interface TextSectionSlots {
  showToc: boolean;
  showLastUpdated: boolean;
}

export const TEXT_SECTION_DEFAULT_SLOTS: TextSectionSlots = {
  showToc: true,
  showLastUpdated: true,
};

interface TextSectionLayout {
  background?: "surface" | "subtle";
  maxWidth?: "prose" | "wide";
}

interface TextSectionItem {
  label?: string;
  value?: string;
  description?: string;
  color?: "blue" | "green" | "purple" | "amber";
}

interface TextSectionBlock {
  id?: string;
  heading: string;
  body?: string;
  type?: "prose" | "list" | "callout-grid" | "table" | "numbered-grid" | "two-col";
  items?: TextSectionItem[];
}

interface TocEntry {
  id: string;
  label: string;
}

interface TextSectionProps {
  slots?: Partial<TextSectionSlots>;
  layout?: TextSectionLayout;
  data: Record<string, unknown>;
  className?: string;
}

const CALLOUT_COLOR_MAP: Record<NonNullable<TextSectionItem["color"]>, string> = {
  blue: "bg-blue-50 border-l-4 border-blue-500",
  green: "bg-green-50 border-l-4 border-green-500",
  purple: "bg-purple-50 border-l-4 border-purple-500",
  amber: "bg-amber-50 border-l-4 border-amber-500",
};

function formatLastUpdated(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return iso;
  }
  const formatted = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
  return `Last updated: ${formatted}`;
}

function renderSection(section: TextSectionBlock, index: number) {
  const type = section.type ?? "prose";
  const items = section.items ?? [];
  const headingId = section.id;

  if (type === "list") {
    return (
      <section key={index} className="mb-12">
        <h2 id={headingId} className="heading-section">
          {section.heading}
        </h2>
        <ul className="space-y-3">
          {items.map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <CheckCircle2
                className="text-brand-primary mt-1 h-5 w-5 flex-shrink-0"
                aria-hidden="true"
              />
              <span>{item.label}</span>
            </li>
          ))}
        </ul>
      </section>
    );
  }

  if (type === "callout-grid") {
    return (
      <section key={index} className="mb-12">
        <h2 id={headingId} className="heading-section mb-6">
          {section.heading}
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {items.map((item, i) => {
            const colorClasses = item.color
              ? CALLOUT_COLOR_MAP[item.color]
              : "bg-surface-subtle border-l-4 border-brand-primary";
            return (
              <div key={i} className={`rounded-lg p-4 ${colorClasses}`}>
                {item.label && <p className="font-semibold">{item.label}</p>}
                {item.description && <p className="text-caption mt-1">{item.description}</p>}
              </div>
            );
          })}
        </div>
      </section>
    );
  }

  if (type === "table") {
    return (
      <section key={index} className="mb-12">
        <h2 id={headingId} className="heading-section mb-6">
          {section.heading}
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <tbody>
              {items.map((item, i) => (
                <tr key={i} className={i % 2 === 1 ? "bg-surface-subtle" : ""}>
                  <th scope="row" className="px-4 py-3 font-medium">
                    {item.label}
                  </th>
                  <td className="px-4 py-3">{item.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    );
  }

  if (type === "numbered-grid") {
    return (
      <section key={index} className="mb-12">
        <h2 id={headingId} className="heading-section mb-6">
          {section.heading}
        </h2>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
          {items.map((item, i) => (
            <div key={i}>
              <div className="text-caption bg-brand-primary text-brand-on-primary mb-3 flex h-8 w-8 items-center justify-center rounded-full font-semibold">
                {i + 1}
              </div>
              {item.label && <p className="mb-1 font-semibold">{item.label}</p>}
              {item.description && (
                <p className="text-caption text-surface-muted-foreground">{item.description}</p>
              )}
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (type === "two-col") {
    return (
      <section key={index} className="mb-12">
        <h2 id={headingId} className="heading-section mb-6">
          {section.heading}
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {items.map((item, i) => (
            <div key={i} className="border-surface-border rounded-lg border p-4">
              {item.label && <p className="mb-2 font-semibold">{item.label}</p>}
              {item.description && (
                <p className="text-caption text-surface-muted-foreground">{item.description}</p>
              )}
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section key={index} className="mb-12">
      <h2 id={headingId} className="text-h2 mb-4">
        {section.heading}
      </h2>
      {section.body && <p className="text-body text-surface-muted-foreground">{section.body}</p>}
    </section>
  );
}

export function TextSection({ slots: slotOverrides, layout, data, className }: TextSectionProps) {
  const slots = { ...TEXT_SECTION_DEFAULT_SLOTS, ...slotOverrides };

  const heading = typeof data.heading === "string" ? data.heading : "";
  const lastUpdated = typeof data.lastUpdated === "string" ? data.lastUpdated : undefined;
  const intro = typeof data.intro === "string" ? data.intro : undefined;
  const sections = Array.isArray(data.sections) ? (data.sections as TextSectionBlock[]) : [];
  const tableOfContents = Array.isArray(data.tableOfContents)
    ? (data.tableOfContents as TocEntry[])
    : [];

  const bg =
    layout?.background === "subtle"
      ? "bg-surface-subtle text-surface-foreground"
      : "bg-surface-background text-surface-foreground";

  const maxWidth = layout?.maxWidth === "wide" ? "max-w-6xl" : "max-w-4xl";

  return (
    <article className={`${bg} ${className ?? ""}`} data-component="TextSection">
      <div className={`mx-auto ${maxWidth} px-6 py-16 md:py-24`}>
        {heading && (
          <h1 data-slot="heading" className="heading-hero mb-4">
            {heading}
          </h1>
        )}
        {slots.showLastUpdated && lastUpdated && (
          <p data-slot="lastUpdated" className="text-body-sm text-surface-muted-foreground mb-8">
            {formatLastUpdated(lastUpdated)}
          </p>
        )}
        {slots.showToc && tableOfContents.length > 0 && (
          <nav
            data-slot="toc"
            aria-label="Table of contents"
            className="bg-surface-subtle mb-10 rounded-lg p-6"
          >
            <p className="text-eyebrow mb-3">Contents</p>
            <ol className="list-decimal space-y-2 pl-5">
              {tableOfContents.map((entry) => (
                <li key={entry.id}>
                  <a href={`#${entry.id}`} className="text-brand-primary hover:underline">
                    {entry.label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        )}
        {intro && (
          <p data-slot="intro" className="text-body text-surface-muted-foreground mb-10">
            {intro}
          </p>
        )}
        {sections.map((section, i) => renderSection(section, i))}
      </div>
    </article>
  );
}
