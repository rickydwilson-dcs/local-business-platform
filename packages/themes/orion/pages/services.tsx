import type { ServicesPageTemplateProps } from '@platform/core-components';
import Link from 'next/link';
import { AccentUnderline, PageHeroImage, ImageOverlayCard } from '@platform/core-components';
import { ArrowRight } from 'lucide-react';

interface FeaturedService {
  title: string;
  description: string;
  href: string;
}

interface CategoryCard {
  imageSrc: string;
  imageAlt: string;
  category: string;
  title: string;
  href: string;
}

interface ServiceCategory {
  id: string;
  label: string;
  description: string;
  services: Array<{ slug: string; title: string; description?: string }>;
  bgClass?: string;
}

export interface OrionServicesPageProps extends ServicesPageTemplateProps {
  /** Hero background image path */
  heroImage?: string;
  /** Featured services displayed in zig-zag rows */
  featuredServices?: FeaturedService[];
  /** Category image cards for the grid section */
  categoryCards?: CategoryCard[];
  /** Grouped service categories for sectioned display */
  serviceCategories?: ServiceCategory[];
}

export function OrionServicesPage({
  siteConfig,
  services,
  heroImage,
  featuredServices,
  categoryCards,
  serviceCategories,
}: OrionServicesPageProps) {
  const breadcrumbItems = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/services', current: true },
  ];

  return (
    <>
      <PageHeroImage
        title="Our Services"
        subtitle={`Professional services across ${siteConfig.address.city} & surrounding areas`}
        imageSrc={heroImage || ''}
        imageAlt="Our services"
        breadcrumbs={breadcrumbItems}
      />

      <div className="min-h-screen">
        {/* Featured Services */}
        {featuredServices && featuredServices.length > 0 && (
          <section className="section bg-white">
            <div className="container-narrow">
              <p className="text-sm font-medium uppercase tracking-widest text-brand-primary mb-3">
                Top services
              </p>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-surface-foreground mb-12">
                Top-notch <AccentUnderline as="span">professional</AccentUnderline> assistance
              </h2>

              <div className="space-y-px border-t border-surface-card-border">
                {featuredServices.map(({ title, description, href }, i) => (
                  <Link
                    key={title}
                    href={href}
                    className="group grid md:grid-cols-[auto_1fr_auto] gap-6 items-center py-8 border-b border-surface-card-border hover:bg-surface-muted px-4 -mx-4 rounded-xl transition-colors duration-200"
                  >
                    <div className="w-12 h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-brand-primary/20 transition-colors">
                      <span className="text-lg font-bold text-brand-primary">{i + 1}</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-surface-foreground mb-1 group-hover:text-brand-primary transition-colors">
                        {title}
                      </h3>
                      <p className="text-sm text-surface-muted-foreground leading-relaxed max-w-2xl">
                        {description}
                      </p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-surface-muted-foreground group-hover:text-brand-primary group-hover:translate-x-1 transition-all duration-200 flex-shrink-0 hidden md:block" aria-hidden="true" />
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Category Image Grid */}
        {categoryCards && categoryCards.length > 0 && (
          <section className="section bg-surface-muted">
            <div className="container-narrow">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-surface-foreground mb-2">
                Browse services by type
              </h2>
              <p className="text-surface-muted-foreground mb-10 max-w-xl">
                Explore our comprehensive range of services organised by category.
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                {categoryCards.map((card) => (
                  <ImageOverlayCard
                    key={card.title}
                    imageSrc={card.imageSrc}
                    imageAlt={card.imageAlt}
                    category={card.category}
                    title={card.title}
                    href={card.href}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Service Categories (if provided) or flat list */}
        {serviceCategories && serviceCategories.length > 0 ? (
          serviceCategories.map((category) => (
            <section
              key={category.id}
              id={category.id}
              className={`section scroll-mt-20 ${category.bgClass || 'bg-white'}`}
            >
              <div className="container-narrow">
                <div className="mb-12">
                  <p className="text-sm font-medium uppercase tracking-widest text-brand-primary mb-3">
                    {category.label}
                  </p>
                  <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-surface-foreground mb-3">
                    {category.label} services
                  </h2>
                  <p className="text-surface-muted-foreground max-w-xl">
                    {category.description}
                  </p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.services.map((service) => (
                    <Link
                      key={service.slug}
                      href={`/services/${service.slug}`}
                      className="bg-surface-background rounded-2xl shadow-lg border border-surface-border p-6 group hover:shadow-xl transition-shadow"
                    >
                      <h3 className="text-xl font-semibold mb-3 group-hover:text-brand-primary transition-colors text-surface-foreground">
                        {service.title}
                      </h3>
                      {service.description && (
                        <p className="text-surface-muted-foreground line-clamp-3">
                          {service.description}
                        </p>
                      )}
                      <span className="inline-block mt-4 text-brand-primary font-medium group-hover:translate-x-1 transition-transform">
                        Learn more &rarr;
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          ))
        ) : (
          /* Flat services grid fallback */
          <section className="section bg-white">
            <div className="container-narrow">
              <div className="mb-12">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-surface-foreground mb-3">
                  All Services
                </h2>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service) => (
                  <Link
                    key={service.slug}
                    href={`/services/${service.slug}`}
                    className="bg-surface-background rounded-2xl shadow-lg border border-surface-border p-6 group hover:shadow-xl transition-shadow"
                  >
                    <h3 className="text-xl font-semibold mb-3 group-hover:text-brand-primary transition-colors text-surface-foreground">
                      {service.title}
                    </h3>
                    {service.description && (
                      <p className="text-surface-muted-foreground line-clamp-3">
                        {service.description}
                      </p>
                    )}
                    <span className="inline-block mt-4 text-brand-primary font-medium group-hover:translate-x-1 transition-transform">
                      Learn more &rarr;
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  );
}
