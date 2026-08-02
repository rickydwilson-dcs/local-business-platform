import Image from 'next/image';
import { listSlugs, loadMdx } from '@/lib/mdx';
import { MerchFrontmatterSchema, type MerchFrontmatter } from '@/lib/schemas/merch';
import { getImageSizes, getImageUrl } from '@/lib/image';
import { siteConfig } from '@/site.config';
import { PageHead } from '@/components/sections/page-head';
import { CtaButton } from '@/components/ui/cta-button';
import { ExternalLinkIcon } from '@/components/ui/icons';

/**
 * MerchPage — "Number 51" merchandise listing.
 *
 * Every card is a deep link to the retailer's own product page: NP Racing has
 * no on-site checkout. Each card carries three independent leaving-the-site
 * cues — a visible "External" chip on the artwork, the external-link glyph in
 * the CTA, and screen-reader text naming the destination — plus
 * `target="_blank" rel="noopener noreferrer"`.
 *
 * Products are read from `content/merch/*.mdx`; nothing about the range is
 * hardcoded here.
 */
const RETAILER_NAME = 'The Clothing Kings';

async function getMerchProducts(): Promise<Array<{ slug: string; frontmatter: MerchFrontmatter }>> {
  const slugs = await listSlugs('merch');

  const products = await Promise.all(
    slugs.map(async (slug) => {
      const { frontmatter } = await loadMdx({ baseDir: 'merch', slug });
      return { slug, frontmatter: MerchFrontmatterSchema.parse(frontmatter) };
    })
  );

  return products.sort((a, b) => a.frontmatter.sortOrder - b.frontmatter.sortOrder);
}

export async function MerchPage() {
  const products = await getMerchProducts();

  return (
    <>
      <PageHead
        tag="Merchandise"
        heading="Kit up in team colours."
        lede={`Every item is printed to order and fulfilled by our partner store, ${RETAILER_NAME} — pick a piece below and it will take you straight to that product.`}
        note={`Prices as last checked on the retailer's site · fulfilled and shipped by ${RETAILER_NAME}, not ${siteConfig.business.name} directly`}
      />

      <section aria-label="Team merchandise" className="py-14">
        <div className="mx-auto w-full max-w-[80rem] px-6">
          {products.length === 0 ? (
            <p className="text-body text-surface-secondary">
              The merchandise range is being updated — check back soon.
            </p>
          ) : (
            <ul className="grid border border-surface-card-border sm:grid-cols-2 lg:grid-cols-4">
              {products.map(({ slug, frontmatter }) => (
                <li
                  key={slug}
                  className="flex flex-col border-b border-surface-card-border last:border-b-0 sm:border-r sm:[&:nth-child(2n)]:border-r-0 lg:[&:nth-child(2n)]:border-r lg:[&:nth-child(4n)]:border-r-0"
                >
                  <div className="relative aspect-square overflow-hidden bg-surface-card">
                    <Image
                      src={getImageUrl(frontmatter.image.src)}
                      alt={frontmatter.image.alt}
                      fill
                      sizes={getImageSizes('card')}
                      className="object-cover grayscale-[0.25]"
                    />
                    <span className="absolute right-0 top-0 z-10 inline-flex items-center gap-1.5 bg-black/80 px-2.5 py-1.5 text-caption uppercase text-surface-tertiary">
                      <ExternalLinkIcon className="h-3 w-3" />
                      External
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col gap-2 p-5">
                    <h2 className="font-sans text-base font-extrabold leading-tight text-surface-foreground">
                      {frontmatter.title}
                    </h2>
                    <p className="text-small text-surface-secondary">{frontmatter.description}</p>
                    <p className="mt-1 font-heading text-2xl leading-none text-brand-accent">
                      {frontmatter.displayPrice}
                      {!frontmatter.available && (
                        <span className="ml-2 align-middle text-caption uppercase text-surface-tertiary">
                          Currently unavailable
                        </span>
                      )}
                    </p>
                    <div className="mt-auto pt-3">
                      <CtaButton
                        href={frontmatter.externalUrl}
                        external
                        externalSiteName={RETAILER_NAME}
                        fullWidth
                      >
                        View at {RETAILER_NAME}
                      </CtaButton>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section
        aria-label="Retailer information"
        className="border-t border-surface-card-border py-14"
      >
        <div className="mx-auto w-full max-w-[56ch] px-6 text-center">
          <p className="text-small text-surface-secondary">
            All {siteConfig.business.name} merchandise is sold and fulfilled by{' '}
            <a
              href={siteConfig.racing.merchandiseStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-brand-accent underline underline-offset-2"
            >
              {RETAILER_NAME}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>{' '}
            — see the full range, sizing and delivery information on their site.
          </p>
        </div>
      </section>
    </>
  );
}
