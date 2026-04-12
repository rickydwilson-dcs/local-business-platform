/**
 * Speaker Bio Detail (Category B) — static placeholder, no generateStaticParams per brief
 */
import type { Metadata } from 'next';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Speaker | Digital Marketing Weekend 2026',
  description: 'Speaker bio — Digital Marketing Weekend 2026.',
};

export default function SpeakerDetailPage() {
  return (
    <main>
      <section className="py-20 px-4 bg-surface-inverse">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-12 items-start">
          <div className="flex-shrink-0">
            <div className="w-32 h-32 rounded-full bg-brand-primary flex items-center justify-center">
              <span className="text-hero text-brand-secondary font-black">S</span>
            </div>
          </div>
          <div>
            <span className="text-brand-secondary text-sm font-semibold uppercase tracking-widest mb-3 block">
              Speaker
            </span>
            <h1 className="text-h1 text-surface-foreground mb-3">Speaker Name</h1>
            <p className="text-body text-brand-secondary mb-6">Role / Company</p>
            <p className="text-body text-surface-foreground opacity-80 mb-4">
              Bio coming soon. This speaker will share practical insights at Digital Marketing
              Weekend 2026.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-surface-background">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-h2 text-surface-foreground mb-8">Session</h2>
          <div className="p-8 bg-surface-card rounded-lg border border-surface-border">
            <span className="text-brand-secondary text-sm font-semibold uppercase tracking-wider block mb-3">
              Saturday / Sunday · Main Stage
            </span>
            <h3 className="text-h3 text-surface-foreground mb-4">Talk Title TBA</h3>
            <p className="text-body text-surface-foreground opacity-80">
              Session description coming soon.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 px-4 bg-surface-background text-center border-t border-surface-border">
        <a
          href="/speakers"
          className="text-brand-secondary font-semibold hover:opacity-80 transition-opacity"
        >
          ← Back to All Speakers
        </a>
      </section>
    </main>
  );
}
