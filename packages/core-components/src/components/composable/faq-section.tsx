import { FAQItem } from "./faq-item";
import type { LayoutParams } from "./layout-params";

export interface FAQSectionSlots {
  showSectionHeading: boolean;
  showPhonePrompt: boolean;
}

export const FAQ_SECTION_DEFAULT_SLOTS: FAQSectionSlots = {
  showSectionHeading: true,
  showPhonePrompt: false,
};

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  slots?: Partial<FAQSectionSlots>;
  layout?: Pick<LayoutParams, "background">;
  data: Record<string, unknown>;
  className?: string;
}

export function FAQSection({ slots: slotOverrides, layout, data, className }: FAQSectionProps) {
  const slots = { ...FAQ_SECTION_DEFAULT_SLOTS, ...slotOverrides };

  const heading = typeof data.heading === "string" ? data.heading : undefined;
  const faqs: FAQItem[] = Array.isArray(data.faqs)
    ? (data.faqs as FAQItem[]).filter(
        (f) => f && typeof f.question === "string" && typeof f.answer === "string"
      )
    : [];
  const phoneDisplay = typeof data.phoneDisplay === "string" ? data.phoneDisplay : undefined;
  const phoneTel = typeof data.phoneTel === "string" ? data.phoneTel : undefined;

  const bg =
    layout?.background === "inverse"
      ? "bg-surface-inverse text-surface-inverse-foreground"
      : layout?.background === "brand"
        ? "bg-brand-primary text-brand-on-primary"
        : layout?.background === "subtle"
          ? "bg-surface-subtle text-surface-foreground"
          : "bg-surface-background text-surface-foreground";

  return (
    <section className={`${bg} ${className ?? ""}`} data-component="FAQSection">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        {slots.showSectionHeading && heading && (
          <h2 data-slot="heading" className="text-h2 mb-10 text-center">
            {heading}
          </h2>
        )}

        {faqs.length > 0 && (
          <div data-slot="faqs" className="divide-y divide-surface-border">
            {faqs.map((faq, i) => (
              <FAQItem key={i} question={faq.question} answer={faq.answer} index={i} />
            ))}
          </div>
        )}

        {slots.showPhonePrompt && phoneTel && (
          <div data-slot="phonePrompt" className="mt-12 text-center">
            <p className="text-surface-foreground text-lg">
              Still have questions?{" "}
              <a
                href={`tel:${phoneTel}`}
                className="text-brand-primary hover:text-brand-primary-hover font-semibold underline-offset-4 hover:underline"
              >
                Call {phoneDisplay ?? phoneTel}
              </a>
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
