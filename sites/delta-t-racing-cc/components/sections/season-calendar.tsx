'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { Race } from '@/lib/schemas/races';

/**
 * SeasonCalendar — the championship rounds from content/races/*.mdx.
 *
 * Which rounds are done and which is next depends on *today*, not on when the
 * site was last built (a static build could be weeks old), so status is
 * worked out in the browser after mount. The server render shows every round
 * with its dates and no status, which is still correct — just unlabelled.
 */
export interface SeasonCalendarProps {
  races: Race[];
}

type Status = 'done' | 'live' | 'next' | 'upcoming';

function todayIso() {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

function statusFor(races: Race[], today: string): Map<number, Status> {
  const map = new Map<number, Status>();
  let nextAssigned = false;
  for (const race of races) {
    if (race.endDate < today) map.set(race.round, 'done');
    else if (race.startDate <= today) {
      map.set(race.round, 'live');
      nextAssigned = true;
    } else if (!nextAssigned) {
      map.set(race.round, 'next');
      nextAssigned = true;
    } else map.set(race.round, 'upcoming');
  }
  return map;
}

function formatRange(start: string, end: string) {
  const s = new Date(`${start}T12:00:00`);
  const e = new Date(`${end}T12:00:00`);
  const month = (d: Date) => d.toLocaleDateString('en-GB', { month: 'short' });
  return s.getMonth() === e.getMonth()
    ? `${s.getDate()}–${e.getDate()} ${month(e)}`
    : `${s.getDate()} ${month(s)} – ${e.getDate()} ${month(e)}`;
}

const STATUS_LABEL: Record<Status, string> = {
  done: 'Complete',
  live: 'Race weekend',
  next: 'Next up',
  upcoming: '',
};

export function SeasonCalendar({ races }: SeasonCalendarProps) {
  const [status, setStatus] = useState<Map<number, Status> | null>(null);

  useEffect(() => {
    setStatus(statusFor(races, todayIso()));
  }, [races]);

  return (
    <ol className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {races.map((race) => {
        const s = status?.get(race.round);
        const highlighted = s === 'next' || s === 'live';
        return (
          <li
            key={race.slug}
            className={[
              'relative flex gap-5 rounded-card border p-6 transition-colors',
              highlighted
                ? 'border-brand-accent bg-surface-card'
                : 'border-surface-card-border bg-surface-card',
              s === 'done' ? 'opacity-70' : '',
            ].join(' ')}
          >
            <div className="flex flex-col items-center">
              <span className="text-caption uppercase text-surface-tertiary-foreground">Round</span>
              <span className="font-heading text-5xl font-extrabold italic leading-none text-brand-accent">
                {race.round}
              </span>
            </div>
            <div className="min-w-0">
              <h3 className="text-h4 uppercase text-surface-foreground">
                {race.circuit}
                {race.layout && (
                  <span className="text-surface-secondary-foreground"> {race.layout}</span>
                )}
              </h3>
              <p className="mt-1 text-sm text-surface-secondary-foreground">
                <time dateTime={race.startDate}>{formatRange(race.startDate, race.endDate)}</time>
                {race.round === races.length && ' · Finale'}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                {s && STATUS_LABEL[s] && (
                  <span
                    className={[
                      'rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.12em]',
                      highlighted
                        ? 'bg-brand-primary text-on-brand-primary'
                        : 'border border-surface-card-border text-surface-tertiary-foreground',
                    ].join(' ')}
                  >
                    {STATUS_LABEL[s]}
                  </span>
                )}
                {race.report && (
                  <Link
                    href={`/news/${race.report}`}
                    className="text-xs font-bold uppercase tracking-[0.12em] text-brand-accent underline underline-offset-2 hover:text-surface-foreground"
                  >
                    Race report
                    <span className="sr-only"> for round {race.round}</span>
                  </Link>
                )}
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
