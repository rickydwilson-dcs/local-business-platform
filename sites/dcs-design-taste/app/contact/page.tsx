"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

const NAV_LINKS = [
  { label: "Services", href: "/services" },
  { label: "Portfolio", href: "/projects" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const CONTACT_META = [
  { label: "Email", value: "hello@digitalconsultingservices.co.uk" },
  { label: "Location", value: "United Kingdom" },
  { label: "Hours", value: "Mon–Fri, 9:00–17:00" },
  { label: "Response", value: "Within one business day" },
  { label: "Status", value: "Open to new projects" },
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
        <Link href="/" className="font-bold text-[#0D0D0D] tracking-tight mr-2" style={{ fontFamily: "var(--font-space-grotesk, system-ui)" }}>DCS</Link>
        <div className="hidden md:flex items-center gap-5">
          {NAV_LINKS.map((link) => (<Link key={link.href} href={link.href} className="text-sm text-zinc-600 hover:text-zinc-900 transition-colors duration-150">{link.label}</Link>))}
        </div>
        <Link href="/contact" className="hidden md:inline-flex items-center gap-1.5 bg-[#2563EB] text-white text-sm font-semibold px-5 py-2 rounded-full hover:bg-[#1D4ED8] transition-colors duration-150 active:scale-[0.98] ml-2">
          Start a Project
        </Link>
        <button className="md:hidden p-1.5 text-zinc-600" onClick={() => setOpen(true)} aria-label="Open menu" aria-expanded={open}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
        </button>
      </nav>
      <div className={`fixed inset-0 z-[60] bg-white flex flex-col transition-transform duration-300 md:hidden ${open ? "translate-x-0" : "translate-x-full"}`} aria-hidden={!open}>
        <div className="flex items-center justify-between px-6 py-6 border-b border-zinc-100">
          <span className="font-bold text-[#0D0D0D] tracking-tight text-lg" style={{ fontFamily: "var(--font-space-grotesk, system-ui)" }}>DCS</span>
          <button onClick={() => setOpen(false)} className="p-2 text-zinc-600" aria-label="Close menu">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
          </button>
        </div>
        <nav className="flex flex-col gap-1 px-6 py-8 flex-1">
          {NAV_LINKS.map((link) => (<Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="text-2xl font-medium text-[#0D0D0D] py-3 border-b border-zinc-100 hover:text-[#2563EB] transition-colors">{link.label}</Link>))}
        </nav>
        <div className="px-6 pb-8"><Link href="/contact" onClick={() => setOpen(false)} className="block w-full text-center bg-[#2563EB] text-white font-semibold py-4 rounded-full">Start a Project</Link></div>
      </div>
    </>
  );
}

function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = data.get("name") as string;
    const email = data.get("email") as string;
    const message = data.get("message") as string;

    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!email.trim() || !email.includes("@")) newErrors.email = "Valid email is required";
    if (!message.trim()) newErrors.message = "Message is required";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      if (res.ok) {
        setStatus("sent");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div>
        <label htmlFor="name" className="form-label">Name</label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          className={`form-input ${errors.name ? "ring-2 ring-red-400 border-red-300" : ""}`}
          placeholder="Your name"
        />
        {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
      </div>
      <div>
        <label htmlFor="email" className="form-label">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          className={`form-input ${errors.email ? "ring-2 ring-red-400 border-red-300" : ""}`}
          placeholder="you@company.co.uk"
        />
        {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
      </div>
      <div>
        <label htmlFor="company" className="form-label">
          Company <span className="text-zinc-400 font-normal">(optional)</span>
        </label>
        <input
          id="company"
          name="company"
          type="text"
          autoComplete="organization"
          className="form-input"
          placeholder="Your company"
        />
      </div>
      <div>
        <label htmlFor="message" className="form-label">What are you building?</label>
        <textarea
          id="message"
          name="message"
          className={`form-textarea ${errors.message ? "ring-2 ring-red-400 border-red-300" : ""}`}
          placeholder="Tell us about your project — what you need, what you've tried, and what success looks like for you."
        />
        {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message}</p>}
      </div>

      {status === "sent" && (
        <p className="text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
          Message sent. We&apos;ll reply within one business day.
        </p>
      )}
      {status === "error" && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          Something went wrong. Email us directly at hello@digitalconsultingservices.co.uk
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full bg-[#2563EB] text-white font-semibold py-3.5 rounded-full hover:bg-[#1D4ED8] transition-colors active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === "sending" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}

export default function ContactPage() {
  return (
    <>
      <PillNav />

      {/* Hero */}
      <section className="pt-36 pb-16 bg-[#FAFAFA]">
        <div className="container-standard">
          <span className="eyebrow mb-4 block">OPEN TO NEW PROJECTS</span>
          <h1 className="heading-hero mb-4">Get in touch</h1>
          <p className="body-relaxed text-lg">
            Tell us what you need. We reply within one business day with a clear scope and a fixed
            price.
          </p>
        </div>
      </section>

      {/* Form + meta */}
      <section className="bg-[#FAFAFA] pb-24">
        <div className="container-standard">
          <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-16 items-start">
            <ContactForm />

            {/* Contact metadata */}
            <div className="divide-y divide-zinc-100">
              {CONTACT_META.map((item) => (
                <div key={item.label} className="py-4 flex items-start justify-between gap-4">
                  <span className="text-xs font-semibold tracking-wider text-zinc-400 uppercase pt-0.5 flex-shrink-0">
                    {item.label}
                  </span>
                  <span className="text-sm text-zinc-700 text-right">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
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
              <div className="text-zinc-600 text-xs font-semibold tracking-widest uppercase mb-4">Navigation</div>
              <ul className="space-y-2">
                {NAV_LINKS.map((link) => (<li key={link.href}><Link href={link.href} className="text-zinc-400 text-sm hover:text-white transition-colors">{link.label}</Link></li>))}
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
