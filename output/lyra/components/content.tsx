/**
 * Content
 *
 * Content section
 * Layout: contained
 * Category: Content
 */

export interface ContentProps {
  /** body */
  body?: string;
  /** image */
  image?: { src?: string; alt?: string };
}

export function Content(props: ContentProps) {
  return (
    <section className="bg-surface-background py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {props.image && (
            <div className="w-full overflow-hidden rounded-lg">
              <img
                src={props.image}
                alt=""
                className="w-full h-auto object-cover"
              />
            </div>
          )}
          <div className={!props.image ? "md:col-span-2 max-w-3xl mx-auto text-center" : ""}>
            {props.body && (
              <p className="text-surface-foreground text-lg leading-relaxed">
                {props.body}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
