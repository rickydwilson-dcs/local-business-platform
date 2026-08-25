import type { AboutPageTemplateProps } from '@platform/core-components';
import Link from 'next/link';

const defaultStats = [
  { value: 'Founded 2019', label: 'Years in Business' },
  { value: 'UK-Wide', label: 'Client Coverage' },
  { value: '5-Star', label: 'Rated Service' },
];

const values = [
  {
    icon: 'trending_up',
    title: 'We care about your results',
    body: 'Every site we build is measured against one goal: more enquiries for your trade business. We track what works and keep improving.',
  },
  {
    icon: 'handshake',
    title: 'No jargon, no hassle',
    body: 'We explain everything in plain English. No confusing tech talk, no surprise invoices — just honest, straightforward service.',
  },
  {
    icon: 'support_agent',
    title: 'Always reachable',
    body: 'You get a real person to talk to. Call or email whenever you need us — we respond the same working day.',
  },
];

export function SiteAboutPage({ siteConfig }: AboutPageTemplateProps) {
  const statItems =
    siteConfig.stats && siteConfig.stats.length > 0 ? siteConfig.stats : defaultStats;

  return (
    <div className="min-h-screen font-sans bg-surface-foreground">
      {/* ─── Hero ──────────────────────────────────────────────────────────────── */}
      <header className="bg-surface-foreground pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="max-w-[1200px] mx-auto px-6">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-8 md:mb-10">
            <ol className="flex items-center gap-2 text-sm text-white/60 font-sans">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">
                <span className="material-symbols-outlined text-sm leading-none align-middle">
                  chevron_right
                </span>
              </li>
              <li>
                <span className="text-white font-semibold" aria-current="page">
                  About
                </span>
              </li>
            </ol>
          </nav>

          <div className="max-w-3xl">
            <div className="text-xs font-bold uppercase tracking-[0.11em] text-brand-accent mb-5">
              Who we are
            </div>
            <h1 className="text-5xl md:text-6xl xl:text-7xl font-extrabold font-heading text-white mb-6 leading-[0.95] tracking-[-0.03em]">
              About Digital Consulting Services
            </h1>
            <p className="text-lg md:text-xl text-white/70 font-sans leading-relaxed max-w-xl">
              {siteConfig.tagline}
            </p>
          </div>
        </div>
      </header>

      {/* ─── Story ─────────────────────────────────────────────────────────────── */}
      <section className="bg-surface-background py-20 md:py-28 rounded-t-[2.5rem] md:rounded-t-[3rem]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left — story text */}
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.11em] text-brand-primary mb-5">
                Our story
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold font-heading text-surface-foreground mb-7 leading-[0.95] tracking-[-0.03em]">
                Built by tradespeople,
                <br />
                for tradespeople
              </h2>
              <p className="text-surface-muted-foreground font-sans leading-relaxed mb-5">
                Digital Consulting Services was founded in 2019 by Ricky Wilson with one clear
                purpose: to help skilled tradespeople get found online and win more work. Based in
                Polegate, East Sussex, we saw first-hand how brilliant plumbers, electricians, and
                builders were losing jobs simply because their online presence didn&rsquo;t reflect
                the quality of their work.
              </p>
              <p className="text-surface-muted-foreground font-sans leading-relaxed mb-5">
                Since then we&rsquo;ve grown into a specialist web design and digital marketing
                agency working exclusively with local service businesses across the UK. Every site
                we build is fast, mobile-first, and engineered to rank in local search — so when a
                homeowner in your area searches for the job you do, your business comes up first.
              </p>
              <p className="text-surface-muted-foreground font-sans leading-relaxed">
                We&rsquo;re proudly independent and UK-based. No offshore outsourcing, no account
                managers who don&rsquo;t know your industry. You deal directly with the people doing
                the work — and we measure our success by the enquiries hitting your phone.
              </p>
            </div>

            {/* Right — placeholder image area */}
            <div className="bg-surface-muted border border-surface-card-border rounded-[1.75rem] aspect-[4/3] flex items-center justify-center overflow-hidden">
              <div className="bg-brand-primary/10 w-24 h-24 rounded-2xl flex items-center justify-center">
                <span
                  className="material-symbols-outlined text-brand-primary"
                  style={{ fontSize: '48px', fontVariationSettings: "'FILL' 1" }}
                  aria-hidden="true"
                >
                  web
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Stats ─────────────────────────────────────────────────────────────── */}
      <section className="bg-brand-secondary py-16 md:py-20">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 border-t border-white/15 md:border-t-0">
            {statItems.map((stat, index) => (
              <div
                key={index}
                className="py-8 md:py-2 border-b md:border-b-0 md:border-l border-white/15 first:border-l-0 px-0 md:px-10 first:pl-0"
              >
                <div className="font-heading text-4xl md:text-5xl font-extrabold text-white mb-3 leading-[0.95] tracking-[-0.03em]">
                  {stat.value}
                </div>
                <div className="text-brand-accent font-sans text-xs uppercase tracking-[0.11em] font-bold">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Values ────────────────────────────────────────────────────────────── */}
      <section className="bg-surface-background py-20 md:py-28">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="max-w-2xl mb-14">
            <div className="text-xs font-bold uppercase tracking-[0.11em] text-brand-primary mb-5">
              What we believe in
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold font-heading text-surface-foreground leading-[0.95] tracking-[-0.03em]">
              The way we work
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {values.map((value) => (
              <div
                key={value.icon}
                className="bg-surface-card rounded-[1.25rem] border border-surface-card-border p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="bg-brand-primary/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
                  <span
                    className="material-symbols-outlined text-brand-primary text-3xl leading-none"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                    aria-hidden="true"
                  >
                    {value.icon}
                  </span>
                </div>
                <h3 className="text-lg font-bold font-heading text-surface-foreground mb-3 tracking-[-0.02em]">
                  {value.title}
                </h3>
                <p className="text-surface-muted-foreground font-sans leading-relaxed text-sm">
                  {value.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA Strip ─────────────────────────────────────────────────────────── */}
      <section className="bg-brand-primary py-20 md:py-24 rounded-b-[2.5rem] md:rounded-b-[3rem]">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold font-heading text-white mb-5 leading-[0.95] tracking-[-0.03em]">
            Ready to grow your trade business?
          </h2>
          <p className="text-lg text-white/80 font-sans mb-10 max-w-xl mx-auto">
            Let&rsquo;s build you a website that wins more jobs in {siteConfig.address.city}
            {siteConfig.address.county ? ` and ${siteConfig.address.county}` : ''}.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-3 bg-white text-brand-primary px-10 py-5 rounded-full text-base font-semibold shadow-lg transition-transform duration-300 hover:-translate-y-1 font-sans"
          >
            Get in touch
          </Link>
        </div>
      </section>
    </div>
  );
}
