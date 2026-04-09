"use client";

import Link from "next/link";
import { useState } from "react";

const NAV_LINKS = [
  { label: "Services", href: "/services" },
  { label: "Portfolio", href: "/projects" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const SERVICES = [
  {
    title: "Platform Websites",
    slug: "platform-websites",
    description:
      "Managed Next.js websites deployed in days, not months. Your clients get a fast, accessible site — you never touch a server.",
    number: "01",
  },
  {
    title: "AI Automation",
    slug: "ai-automation",
    description:
      "Connect your tools, eliminate manual tasks, and surface insights automatically. We build the workflows so you can focus on the work.",
    number: "02",
  },
  {
    title: "eCommerce Solutions",
    slug: "ecommerce",
    description:
      "Scalable storefronts built for conversion. Structured data, fast load times, and inventory workflows wired in by default.",
    number: "03",
  },
  {
    title: "SEO and Analytics",
    slug: "seo-analytics",
    description:
      "Technical SEO, schema markup, and analytics pipelines that give you a clear picture of what's working and what isn't.",
    number: "04",
  },
  {
    title: "Web Design",
    slug: "web-design",
    description:
      "Brand-led design that communicates authority. We start with your identity and build outward — no templates, no stock aesthetics.",
    number: "05",
  },
  {
    title: "Maintenance and Support",
    slug: "maintenance",
    description:
      "Platform monitoring, security patches, and priority support. We keep your site healthy so you don't have to think about it.",
    number: "06",
  },
];

const STATS = [
  { value: "47", label: "sites deployed" },
  { value: "99.3%", label: "uptime" },
  { value: "23", label: "active clients" },
];

function PillNav() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <nav
        className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-6 px-6 py-3 rounded-full bg-white/80 backdrop-blur-md"
        style={{ boxShadow: "0 0 0 1px rgba(0,0,0,0.05), 0 2px 8px rgba(0,0,0,0.04)" }}
        aria-label="Primary navigation"
      >
        <Link
          href="/"
          className="font-bold text-[#0D0D0D] tracking-tight mr-2"
          style={{ fontFamily: "var(--font-space-grotesk, system-ui)" }}
        >
          DCS
        </Link>
        <div className="hidden md:flex items-center gap-5">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-zinc-600 hover:text-zinc-900 transition-colors duration-150"
            >
              {link.label}
            </Link>
          ))}
        </div>
        <Link
          href="/contact"
          className="hidden md:inline-flex items-center gap-1.5 bg-[#2563EB] text-white text-sm font-semibold px-5 py-2 rounded-full hover:bg-[#1D4ED8] transition-colors duration-150 active:scale-[0.98] ml-2"
        >
          Start a Project
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
        <button
          className="md:hidden p-1.5 text-zinc-600 hover:text-zinc-900"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          aria-expanded={open}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </nav>

      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-[60] bg-white flex flex-col transition-transform duration-300 md:hidden ${open ? "translate-x-0" : "translate-x-full"}`}
        aria-hidden={!open}
      >
        <div className="flex items-center justify-between px-6 py-6 border-b border-zinc-100">
          <span
            className="font-bold text-[#0D0D0D] tracking-tight text-lg"
            style={{ fontFamily: "var(--font-space-grotesk, system-ui)" }}
          >
            DCS
          </span>
          <button
            onClick={() => setOpen(false)}
            className="p-2 text-zinc-600 hover:text-zinc-900"
            aria-label="Close menu"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <nav className="flex flex-col gap-1 px-6 py-8 flex-1">
          {NAV_LINKS.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="text-2xl font-medium text-[#0D0D0D] py-3 border-b border-zinc-100 hover:text-[#2563EB] transition-colors animate-reveal"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="px-6 pb-8">
          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            className="block w-full text-center bg-[#2563EB] text-white font-semibold py-4 rounded-full hover:bg-[#1D4ED8] transition-colors"
          >
            Start a Project
          </Link>
        </div>
      </div>
    </>
  );
}

export default function HomePage() {
  return (
    <>
      <PillNav />

      {/* Hero */}
      <section className="min-h-[100dvh] flex items-center pt-24 pb-16 bg-[#FAFAFA]">
        <div className="container-standard w-full">
          <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-12 lg:gap-20 items-center">
            {/* Left — content */}
            <div>
              <span className="pill-badge mb-6 inline-flex">EST. 2015 · UNITED KINGDOM</span>
              <h1
                className="heading-hero mb-6 text-balance"
              >
                We build the platform.
                <br />
                <span className="text-[#2563EB]">You build the</span>
                <br />
                business.
              </h1>
              <p className="body-relaxed text-lg mb-10">
                Platform websites and AI automation for UK businesses. We ship fast, iterate
                faster, and keep everything running — so you can focus on growth, not
                infrastructure.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/contact"
                  className="btn-primary text-base"
                >
                  Start a Project
                </Link>
                <Link
                  href="/services"
                  className="btn-ghost text-base"
                >
                  See what we do
                </Link>
              </div>
            </div>

            {/* Right — asymmetric stat cards */}
            <div className="hidden lg:grid grid-cols-1 gap-4 relative">
              {STATS.map((stat, i) => (
                <div
                  key={stat.label}
                  className="card-stat animate-reveal"
                  style={{
                    animationDelay: `${i * 150}ms`,
                    marginLeft: i % 2 === 1 ? "2rem" : "0",
                  }}
                >
                  <div
                    className="text-4xl font-bold tracking-tighter text-[#0D0D0D] leading-none mb-1"
                    style={{ fontFamily: "var(--font-geist-mono, monospace)" }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-sm text-zinc-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="border-t border-zinc-100" />

      {/* Services */}
      <section className="section bg-[#FAFAFA]">
        <div className="container-standard">
          <div className="mb-16">
            <span className="eyebrow mb-3 block">/// SERVICES</span>
            <h2 className="heading-section max-w-lg">
              What we build and how we build it
            </h2>
          </div>

          <div className="space-y-0">
            {SERVICES.map((service, i) => (
              <div
                key={service.slug}
                className={`grid grid-cols-1 md:grid-cols-2 gap-8 py-12 border-b border-zinc-100 items-center ${
                  i % 2 === 1 ? "md:[direction:rtl]" : ""
                }`}
              >
                <div className={i % 2 === 1 ? "md:[direction:ltr]" : ""}>
                  <span
                    className="text-xs font-semibold tracking-widest text-zinc-400 mb-3 block"
                    style={{ fontFamily: "var(--font-geist-mono, monospace)" }}
                  >
                    {service.number}
                  </span>
                  <h3 className="heading-subsection mb-4">{service.title}</h3>
                  <p className="body-relaxed mb-6">{service.description}</p>
                  <Link
                    href={`/services/${service.slug}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#2563EB] hover:gap-3 transition-all duration-200"
                  >
                    Learn more
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                      <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                </div>
                <div className={`rounded-2xl bg-zinc-100/60 aspect-video ${i % 2 === 1 ? "md:[direction:ltr]" : ""}`} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="border-t border-zinc-100" />

      {/* About strip */}
      <section className="py-24 bg-[#FAFAFA]">
        <div className="container-standard">
          <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-12 items-start">
            <div>
              <h2 className="heading-section mb-6">
                A platform agency, not a project shop
              </h2>
            </div>
            <div>
              <p className="body-relaxed mb-6">
                We built our own white-label website platform because bespoke WordPress builds
                don&apos;t scale. Now we run it for 23 clients — and the infrastructure costs less
                than one freelancer retainer.
              </p>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#2563EB] hover:gap-3 transition-all duration-200"
              >
                About DCS
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-32 bg-[#0D0D0D]">
        <div className="container-standard text-center">
          <span className="eyebrow text-zinc-500 mb-4 block">OPEN TO NEW PROJECTS</span>
          <h2
            className="text-3xl md:text-5xl font-bold tracking-tighter leading-none text-white mb-6"
            style={{ fontFamily: "var(--font-space-grotesk, system-ui)" }}
          >
            Ready to build something
            <br />
            that actually works?
          </h2>
          <p className="text-zinc-400 mb-10 max-w-lg mx-auto leading-relaxed">
            Tell us what you need. We&apos;ll reply within one business day with a clear scope
            and a fixed price.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-white text-[#0D0D0D] font-semibold px-8 py-4 rounded-full hover:bg-zinc-100 transition-colors duration-150 active:scale-[0.98]"
          >
            Get in touch
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0D0D0D] border-t border-white/5">
        <div className="container-standard py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div>
              <div
                className="text-white font-bold text-xl mb-3 tracking-tight"
                style={{ fontFamily: "var(--font-space-grotesk, system-ui)" }}
              >
                DCS
              </div>
              <p className="text-zinc-400 text-sm leading-relaxed max-w-[28ch]">
                Websites as intelligent as your business
              </p>
            </div>
            <div>
              <div className="text-zinc-600 text-xs font-semibold tracking-widest uppercase mb-4">
                Services
              </div>
              <ul className="space-y-2">
                {SERVICES.map((s) => (
                  <li key={s.slug}>
                    <Link
                      href={`/services/${s.slug}`}
                      className="text-zinc-400 text-sm hover:text-white transition-colors"
                    >
                      {s.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="text-zinc-600 text-xs font-semibold tracking-widest uppercase mb-4">
                Contact
              </div>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li>hello@digitalconsultingservices.co.uk</li>
                <li>United Kingdom</li>
                <li>Mon–Fri, 9:00–17:00</li>
                <li className="flex items-center gap-2 mt-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                  <span className="text-zinc-400">Open to new projects</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/5 mt-12 pt-6">
            <p className="text-zinc-600 text-xs">
              &copy; 2015 Digital Consulting Services Ltd. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
