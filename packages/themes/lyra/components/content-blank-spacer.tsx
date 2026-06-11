/**
 * ContentSpacer
 *
 * Large white space section likely intended for team bios, values or additional about content that is not rendering in the screenshot
 * Layout: Full-width empty white block
 * Category: Content
 */
import { RevealOnScroll } from "@platform/core-components/components/animation";
export interface ContentSpacerProps {
  /** dynamic-content-placeholder */
  dynamicContentPlaceholder?: string;
}
export function ContentSpacer(props: ContentSpacerProps) {
  return (
    <section className="w-full bg-surface-background py-24 md:py-32 lg:py-40">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
        <RevealOnScroll variant="fade-up">
          <div className="flex flex-col items-center justify-center text-center gap-6">
            <div className="w-16 h-1 bg-brand-accent rounded-full" />
            <p className="text-surface-muted-foreground text-sm uppercase tracking-widest font-medium">
              Our Team &amp; Values
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-surface-foreground max-w-2xl leading-tight">
              Content coming soon
            </h2>
            <p className="text-surface-muted-foreground text-base md:text-lg max-w-xl leading-relaxed">
              We&apos;re putting the finishing touches on this section. Check back shortly to meet
              the people behind our work and learn what drives us.
            </p>
            <div className="w-16 h-1 bg-brand-accent rounded-full" />
          </div>
        </RevealOnScroll>

        <div className="mt-16 md:mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="bg-surface-muted rounded-2xl p-8 flex flex-col items-center gap-4 animate-fade-in-up"
            >
              <div className="w-20 h-20 rounded-full bg-surface-foreground opacity-10" />
              <div className="w-32 h-3 rounded-full bg-surface-foreground opacity-10" />
              <div className="w-24 h-2 rounded-full bg-surface-foreground opacity-5" />
              <div className="w-full h-2 rounded-full bg-surface-foreground opacity-5 mt-2" />
              <div className="w-5/6 h-2 rounded-full bg-surface-foreground opacity-5" />
              <div className="w-4/6 h-2 rounded-full bg-surface-foreground opacity-5" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
