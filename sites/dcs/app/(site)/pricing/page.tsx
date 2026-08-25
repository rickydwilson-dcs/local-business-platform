import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Pricing | Digital Consulting Services',
  description:
    'Simple, transparent pricing for tradesperson websites. Pay monthly from £45/month or upfront from £750. No hidden fees.',
};

// ─── Data ─────────────────────────────────────────────────────────────────────
// Unchanged from the pre-rebuild version — visual rebuild only.

const tiers = [
  {
    name: 'Starter',
    pages: 'Up to 20',
    upfront: '£750',
    monthlyAfterUpfront: '£10/mo',
    payMonthly: '£45/mo',
    minTerm: '24 months',
    popular: false,
  },
  {
    name: 'Professional',
    pages: 'Up to 50',
    upfront: '£1,495',
    monthlyAfterUpfront: '£15/mo',
    payMonthly: '£85/mo',
    minTerm: '24 months',
    popular: true,
  },
  {
    name: 'Growth',
    pages: 'Up to 100',
    upfront: '£2,995',
    monthlyAfterUpfront: '£25/mo',
    payMonthly: '£150/mo',
    minTerm: '24 months',
    popular: false,
  },
] as const;

const included = [
  'Custom bespoke design',
  'Local SEO built in (service pages, location pages, Schema markup)',
  'Mobile-first and fast',
  'Contact form with email notification',
  'Hosting, SSL certificate, and domain management',
  'Ongoing support and monitoring',
  'Unlimited revision rounds during build',
  'Google Search Console submission',
];

const tierDifferences = [
  { label: 'Pages', starter: '20', professional: '50', growth: '100' },
  {
    label: 'Content updates included per month',
    starter: '1',
    professional: '2',
    growth: '4',
  },
  {
    label: 'Build timeline',
    starter: '4 weeks',
    professional: '6 weeks',
    growth: '8 weeks',
  },
] as const;

const addons = [
  {
    icon: 'star',
    name: 'Review capture widget',
    description: 'Prompt happy customers to leave a review on Google or Trustpilot automatically.',
  },
  {
    icon: 'sms',
    name: 'SMS lead notification',
    description: 'Get a text message the moment a new enquiry lands in your inbox.',
  },
  {
    icon: 'analytics',
    name: 'Call tracking number',
    description: 'A dedicated number that records which marketing channel drove the call.',
  },
  {
    icon: 'smart_toy',
    name: 'AI chatbot FAQ',
    description: 'A lightweight chatbot that answers common questions 24/7 without your input.',
  },
  {
    icon: 'calendar_month',
    name: 'Booking calendar integration',
    description: 'Let customers book a slot directly from your website.',
  },
  {
    icon: 'location_on',
    name: 'Google My Business setup',
    description: 'Full GMB profile creation and optimisation for local search visibility.',
  },
  {
    icon: 'ads_click',
    name: 'Google Ads management',
    description: 'Targeted pay-per-click campaigns managed monthly to drive immediate leads.',
  },
] as const;

const faqs = [
  {
    question: 'Do I own my website?',
    answer:
      'Yes, if you paid upfront. Pay-monthly clients own all their content; the hosting arrangement transfers to you if you cancel after your minimum term.',
  },
  {
    question: 'What happens if I want to cancel?',
    answer:
      "Give us 30 days notice after your minimum term and we'll export all your content so you can take it elsewhere. No fuss.",
  },
  {
    question: 'Can I upgrade my tier later?',
    answer:
      "Yes, you can upgrade at any time. We'll quote for the additional pages and work out the most cost-effective route for you.",
  },
  {
    question: 'Is there a contract?',
    answer:
      'Pay-monthly has a 24-month minimum term, after which it rolls monthly. Upfront clients have no ongoing commitment beyond the monthly hosting fee.',
  },
  {
    question: "What's included in 'managed hosting'?",
    answer:
      'Hosting on fast UK servers, SSL certificate, domain renewal, security monitoring, and uptime alerts — all managed by us.',
  },
] as const;

// ─── Page ──────────────────────────────────────────────────────────────────────
//
// r9 visual language, expressed through the promoted theme tokens (not the
// homepage's bespoke home-r9.css, which stays untouched and page-scoped):
// magenta CTAs, ink "selected" panels, aqua accents, pill-shaped buttons with
// a hover lift, heavy tight-tracking display type.
//
// Font choice: every heading below uses `font-sans` (Archivo), not
// `font-heading` (Poppins). This matches the real r9 homepage, where Poppins
// is reserved for the lowercase wordmark and every headline is set in heavy
// Archivo — and Poppins is only loaded at weight 300 (`app/layout.tsx`), so
// pairing it with `font-bold` here would silently fail to render bold.
//
// Trap 10 (CLAUDE.md): comma'd tier figures (£1,495 / £2,995) must never sit
// on `tabular-nums` or a monospace face. Every price figure below carries an
// explicit `font-sans` class of its own — belt-and-suspenders on top of the
// ancestor chain, which was checked end to end: `app/globals.css` only scopes
// `font-variant-numeric: tabular-nums` to the opt-in `.stat-value` class
// (never applied here, never applied to any ancestor of this page), `body`
// sets no font-family at all, and no `font-mono` class appears anywhere in
// this file or on any wrapping element.

export default function PricingPage() {
  return (
    <div className="min-h-screen font-sans">
      {/* ── Hero ──────────────────────────────────────────────────────────────── */}
      <header className="bg-brand-primary py-20 md:py-28">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="max-w-2xl">
            <span className="inline-block bg-white/15 text-white text-xs font-bold uppercase tracking-[0.18em] px-4 py-1.5 rounded-full mb-6">
              Pricing
            </span>
            <h1 className="text-4xl md:text-5xl xl:text-6xl font-black font-sans text-white mb-5 leading-[1.02] tracking-tight">
              Simple, Transparent Pricing
            </h1>
            <p className="text-lg md:text-xl text-white/80 font-sans leading-relaxed">
              No hidden fees. No long contracts. Just a website that works.
            </p>
          </div>
        </div>
      </header>

      {/* ── Payment options explainer ─────────────────────────────────────────── */}
      <section className="py-16 md:py-24 bg-surface-background">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-black font-sans text-surface-foreground mb-10 text-center tracking-tight">
            Two ways to pay
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pay Upfront */}
            <div className="bg-surface-card rounded-[20px] border border-surface-card-border p-7">
              <div className="flex items-center gap-3 mb-5">
                <div className="bg-brand-primary/10 w-12 h-12 rounded-full flex items-center justify-center">
                  <span
                    className="material-symbols-outlined text-brand-primary text-2xl leading-none"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                    aria-hidden="true"
                  >
                    payments
                  </span>
                </div>
                <h3 className="font-sans font-extrabold text-xl text-surface-foreground tracking-tight">
                  Pay Upfront
                </h3>
              </div>
              <ul className="space-y-3 text-surface-muted-foreground font-sans text-sm leading-relaxed">
                <li className="flex items-start gap-2">
                  <span
                    className="material-symbols-outlined text-brand-primary text-base leading-none mt-0.5 shrink-0"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                    aria-hidden="true"
                  >
                    check_circle
                  </span>
                  One-off setup fee covers design and build.
                </li>
                <li className="flex items-start gap-2">
                  <span
                    className="material-symbols-outlined text-brand-primary text-base leading-none mt-0.5 shrink-0"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                    aria-hidden="true"
                  >
                    check_circle
                  </span>
                  Lower monthly fee after launch — just hosting and management.
                </li>
                <li className="flex items-start gap-2">
                  <span
                    className="material-symbols-outlined text-brand-primary text-base leading-none mt-0.5 shrink-0"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                    aria-hidden="true"
                  >
                    check_circle
                  </span>
                  You own the site outright from day one.
                </li>
              </ul>
            </div>

            {/* Pay Monthly */}
            <div className="bg-surface-card rounded-[20px] border border-surface-card-border p-7">
              <div className="flex items-center gap-3 mb-5">
                <div className="bg-brand-primary/10 w-12 h-12 rounded-full flex items-center justify-center">
                  <span
                    className="material-symbols-outlined text-brand-primary text-2xl leading-none"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                    aria-hidden="true"
                  >
                    calendar_month
                  </span>
                </div>
                <h3 className="font-sans font-extrabold text-xl text-surface-foreground tracking-tight">
                  Pay Monthly
                </h3>
              </div>
              <ul className="space-y-3 text-surface-muted-foreground font-sans text-sm leading-relaxed">
                <li className="flex items-start gap-2">
                  <span
                    className="material-symbols-outlined text-brand-primary text-base leading-none mt-0.5 shrink-0"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                    aria-hidden="true"
                  >
                    check_circle
                  </span>
                  No upfront setup fee — spread the cost over time.
                </li>
                <li className="flex items-start gap-2">
                  <span
                    className="material-symbols-outlined text-brand-primary text-base leading-none mt-0.5 shrink-0"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                    aria-hidden="true"
                  >
                    check_circle
                  </span>
                  Higher monthly cost covers design, build, hosting, and support.
                </li>
                <li className="flex items-start gap-2">
                  <span
                    className="material-symbols-outlined text-brand-primary text-base leading-none mt-0.5 shrink-0"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                    aria-hidden="true"
                  >
                    check_circle
                  </span>
                  24-month minimum term.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Tier comparison cards ─────────────────────────────────────────────── */}
      <section className="py-16 md:py-24 bg-surface-background">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-black font-sans text-surface-foreground mb-10 text-center tracking-tight">
            Choose your tier
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={
                  tier.popular
                    ? 'rounded-[20px] p-7 relative flex flex-col bg-surface-foreground text-white shadow-2xl'
                    : 'rounded-[20px] p-7 relative flex flex-col bg-surface-card border border-surface-card-border shadow-sm'
                }
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-brand-accent text-surface-foreground text-xs font-bold font-sans px-4 py-1.5 rounded-full whitespace-nowrap">
                      Most Popular
                    </span>
                  </div>
                )}

                <h3
                  className={
                    tier.popular
                      ? 'font-sans font-extrabold text-2xl text-white mb-1 mt-2 tracking-tight'
                      : 'font-sans font-extrabold text-2xl text-surface-foreground mb-1 mt-2 tracking-tight'
                  }
                >
                  {tier.name}
                </h3>
                <p
                  className={
                    tier.popular
                      ? 'text-white/70 text-sm font-sans mb-6'
                      : 'text-surface-muted-foreground text-sm font-sans mb-6'
                  }
                >
                  {tier.pages} pages
                </p>

                {/* Pricing rows */}
                <div className="space-y-4 mb-6 flex-1">
                  <div
                    className={
                      tier.popular
                        ? 'bg-white/10 rounded-xl p-4'
                        : 'bg-surface-background rounded-xl p-4'
                    }
                  >
                    <p
                      className={
                        tier.popular
                          ? 'text-xs text-white/60 font-sans uppercase tracking-wide mb-1'
                          : 'text-xs text-surface-muted-foreground font-sans uppercase tracking-wide mb-1'
                      }
                    >
                      Pay upfront
                    </p>
                    <p
                      className={
                        tier.popular
                          ? 'font-sans font-extrabold text-2xl text-white tracking-tight'
                          : 'font-sans font-extrabold text-2xl text-surface-foreground tracking-tight'
                      }
                    >
                      {tier.upfront}
                    </p>
                    <p
                      className={
                        tier.popular
                          ? 'text-xs text-white/60 font-sans mt-1'
                          : 'text-xs text-surface-muted-foreground font-sans mt-1'
                      }
                    >
                      then {tier.monthlyAfterUpfront} ongoing
                    </p>
                  </div>

                  <div
                    className={
                      tier.popular
                        ? 'bg-white/10 rounded-xl p-4'
                        : 'bg-surface-background rounded-xl p-4'
                    }
                  >
                    <p
                      className={
                        tier.popular
                          ? 'text-xs text-white/60 font-sans uppercase tracking-wide mb-1'
                          : 'text-xs text-surface-muted-foreground font-sans uppercase tracking-wide mb-1'
                      }
                    >
                      Pay monthly (no setup)
                    </p>
                    <p
                      className={
                        tier.popular
                          ? 'font-sans font-extrabold text-2xl text-white tracking-tight'
                          : 'font-sans font-extrabold text-2xl text-surface-foreground tracking-tight'
                      }
                    >
                      {tier.payMonthly}
                    </p>
                    <p
                      className={
                        tier.popular
                          ? 'text-xs text-white/60 font-sans mt-1'
                          : 'text-xs text-surface-muted-foreground font-sans mt-1'
                      }
                    >
                      {tier.minTerm} minimum
                    </p>
                  </div>
                </div>

                <Link
                  href="/contact"
                  className={
                    tier.popular
                      ? 'block text-center py-3.5 px-6 rounded-full text-sm font-bold font-sans transition-all bg-brand-accent text-surface-foreground hover:-translate-y-0.5 hover:shadow-xl'
                      : 'block text-center py-3.5 px-6 rounded-full text-sm font-bold font-sans transition-all bg-brand-primary text-white hover:-translate-y-0.5 hover:shadow-xl'
                  }
                >
                  Get a quote
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What's included ───────────────────────────────────────────────────── */}
      <section className="py-16 md:py-24 bg-brand-secondary">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-black font-sans text-white mb-10 text-center tracking-tight">
              What&apos;s Included on Every Plan
            </h2>
            <div className="bg-white/5 rounded-[20px] border border-white/10 p-8">
              <ul className="space-y-4">
                {included.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span
                      className="material-symbols-outlined text-brand-accent text-xl leading-none mt-0.5 shrink-0"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                      aria-hidden="true"
                    >
                      check_circle
                    </span>
                    <span className="text-white/90 font-sans leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── What changes between tiers ────────────────────────────────────────── */}
      <section className="py-16 md:py-24 bg-surface-background">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-black font-sans text-surface-foreground mb-10 text-center tracking-tight">
            What Changes Between Tiers
          </h2>
          <div className="bg-surface-card rounded-[20px] border border-surface-card-border overflow-hidden">
            {/* Header row */}
            <div className="grid grid-cols-4 bg-surface-foreground">
              <div className="p-4 font-sans font-bold text-sm text-white" />
              {tiers.map((tier) => (
                <div
                  key={tier.name}
                  className="p-4 font-sans font-bold text-sm text-white text-center"
                >
                  {tier.name}
                </div>
              ))}
            </div>
            {/* Data rows */}
            {tierDifferences.map((row, i) => (
              <div
                key={row.label}
                className={`grid grid-cols-4${i < tierDifferences.length - 1 ? ' border-b border-surface-card-border' : ''}`}
              >
                <div className="p-4 font-sans text-sm text-surface-muted-foreground leading-relaxed">
                  {row.label}
                </div>
                <div className="p-4 font-sans text-sm text-surface-foreground text-center font-semibold">
                  {row.starter}
                </div>
                <div className="p-4 font-sans text-sm text-surface-foreground text-center font-semibold">
                  {row.professional}
                </div>
                <div className="p-4 font-sans text-sm text-surface-foreground text-center font-semibold">
                  {row.growth}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Extras & Add-ons ──────────────────────────────────────────────────── */}
      <section className="py-16 md:py-24 bg-surface-background">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-black font-sans text-surface-foreground mb-3 text-center tracking-tight">
            We Can Also Add&hellip;
          </h2>
          <p className="text-center text-surface-muted-foreground font-sans mb-10">
            Prices vary &mdash; get in touch to discuss what you need.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {addons.map((addon) => (
              <div
                key={addon.name}
                className="bg-surface-card rounded-[20px] border border-surface-card-border p-5 transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="bg-brand-primary/10 w-11 h-11 rounded-full flex items-center justify-center mb-4">
                  <span
                    className="material-symbols-outlined text-brand-primary text-2xl leading-none"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                    aria-hidden="true"
                  >
                    {addon.icon}
                  </span>
                </div>
                <h3 className="font-sans font-extrabold text-base text-surface-foreground mb-2 tracking-tight">
                  {addon.name}
                </h3>
                <p className="text-surface-muted-foreground text-sm font-sans leading-relaxed">
                  {addon.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────────────── */}
      <section className="py-16 md:py-24 bg-surface-background">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-black font-sans text-surface-foreground mb-10 text-center tracking-tight">
              Frequently Asked Questions
            </h2>
            <div className="space-y-3">
              {faqs.map((faq) => (
                <details
                  key={faq.question}
                  className="bg-surface-card rounded-[20px] border border-surface-card-border group"
                >
                  <summary className="flex items-center justify-between gap-4 p-6 cursor-pointer list-none font-sans font-bold text-base text-surface-foreground select-none">
                    {faq.question}
                    <span
                      className="material-symbols-outlined text-brand-primary text-xl leading-none shrink-0 transition-transform group-open:rotate-180"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                      aria-hidden="true"
                    >
                      expand_more
                    </span>
                  </summary>
                  <div className="px-6 pb-6 font-sans text-surface-muted-foreground leading-relaxed text-sm">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA banner ────────────────────────────────────────────────────────── */}
      <section className="bg-brand-accent py-16 md:py-20">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-black font-sans text-surface-foreground mb-4 tracking-tight">
            Not sure which plan is right for you?
          </h2>
          <p className="text-lg font-sans text-surface-foreground/80 mb-10 max-w-xl mx-auto">
            Let&apos;s talk. We&apos;ll recommend the right tier for your trade and answer any
            questions you have.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-surface-foreground text-white px-10 py-4 rounded-full text-base font-bold font-sans transition-all hover:-translate-y-0.5 hover:shadow-xl"
          >
            Get a free quote
          </Link>
        </div>
      </section>
    </div>
  );
}
