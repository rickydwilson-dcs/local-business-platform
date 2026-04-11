/**
 * RigelSchedulePage — Full weekend schedule template
 *
 * Displays sessions in a two-column grid (Saturday / Sunday).
 * Session data is passed as props — not loaded inside this component.
 */

import type { RigelSchedulePageTemplateProps } from "@platform/core-components";

export interface ScheduleSession {
  time: string;
  title: string;
  stage: string;
  speaker: string | null;
  day: "saturday" | "sunday";
}

export interface RigelSchedulePageProps extends RigelSchedulePageTemplateProps {
  sessions?: ScheduleSession[];
  ticketUrl?: string;
  eventDateSaturday?: string;
  eventDateSunday?: string;
}

function stageBadgeClass(stage: string): string {
  if (stage === "Main Stage") return "bg-brand-primary text-white";
  if (stage === "Workshop Room") return "bg-brand-secondary text-brand-primary";
  return "bg-surface-subtle text-surface-foreground";
}

function SessionRow({ session }: { session: ScheduleSession }) {
  const isBreak = session.speaker === null;
  return (
    <div
      className={`flex items-start gap-4 py-4 border-b border-surface-muted last:border-0 ${isBreak ? "opacity-60" : ""}`}
    >
      {/* Time */}
      <div className="flex-shrink-0 w-14">
        <span className="inline-block bg-surface-subtle text-surface-foreground text-xs font-bold px-2 py-1 rounded">
          {session.time}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p
          className={`font-medium leading-snug ${isBreak ? "text-surface-muted-foreground" : "text-surface-foreground"}`}
        >
          {session.title}
        </p>
        {session.speaker && (
          <p className="text-sm text-surface-muted-foreground mt-0.5">{session.speaker}</p>
        )}
      </div>

      {/* Stage badge */}
      <div className="flex-shrink-0">
        <span
          className={`inline-block text-xs font-semibold px-2 py-1 rounded-full ${stageBadgeClass(session.stage)}`}
        >
          {session.stage}
        </span>
      </div>
    </div>
  );
}

export function RigelSchedulePage({
  siteConfig,
  sessions = [],
  ticketUrl,
  eventDateSaturday = "Saturday",
  eventDateSunday = "Sunday",
}: RigelSchedulePageProps) {
  const saturdaySessions = sessions.filter((s) => s.day === "saturday");
  const sundaySessions = sessions.filter((s) => s.day === "sunday");
  const ctaHref = ticketUrl ?? siteConfig.cta.primary.href;

  return (
    <div className="min-h-screen bg-surface-background">
      {/* Header */}
      <section className="bg-brand-primary py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Weekend Schedule</h1>
          <p className="text-lg text-white opacity-90">
            {eventDateSaturday} &amp; {eventDateSunday} · {siteConfig.address.city}
          </p>
        </div>
      </section>

      {/* Schedule Grid */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Saturday */}
            <div>
              <h2 className="text-2xl font-bold text-surface-foreground mb-6 pb-3 border-b-2 border-brand-primary">
                {eventDateSaturday}
              </h2>
              <div>
                {saturdaySessions.map((session, index) => (
                  <SessionRow key={index} session={session} />
                ))}
                {saturdaySessions.length === 0 && (
                  <p className="text-surface-muted-foreground text-sm py-4">
                    Saturday schedule coming soon.
                  </p>
                )}
              </div>
            </div>

            {/* Sunday */}
            <div>
              <h2 className="text-2xl font-bold text-surface-foreground mb-6 pb-3 border-b-2 border-brand-secondary">
                {eventDateSunday}
              </h2>
              <div>
                {sundaySessions.map((session, index) => (
                  <SessionRow key={index} session={session} />
                ))}
                {sundaySessions.length === 0 && (
                  <p className="text-surface-muted-foreground text-sm py-4">
                    Sunday schedule coming soon.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-12 text-center">
            <a
              href={ctaHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 bg-brand-primary text-white font-bold text-lg rounded-lg hover:opacity-90 transition-opacity"
            >
              Get Tickets — Free
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
