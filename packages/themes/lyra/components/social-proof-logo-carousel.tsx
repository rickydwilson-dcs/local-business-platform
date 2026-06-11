/**
 * TeamAvatarCarousel
 *
 * Displays circular avatar/profile indicators, likely team members or client logos in a horizontal row
 * Layout: Single row of evenly spaced coloured circles
 * Category: Social Proof
 */
import { RevealOnScroll } from "@platform/core-components/components/animation";
export interface AvatarItem {
  src?: string;
  alt?: string;
}
export interface TeamAvatarCarouselProps {
  /** avatar-circles */
  avatarCircles?: AvatarItem[];
}
export function TeamAvatarCarousel(props: TeamAvatarCarouselProps) {
  return (
    <section className="py-12 px-4 bg-surface-background">
      <div className="max-w-4xl mx-auto">
        <RevealOnScroll variant="fade-up">
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6 lg:gap-8">
            {props.avatarCircles && props.avatarCircles.length > 0 ? (
              props.avatarCircles.map((avatar: AvatarItem, index: number) => {
                const colorClasses = [
                  "bg-brand-primary",
                  "bg-brand-secondary",
                  "bg-brand-accent",
                  "bg-surface-inverse",
                  "bg-surface-muted",
                  "bg-brand-primary",
                  "bg-brand-secondary",
                  "bg-brand-accent",
                ];
                const textClasses = [
                  "text-on-brand-primary",
                  "text-on-brand-secondary",
                  "text-surface-background",
                  "text-surface-background",
                  "text-surface-foreground",
                  "text-on-brand-primary",
                  "text-on-brand-secondary",
                  "text-surface-background",
                ];
                const bgClass = colorClasses[index % colorClasses.length];
                const textClass = textClasses[index % textClasses.length];

                return (
                  <div key={index} className="flex flex-col items-center gap-2 group">
                    <div
                      className={`relative w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full ${bgClass} flex items-center justify-center border-2 border-surface-muted shadow-md transition-transform duration-200 group-hover:scale-110 overflow-hidden`}
                      aria-label={avatar.alt ?? `Team member ${index + 1}`}
                    >
                      {avatar.src ? (
                        <img
                          src={avatar.src}
                          alt={avatar.alt ?? `Team member ${index + 1}`}
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <span
                          className={`text-lg md:text-xl font-semibold ${textClass} select-none`}
                        >
                          {avatar.alt
                            ? avatar.alt
                                .split(" ")
                                .map((word: string) => word[0])
                                .join("")
                                .slice(0, 2)
                                .toUpperCase()
                            : (index + 1).toString()}
                        </span>
                      )}
                    </div>
                    {avatar.alt && (
                      <span className="text-xs md:text-sm text-surface-muted-foreground text-center max-w-[80px] leading-tight">
                        {avatar.alt}
                      </span>
                    )}
                  </div>
                );
              })
            ) : (
              <>
                {[
                  { bg: "bg-brand-primary", text: "text-on-brand-primary", initials: "AB" },
                  { bg: "bg-brand-secondary", text: "text-on-brand-secondary", initials: "CD" },
                  { bg: "bg-brand-accent", text: "text-surface-background", initials: "EF" },
                  { bg: "bg-surface-inverse", text: "text-surface-background", initials: "GH" },
                  { bg: "bg-surface-muted", text: "text-surface-foreground", initials: "IJ" },
                ].map((item, index) => (
                  <div key={index} className="flex flex-col items-center gap-2 group">
                    <div
                      className={`w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full ${item.bg} flex items-center justify-center border-2 border-surface-muted shadow-md transition-transform duration-200 group-hover:scale-110`}
                      aria-label={`Team member ${index + 1}`}
                    >
                      <span className={`text-lg md:text-xl font-semibold ${item.text} select-none`}>
                        {item.initials}
                      </span>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
