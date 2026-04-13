/**
 * HeroHeadlineColoured
 *
 * Hero with coloured headline
 * Category: Hero
 * Note: Placeholder — re-run --pass translate to regenerate.
 */

export interface HeroHeadlineColouredProps {
  [key: string]: unknown;
}

export function HeroHeadlineColoured(props: HeroHeadlineColouredProps) {
  void props;
  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <p className="text-surface-foreground text-sm uppercase tracking-wider">Hero</p>
        <h2 className="text-surface-foreground text-2xl font-bold mt-2">
          Hero with coloured headline
        </h2>
      </div>
    </section>
  );
}
