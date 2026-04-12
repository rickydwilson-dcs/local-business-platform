"use client";

/**
 * ContentCheckout
 *
 * Checkout content area with heading and form body for ticket purchase flow
 * Layout: Contained single-column block with heading and checkout form body
 * Category: Content
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/components/animation";

export interface ContentCheckoutProps {
  /** heading */
  heading?: string;
  /** body */
  body?: string;
}

export function ContentCheckout(props: ContentCheckoutProps) {
  return (
    <section className="bg-surface-background py-16 px-4">
      <div className="max-w-2xl mx-auto">
        <RevealOnScroll variant="fade-up">
          {props.heading && (
            <h1 className="text-3xl md:text-4xl font-bold text-surface-foreground mb-8 text-center">
              {props.heading}
            </h1>
          )}
        </RevealOnScroll>

        <RevealOnScroll variant="fade-up">
          <div className="bg-surface-foreground rounded-2xl shadow-md p-8 md:p-12">
            {props.body ? (
              <div className="text-surface-muted-foreground text-base leading-relaxed">
                {props.body}
              </div>
            ) : (
              <form className="space-y-6" noValidate>
                <div className="space-y-1">
                  <label
                    htmlFor="full-name"
                    className="block text-sm font-medium text-surface-foreground"
                  >
                    Full Name
                  </label>
                  <input
                    id="full-name"
                    type="text"
                    autoComplete="name"
                    placeholder="Jane Smith"
                    className="w-full rounded-lg border border-surface-muted bg-surface-background text-surface-foreground placeholder:text-surface-muted-foreground px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary transition"
                  />
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-surface-foreground"
                  >
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="jane@example.com"
                    className="w-full rounded-lg border border-surface-muted bg-surface-background text-surface-foreground placeholder:text-surface-muted-foreground px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary transition"
                  />
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="ticket-type"
                    className="block text-sm font-medium text-surface-foreground"
                  >
                    Ticket Type
                  </label>
                  <select
                    id="ticket-type"
                    className="w-full rounded-lg border border-surface-muted bg-surface-background text-surface-foreground px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary transition"
                  >
                    <option value="">Select a ticket</option>
                    <option value="general">General Admission</option>
                    <option value="vip">VIP</option>
                    <option value="early-bird">Early Bird</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="quantity"
                    className="block text-sm font-medium text-surface-foreground"
                  >
                    Quantity
                  </label>
                  <input
                    id="quantity"
                    type="number"
                    min={1}
                    max={10}
                    defaultValue={1}
                    className="w-full rounded-lg border border-surface-muted bg-surface-background text-surface-foreground px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary transition"
                  />
                </div>

                <div className="pt-2 border-t border-surface-muted flex items-center justify-between">
                  <span className="text-sm text-surface-muted-foreground">
                    Order total calculated at next step
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full bg-brand-primary text-on-brand-primary font-semibold rounded-lg py-3 px-6 text-sm hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 transition"
                >
                  Proceed to Payment
                </button>
              </form>
            )}
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
