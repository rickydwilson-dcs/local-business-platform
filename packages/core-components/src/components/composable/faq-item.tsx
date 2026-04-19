"use client";

import { useState } from "react";

interface FAQItemProps {
  question: string;
  answer: string;
  index: number;
}

export function FAQItem({ question, answer, index }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const panelId = `faq-panel-${index}`;
  const buttonId = `faq-button-${index}`;

  return (
    <div className="py-5">
      <button
        id={buttonId}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="text-surface-foreground flex w-full cursor-pointer items-center justify-between gap-4 text-left text-lg font-semibold"
      >
        <span>{question}</span>
        <span
          aria-hidden="true"
          className={`text-brand-primary flex-shrink-0 text-2xl leading-none transition-transform duration-200 ${isOpen ? "rotate-45" : ""}`}
        >
          +
        </span>
      </button>
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        className={`overflow-hidden transition-all duration-200 ${isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div className="text-surface-muted-foreground mt-3 leading-relaxed">{answer}</div>
      </div>
    </div>
  );
}
