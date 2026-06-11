/**
 * TeamAvatarRow
 *
 * Displays circular avatar indicators for team members or clients in a horizontal row
 * Layout: Single row of evenly spaced coloured circles
 * Category: Social Proof
 */

export interface AvatarCircle {
  src?: string;
  alt?: string;
}

export interface TeamAvatarRowProps {
  /** avatar-circles */
  avatarCircles?: AvatarCircle[];
}

export function TeamAvatarRow(props: TeamAvatarRowProps) {
  return (
    <div className="w-full py-8 px-4">
      <div className="flex flex-row items-center justify-center gap-4 md:gap-6 flex-wrap">
        {props.avatarCircles && props.avatarCircles.length > 0 ? (
          props.avatarCircles.map((avatar: AvatarCircle, index: number) => (
            <div key={index} className="flex flex-col items-center gap-2">
              <div
                className={`
                    w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16
                    rounded-full
                    flex items-center justify-center
                    border-2 border-surface-muted
                    overflow-hidden
                    shadow-sm
                    ${
                      index % 8 === 0
                        ? "bg-brand-primary"
                        : index % 8 === 1
                          ? "bg-brand-secondary"
                          : index % 8 === 2
                            ? "bg-brand-accent"
                            : index % 8 === 3
                              ? "bg-surface-muted"
                              : index % 8 === 4
                                ? "bg-surface-foreground"
                                : index % 8 === 5
                                  ? "bg-surface-inverse"
                                  : index % 8 === 6
                                    ? "bg-brand-primary"
                                    : "bg-brand-secondary"
                    }
                  `}
              >
                {avatar.src ? (
                  <img
                    src={avatar.src}
                    alt={avatar.alt ?? `Team member ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-on-brand-primary text-sm md:text-base font-semibold uppercase select-none">
                    {avatar.alt ? avatar.alt.charAt(0) : "?"}
                  </span>
                )}
              </div>
              {avatar.alt && (
                <span className="text-surface-muted-foreground text-xs md:text-sm text-center max-w-[64px] md:max-w-[80px] truncate">
                  {avatar.alt}
                </span>
              )}
            </div>
          ))
        ) : (
          <div className="flex flex-row items-center justify-center gap-4 md:gap-6">
            {[
              { bg: "bg-brand-primary", initial: "A" },
              { bg: "bg-brand-secondary", initial: "B" },
              { bg: "bg-brand-accent", initial: "C" },
              { bg: "bg-surface-foreground", initial: "D" },
              { bg: "bg-surface-inverse", initial: "E" },
            ].map((item, index) => (
              <div
                key={index}
                className={`
                    w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16
                    rounded-full
                    flex items-center justify-center
                    border-2 border-surface-muted
                    shadow-sm
                    ${item.bg}
                  `}
              >
                <span className="text-on-brand-primary text-sm md:text-base font-semibold uppercase select-none">
                  {item.initial}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
