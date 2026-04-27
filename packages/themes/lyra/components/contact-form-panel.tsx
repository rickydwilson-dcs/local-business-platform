"use client";

/**
 * ContactFormPanel
 *
 * Multi-field contact form allowing users to submit enquiries with optional file attachments
 * Layout: Single-column card with stacked form fields, dropdown, textarea, file upload and submit button
 * Category: Custom
 */

import { useState } from "react";
import { RevealOnScroll } from "@platform/core-components/components/animation";

export interface ContactFormPanelProps {
  /** form-title */
  formTitle?: string;
  /** form-description */
  formDescription?: string;
  /** name-field */
  nameField?: string;
  /** company-name-field */
  companyNameField?: string;
  /** email-field */
  emailField?: string;
  /** phone-field */
  phoneField?: string;
  /** service-dropdown */
  serviceDropdown?: string;
  /** additional-info-textarea */
  additionalInfoTextarea?: string;
  /** file-upload */
  fileUpload?: string;
  /** submit-button */
  submitButton?: { label?: string; href?: string };
}

export function ContactFormPanel(props: ContactFormPanelProps) {
  return (
    <div className="bg-surface-background min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <RevealOnScroll variant="fade-up">
          <div className="bg-surface-foreground rounded-2xl shadow-lg p-8 md:p-12 border border-surface-muted">
            {/* Form Header */}
            {(props.formTitle || props.formDescription) && (
              <div className="mb-8">
                {props.formTitle && (
                  <h2 className="text-2xl md:text-3xl font-bold text-surface-foreground mb-3">
                    {props.formTitle}
                  </h2>
                )}
                {props.formDescription && (
                  <p className="text-surface-muted-foreground text-base leading-relaxed">
                    {props.formDescription}
                  </p>
                )}
              </div>
            )}

            {/* Form */}
            <form className="space-y-6" noValidate>
              {/* Name Field */}
              {props.nameField && (
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="contact-name"
                    className="text-sm font-medium text-surface-foreground"
                  >
                    {props.nameField}
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    name="name"
                    placeholder={props.nameField}
                    className="w-full rounded-lg border border-surface-muted bg-surface-background text-surface-foreground placeholder:text-surface-muted-foreground px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary transition"
                  />
                </div>
              )}

              {/* Company Name Field */}
              {props.companyNameField && (
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="contact-company"
                    className="text-sm font-medium text-surface-foreground"
                  >
                    {props.companyNameField}
                  </label>
                  <input
                    id="contact-company"
                    type="text"
                    name="company"
                    placeholder={props.companyNameField}
                    className="w-full rounded-lg border border-surface-muted bg-surface-background text-surface-foreground placeholder:text-surface-muted-foreground px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary transition"
                  />
                </div>
              )}

              {/* Email and Phone — side by side on md+ */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {props.emailField && (
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="contact-email"
                      className="text-sm font-medium text-surface-foreground"
                    >
                      {props.emailField}
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      name="email"
                      placeholder={props.emailField}
                      className="w-full rounded-lg border border-surface-muted bg-surface-background text-surface-foreground placeholder:text-surface-muted-foreground px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary transition"
                    />
                  </div>
                )}

                {props.phoneField && (
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="contact-phone"
                      className="text-sm font-medium text-surface-foreground"
                    >
                      {props.phoneField}
                    </label>
                    <input
                      id="contact-phone"
                      type="tel"
                      name="phone"
                      placeholder={props.phoneField}
                      className="w-full rounded-lg border border-surface-muted bg-surface-background text-surface-foreground placeholder:text-surface-muted-foreground px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary transition"
                    />
                  </div>
                )}
              </div>

              {/* Service Dropdown */}
              {props.serviceDropdown && (
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="contact-service"
                    className="text-sm font-medium text-surface-foreground"
                  >
                    {props.serviceDropdown}
                  </label>
                  <select
                    id="contact-service"
                    name="service"
                    defaultValue=""
                    className="w-full rounded-lg border border-surface-muted bg-surface-background text-surface-foreground px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary transition appearance-none cursor-pointer"
                  >
                    <option value="" disabled>
                      Select a service…
                    </option>
                    <option value="consulting">Consulting</option>
                    <option value="development">Development</option>
                    <option value="design">Design</option>
                    <option value="support">Support</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              )}

              {/* Additional Info Textarea */}
              {props.additionalInfoTextarea && (
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="contact-message"
                    className="text-sm font-medium text-surface-foreground"
                  >
                    {props.additionalInfoTextarea}
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={5}
                    placeholder={props.additionalInfoTextarea}
                    className="w-full rounded-lg border border-surface-muted bg-surface-background text-surface-foreground placeholder:text-surface-muted-foreground px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary transition resize-y"
                  />
                </div>
              )}

              {/* File Upload */}
              {props.fileUpload && (
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="contact-file"
                    className="text-sm font-medium text-surface-foreground"
                  >
                    {props.fileUpload}
                  </label>
                  <div className="relative flex items-center justify-center w-full rounded-lg border-2 border-dashed border-surface-muted bg-surface-background hover:border-brand-primary transition cursor-pointer px-4 py-8">
                    <div className="flex flex-col items-center gap-2 text-center pointer-events-none">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-surface-muted-foreground"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 16v-8m0 0-3 3m3-3 3 3M4.5 19.5h15a1.5 1.5 0 0 0 0-3h-15a1.5 1.5 0 0 0 0 3Z"
                        />
                      </svg>
                      <span className="text-sm text-surface-muted-foreground"></span>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>
        </RevealOnScroll>
      </div>
    </div>
  );
}
