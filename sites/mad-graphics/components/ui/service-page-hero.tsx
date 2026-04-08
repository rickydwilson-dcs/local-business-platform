import Image from 'next/image';
import Link from 'next/link';

interface ServicePageHeroProps {
  title: string;
  description: string;
  badge?: string;
  heroImage?: string;
  phone: string;
}

export function ServicePageHero({
  title,
  description,
  badge,
  heroImage,
  phone,
}: ServicePageHeroProps) {
  const phoneTel = phone.replace(/\s/g, '');

  return (
    <section className="relative bg-surface-background py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text column */}
          <div>
            {badge && <span className="label-overline mb-6 inline-block">{badge}</span>}
            <h1 className="text-6xl md:text-7xl font-headline font-bold italic tracking-tight leading-none mb-8">
              {title}
            </h1>
            <p className="text-lg text-surface-muted-foreground font-body leading-relaxed max-w-xl mb-10">
              {description}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="bg-brand-primary text-surface-background px-10 py-4 rounded-lg font-bold text-base hover:bg-brand-primary-hover transition-colors uppercase tracking-widest"
              >
                Get Free Quote
              </Link>
              <Link
                href={`tel:${phoneTel}`}
                className="border border-surface-card-border text-surface-foreground px-10 py-4 rounded-lg font-bold text-base hover:bg-surface-muted transition-colors uppercase tracking-widest inline-flex items-center gap-2"
              >
                <svg
                  aria-hidden="true"
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                {phone}
              </Link>
            </div>
          </div>

          {/* Image column */}
          <div className="relative">
            {heroImage ? (
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                <Image
                  src={heroImage}
                  alt={`Professional ${title.toLowerCase()} services`}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-surface-background/40 to-transparent" />
              </div>
            ) : (
              <div className="aspect-[4/3] bg-surface-muted rounded-lg border border-surface-card-border flex items-center justify-center">
                <span className="text-surface-muted-foreground font-body text-sm uppercase tracking-widest">
                  Service Photography
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
