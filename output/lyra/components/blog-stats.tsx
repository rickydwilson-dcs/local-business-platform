/**
 * BlogStats
 *
 * Displays blog post metadata or stats such as read time and publication info
 * Layout: Contained horizontal stats row with heading and stat items
 * Category: Stats
 */

export interface BlogStatsProps {
  /** heading */
  heading?: string;
  /** statItems */
  statItems?: Array<{ title?: string; description?: string; image?: string; href?: string }>;
}

export function BlogStats(props: BlogStatsProps) {
  return (
    <div className="bg-surface-background py-8 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        {props.heading && (
          <h2 className="text-surface-foreground text-xl font-semibold mb-4">
            {props.heading}
          </h2>
        )}
        <div className="flex flex-wrap gap-6 items-center border-t border-b border-surface-muted py-4">
          {props.statItems && props.statItems.length > 0 ? (
            props.statItems.map((item, index) => (
              <div
                key={index}
                className="flex flex-col gap-1 min-w-[100px]"
              >
                {item.label && (
                  <span className="text-surface-muted-foreground text-xs uppercase tracking-wide font-medium">
                    {item.label}
                  </span>
                )}
                {item.value && (
                  <span className="text-surface-foreground text-sm font-semibold">
                    {item.value}
                  </span>
                )}
              </div>
            ))
          ) : (
            <>
              <div className="flex flex-col gap-1">
                <span className="text-surface-muted-foreground text-xs uppercase tracking-wide font-medium">
                  Read Time
                </span>
                <span className="text-surface-foreground text-sm font-semibold">
                  5 min read
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-surface-muted-foreground text-xs uppercase tracking-wide font-medium">
                  Published
                </span>
                <span className="text-surface-foreground text-sm font-semibold">
                  January 1, 2024
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-surface-muted-foreground text-xs uppercase tracking-wide font-medium">
                  Category
                </span>
                <span className="text-surface-foreground text-sm font-semibold">
                  Technology
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
