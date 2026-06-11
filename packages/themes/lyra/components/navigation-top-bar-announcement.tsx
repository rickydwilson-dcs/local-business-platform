/**
 * AnnouncementBar
 *
 * Top-of-page announcement strip promoting the team with a CTA link
 * Layout: Full-width single row centered text with arrow link
 * Category: Navigation
 */

export interface AnnouncementBarProps {
  /** announcement-text */
  announcementText?: string;
  /** cta-link */
  ctaLink?: { label?: string; href?: string };
}

export function AnnouncementBar(props: AnnouncementBarProps) {
  return (
    <div className="bg-brand-primary w-full py-2 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-sm">
        <span className="text-on-brand-primary font-medium text-center">
          {props.announcementText ?? "🎉 Welcome to our team — we're building something great!"}
        </span>
        {props.ctaLink?.href && (
          <a
            href={props.ctaLink.href}
            className="text-on-brand-primary font-semibold underline underline-offset-2 inline-flex items-center gap-1 hover:opacity-80 transition-opacity whitespace-nowrap"
            aria-label={props.ctaLink.label ?? "Learn more"}
          >
            {props.ctaLink.label ?? "Learn more"}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </a>
        )}
      </div>
    </div>
  );
}
