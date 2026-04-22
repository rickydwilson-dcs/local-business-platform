import Link from "next/link";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import type { LayoutParams } from "./layout-params";
import { ContactForm } from "../ui/contact-form";

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
      : layout?.background === "inverse"
        ? "bg-surface-inverse text-white"
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
  const services = Array.isArray(d.services)
    ? (d.services as Array<{ slug: string; title: string }>)
    : undefined;
  const serviceAreas = Array.isArray(d.serviceAreas) ? (d.serviceAreas as string[]) : undefined;

  return (
    <section className={`${bg} ${className ?? ""}`} data-component="ContactSection">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        {(heading || subheading) && (
          <div className="mb-12 text-center">
            {heading && (
              <h2 data-slot="heading" className="heading-section tracking-tight">
                {heading}
              </h2>
            )}
            {subheading && (
              <p data-slot="subheading" className="text-body text-surface-muted-foreground">
                {subheading}
              </p>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-12 items-start">
          {/* Left: Contact Form in dark card */}
          <div data-slot="contactForm" className="bg-surface-inverse p-8 md:p-12 rounded-2xl">
            <p className="text-eyebrow text-brand-primary mb-3">Get in touch</p>
            <h3 className="heading-card tracking-tight text-white mb-2">
              Write to us for fast feedback
            </h3>
            <p className="text-body-sm text-surface-muted-foreground mb-8">
              Our team will get back to you as soon as possible with a tailored solution.
            </p>
            <ContactForm services={services} serviceAreas={serviceAreas} darkMode={true} />
          </div>

          {/* Right: sidebar */}
          <aside className="space-y-10 pt-2">
            {slots.showSidebarContact && (phoneDisplay || email || address) && (
              <div data-slot="sidebarContact">
                <p className="text-eyebrow text-brand-primary mb-6">Direct contact</p>
                <div className="space-y-6">
                  {phoneDisplay && (
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center flex-shrink-0">
                        <Phone className="w-5 h-5 text-brand-primary" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="text-caption text-surface-muted-foreground uppercase tracking-widest mb-1">
                          Phone
                        </p>
                        <a
                          href={phoneTel ? `tel:${phoneTel}` : `tel:${phoneDisplay}`}
                          className="text-body font-semibold text-brand-primary hover:underline"
                        >
                          {phoneDisplay}
                        </a>
                      </div>
                    </div>
                  )}
                  {email && (
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center flex-shrink-0">
                        <Mail className="w-5 h-5 text-brand-primary" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="text-caption text-surface-muted-foreground uppercase tracking-widest mb-1">
                          Email
                        </p>
                        <a
                          href={`mailto:${email}`}
                          className="text-body-sm text-brand-primary hover:underline break-all font-medium"
                        >
                          {email}
                        </a>
                      </div>
                    </div>
                  )}
                  {address && (
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-5 h-5 text-brand-primary" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="text-caption text-surface-muted-foreground uppercase tracking-widest mb-1">
                          Address
                        </p>
                        <address className="text-body-sm not-italic text-surface-foreground">
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
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {slots.showSidebarContact &&
              (phoneDisplay || email || address) &&
              slots.showHours &&
              hours && <div className="border-t border-surface-card-border" />}

            {slots.showHours && hours && (hours.weekdays || hours.saturday || hours.sunday) && (
              <div data-slot="hours">
                <p className="text-eyebrow text-brand-primary mb-6">Business hours</p>
                <div className="space-y-3">
                  {hours.weekdays && (
                    <div className="flex items-center justify-between">
                      <span className="text-body-sm text-surface-muted-foreground flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
                        Mon&ndash;Fri
                      </span>
                      <span className="text-body-sm font-medium text-surface-foreground">
                        {hours.weekdays}
                      </span>
                    </div>
                  )}
                  {hours.saturday && (
                    <div className="flex items-center justify-between">
                      <span className="text-body-sm text-surface-muted-foreground flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
                        Saturday
                      </span>
                      <span className="text-body-sm font-medium text-surface-foreground">
                        {hours.saturday}
                      </span>
                    </div>
                  )}
                  {hours.sunday && (
                    <div className="flex items-center justify-between">
                      <span className="text-body-sm text-surface-muted-foreground flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
                        Sunday
                      </span>
                      <span className="text-body-sm font-medium text-surface-foreground">
                        {hours.sunday}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {((slots.showHours && hours) || slots.showSidebarContact) &&
              slots.showServiceLinks &&
              serviceLinks.length > 0 && <div className="border-t border-surface-card-border" />}

            {slots.showServiceLinks && serviceLinks.length > 0 && (
              <div data-slot="serviceLinks">
                <p className="text-eyebrow text-brand-primary mb-4">Our services</p>
                <ul className="space-y-2">
                  {serviceLinks.slice(0, 5).map((svc) => (
                    <li key={svc.slug}>
                      <Link
                        href={`/services/${svc.slug}`}
                        className="text-body-sm text-surface-foreground hover:text-brand-primary transition-colors font-medium"
                      >
                        {svc.title}
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/services"
                  className="text-body-sm text-brand-primary hover:underline font-semibold mt-4 inline-block"
                >
                  View all services &rarr;
                </Link>
              </div>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
}
