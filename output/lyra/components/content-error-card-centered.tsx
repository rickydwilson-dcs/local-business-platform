/**
 * ErrorMessageCard
 *
 * Displays an error/whoops message indicating no purchase was made, with a link back home
 * Layout: Centered white card on dark background with heading, body text, and inline link
 * Category: Content
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
        <h1 className="text-2xl md:text-3xl font-bold text-surface-foreground mb-4">
          {props["error-heading"] ?? "Whoops!"}
        </h1>
        <p className="text-surface-muted-foreground text-base md:text-lg mb-6">
          {props["error-body-text"] ?? "It looks like no purchase was made. Don't worry, you haven't been charged."}
        </p>
        <p className="text-surface-muted-foreground text-sm">
          Head back{" "}
          <a
            href={props["back-home-link"] ?? "/"}
            className="text-brand-primary underline hover:text-brand-secondary transition-colors"
          >
            home
          </a>{" "}
          and try again whenever you're ready.
        </p>
      </div>
    </div>
  );
}
