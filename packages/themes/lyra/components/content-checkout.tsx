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
  
              {/* Body */}
              <div className="px-8 py-10">
                {props.body && (
                  <p className="text-surface-muted-foreground text-base md:text-lg leading-relaxed mb-8 text-center">
                    {props.body}
                  </p>
                )}
  
                {/* Order Summary Placeholder */}
                <div className="border border-surface-muted rounded-xl p-6 mb-6">
                  <h3 className="text-surface-foreground font-semibold text-lg mb-4">
                    Order Summary
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex justify-between items-center">
                      <span className="text-surface-muted-foreground text-sm">Item subtotal</span>
                      <span className="text-surface-foreground font-medium text-sm">$0.00</span>
                    </li>
                    <li className="flex justify-between items-center">
                      <span className="text-surface-muted-foreground text-sm">Shipping</span>
                      <span className="text-surface-foreground font-medium text-sm">$0.00</span>
                    </li>
                    <li className="flex justify-between items-center">
                      <span className="text-surface-muted-foreground text-sm">Tax</span>
                      <span className="text-surface-foreground font-medium text-sm">$0.00</span>
                    </li>
                  </ul>
                  <div className="border-t border-surface-muted mt-4 pt-4 flex justify-between items-center">
                    <span className="text-surface-foreground font-bold text-base">Total</span>
                    <span className="text-brand-primary font-bold text-xl">$0.00</span>
                  </div>
                </div>
  
                {/* Payment Form Placeholder */}
                <div className="space-y-4 mb-8">
                  <div>
                    <label className="block text-surface-foreground text-sm font-medium mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="Jane Doe"
                      className="w-full border border-surface-muted rounded-lg px-4 py-3 text-surface-foreground bg-surface-background placeholder:text-surface-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-primary text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-surface-foreground text-sm font-medium mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="jane@example.com"
                      className="w-full border border-surface-muted rounded-lg px-4 py-3 text-surface-foreground bg-surface-background placeholder:text-surface-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-primary text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-surface-foreground text-sm font-medium mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      className="w-full border border-surface-muted rounded-lg px-4 py-3 text-surface-foreground bg-surface-background placeholder:text-surface-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-primary text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-surface-foreground text-sm font-medium mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        placeholder="MM / YY"
                        className="w-full border border-surface-muted rounded-lg px-4 py-3 text-surface-foreground bg-surface-background placeholder:text-surface-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-primary text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-surface-foreground text-sm font-medium mb-1">
                        CVV
                      </label>
                      <input
                        type="text"
                        placeholder="123"
                        className="w-full border border-surface-muted rounded-lg px-4 py-3 text-surface-foreground bg-surface-background placeholder:text-surface-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-primary text-sm"
                      />
                    </div>
                  </div>
                </div>
  
                {/* CTA Button */}
                <button
                  type="button"
                  className="w-full bg-brand-primary text-on-brand-primary font-semibold text-base py-4 rounded-xl hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2"
                >
                  Complete Purchase
                </button>
  
                <p className="text-center text-surface-muted-foreground text-xs mt-4">
                  Your payment is secured with end-to-end encryption.
                </p>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    );
}
