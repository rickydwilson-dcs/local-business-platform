/**
 * ContactFormPanel
 *
 * Primary contact form allowing users to submit name, company, email, phone, service selection, additional info and file attachments
 * Layout: Right-side card panel with stacked form fields and submit button
 * Category: Custom
 */
import { RevealOnScroll } from "@platform/core-components/components/animation";
export interface ContactFormPanelProps {
  /** form-title */
  formTitle?: string;
  /** form-description */
  formDescription?: string;
  /** field-name */
  fieldName?: string;
  /** field-company */
  fieldCompany?: string;
  /** field-email */
  fieldEmail?: string;
  /** field-phone */
  fieldPhone?: string;
  /** field-service-select */
  fieldServiceSelect?: string;
  /** field-additional-info */
  fieldAdditionalInfo?: string;
  /** field-file-upload */
  fieldFileUpload?: string;
  /** submit-button */
  submitButton?: { label?: string; href?: string };
}
export function ContactFormPanel(props: ContactFormPanelProps) {
  return (
    <div className="w-full bg-surface-background py-8 px-4 md:px-8">
      <div className="max-w-2xl mx-auto bg-surface-foreground rounded-2xl shadow-card border border-surface-muted p-6 md:p-10">
        <RevealOnScroll variant="fade-up">
          {/* Form Header */}
          {(props.formTitle || props.formDescription) && (
            <div className="mb-8">
              {props.formTitle && (
                <h2 className="text-2xl md:text-3xl font-bold text-surface-foreground mb-2">
                  {props.formTitle}
                </h2>
              )}
              {props.formDescription && (
                <p className="text-surface-muted-foreground text-base">{props.formDescription}</p>
              )}
            </div>
          )}

          <form className="flex flex-col gap-5" noValidate>
            {/* Name Field */}
            <div className="flex flex-col gap-1">
              <label htmlFor="contact-name" className="text-sm font-medium text-surface-foreground">
                {props.fieldName ?? "Full Name"}
              </label>
              <input
                id="contact-name"
                type="text"
                name="name"
                autoComplete="name"
                placeholder={props.fieldName ?? "Your full name"}
                className="w-full rounded-lg border border-surface-muted bg-surface-background text-surface-foreground placeholder:text-surface-muted-foreground px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary transition"
              />
            </div>

            {/* Company Field */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="contact-company"
                className="text-sm font-medium text-surface-foreground"
              >
                {props.fieldCompany ?? "Company"}
              </label>
              <input
                id="contact-company"
                type="text"
                name="company"
                autoComplete="organization"
                placeholder={props.fieldCompany ?? "Your company name"}
                className="w-full rounded-lg border border-surface-muted bg-surface-background text-surface-foreground placeholder:text-surface-muted-foreground px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary transition"
              />
            </div>

            {/* Email & Phone Row */}
            <div className="flex flex-col md:flex-row gap-5">
              <div className="flex flex-col gap-1 flex-1">
                <label
                  htmlFor="contact-email"
                  className="text-sm font-medium text-surface-foreground"
                >
                  {props.fieldEmail ?? "Email Address"}
                </label>
                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder={props.fieldEmail ?? "you@example.com"}
                  className="w-full rounded-lg border border-surface-muted bg-surface-background text-surface-foreground placeholder:text-surface-muted-foreground px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary transition"
                />
              </div>
              <div className="flex flex-col gap-1 flex-1">
                <label
                  htmlFor="contact-phone"
                  className="text-sm font-medium text-surface-foreground"
                >
                  {props.fieldPhone ?? "Phone Number"}
                </label>
                <input
                  id="contact-phone"
                  type="tel"
                  name="phone"
                  autoComplete="tel"
                  placeholder={props.fieldPhone ?? "+1 (555) 000-0000"}
                  className="w-full rounded-lg border border-surface-muted bg-surface-background text-surface-foreground placeholder:text-surface-muted-foreground px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary transition"
                />
              </div>
            </div>

            {/* Service Selection */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="contact-service"
                className="text-sm font-medium text-surface-foreground"
              >
                {props.fieldServiceSelect ?? "Service Required"}
              </label>
              <select
                id="contact-service"
                name="service"
                className="w-full rounded-lg border border-surface-muted bg-surface-background text-surface-foreground px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary transition appearance-none cursor-pointer"
                defaultValue=""
              >
                <option value="" disabled>
                  {props.fieldServiceSelect ?? "Select a service..."}
                </option>
                <option value="consulting">Consulting</option>
                <option value="development">Development</option>
                <option value="design">Design</option>
                <option value="support">Support</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Additional Info */}
            <div className="flex flex-col gap-1">
              <label htmlFor="contact-info" className="text-sm font-medium text-surface-foreground">
                {props.fieldAdditionalInfo ?? "Additional Information"}
              </label>
              <textarea
                id="contact-info"
                name="additional_info"
                rows={5}
                placeholder={
                  props.fieldAdditionalInfo ?? "Tell us more about your project or enquiry..."
                }
                className="w-full rounded-lg border border-surface-muted bg-surface-background text-surface-foreground placeholder:text-surface-muted-foreground px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary transition resize-y"
              />
            </div>

            {/* File Upload */}
            <div className="flex flex-col gap-1">
              <label htmlFor="contact-file" className="text-sm font-medium text-surface-foreground">
                {props.fieldFileUpload ?? "Attach Files"}
              </label>
              <div className="w-full rounded-lg border border-dashed border-surface-muted bg-surface-muted px-4 py-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-brand-primary transition">
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
                <span className="text-sm text-surface-muted-foreground">
                  {props.fieldFileUpload ?? "Click to upload or drag and drop"}
                </span>
                <span className="text-xs text-surface-muted-foreground">
                  PDF, DOC, PNG, JPG up to 10MB
                </span>
                <input
                  id="contact-file"
                  type="file"
                  name="attachments"
                  multiple
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                  className="hidden"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 px-6 bg-brand-primary text-white font-semibold rounded-lg hover:bg-brand-primary/90 transition-colors"
            >
              {props.submitButton?.label ?? "Send Message"}
            </button>
          </form>
        </RevealOnScroll>
      </div>
    </div>
  );
}
