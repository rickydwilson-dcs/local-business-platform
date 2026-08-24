import Image from 'next/image';
import type { MerchProduct } from '@/lib/merch';
import { PageHead } from '@/components/sections/page-head';
import { ArrowButton } from '@/components/sections/arrow-link';

/**
 * MerchPage — the team store listing.
 *
 * Every card is rendered from a content/merch/*.mdx record; nothing about the
 * products is hardcoded here. NPRacing does not sell or fulfil anything
 * itself, so each card links out to the retailer's own product page and says
 * so plainly: an external-link icon, a "Shop at <retailer>" label, a
 * screen-reader "(opens in a new tab)" suffix, and target/rel on the anchor.
 */
export interface MerchPageProps {
  products: MerchProduct[];
  /** Retailer display name, e.g. "The Clothing Kings". */
  retailerName: string;
  /** Retailer's NPRacing category page. */
  retailerUrl: string;
}

export function MerchPage({ products, retailerName, retailerUrl }: MerchPageProps) {
  return (
    <>
      <div className="grain-overlay" aria-hidden="true" />

      <PageHead
        eyebrow="Team merchandise"
        title="Kit up in team colours."
        lede={`Pick a piece below and it will take you straight to that product on ${retailerName}'s site.`}
        note={`Prices as listed by the retailer · sold, fulfilled and shipped by ${retailerName}, not NPRacing directly`}
      />

      <section className="container-grid py-16">
        <h2 className="sr-only">Available merchandise</h2>

        {products.length === 0 ? (
          <p className="text-surface-secondary-foreground">
            No merchandise is listed at the moment.
          </p>
        ) : (
          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <li key={product.slug} className="flex">
                <article className="flex w-full flex-col overflow-hidden rounded-card border border-surface-card-border bg-surface-card transition-colors duration-300 hover:border-brand-primary">
                  <div className="aspect-square overflow-hidden bg-surface-subtle">
                    <Image
                      src={product.image.src}
                      alt={product.image.alt}
                      width={product.image.width}
                      height={product.image.height}
                      sizes="(min-width: 1280px) 20rem, (min-width: 640px) 45vw, 100vw"
                      quality={65}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="flex flex-1 flex-col gap-3 p-5">
                    <h3 className="text-h4 text-surface-foreground">{product.title}</h3>
                    <p className="text-sm leading-relaxed text-surface-secondary-foreground">
                      {product.description}
                    </p>
                    <p className="font-heading text-2xl text-brand-accent">
                      {product.displayPrice}
                      {!product.available && (
                        <span className="ml-2 align-middle text-xs font-bold uppercase tracking-wide text-surface-tertiary-foreground">
                          Currently unavailable
                        </span>
                      )}
                    </p>

                    <div className="mt-auto pt-2">
                      <ArrowButton
                        href={product.externalUrl}
                        external
                        externalLabel={`Shop ${product.title} at ${retailerName}`}
                        className="w-full"
                      >
                        Shop at {retailerName}
                      </ArrowButton>
                    </div>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="border-t border-surface-card-border py-14">
        <div className="container-grid text-center">
          <p className="mx-auto max-w-[56ch] leading-relaxed text-surface-secondary-foreground">
            All NPRacing merchandise is sold and fulfilled by{' '}
            <a
              href={retailerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-brand-accent underline underline-offset-2"
            >
              {retailerName}
              <span className="sr-only">(opens in a new tab)</span>
            </a>{' '}
            — see the full range, sizing and delivery information on their site.
          </p>
        </div>
      </section>
    </>
  );
}
