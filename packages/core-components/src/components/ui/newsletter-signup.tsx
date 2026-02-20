"use client";

import { useState } from "react";

interface NewsletterSignupProps {
  /** Section heading */
  heading: string;
  /** Optional subtext below heading */
  subtext?: string;
  /** Placeholder text for email input, default "Enter your email" */
  inputPlaceholder?: string;
  /** Submit button text */
  buttonLabel: string;
  /** Form action URL — the form POSTs to this endpoint. If omitted, form does nothing visible (demo mode). */
  formAction?: string;
  /** Visual variant for the band background */
  variant?: "brand" | "dark" | "light";
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const variantClasses: Record<string, string> = {
  brand: "bg-brand-primary text-white",
  dark: "bg-surface-muted text-surface-foreground",
  light: "bg-white text-surface-foreground",
};

export function NewsletterSignup({
  heading,
  subtext,
  inputPlaceholder = "Enter your email",
  buttonLabel,
  formAction,
  variant = "brand",
}: NewsletterSignupProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    if (!EMAIL_REGEX.test(email)) {
      e.preventDefault();
      setError("Please enter a valid email address");
      return;
    }

    setError("");

    if (!formAction) {
      e.preventDefault();
      setSubmitted(true);
    }
    // If formAction is set, the native form submission proceeds
  }

  return (
    <section className={`section-standard ${variantClasses[variant]}`}>
      <div className="container-standard text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-3">{heading}</h2>
        {subtext && (
          <p className="text-lg opacity-90 mb-6 max-w-2xl mx-auto">
            {subtext}
          </p>
        )}
        {submitted ? (
          <p className="text-lg font-semibold">Thanks for subscribing!</p>
        ) : (
          <form
            action={formAction}
            method={formAction ? "POST" : undefined}
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
          >
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError("");
              }}
              placeholder={inputPlaceholder}
              className="flex-1 px-4 py-3 rounded-lg text-surface-foreground bg-white border border-surface-subtle focus:outline-none focus:ring-2 focus:ring-brand-accent"
              required
            />
            <button
              type="submit"
              className="px-6 py-3 bg-brand-accent text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
            >
              {buttonLabel}
            </button>
            {error && (
              <p className="sm:col-span-full text-sm text-red-300 mt-1 basis-full">
                {error}
              </p>
            )}
          </form>
        )}
      </div>
    </section>
  );
}
