/**
 * ContactFormPanel
 *
 * Primary contact form allowing users to submit name, company, email, phone, service selection, additional info and file attachments
 * Layout: Right-side card panel with stacked form fields and submit button
 * Category: Custom
 */
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
    <div className="w-full bg-surface-foreground rounded-2xl shadow-xl p-8 md:p-10 flex flex-col gap-6">
      {/* Form Header */}
      <div className="flex flex-col gap-2">
        {props.formTitle && (
          <h2 className="text-2xl md:text-3xl font-bold text-surface-foreground">
            {props.formTitle}
          </h2>
        )}
        {props.formDescription && (
          <p className="text-surface-muted-foreground text-sm md:text-base">
            {props.formDescription}
          </p>
        )}
      </div>

      {/* Form Fields */}
      <form className="flex flex-col gap-5" noValidate>
        {/* Name & Company Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="contact-name" className="text-sm font-medium text-surface-foreground">
              {props.fieldName ?? "Full Name"}
            </label>
            <input
              id="contact-name"
              type="text"
              placeholder={props.fieldName ?? "Full Name"}
              className="w-full rounded-lg border border-surface-muted bg-surface-background px-4 py-2.5 text-sm text-surface-foreground placeholder:text-surface-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-primary transition"
            />
          </div>

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
              placeholder={props.fieldCompany ?? "Company"}
              className="w-full rounded-lg border border-surface-muted bg-surface-background px-4 py-2.5 text-sm text-surface-foreground placeholder:text-surface-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-primary transition"
            />
          </div>
        </div>

        {/* Email & Phone Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="contact-email" className="text-sm font-medium text-surface-foreground">
              {props.fieldEmail ?? "Email Address"}
            </label>
            <input
              id="contact-email"
              type="email"
              placeholder={props.fieldEmail ?? "Email Address"}
              className="w-full rounded-lg border border-surface-muted bg-surface-background px-4 py-2.5 text-sm text-surface-foreground placeholder:text-surface-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-primary transition"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="contact-phone" className="text-sm font-medium text-surface-foreground">
              {props.fieldPhone ?? "Phone Number"}
            </label>
            <input
              id="contact-phone"
              type="tel"
              placeholder={props.fieldPhone ?? "Phone Number"}
              className="w-full rounded-lg border border-surface-muted bg-surface-background px-4 py-2.5 text-sm text-surface-foreground placeholder:text-surface-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-primary transition"
            />
          </div>
        </div>

        {/* Service Selection */}
        <div className="flex flex-col gap-1">
          <label htmlFor="contact-service" className="text-sm font-medium text-surface-foreground">
            {props.fieldServiceSelect ?? "Service Required"}
          </label>
          <select
            id="contact-service"
            className="w-full rounded-lg border border-surface-muted bg-surface-background px-4 py-2.5 text-sm text-surface-foreground focus:outline-none focus:ring-2 focus:ring-brand-primary transition appearance-none cursor-pointer"
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
            rows={4}
            placeholder={
              props.fieldAdditionalInfo ?? "Tell us more about your project or enquiry..."
            }
            className="w-full rounded-lg border border-surface-muted bg-surface-background px-4 py-2.5 text-sm text-surface-foreground placeholder:text-surface-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-primary transition resize-none"
          />
        </div>

        {/* File Upload */}
        <div className="flex flex-col gap-1">
          <label htmlFor="contact-file" className="text-sm font-medium text-surface-foreground">
            {props.fieldFileUpload ?? "Attach Files"}
          </label>
          <label
            htmlFor="contact-file"
            className="flex flex-col items-center justify-center w-full rounded-lg border-2 border-dashed border-surface-muted bg-surface-background px-4 py-6 cursor-pointer hover:border-brand-primary transition group"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8 text-surface-muted-foreground group-hover:text-brand-primary mb-2 transition"
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
            <span className="text-sm text-surface-muted-foreground group-hover:text-brand-primary transition">
              {props.fieldFileUpload ?? "Click to upload or drag & drop"}
            </span>
            <span className="text-xs text-surface-muted-foreground mt-1">
              PDF, DOC, PNG, JPG up to 10MB
            </span>
            <input
              id="contact-file"
              type="file"
              multiple
              className="sr-only"
              accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
            />
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full rounded-lg bg-brand-primary px-6 py-3 text-base font-semibold text-on-brand-primary hover:opacity-90 active:scale-95 transition-all duration-150 focus:outline-none focus:ring-2"
        >
          {props.submitButton?.label ?? "Submit"}
        </button>
      </form>
    </div>
  );
}
