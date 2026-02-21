/**
 * RegistrationErrorState
 *
 * Displays an error/empty state message indicating no purchase was made during attendee registration flow
 * Layout: Centered card on dark background with heading, body text, and text link
 * Category: Custom
 */

export interface RegistrationErrorStateProps {
  /** error-heading */
  errorHeading?: string;
  /** error-body-text */
  errorBodyText?: string;
  /** back-home-link */
  backHomeLink?: Array<{ label?: string; href?: string }>;
}

export function RegistrationErrorState(props: RegistrationErrorStateProps) {
  return (
    <div className="min-h-screen bg-surface-inverse flex items-center justify-center px-4 py-16">
      <div className="bg-surface-foreground rounded-2xl shadow-lg max-w-md w-full px-8 py-12 flex flex-col items-center text-center">
        <div className="mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-brand-accent mx-auto"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-surface-foreground mb-4">
          {props["error-heading"] ?? "No Purchase Found"}
        </h1>

        <p className="text-surface-muted-foreground text-base md:text-lg leading-relaxed mb-8">
          {props["error-body-text"] ??
            "It looks like no purchase was completed during your registration. Please try again or contact support if you believe this is an error."}
        </p>

        {props["back-home-link"] && (
          <a
            href={props["back-home-link"]}
            className="text-brand-primary underline underline-offset-4 hover:text-brand-secondary transition-colors duration-200 text-sm md:text-base font-medium"
          >
            Return to Home
          </a>
        )}
      </div>
    </div>
  );
}
