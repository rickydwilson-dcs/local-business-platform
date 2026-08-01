'use client';

import { useId, useState } from 'react';
import type { FormEvent } from 'react';
import { Mail, Instagram, Facebook, Info } from 'lucide-react';
import type { BrandContent } from '@/lib/schemas/brand';
import { PageHead } from '@/components/sections/page-head';
import { Eyebrow } from '@/components/sections/eyebrow';
import { ArrowTextLink } from '@/components/sections/arrow-link';

/**
 * ContactPage — the Grid Box contact page.
 *
 * IMPORTANT — this form deliberately does not send anything.
 *
 * NPRacing has no confirmed enquiry inbox or form backend wired up for this
 * build, so shipping a form that POSTs to /api/contact would tell a visitor
 * their message had been delivered when nobody would ever read it. Instead the
 * form is fully built and validated client-side, submission is intercepted,
 * and the result region says plainly that nothing was sent and points at the
 * team's real email address.
 *
 * Every contact detail (email, Instagram) is read from
 * content/brand/npracing.mdx via the `brand` prop — none of it is hardcoded
 * here. NPRacing's Facebook page has not been confirmed, so it is rendered as
 * plain "Link coming soon" text rather than a guessed URL.
 */

export interface ContactPageProps {
  /** Validated frontmatter from content/brand/npracing.mdx. */
  brand: BrandContent;
}

const SUBJECTS = [
  'Sponsorship and partnerships',
  'Media and press',
  'Merchandise',
  'Rider or team enquiry',
  'Something else',
] as const;

type FieldName = 'name' | 'email' | 'subject' | 'message';

type FieldErrors = Partial<Record<FieldName, string>>;

interface FormValues {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const EMPTY_VALUES: FormValues = { name: '', email: '', subject: '', message: '' };

/** Deliberately permissive — the browser is not the authority on address validity. */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values: FormValues): FieldErrors {
  const errors: FieldErrors = {};

  if (!values.name.trim()) {
    errors.name = 'Enter your name.';
  }

  if (!values.email.trim()) {
    errors.email = 'Enter your email address.';
  } else if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = 'Enter an email address in the format name@example.com.';
  }

  if (!values.subject) {
    errors.subject = 'Choose what your enquiry is about.';
  }

  if (!values.message.trim()) {
    errors.message = 'Enter your message.';
  } else if (values.message.trim().length < 10) {
    errors.message = 'Your message is too short — please give us a little more detail.';
  }

  return errors;
}

export function ContactPage({ brand }: ContactPageProps) {
  const fieldId = useId();
  const [values, setValues] = useState<FormValues>(EMPTY_VALUES);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusTone, setStatusTone] = useState<'error' | 'notice'>('notice');

  const id = (field: FieldName) => `${fieldId}-${field}`;
  const errorId = (field: FieldName) => `${fieldId}-${field}-error`;

  const update = (field: FieldName) => (value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  /**
   * Intercepts submission entirely. Nothing is POSTed, nothing is queued, and
   * the status text says so — the form never claims a message was delivered.
   */
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validate(values);
    setErrors(nextErrors);

    const errorCount = Object.keys(nextErrors).length;
    if (errorCount > 0) {
      setStatusTone('error');
      setStatusMessage(
        errorCount === 1
          ? 'There is 1 problem with this form. Check the highlighted field below.'
          : `There are ${errorCount} problems with this form. Check the highlighted fields below.`
      );
      return;
    }

    setStatusTone('notice');
    setStatusMessage(
      `Your message has NOT been sent — online enquiries are not live on this site yet. ` +
        `Please email ${brand.email} directly and we will pick it up from there.`
    );
  };

  const describedBy = (field: FieldName) => (errors[field] ? errorId(field) : undefined);

  return (
    <>
      <div className="grain-overlay" aria-hidden="true" />

      <PageHead
        eyebrow="Contact"
        title="Talk to the team."
        lede={`Sponsorship, media, merchandise or just a question about the ${brand.raceNumber} bike — ${brand.teamName} reads everything that comes in.`}
      />

      <div className="container-grid grid grid-cols-1 gap-12 py-16 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
        {/* ── Enquiry form ─────────────────────────────────────────────── */}
        <section aria-labelledby={`${fieldId}-form-heading`}>
          <h2 id={`${fieldId}-form-heading`} className="text-h3 uppercase text-surface-foreground">
            Send us an enquiry
          </h2>

          {/* Persistent, unmissable statement of what this form does and does
              not do — shown before anyone starts typing, not only afterwards. */}
          <div
            className="mt-5 flex gap-3 rounded-card border border-brand-secondary chip-brand p-4"
            role="note"
          >
            <Info className="mt-0.5 h-5 w-5 flex-shrink-0 text-brand-accent" aria-hidden="true" />
            <p className="text-sm leading-relaxed text-surface-secondary-foreground">
              <span className="font-semibold text-surface-foreground">
                Online enquiries are not live yet.
              </span>{' '}
              This form will not send or store anything. Until it is connected, please email{' '}
              <a
                href={`mailto:${brand.email}`}
                className="font-semibold text-brand-accent underline underline-offset-2"
              >
                {brand.email}
              </a>
              .
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="mt-8 flex flex-col gap-6">
            {/* Single live region for both validation feedback and the
                "nothing was sent" result. Always present in the DOM so
                assistive technology announces changes to it. */}
            <div
              role="status"
              aria-live="polite"
              aria-atomic="true"
              className={
                statusMessage
                  ? statusTone === 'error'
                    ? 'rounded-card border border-semantic-error bg-surface-subtle p-4 text-sm font-semibold leading-relaxed text-semantic-error'
                    : 'rounded-card border border-surface-card-border bg-surface-subtle p-4 text-sm leading-relaxed text-surface-foreground'
                  : undefined
              }
            >
              {statusMessage}
            </div>

            <div>
              <label htmlFor={id('name')} className="field-label">
                Your name <span aria-hidden="true">*</span>
                <span className="sr-only">(required)</span>
              </label>
              <input
                id={id('name')}
                name="name"
                type="text"
                required
                autoComplete="name"
                value={values.name}
                onChange={(event) => update('name')(event.target.value)}
                aria-invalid={errors.name ? true : undefined}
                aria-describedby={describedBy('name')}
                className="field-control mt-2"
              />
              {errors.name && (
                <p id={errorId('name')} className="mt-2 text-sm font-semibold text-semantic-error">
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label htmlFor={id('email')} className="field-label">
                Email address <span aria-hidden="true">*</span>
                <span className="sr-only">(required)</span>
              </label>
              <input
                id={id('email')}
                name="email"
                type="email"
                required
                autoComplete="email"
                value={values.email}
                onChange={(event) => update('email')(event.target.value)}
                aria-invalid={errors.email ? true : undefined}
                aria-describedby={describedBy('email')}
                className="field-control mt-2"
              />
              {errors.email && (
                <p id={errorId('email')} className="mt-2 text-sm font-semibold text-semantic-error">
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label htmlFor={id('subject')} className="field-label">
                What is it about? <span aria-hidden="true">*</span>
                <span className="sr-only">(required)</span>
              </label>
              <select
                id={id('subject')}
                name="subject"
                required
                value={values.subject}
                onChange={(event) => update('subject')(event.target.value)}
                aria-invalid={errors.subject ? true : undefined}
                aria-describedby={describedBy('subject')}
                className="field-control mt-2"
              >
                <option value="">Choose a subject</option>
                {SUBJECTS.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
              {errors.subject && (
                <p
                  id={errorId('subject')}
                  className="mt-2 text-sm font-semibold text-semantic-error"
                >
                  {errors.subject}
                </p>
              )}
            </div>

            <div>
              <label htmlFor={id('message')} className="field-label">
                Message <span aria-hidden="true">*</span>
                <span className="sr-only">(required)</span>
              </label>
              <textarea
                id={id('message')}
                name="message"
                required
                rows={6}
                value={values.message}
                onChange={(event) => update('message')(event.target.value)}
                aria-invalid={errors.message ? true : undefined}
                aria-describedby={describedBy('message')}
                className="field-control mt-2 resize-y"
              />
              {errors.message && (
                <p
                  id={errorId('message')}
                  className="mt-2 text-sm font-semibold text-semantic-error"
                >
                  {errors.message}
                </p>
              )}
            </div>

            <p className="text-xs text-surface-tertiary-foreground">
              <span aria-hidden="true">*</span> Required field.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              {/* Deliberately not labelled "Send" — nothing is sent. */}
              <button type="submit" className="btn-primary">
                Check my enquiry
              </button>
              <a href={`mailto:${brand.email}`} className="btn-secondary">
                Email us instead
              </a>
            </div>
          </form>
        </section>

        {/* ── Direct contact details ───────────────────────────────────── */}
        <section aria-labelledby={`${fieldId}-details-heading`}>
          <Eyebrow>Direct</Eyebrow>
          <h2
            id={`${fieldId}-details-heading`}
            className="mt-4 text-h3 uppercase text-surface-foreground"
          >
            Reach {brand.teamName}
          </h2>

          <dl className="mt-8 flex flex-col gap-6">
            <div className="card">
              <dt className="flex items-center gap-3">
                <span
                  className="chip-brand grid h-9 w-9 flex-shrink-0 place-items-center rounded-full"
                  aria-hidden="true"
                >
                  <Mail className="h-4 w-4 text-brand-accent" />
                </span>
                <span className="text-xs font-bold uppercase tracking-[0.14em] text-surface-tertiary-foreground">
                  Email
                </span>
              </dt>
              <dd className="mt-3">
                <a
                  href={`mailto:${brand.email}`}
                  className="break-words font-semibold text-surface-foreground underline underline-offset-2 transition-colors hover:text-brand-accent"
                >
                  {brand.email}
                </a>
                <p className="mt-2 text-sm leading-relaxed text-surface-secondary-foreground">
                  The quickest way to reach the team while the enquiry form is offline.
                </p>
              </dd>
            </div>

            <div className="card">
              <dt className="flex items-center gap-3">
                <span
                  className="chip-brand grid h-9 w-9 flex-shrink-0 place-items-center rounded-full"
                  aria-hidden="true"
                >
                  <Instagram className="h-4 w-4 text-brand-accent" />
                </span>
                <span className="text-xs font-bold uppercase tracking-[0.14em] text-surface-tertiary-foreground">
                  Instagram
                </span>
              </dt>
              <dd className="mt-3">
                <ArrowTextLink
                  href={brand.instagramUrl}
                  external
                  externalLabel={`${brand.teamName} on Instagram, ${brand.instagramHandle}`}
                >
                  {brand.instagramHandle}
                </ArrowTextLink>
                <p className="mt-2 text-sm leading-relaxed text-surface-secondary-foreground">
                  Race weekend updates, paddock photos and results.
                </p>
              </dd>
            </div>

            <div className="card">
              <dt className="flex items-center gap-3">
                <span
                  className="chip-brand grid h-9 w-9 flex-shrink-0 place-items-center rounded-full"
                  aria-hidden="true"
                >
                  <Facebook className="h-4 w-4 text-brand-accent" />
                </span>
                <span className="text-xs font-bold uppercase tracking-[0.14em] text-surface-tertiary-foreground">
                  Facebook
                </span>
              </dt>
              {/* No confirmed Facebook URL — plain text, never a guessed link. */}
              <dd className="mt-3 font-semibold text-surface-secondary-foreground">
                Link coming soon
              </dd>
            </div>
          </dl>
        </section>
      </div>
    </>
  );
}
