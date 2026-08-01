import { CtaButton } from '@/components/ui/cta-button';

/**
 * MerchCta — solid red band closing the homepage, pointing at the on-site
 * merchandise listing (which then deep-links to the external retailer).
 */
export interface MerchCtaProps {
  heading: string;
  href: string;
  ctaLabel: string;
}

export function MerchCta({ heading, href, ctaLabel }: MerchCtaProps) {
  return (
    <section id="merch" className="py-24">
      <div className="mx-auto w-full max-w-[80rem] px-6">
        <div className="flex flex-wrap items-center justify-between gap-8 bg-brand-primary p-10 lg:p-16">
          <h2 className="max-w-[16ch] text-h2 uppercase text-on-brand-primary">{heading}</h2>
          <CtaButton href={href} variant="on-brand">
            {ctaLabel}
          </CtaButton>
        </div>
      </div>
    </section>
  );
}
