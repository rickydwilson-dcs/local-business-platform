/**
 * AnnouncementBar
 *
 * Top-of-page announcement strip promoting the award-winning team with a CTA link
 * Layout: Full-width single row centered text with arrow link
 * Category: Navigation
 */

export interface AnnouncementBarProps {
  /** announcement-text */
  announcementText?: string;
  /** announcement-cta */
  announcementCta?: { label?: string; href?: string };
}

export function AnnouncementBar(props: AnnouncementBarProps) {
  return (
    <div className="bg-brand-primary w-full py-2 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-sm flex-wrap">
        <span className="text-on-brand-primary font-medium text-center">
          {props.announcementText ??
            "🏆 We've been named an award-winning team — discover what sets us apart."}
        </span>
        {props.announcementCta?.href && (
          <a
            href={props.announcementCta.href}
            className="text-on-brand-primary underline underline-offset-2 font-semibold inline-flex items-center gap-1 hover:opacity-80 transition-opacity whitespace-nowrap"
            aria-label={props.announcementCta.label ?? "Learn more"}
          >
            {props.announcementCta.label ?? "Learn more"}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </a>
        )}
      </div>
    </div>
  );
}
