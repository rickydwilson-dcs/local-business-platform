"use client";

/**
 * ContentPrivacyPolicy
 *
 * Content section: Privacy Policy
 * Layout: contained
 * Category: Content
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/components/animation";

export interface ContentPrivacyPolicyProps {
  /** heading */
  heading?: string;
  /** body */
  body?: string;
}

export function ContentPrivacyPolicy(props: ContentPrivacyPolicyProps) {
  return (
      <section className="bg-surface-background py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <RevealOnScroll variant="fade-up">
            <h1 className="text-3xl md:text-4xl font-bold text-surface-foreground mb-6">
              {props.heading ?? "Privacy Policy"}
            </h1>
          </RevealOnScroll>
  
          <RevealOnScroll variant="fade-up">
            <div className="prose prose-neutral max-w-none text-surface-foreground">
              {props.body ? (
                <p className="text-base md:text-lg leading-relaxed text-surface-foreground">
                  {props.body}
                </p>
              ) : (
                <>
                  <p className="text-base md:text-lg leading-relaxed text-surface-foreground mb-6">
                    Your privacy is important to us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services. Please read this policy carefully to understand our views and practices regarding your personal data.
                  </p>
  
                  <h2 className="text-xl md:text-2xl font-semibold text-surface-foreground mt-10 mb-4">
                    Information We Collect
                  </h2>
                  <p className="text-base leading-relaxed text-surface-foreground mb-4">
                    We may collect personal information that you voluntarily provide to us, such as your name, email address, and any other details you submit through forms or account registration. We also collect certain data automatically, including IP addresses, browser type, and usage data through cookies and similar technologies.
                  </p>
  
                  <h2 className="text-xl md:text-2xl font-semibold text-surface-foreground mt-10 mb-4">
                    How We Use Your Information
                  </h2>
                  <ul className="list-disc list-inside space-y-2 text-base text-surface-foreground mb-4">
                    <li>To provide, operate, and maintain our services</li>
                    <li>To improve, personalise, and expand our offerings</li>
                    <li>To communicate with you, including for customer support</li>
                    <li>To send you updates, marketing, and promotional materials (where permitted)</li>
                    <li>To comply with legal obligations</li>
                  </ul>
  
                  <h2 className="text-xl md:text-2xl font-semibold text-surface-foreground mt-10 mb-4">
                    Sharing Your Information
                  </h2>
                  <p className="text-base leading-relaxed text-surface-foreground mb-4">
                    We do not sell, trade, or rent your personal information to third parties. We may share data with trusted service providers who assist us in operating our website and services, subject to confidentiality agreements. We may also disclose information when required by law or to protect our rights.
                  </p>
  
                  <h2 className="text-xl md:text-2xl font-semibold text-surface-foreground mt-10 mb-4">
                    Cookies
                  </h2>
                  <p className="text-base leading-relaxed text-surface-foreground mb-4">
                    We use cookies and similar tracking technologies to enhance your experience. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, some features of our service may not function properly without cookies.
                  </p>
  
                  <h2 className="text-xl md:text-2xl font-semibold text-surface-foreground mt-10 mb-4">
                    Your Rights
                  </h2>
                  <p className="text-base leading-relaxed text-surface-foreground mb-4">
                    Depending on your location, you may have rights regarding your personal data, including the right to access, correct, or delete information we hold about you. To exercise these rights, please contact us using the details below.
                  </p>
  
                  <h2 className="text-xl md:text-2xl font-semibold text-surface-foreground mt-10 mb-4">
                    Contact Us
                  </h2>
                  <p className="text-base leading-relaxed text-surface-foreground mb-4">
                    If you have any questions or concerns about this Privacy Policy, please contact us at{" "}
                    <a
                      href="mailto:privacy@example.com"
                      className="text-brand-primary underline hover:text-brand-secondary transition-colors"
                    >
                      privacy@example.com
                    </a>
                    .
                  </p>
  
                  <p className="text-sm text-surface-muted-foreground mt-10 border-t border-surface-muted pt-6">
                    Last updated: January 2025
                  </p>
                </>
              )}
            </div>
          </RevealOnScroll>
        </div>
      </section>
    );
}
