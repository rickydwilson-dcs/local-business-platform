'use client';

import { useState, type FormEvent } from 'react';
import { ArrowRightIcon } from '@/components/ui/icons';

/**
 * ContactEnquiryForm — semantic, validation-ready enquiry form that does not
 * send anything.
 *
 * There is no delivery backend wired for this site yet, so the form must never
 * imply a message reached the team. It therefore:
 *  - states, before the button, that submissions are not being delivered yet;
 *  - intercepts submit and never issues a network request;
 *  - reports back with an explicit "not sent" status in a live region, along
 *    with the direct email address.
 *
 * Native `required` / `type="email"` validation still runs first, so the
 * markup is ready to be pointed at a real endpoint without restructuring.
 */
export interface ContactEnquiryFormProps {
  /** Direct team email, sourced from the brand MDX record. */
  email: string;
}

const FIELD_LABEL_CLASSES =
  'font-sans text-caption font-bold uppercase tracking-[0.06em] text-surface-tertiary';
const FIELD_CONTROL_CLASSES =
  'w-full border border-surface-card-border bg-surface-muted px-4 py-3 font-sans text-body text-surface-foreground placeholder:text-surface-tertiary focus:border-brand-primary focus:outline focus:outline-2 focus:outline-offset-1 focus:outline-brand-primary';

export function ContactEnquiryForm({ email }: ContactEnquiryFormProps) {
  const [attempted, setAttempted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    // Never submits: no fetch, no action, no navigation.
    event.preventDefault();
    setAttempted(true);
  }

  return (
    <form onSubmit={handleSubmit} noValidate={false} aria-describedby="enquiry-form-status">
      <div className="flex flex-col gap-2 pb-5">
        <label htmlFor="enquiry-name" className={FIELD_LABEL_CLASSES}>
          Name <span aria-hidden="true">*</span>
        </label>
        <input
          id="enquiry-name"
          name="name"
          type="text"
          autoComplete="name"
          required
          placeholder="Your name"
          className={FIELD_CONTROL_CLASSES}
        />
      </div>

      <div className="flex flex-col gap-2 pb-5">
        <label htmlFor="enquiry-email" className={FIELD_LABEL_CLASSES}>
          Email <span aria-hidden="true">*</span>
        </label>
        <input
          id="enquiry-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="you@example.com"
          className={FIELD_CONTROL_CLASSES}
        />
      </div>

      <div className="flex flex-col gap-2 pb-5">
        <label htmlFor="enquiry-subject" className={FIELD_LABEL_CLASSES}>
          Subject <span className="font-normal normal-case tracking-normal">(optional)</span>
        </label>
        <input
          id="enquiry-subject"
          name="subject"
          type="text"
          placeholder="What is this about?"
          className={FIELD_CONTROL_CLASSES}
        />
      </div>

      <div className="flex flex-col gap-2 pb-5">
        <label htmlFor="enquiry-message" className={FIELD_LABEL_CLASSES}>
          Message <span aria-hidden="true">*</span>
        </label>
        <textarea
          id="enquiry-message"
          name="message"
          rows={6}
          required
          placeholder="Write your message..."
          className={`${FIELD_CONTROL_CLASSES} min-h-[8rem] resize-y`}
        />
      </div>

      <p className="pb-4 text-small text-surface-tertiary">
        <strong className="text-surface-foreground">This form is not live yet.</strong> Nothing
        typed here is delivered to the team. Please email{' '}
        <a href={`mailto:${email}`} className="font-semibold text-brand-accent underline">
          {email}
        </a>{' '}
        directly in the meantime.
      </p>

      <button
        type="submit"
        className="group inline-flex w-full items-center justify-center gap-2.5 border border-transparent bg-brand-primary py-3 pl-5 pr-3 font-sans text-sm font-bold uppercase tracking-[0.04em] text-on-brand-primary transition-colors duration-normal hover:bg-brand-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent"
      >
        Check message
        <span
          aria-hidden="true"
          className="grid h-8 w-8 flex-none place-items-center bg-white/20 transition-transform duration-slow group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
        >
          <ArrowRightIcon />
        </span>
      </button>

      <p
        id="enquiry-form-status"
        role="status"
        aria-live="polite"
        className="mt-4 min-h-[1.5rem] text-small text-surface-secondary"
      >
        {attempted ? (
          <span className="block border-l-2 border-brand-primary pl-3">
            <strong className="text-surface-foreground">Not sent.</strong> Your details were checked
            but no message was delivered — this form has no mailbox behind it yet. Email{' '}
            <a href={`mailto:${email}`} className="font-semibold text-brand-accent underline">
              {email}
            </a>{' '}
            to reach the team.
          </span>
        ) : (
          ''
        )}
      </p>
    </form>
  );
}
