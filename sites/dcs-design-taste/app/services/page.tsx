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
    number: "01",
    description:
      "Managed Next.js websites deployed in days, not months. Your clients get a fast, accessible site — you never touch a server.",
    benefits: [
      "Deployed and live within five working days",
      "Automated security and dependency updates",
      "99.3% uptime SLA across all hosted sites",
    ],
  },
  {
    title: "AI Automation",
    slug: "ai-automation",
    number: "02",
    description:
      "Connect your tools, eliminate manual tasks, and surface insights automatically. We build the workflows so you can focus on the work.",
    benefits: [
      "Custom n8n or Make workflows built to your process",
      "AI-assisted content generation and scheduling",
      "Real-time alerts and reporting dashboards",
    ],
  },
  {
    title: "eCommerce Solutions",
    slug: "ecommerce",
    number: "03",
    description:
      "Scalable storefronts built for conversion. Structured data, fast load times, and inventory workflows wired in by default.",
    benefits: [
      "Core Web Vitals optimised out of the box",
      "Schema markup and rich snippets by default",
      "Inventory and order automation integrations",
    ],
  },
  {
    title: "Web Design",
    slug: "web-design",
    number: "04",
    description:
      "Brand-led design that communicates authority. We start with your identity and build outward — no templates, no stock aesthetics.",
    benefits: [
      "Brand audit before every design engagement",
      "Design tokens that translate directly to code",
      "Accessible contrast ratios tested to WCAG AA",
    ],
  },
  {
    title: "SEO and Analytics",
    slug: "seo-analytics",
    number: "05",
    description:
      "Technical SEO, schema markup, and analytics pipelines that give you a clear picture of what's working and what isn't.",
    benefits: [
      "Full technical SEO audit on every new site",
      "GA4 and Search Console configured from day one",
      "Monthly ranking and traffic reports included",
    ],
  },
  {
    title: "Maintenance and Support",
    slug: "maintenance",
    number: "06",
    description:
      "Platform monitoring, security patches, and priority support. We keep your site healthy so you don't have to think about it.",
    benefits: [
      "24/7 uptime monitoring with instant alerts",
      "Priority response within four business hours",
      "Monthly platform health report",
    ],
  },
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
      <div
        className={`fixed inset-0 z-[60] bg-white flex flex-col transition-transform duration-300 md:hidden ${open ? "translate-x-0" : "translate-x-full"}`}
        aria-hidden={!open}
      >
        <div className="flex items-center justify-between px-6 py-6 border-b border-zinc-100">
          <span className="font-bold text-[#0D0D0D] tracking-tight text-lg" style={{ fontFamily: "var(--font-space-grotesk, system-ui)" }}>DCS</span>
          <button onClick={() => setOpen(false)} className="p-2 text-zinc-600" aria-label="Close menu">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <nav className="flex flex-col gap-1 px-6 py-8 flex-1">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="text-2xl font-medium text-[#0D0D0D] py-3 border-b border-zinc-100 hover:text-[#2563EB] transition-colors">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="px-6 pb-8">
          <Link href="/contact" onClick={() => setOpen(false)} className="block w-full text-center bg-[#2563EB] text-white font-semibold py-4 rounded-full hover:bg-[#1D4ED8] transition-colors">
            Start a Project
          </Link>
        </div>
      </div>
    </>
  );
}

export default function ServicesPage() {
  return (
    <>
      <PillNav />

      {/* Page hero */}
      <section className="pt-36 pb-16 bg-[#FAFAFA]">
        <div className="container-standard">
          <nav className="mb-8" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-xs text-zinc-400">
              <li><Link href="/" className="hover:text-zinc-600 transition-colors">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li className="text-zinc-600">Services</li>
            </ol>
          </nav>
          <span className="eyebrow mb-4 block">/// SERVICES</span>
          <h1 className="heading-hero mb-6">
            {SERVICES.length} services.
            <br />
            <span className="text-zinc-400">One platform.</span>
          </h1>
          <p className="body-relaxed text-lg max-w-xl">
            Every service we offer runs on the same managed infrastructure — which means
            lower overhead, faster delivery, and a single point of contact for your entire
            digital operation.
          </p>
        </div>
      </section>

      {/* Services zig-zag */}
      <section className="bg-[#FAFAFA] pb-24">
        <div className="container-standard">
          {SERVICES.map((service, i) => (
            <div
              key={service.slug}
              className="grid grid-cols-1 md:grid-cols-2 gap-12 py-16 border-b border-zinc-100 items-start"
            >
              {/* Content — always left on mobile, alternates on desktop */}
              <div className={i % 2 === 1 ? "md:order-2" : ""}>
                <span
                  className="text-xs font-semibold tracking-widest text-zinc-400 mb-3 block"
                  style={{ fontFamily: "var(--font-geist-mono, monospace)" }}
                >
                  {service.number}
                </span>
                <h2 className="heading-subsection mb-4">{service.title}</h2>
                <p className="body-relaxed mb-8">{service.description}</p>
                <ul className="divide-y divide-zinc-100 mb-8">
                  {service.benefits.map((benefit) => (
                    <li key={benefit} className="py-3 text-sm text-zinc-600 flex items-start gap-3">
                      <span className="text-[#2563EB] mt-0.5 flex-shrink-0" aria-hidden="true">—</span>
                      {benefit}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/services/${service.slug}`}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#2563EB] hover:gap-3 transition-all duration-200"
                >
                  Full details
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </div>
              <div className={`rounded-2xl bg-zinc-100/60 aspect-video ${i % 2 === 1 ? "md:order-1" : ""}`} />
            </div>
          ))}
        </div>
      </section>

      {/* CTA band */}
      <section className="py-24 bg-[#0D0D0D]">
        <div className="container-standard text-center">
          <h2
            className="text-3xl md:text-4xl font-bold tracking-tighter text-white mb-4"
            style={{ fontFamily: "var(--font-space-grotesk, system-ui)" }}
          >
            Not sure where to start?
          </h2>
          <p className="text-zinc-400 mb-8 max-w-md mx-auto">Tell us your problem. We&apos;ll work out which service fits.</p>
          <Link href="/contact" className="inline-flex items-center gap-2 bg-white text-[#0D0D0D] font-semibold px-8 py-4 rounded-full hover:bg-zinc-100 transition-colors active:scale-[0.98]">
            Get in touch
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0D0D0D] border-t border-white/5">
        <div className="container-standard py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div>
              <div className="text-white font-bold text-xl mb-3 tracking-tight" style={{ fontFamily: "var(--font-space-grotesk, system-ui)" }}>DCS</div>
              <p className="text-zinc-400 text-sm leading-relaxed max-w-[28ch]">Websites as intelligent as your business</p>
            </div>
            <div>
              <div className="text-zinc-600 text-xs font-semibold tracking-widest uppercase mb-4">Services</div>
              <ul className="space-y-2">
                {SERVICES.map((s) => (
                  <li key={s.slug}><Link href={`/services/${s.slug}`} className="text-zinc-400 text-sm hover:text-white transition-colors">{s.title}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <div className="text-zinc-600 text-xs font-semibold tracking-widest uppercase mb-4">Contact</div>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li>hello@digitalconsultingservices.co.uk</li>
                <li>United Kingdom</li>
                <li className="flex items-center gap-2 mt-3"><span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" /><span>Open to new projects</span></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/5 mt-12 pt-6">
            <p className="text-zinc-600 text-xs">&copy; 2015 Digital Consulting Services Ltd. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
