import Link from "next/link";
import { Phone, Mail, MapPin, Clock, ArrowRight } from "lucide-react";
import type { LayoutParams } from "./layout-params";

export interface ContactSectionSlots {
  showHours: boolean;
  showServiceLinks: boolean;
  showSidebarContact: boolean;
}

export const CONTACT_SECTION_DEFAULT_SLOTS: ContactSectionSlots = {
  showHours: true,
  showServiceLinks: true,
  showSidebarContact: true,
};

interface AddressData {
  street?: string;
  locality: string;
  region: string;
  postalCode?: string;
}

interface HoursData {
  weekdays?: string;
  saturday?: string;
  sunday?: string;
}

interface ServiceLink {
  slug: string;
  title: string;
}

interface ContactSectionProps {
  slots?: Partial<ContactSectionSlots>;
  layout?: Pick<LayoutParams, "background">;
  data: Record<string, unknown>;
  className?: string;
}

export function ContactSection({
  slots: slotOverrides,
  layout,
  data,
  className,
}: ContactSectionProps) {
  const slots = { ...CONTACT_SECTION_DEFAULT_SLOTS, ...slotOverrides };
  const d = data as Record<string, unknown>;

  const bg =
    layout?.background === "subtle"
      ? "bg-surface-subtle text-surface-foreground"
      : "bg-surface-background text-surface-foreground";

  const heading = typeof d.heading === "string" ? d.heading : undefined;
  const subheading = typeof d.subheading === "string" ? d.subheading : undefined;
  const email = typeof d.email === "string" ? d.email : undefined;
  const phoneDisplay = typeof d.phoneDisplay === "string" ? d.phoneDisplay : undefined;
  const phoneTel = typeof d.phoneTel === "string" ? d.phoneTel : undefined;
  const address =
    d.address && typeof d.address === "object" ? (d.address as AddressData) : undefined;
  const hours = d.hours && typeof d.hours === "object" ? (d.hours as HoursData) : undefined;
  const serviceLinks = Array.isArray(d.serviceLinks) ? (d.serviceLinks as ServiceLink[]) : [];

  return (
    <section className={`${bg} ${className ?? ""}`} data-component="ContactSection">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {(heading || subheading) && (
          <div className="mb-12 text-center">
            {heading && (
              <h2 data-slot="heading" className="text-h2 mb-4">
                {heading}
              </h2>
            )}
            {subheading && (
              <p data-slot="subheading" className="text-surface-muted-foreground text-lg">
                {subheading}
              </p>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 md:grid-cols-[3fr_2fr]">
          {/* Left: Contact Form Placeholder */}
          <div
            data-slot="contactForm"
            className="bg-surface-card border-surface-border rounded-xl border p-8"
          >
            <p className="text-surface-muted-foreground">
              Contact form placeholder &mdash; wire ContactForm at page level
            </p>
          </div>

          {/* Right: Sidebar */}
          <aside className="flex flex-col gap-6">
            {slots.showSidebarContact && (phoneDisplay || email || address) && (
              <div
                data-slot="sidebarContact"
                className="bg-surface-card border-surface-border rounded-xl border p-6"
              >
                <h3 className="text-h4 mb-4">Get in touch</h3>
                <ul className="flex flex-col gap-3">
                  {phoneDisplay && (
                    <li className="flex items-start gap-3">
                      <Phone
                        className="text-brand-primary mt-1 h-5 w-5 flex-shrink-0"
                        aria-hidden="true"
                      />
                      <a
                        href={phoneTel ? `tel:${phoneTel}` : `tel:${phoneDisplay}`}
                        className="hover:text-brand-primary"
                      >
                        {phoneDisplay}
                      </a>
                    </li>
                  )}
                  {email && (
                    <li className="flex items-start gap-3">
                      <Mail
                        className="text-brand-primary mt-1 h-5 w-5 flex-shrink-0"
                        aria-hidden="true"
                      />
                      <a href={`mailto:${email}`} className="hover:text-brand-primary break-all">
                        {email}
                      </a>
                    </li>
                  )}
                  {address && (
                    <li className="flex items-start gap-3">
                      <MapPin
                        className="text-brand-primary mt-1 h-5 w-5 flex-shrink-0"
                        aria-hidden="true"
                      />
                      <address className="not-italic">
                        {address.street && (
                          <>
                            {address.street}
                            <br />
                          </>
                        )}
                        {address.locality}, {address.region}
                        {address.postalCode && (
                          <>
                            <br />
                            {address.postalCode}
                          </>
                        )}
                      </address>
                    </li>
                  )}
                </ul>
              </div>
            )}

            {slots.showHours && hours && (hours.weekdays || hours.saturday || hours.sunday) && (
              <div
                data-slot="hours"
                className="bg-surface-card border-surface-border rounded-xl border p-6"
              >
                <h3 className="text-h4 mb-4 flex items-center gap-2">
                  <Clock className="text-brand-primary h-5 w-5" aria-hidden="true" />
                  Opening hours
                </h3>
                <dl className="flex flex-col gap-2 text-sm">
                  {hours.weekdays && (
                    <div className="flex justify-between gap-4">
                      <dt className="text-surface-muted-foreground">Mon&ndash;Fri</dt>
                      <dd>{hours.weekdays}</dd>
                    </div>
                  )}
                  {hours.saturday && (
                    <div className="flex justify-between gap-4">
                      <dt className="text-surface-muted-foreground">Saturday</dt>
                      <dd>{hours.saturday}</dd>
                    </div>
                  )}
                  {hours.sunday && (
                    <div className="flex justify-between gap-4">
                      <dt className="text-surface-muted-foreground">Sunday</dt>
                      <dd>{hours.sunday}</dd>
                    </div>
                  )}
                </dl>
              </div>
            )}

            {slots.showServiceLinks && serviceLinks.length > 0 && (
              <div
                data-slot="serviceLinks"
                className="bg-surface-card border-surface-border rounded-xl border p-6"
              >
                <h3 className="text-h4 mb-4">Our services</h3>
                <ul className="flex flex-col gap-2">
                  {serviceLinks.slice(0, 5).map((svc) => (
                    <li key={svc.slug}>
                      <Link
                        href={`/services/${svc.slug}`}
                        className="hover:text-brand-primary inline-flex items-center gap-2"
                      >
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                        {svc.title}
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/services"
                  className="text-brand-primary mt-4 inline-flex items-center gap-1 text-sm font-medium hover:underline"
                >
                  View all services <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
}
