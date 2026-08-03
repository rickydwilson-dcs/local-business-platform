import Image from 'next/image';
import { CtaButton } from '@/components/ui/cta-button';

/**
 * MerchCta — solid red band closing the homepage, pointing at the on-site
 * merchandise listing (which then deep-links to the external retailer).
 */
export interface MerchCtaProps {
  heading: string;
  href: string;
  ctaLabel: string;
  /** Optional product shot, shown as eye candy on the band. Source photo
   *  should be on a pure white background — it's blended with
   *  mix-blend-multiply so the white drops out against the red, no
   *  separate cutout asset needed. */
  imageSrc?: string;
}

export function MerchCta({ heading, href, ctaLabel, imageSrc }: MerchCtaProps) {
  return (
    <section id="merch" className="py-24">
      <div className="mx-auto w-full max-w-[80rem] px-6">
        <div className="group relative flex flex-col overflow-hidden bg-brand-primary p-8 sm:p-10 lg:min-h-[24rem] lg:flex-row lg:items-center lg:gap-8 lg:p-16">
          {/* Cap product shot, blended onto the red band. The source photo
              is on a pure white background, so mix-blend-multiply drops the
              white and leaves just the cap — no separate cutout asset
              needed; cropped tight to the cap's own bounding box (object-
              cover against a fixed aspect ratio) rather than the source's
              square frame, which is mostly dead product-photography
              padding. Product-forward on mobile — shown before the copy,
              since the cap is the reason this band exists. On desktop it
              switches to an absolutely-positioned, vertically-centred shot
              on the right side of the card, inset from the edges (not bled
              into the corner — that clipped the crown/brim against the
              card's overflow-hidden bounds). Straightens up and grows on
              hover — a deliberately punchy sign of life (bigger swing than
              a typical micro-interaction, on purpose, so it reads clearly
              against a big flat colour band) — decorative only, so it's
              fine that touch devices never see it. */}
          {imageSrc && (
            <Image
              src={imageSrc}
              alt=""
              aria-hidden="true"
              width={700}
              height={700}
              sizes="(min-width: 1024px) 420px, (min-width: 640px) 340px, 280px"
              className="pointer-events-none relative z-10 order-first aspect-[3/2] w-64 self-center rotate-6 object-cover mix-blend-multiply transition-transform duration-300 ease-out motion-reduce:transition-none group-hover:rotate-0 group-hover:scale-110 sm:w-80 lg:absolute lg:right-8 lg:top-1/2 lg:order-none lg:w-80 lg:-translate-y-1/2 lg:self-auto xl:right-12 xl:w-[26rem]"
            />
          )}
          <div className="relative z-10 lg:max-w-[26rem]">
            <h2 className="max-w-[16ch] text-h2 uppercase text-on-brand-primary">{heading}</h2>
            <div className="mt-8">
              <CtaButton href={href} variant="on-brand">
                {ctaLabel}
              </CtaButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
