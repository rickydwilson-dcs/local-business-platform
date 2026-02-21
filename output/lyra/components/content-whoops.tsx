/**
 * ContentWhoops
 *
 * Content section: Whoops!
 * Layout: contained
 * Category: Content
 */

export interface ContentWhoopsProps {
  /** heading */
  heading?: string;
  /** body */
  body?: string;
}

export function ContentWhoops(props: ContentWhoopsProps) {
  return (
    <section className="bg-surface-background py-16 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-6 text-6xl" aria-hidden="true">😬</div>
        <h2 className="text-3xl md:text-4xl font-bold text-surface-foreground mb-4">
          {props.heading ?? "Whoops!"}
        </h2>
        <p className="text-surface-muted-foreground text-lg md:text-xl leading-relaxed">
          {props.body ?? "Something went wrong. Please try again or contact us if the problem persists."}
        </p>
      </div>
    </section>
  );
}
