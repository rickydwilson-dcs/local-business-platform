"use client";

/**
 * ContentCheckout
 *
 * Content section: Checkout
 * Layout: contained
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
        <div className="max-w-3xl mx-auto">
          <RevealOnScroll variant="fade-up">
            <div className="bg-surface-foreground rounded-2xl shadow-lg overflow-hidden">
              {/* Header */}
              <div className="bg-brand-primary px-8 py-10 text-center">
                {props.heading && (
                  <h2 className="text-2xl md:text-3xl font-bold text-on-brand-primary">
                    {props.heading}
                  </h2>
                )}
              </div>
  
              {/* Body Content */}
              <div className="px-8 py-10">
                {props.body && (
                  <p className="text-surface-muted-foreground text-base md:text-lg leading-relaxed text-center">
                    {props.body}
                  </p>
                )}
  
                {/* Order Summary Placeholder */}
                <div className="mt-8 border border-surface-muted rounded-xl p-6 space-y-4">
                  <h3 className="text-surface-foreground font-semibold text-lg">
                    Order Summary
                  </h3>
                  <div className="flex justify-between items-center border-b border-surface-muted pb-3">
                    <span className="text-surface-muted-foreground text-sm">Subtotal</span>
                    <span className="text-surface-foreground font-medium text-sm">$0.00</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-surface-muted pb-3">
                    <span className="text-surface-muted-foreground text-sm">Shipping</span>
                    <span className="text-surface-foreground font-medium text-sm">Free</span>
                  </div>
                  <div className="flex justify-between items-center pt-1">
                    <span className="text-surface-foreground font-bold text-base">Total</span>
                    <span className="text-brand-primary font-bold text-base">$0.00</span>
                  </div>
                </div>
  
                {/* Form Fields */}
                <div className="mt-8 space-y-4">
                  <h3 className="text-surface-foreground font-semibold text-lg">
                    Billing Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-surface-muted-foreground text-sm font-medium">
                        First Name
                      </label>
                      <input
                        type="text"
                        placeholder="Jane"
                        className="border border-surface-muted rounded-lg px-4 py-2 text-surface-foreground bg-surface-background text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-surface-muted-foreground text-sm font-medium">
                        Last Name
                      </label>
                      <input
                        type="text"
                        placeholder="Doe"
                        className="border border-surface-muted rounded-lg px-4 py-2 text-surface-foreground bg-surface-background text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-surface-muted-foreground text-sm font-medium">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="jane@example.com"
                      className="border border-surface-muted rounded-lg px-4 py-2 text-surface-foreground bg-surface-background text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-surface-muted-foreground text-sm font-medium">
                      Card Number
                    </label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      className="border border-surface-muted rounded-lg px-4 py-2 text-surface-foreground bg-surface-background text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-surface-muted-foreground text-sm font-medium">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        placeholder="MM / YY"
                        className="border border-surface-muted rounded-lg px-4 py-2 text-surface-foreground bg-surface-background text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-surface-muted-foreground text-sm font-medium">
                        CVV
                      </label>
                      <input
                        type="text"
                        placeholder="123"
                        className="border border-surface-muted rounded-lg px-4 py-2 text-surface-foreground bg-surface-background text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                      />
                    </div>
                  </div>
                </div>
  
                {/* CTA Button */}
                <div className="mt-8">
                  <button
                    type="button"
                    className="w-full bg-brand-primary text-on-brand-primary font-semibold text-base py-3 px-6 rounded-xl hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2"
                  >
                    Complete Purchase
                  </button>
                </div>
  
                {/* Trust Indicators */}
                <p className="mt-4 text-center text-surface-muted-foreground text-xs">
                  🔒 Your payment is secured with 256-bit SSL encryption.
                </p>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    );
}
