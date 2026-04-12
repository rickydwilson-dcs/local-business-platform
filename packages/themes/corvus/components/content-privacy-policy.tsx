"use client";

/**
 * ContentPrivacyPolicy
 *
 * Displays the full privacy policy text with heading and body
 * Layout: Contained single-column block with heading and long-form body text
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
          <h1 className="text-3xl md:text-4xl font-bold text-surface-foreground mb-8">
            {props.heading ?? "Privacy Policy"}
          </h1>
        </RevealOnScroll>

        <RevealOnScroll variant="fade-up">
          <div className="prose prose-lg max-w-none text-surface-foreground">
            {props.body ? (
              <p className="text-surface-foreground leading-relaxed whitespace-pre-line">
                {props.body}
              </p>
            ) : (
              <>
                <p className="text-surface-foreground leading-relaxed mb-6">
                  Your privacy is important to us. This Privacy Policy explains how we collect, use,
                  disclose, and safeguard your information when you visit our website or use our
                  services. Please read this policy carefully to understand our views and practices
                  regarding your personal data and how we will treat it.
                </p>

                <h2 className="text-xl md:text-2xl font-semibold text-surface-foreground mt-10 mb-4">
                  Information We Collect
                </h2>
                <p className="text-surface-foreground leading-relaxed mb-6">
                  We may collect personal information that you voluntarily provide to us when you
                  register on our platform, express interest in obtaining information about us or
                  our products and services, or otherwise contact us. The personal information we
                  collect may include names, email addresses, phone numbers, and other similar
                  information.
                </p>

                <h2 className="text-xl md:text-2xl font-semibold text-surface-foreground mt-10 mb-4">
                  How We Use Your Information
                </h2>
                <p className="text-surface-foreground leading-relaxed mb-6">
                  We use the information we collect to provide, operate, and maintain our services,
                  improve and personalise your experience, understand and analyse how you use our
                  services, develop new products and features, and communicate with you for customer
                  service and marketing purposes.
                </p>

                <h2 className="text-xl md:text-2xl font-semibold text-surface-foreground mt-10 mb-4">
                  Sharing Your Information
                </h2>
                <p className="text-surface-foreground leading-relaxed mb-6">
                  We do not sell, trade, or otherwise transfer your personally identifiable
                  information to outside parties without your consent, except to trusted third
                  parties who assist us in operating our website, conducting our business, or
                  servicing you, so long as those parties agree to keep this information
                  confidential.
                </p>

                <h2 className="text-xl md:text-2xl font-semibold text-surface-foreground mt-10 mb-4">
                  Cookies
                </h2>
                <p className="text-surface-foreground leading-relaxed mb-6">
                  We use cookies and similar tracking technologies to track activity on our services
                  and hold certain information. You can instruct your browser to refuse all cookies
                  or to indicate when a cookie is being sent. However, if you do not accept cookies,
                  you may not be able to use some portions of our services.
                </p>

                <h2 className="text-xl md:text-2xl font-semibold text-surface-foreground mt-10 mb-4">
                  Data Retention
                </h2>
                <p className="text-surface-foreground leading-relaxed mb-6">
                  We will retain your personal information only for as long as is necessary for the
                  purposes set out in this Privacy Policy. We will retain and use your information
                  to the extent necessary to comply with our legal obligations, resolve disputes,
                  and enforce our policies.
                </p>

                <h2 className="text-xl md:text-2xl font-semibold text-surface-foreground mt-10 mb-4">
                  Your Rights
                </h2>
                <p className="text-surface-foreground leading-relaxed mb-6">
                  Depending on your location, you may have certain rights regarding your personal
                  information, including the right to access, correct, or delete the personal data
                  we hold about you. To exercise these rights, please contact us using the details
                  provided below.
                </p>

                <h2 className="text-xl md:text-2xl font-semibold text-surface-foreground mt-10 mb-4">
                  Contact Us
                </h2>
                <p className="text-surface-foreground leading-relaxed mb-6">
                  If you have any questions or concerns about this Privacy Policy or our data
                  practices, please contact us at privacy@example.com. We are committed to resolving
                  any complaints about our collection or use of your personal information.
                </p>
              </>
            )}
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
