/**
 * About Page
 *
 * All content driven from siteConfig — no hardcoded business data.
 */

import type { Metadata } from "next";
import Link from "next/link";
import { Shield, Award, CheckCircle, Phone } from "lucide-react";
import { siteConfig } from "@/site.config";
import { PHONE_DISPLAY, PHONE_TEL } from "@/lib/contact-info";
import { absUrl } from "@/lib/site";
import { Breadcrumbs, Schema } from "@platform/core-components";

export const metadata: Metadata = {
  title: `About Us | ${siteConfig.business.name}`,
  description: `Learn about ${siteConfig.business.name} — established ${siteConfig.credentials.yearEstablished}. ${siteConfig.tagline}.`,
  openGraph: {
    title: `About ${siteConfig.business.name}`,
    description: `${siteConfig.tagline}. Established ${siteConfig.credentials.yearEstablished}.`,
    url: absUrl("/about"),
    siteName: siteConfig.business.name,
    locale: "en_GB",
    type: "website",
  },
  alternates: {
    canonical: absUrl("/about"),
  },
};

export default function AboutPage() {
  const breadcrumbItems = [{ name: "About", href: "/about", current: true }];
  const { about, credentials, business, serviceAreas, name, tagline } = siteConfig;

  return (
    <>
      {/* Breadcrumbs */}
      <div className="bg-surface-muted border-b">
        <div className="container-standard py-4">
          <Breadcrumbs items={breadcrumbItems} />
        </div>
      </div>

      <div className="min-h-screen bg-surface-background">
        {/* Hero Section */}
        <section className="section-standard bg-surface-subtle">
          <div className="container-standard">
            <div className="mx-auto w-full lg:w-[90%] text-center">
              {about?.heroBadges && about.heroBadges.length > 0 && (
                <div className="flex flex-wrap justify-center gap-4 mb-8">
                  {about.heroBadges.map((badge, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-brand-primary/10 text-brand-primary border border-brand-primary/20"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              )}
              <h1 className="heading-hero leading-tight">About {name}</h1>
              <p className="text-xl text-surface-foreground leading-relaxed mx-auto w-full lg:w-[90%] mt-6">
                {tagline}
              </p>
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        {about?.story && about.story.length > 0 && (
          <section className="section-standard bg-surface-card">
            <div className="container-standard">
              <div className="mx-auto w-full lg:w-[90%]">
                <h2 className="heading-section mb-8 text-center">Our Story</h2>
                <div className="max-w-3xl mx-auto prose prose-lg text-surface-foreground leading-relaxed">
                  {about.story.map((paragraph, index) => (
                    <p key={index} className={index === 0 ? "text-xl mb-6" : "mb-6"}>
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Company Info Cards */}
        <section className="section-standard bg-surface-card">
          <div className="container-standard">
            <div className="text-center mb-12">
              <h2 className="heading-section">Company Information</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mx-auto w-full lg:w-[90%]">
              <div className="text-center p-6 bg-surface-muted rounded-2xl">
                <h3 className="text-lg font-semibold text-surface-foreground mb-2">Registered Name</h3>
                <p className="text-surface-secondary">{business.legalName}</p>
              </div>
              <div className="text-center p-6 bg-surface-muted rounded-2xl">
                <h3 className="text-lg font-semibold text-surface-foreground mb-2">Established</h3>
                <p className="text-2xl font-bold text-brand-primary">
                  {credentials.yearEstablished}
                </p>
              </div>
              <div className="text-center p-6 bg-surface-muted rounded-2xl">
                <h3 className="text-lg font-semibold text-surface-foreground mb-2">Service Coverage</h3>
                <p className="text-surface-secondary">{serviceAreas.join(", ")}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        {credentials.stats.length > 0 && (
          <section className="section-standard bg-surface-subtle border-t border-b border-surface-subtle">
            <div className="container-standard">
              <div className="text-center mb-12">
                <h2 className="heading-section">Our Track Record Speaks for Itself</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {credentials.stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="bg-surface-card rounded-xl p-6 shadow-sm border border-surface-subtle hover:shadow-md transition-shadow">
                      <div className="text-4xl font-bold text-brand-primary mb-2">{stat.value}</div>
                      <div className="text-surface-foreground font-medium">{stat.label}</div>
                      {stat.description && (
                        <div className="text-sm text-surface-secondary mt-1">{stat.description}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Certifications Section */}
        {credentials.certifications.length > 0 && (
          <section className="section-standard bg-surface-card">
            <div className="container-standard">
              <div className="text-center mb-12">
                <h2 className="heading-section">Certifications &amp; Accreditations</h2>
                <p className="text-lg text-surface-foreground mx-auto w-full lg:w-[90%] mt-4">
                  We maintain the highest industry standards with comprehensive certifications and
                  accreditations.
                </p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {credentials.certifications.map((cert, index) => (
                  <div
                    key={index}
                    className="bg-surface-muted rounded-lg p-6 flex items-start gap-4"
                  >
                    <div className="bg-brand-primary/10 rounded-full p-3 flex-shrink-0">
                      <Award className="w-6 h-6 text-brand-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-surface-foreground">{cert.name}</h3>
                      <p className="text-sm text-surface-secondary">{cert.description}</p>
                    </div>
                  </div>
                ))}
                {credentials.insurance && (
                  <div className="bg-surface-muted rounded-lg p-6 flex items-start gap-4">
                    <div className="bg-surface-subtle rounded-full p-3 flex-shrink-0">
                    {/* eslint-disable-next-line platform/no-hardcoded-tailwind-colors -- Intentional: insurance shield icon */}
                      <Shield className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-surface-foreground">
                        {credentials.insurance.amount} Insurance
                      </h3>
                      <p className="text-sm text-surface-secondary">{credentials.insurance.type}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Values Section */}
        {about?.values && about.values.length > 0 && (
          <section className="section-standard bg-surface-muted">
            <div className="container-standard">
              <div className="text-center mb-12">
                <h2 className="heading-section">Our Values</h2>
                <p className="text-lg text-surface-foreground mx-auto w-full lg:w-[90%] mt-4">
                  These core principles guide everything we do, from the smallest residential project
                  to the largest commercial installation.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {about.values.map((value, index) => (
                  <div key={index} className="text-center">
                    <div className="w-16 h-16 bg-brand-primary rounded-full flex items-center justify-center mx-auto mb-4">
                      <Award className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-surface-foreground mb-3">{value.title}</h3>
                    <p className="text-surface-foreground">{value.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Why Choose Us Section */}
        {about?.whyChooseUs && about.whyChooseUs.length > 0 && (
          <section className="section-standard bg-surface-card">
            <div className="container-standard">
              <div className="text-center mb-12">
                <h2 className="heading-section">Why Choose {name}?</h2>
                <p className="text-lg text-surface-foreground mx-auto w-full lg:w-[90%] mt-4">
                  From small residential projects to complex commercial installations, here&apos;s
                  what sets us apart.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mx-auto w-full lg:w-[90%]">
                {about.whyChooseUs.map((benefit, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 bg-surface-muted rounded-lg"
                  >
                    <div className="flex-shrink-0 w-6 h-6 bg-brand-primary rounded-full flex items-center justify-center mt-0.5">
                      <CheckCircle className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-surface-foreground font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="section-standard bg-brand-primary text-white">
          <div className="container-standard text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Ready to Work with {name}?
            </h2>
            <p className="text-xl mb-8 mx-auto w-full lg:w-[90%] opacity-90 leading-relaxed">
              Get your free quote today and experience the professional difference that{" "}
              {credentials.yearEstablished
                ? `${new Date().getFullYear() - parseInt(credentials.yearEstablished)}+ years of`
                : "our"}{" "}
              expertise brings to your project.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-brand-primary font-semibold rounded-lg hover:bg-surface-muted transition-colors"
              >
                Get Free Quote
              </Link>
              <Link
                href={`tel:${PHONE_TEL}`}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white text-white font-semibold rounded-lg hover:bg-white hover:text-brand-primary transition-colors"
              >
                <Phone className="h-5 w-5" />
                Call: {PHONE_DISPLAY}
              </Link>
            </div>
          </div>
        </section>
      </div>

      {/* Schema Markup */}
      <Schema
        org={{
          name: business.name,
          url: "/",
          logo: "/logo.svg",
        }}
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "About", url: "/about" },
        ]}
        webpage={{
          "@type": "AboutPage",
          "@id": absUrl("/about#aboutpage"),
          url: absUrl("/about"),
          name: `About ${business.name}`,
          description: `Learn about ${business.name} — professional services since ${credentials.yearEstablished}.`,
        }}
      />
    </>
  );
}
