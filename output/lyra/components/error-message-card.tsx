/**
 * ErrorMessageCard
 *
 * Displays an error or empty state message indicating no purchase was made, with a link back home
 * Layout: Centered white card on dark background with heading, body text, and inline or text link
 * Category: Custom
 */

export interface ErrorMessageCardProps {
  /** error-heading */
  errorHeading?: string;
  /** error-body-text */
  errorBodyText?: string;
  /** back-home-link */
  backHomeLink?: Array<{ label?: string; href?: string }>;
}

export function ErrorMessageCard(props: ErrorMessageCardProps) {
  return (
    <div className="min-h-screen bg-surface-background flex items-center justify-center px-4 py-16">
      <div className="bg-surface-foreground rounded-2xl shadow-lg max-w-md w-full px-8 py-12 text-center">
        <div className="mb-6">
          <svg
            className="mx-auto h-16 w-16 text-surface-muted-foreground"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-surface-foreground mb-4">
          {props["error-heading"] ?? "No Purchase Found"}
        </h1>

        <p className="text-surface-muted-foreground text-base leading-relaxed mb-8">
          {props["error-body-text"] ??
            "It looks like no purchase was made or something went wrong. Please try again or return to the home page."}
        </p>

        <a
          href={props["back-home-link"] ?? "/"}
          className="inline-block bg-brand-primary text-on-brand-primary font-semibold rounded-lg px-6 py-3 text-sm transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2"
        >
          Back to Home
        </a>
      </div>
    </div>
  );
}
