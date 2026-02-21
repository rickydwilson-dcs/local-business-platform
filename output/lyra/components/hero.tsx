/**
 * Hero
 *
 * Hero section
 * Layout: contained
 * Category: Hero
 */

export interface HeroProps {
  /** subheading */
  subheading?: string;
  /** ctaButtons */
  ctaButtons?: Array<{ label?: string; href?: string }>;
  /** backgroundImage */
  backgroundImage?: { src?: string; alt?: string };
}

export function Hero(props: HeroProps) {
  return (
    <section
      className="bg-brand-primary relative overflow-hidden"
      style={
        props.backgroundImage
          ? { backgroundImage: `url(${props.backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
          : undefined
      }
    >
      {props.backgroundImage && (
        <div className="absolute inset-0 bg-brand-primary opacity-70" aria-hidden="true" />
      )}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 lg:py-36">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-surface-background leading-tight tracking-tight">
            Welcome to Our Platform
          </h1>
          {props.subheading && (
            <p className="mt-6 text-lg md:text-xl text-surface-background opacity-90 leading-relaxed">
              {props.subheading}
            </p>
          )}
          {props.ctaButtons && props.ctaButtons.length > 0 && (
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
              {props.ctaButtons.map((button, index) => (
                <a
                  key={index}
                  href={button.href}
                  className={
                    index === 0
                      ? "inline-block px-8 py-3 bg-surface-background text-brand-primary font-semibold rounded-lg hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-surface-background focus:ring-offset-2"
                      : "inline-block px-8 py-3 border-2 border-surface-muted text-surface-background font-semibold rounded-lg hover:bg-surface-background hover:text-brand-primary transition-colors focus:outline-none focus:ring-2 focus:ring-surface-background focus:ring-offset-2"
                  }
                >
                  {button.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
