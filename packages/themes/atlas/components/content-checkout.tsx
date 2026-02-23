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
            <div className="text-center mb-10">
              {props.heading && (
                <h2 className="text-3xl md:text-4xl font-bold text-surface-foreground mb-4">
                  {props.heading}
                </h2>
              )}
              {props.body && (
                <p className="text-surface-muted-foreground text-lg leading-relaxed">
                  {props.body}
                </p>
              )}
            </div>
          </RevealOnScroll>
  
          <RevealOnScroll variant="fade-up">
            <div className="bg-surface-foreground rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-brand-primary px-6 py-5">
                <h3 className="text-xl font-semibold text-on-brand-primary">
                  Order Summary
                </h3>
              </div>
  
              <div className="px-6 py-6 space-y-4">
                <div className="flex items-center justify-between border-b border-surface-muted pb-4">
                  <div>
                    <p className="text-surface-foreground font-medium">Product Name</p>
                    <p className="text-surface-muted-foreground text-sm">Qty: 1</p>
                  </div>
                  <span className="text-surface-foreground font-semibold">$99.00</span>
                </div>
  
                <div className="flex items-center justify-between border-b border-surface-muted pb-4">
                  <div>
                    <p className="text-surface-foreground font-medium">Shipping</p>
                    <p className="text-surface-muted-foreground text-sm">Standard delivery</p>
                  </div>
                  <span className="text-surface-foreground font-semibold">$5.00</span>
                </div>
  
                <div className="flex items-center justify-between pt-2">
                  <p className="text-surface-foreground text-lg font-bold">Total</p>
                  <span className="text-brand-primary text-lg font-bold">$104.00</span>
                </div>
              </div>
  
              <div className="px-6 pb-6 space-y-4">
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-surface-foreground"
                  >
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 rounded-lg border border-surface-muted bg-surface-background text-surface-foreground placeholder:text-surface-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  />
                </div>
  
                <div className="space-y-2">
                  <label
                    htmlFor="card"
                    className="block text-sm font-medium text-surface-foreground"
                  >
                    Card Number
                  </label>
                  <input
                    id="card"
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-4 py-3 rounded-lg border border-surface-muted bg-surface-background text-surface-foreground placeholder:text-surface-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  />
                </div>
  
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="expiry"
                      className="block text-sm font-medium text-surface-foreground"
                    >
                      Expiry Date
                    </label>
                    <input
                      id="expiry"
                      type="text"
                      placeholder="MM / YY"
                      className="w-full px-4 py-3 rounded-lg border border-surface-muted bg-surface-background text-surface-foreground placeholder:text-surface-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="cvv"
                      className="block text-sm font-medium text-surface-foreground"
                    >
                      CVV
                    </label>
                    <input
                      id="cvv"
                      type="text"
                      placeholder="123"
                      className="w-full px-4 py-3 rounded-lg border border-surface-muted bg-surface-background text-surface-foreground placeholder:text-surface-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    />
                  </div>
                </div>
  
                <button
                  type="button"
                  className="w-full bg-brand-primary text-on-brand-primary font-semibold py-4 rounded-lg hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 mt-2"
                >
                  Complete Purchase
                </button>
  
                <p className="text-center text-surface-muted-foreground text-sm">
                  Your payment is secured with 256-bit SSL encryption.
                </p>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    );
}
