/**
 * RigelSpeakersPage — Speaker listing template
 *
 * Displays all speakers sorted by featured status, day, then time.
 * Receives pre-sorted speaker data as props.
 */

import Link from "next/link";
import type { RigelSpeakersPageTemplateProps, SpeakerSummary } from "@platform/core-components";

export function RigelSpeakersPage({ siteConfig, speakers }: RigelSpeakersPageTemplateProps) {
  return (
    <div className="min-h-screen bg-surface-background">
      {/* Header */}
      <section className="bg-brand-primary py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Meet the Speakers</h1>
          <p className="text-lg text-white opacity-90 max-w-2xl mx-auto">
            Hear from practitioners and specialists across digital marketing, SEO, paid ads, email,
            and AI tools.
          </p>
        </div>
      </section>

      {/* Speakers Grid */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {speakers.length === 0 ? (
            <p className="text-center text-surface-muted-foreground text-lg py-12">
              Speakers will be announced soon. Check back later.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {speakers.map((speaker) => (
                <SpeakerCard key={speaker.slug} speaker={speaker} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function SpeakerCard({ speaker }: { speaker: SpeakerSummary }) {
  return (
    <div className="bg-surface-background border border-surface-muted rounded-2xl p-6 flex flex-col gap-4 hover:shadow-md transition-shadow duration-300">
      {/* Day badge */}
      <div className="flex items-center gap-2">
        <span
          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${
            speaker.day === "saturday"
              ? "bg-brand-primary text-white"
              : "bg-brand-secondary text-brand-primary"
          }`}
        >
          {speaker.day === "saturday" ? "Saturday" : "Sunday"}
        </span>
        {speaker.featured && (
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide bg-surface-subtle text-surface-foreground">
            Featured
          </span>
        )}
      </div>

      {/* Speaker info */}
      <div>
        <h2 className="text-xl font-bold text-surface-foreground">{speaker.name}</h2>
        <p className="text-sm text-surface-muted-foreground mt-1">{speaker.title}</p>
      </div>

      {/* Topic */}
      <p className="text-surface-foreground font-medium leading-snug">{speaker.topic}</p>

      {/* Time + Stage */}
      <p className="text-sm text-surface-muted-foreground">
        {speaker.time} · {speaker.stage}
      </p>

      {/* Link */}
      <Link
        href={`/speakers/${speaker.slug}`}
        className="mt-auto inline-flex items-center gap-1 text-brand-primary font-semibold text-sm hover:underline"
      >
        Read Bio →
      </Link>
    </div>
  );
}
