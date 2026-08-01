import { getBrand } from '@/lib/brand';
import { PageHead } from '@/components/sections/page-head';
import { ContactEnquiryForm } from '@/components/contact-enquiry-form';
import {
  FacebookIcon,
  HandshakeIcon,
  InstagramIcon,
  MailIcon,
  type IconProps,
} from '@/components/ui/icons';

/**
 * ContactPage — "Number 51" contact layout.
 *
 * Direct channels on the left, enquiry form on the right. Email and Instagram
 * come from `content/brand/npracing.mdx`; Facebook is shown as "link coming
 * soon" because the team has not supplied a profile URL — no placeholder URL
 * is invented.
 *
 * The form does not send. See ContactEnquiryForm for the reasoning.
 */
interface ChannelRow {
  key: string;
  icon: (props: IconProps) => React.ReactElement;
  label: string;
  value: string;
  href?: string;
  external?: boolean;
}

export async function ContactPage() {
  const brand = await getBrand();

  const channels: ChannelRow[] = [
    {
      key: 'email',
      icon: MailIcon,
      label: 'Email',
      value: brand.email,
      href: `mailto:${brand.email}`,
    },
    {
      key: 'instagram',
      icon: InstagramIcon,
      label: 'Instagram',
      value: brand.instagramHandle,
      href: brand.instagramUrl,
      external: true,
    },
    {
      key: 'facebook',
      icon: FacebookIcon,
      label: 'Facebook',
      value: 'Link coming soon',
    },
    {
      key: 'sponsorship',
      icon: HandshakeIcon,
      label: 'Sponsorship & partnerships',
      value: 'Enquire by email',
      href: `mailto:${brand.email}?subject=Sponsorship%20enquiry`,
    },
  ];

  return (
    <>
      <PageHead
        tag="Contact"
        heading="Get in touch with the team."
        lede={`Sponsorship enquiries, media requests or a message for the ${brand.teamName} crew — reach us by email or Instagram.`}
      />

      <section aria-label="Contact the team" className="py-14">
        <div className="mx-auto w-full max-w-[80rem] px-6">
          <div className="grid border border-surface-card-border lg:grid-cols-[0.85fr_1.15fr]">
            <div className="border-b border-surface-card-border p-8 lg:border-b-0 lg:border-r lg:p-10">
              <h2 className="mb-6 font-sans text-caption uppercase tracking-[0.14em] text-surface-tertiary">
                Direct
              </h2>

              <ul className="flex flex-col gap-6">
                {channels.map((channel) => {
                  const Icon = channel.icon;
                  return (
                    <li key={channel.key} className="flex items-center gap-4">
                      <span className="grid h-11 w-11 flex-none place-items-center bg-brand-primary text-on-brand-primary">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="flex flex-col">
                        <span className="text-caption uppercase text-surface-tertiary">
                          {channel.label}
                        </span>
                        {channel.href ? (
                          <a
                            href={channel.href}
                            {...(channel.external
                              ? { target: '_blank', rel: 'noopener noreferrer' }
                              : {})}
                            className="font-sans text-base font-bold text-surface-foreground transition-colors duration-normal hover:text-brand-accent"
                          >
                            {channel.value}
                            {channel.external && (
                              <span className="sr-only"> (opens in a new tab)</span>
                            )}
                          </a>
                        ) : (
                          <span className="font-sans text-small text-surface-tertiary">
                            {channel.value}
                          </span>
                        )}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="p-8 lg:p-10">
              <h2 className="text-h3 uppercase text-surface-foreground">Send a message</h2>
              <p className="mb-7 mt-1.5 text-small text-surface-secondary">
                Fill this in to check your details — then email the team directly while the form is
                being connected.
              </p>
              <ContactEnquiryForm email={brand.email} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
