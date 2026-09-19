/**
 * `/about` — ported from the approved design at
 * `output/sessions/2026-09/2026-09-15_dcs-inner-pages-design/prototype/about.html`.
 *
 * This component renders ONLY the page body: the breadcrumb, the `.mast`
 * header and the four `.sec` sections. The `.bar`, the `.menu` overlay and
 * the `.pagefoot` footer are the shared r9 chrome from
 * `app/(site)/layout.tsx` / `components/site/site-chrome.tsx` (Phase 1) and
 * are not duplicated here.
 *
 * Every fact on this page traces to
 * `output/sessions/2026-08/2026-08-17_dcs-homepage-redesign/content-brief.md`
 * per the prototype's own inline citations — nothing here is invented. The
 * prototype's three `<script>` behaviours (ground probe, reveal latch, burger
 * menu) are already covered by the shared `HomeBehaviour` provider that
 * `SiteChrome` wraps every `(site)` route in, so none of them is reimplemented
 * here.
 *
 * Two placeholder `href="#"` links in the prototype are wired to real routes,
 * as wiring rather than design: "See the work" / "the work" → `/projects`
 * (the design labels the portfolio "Work" throughout; the route has always
 * been `/projects` — `site-chrome-data.ts`), and "send me a note" → `/contact`,
 * the site's real enquiry route.
 *
 * Voice: first-person singular throughout — this page's argument IS the
 * voice (session.md:222), not a house style applied on top.
 */

import Link from 'next/link';
import { CONTACT } from '@/components/home/home-data';

/** The `.hero__act`/`.detail__l` arrow icon, shared verbatim across every
 *  `.btn` in this design (e.g. `components/home/hero.tsx`). */
function ArrowIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M2 8h11M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** The `.detail__l` check mark, one per included item. */
function CheckIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3 8.5l3.2 3.2L13 4.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const DETAILS = [
  'You are hiring a person, not a company. Nothing is outsourced and nothing is offshored.',
  'The output is held to an agency standard — considered design, copy that reads well, builds that are fast and secure.',
  "You don't need a brief. It gets drawn out of a conversation instead.",
  "The words are handled. You don't have to work out what to say about your own business.",
  "Nothing to learn and nothing to log into. No CMS, no dashboard, no password you'll lose.",
  'One price, printed. Setup plus a low monthly that covers hosting, security, updates and support.',
  "It doesn't stop at launch. It's a managed service, not a hand-off.",
];

interface Sector {
  name: string;
  description: string;
}

const SECTORS: Sector[] = [
  {
    name: 'Retail and eCommerce',
    description:
      'Fabrics, clothing, homeware, made-to-order goods. Cuddle Plush Fabrics, Luna Landings.',
  },
  {
    name: 'Studios and practitioners',
    description: 'Yoga, tuition, therapy, coaching, salons. Sanctuary Ida, Nicola Noble Tuition.',
  },
  {
    name: 'Professional and property',
    description:
      'Consultancies, lettings and luxury property, where the presentation has to match the price.',
  },
  {
    name: 'Trades and contractors',
    description:
      'Electricians, scaffolders, builders, automotive, removals. Colossus Scaffolding, DJ Fox Electrical, DCH Automotive, Bexhill Removals.',
  },
  {
    name: 'Creative and B2B',
    description: 'Signage, print and marketing — including Mad Graphics, rebuilt in full.',
  },
];

export function AboutPage() {
  return (
    <>
      {/* ===== Breadcrumb + masthead — ink =============================== */}
      <div className="crumb p--ink" data-ground="ink">
        <nav aria-label="Breadcrumb">
          <ol>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <span aria-current="page">About</span>
            </li>
          </ol>
        </nav>
      </div>

      <header className="mast p--ink" data-ground="ink">
        <p className="eyeless">About</p>
        <h1>
          You&rsquo;re hiring <span className="plate">a person,</span> not a company.
        </h1>
        <p className="lead">
          Most studios expect you to turn up with a brief, copy, images and a clear idea of what you
          want. I don&rsquo;t. I ask the right questions, write the content, make the design
          decisions, build it, host it, and keep it running.
        </p>
        <div className="hero__act">
          <a className="btn" href={CONTACT.mailtoHref}>
            Start a project
            <ArrowIcon />
          </a>
          <Link className="btn btn--ghost" href="/projects">
            See the work
          </Link>
        </div>
        {/* Static authored figures — no count-up. content-brief.md:202-203. */}
        <div className="mast__meta">
          <div>
            <b>2019</b>
            <span>Studio founded</span>
          </div>
          <div>
            <b>20+</b>
            <span>Sites delivered</span>
          </div>
          <div>
            <b>5+ years</b>
            <span>With the longest-standing client</span>
          </div>
          <div>
            <b>In-house</b>
            <span>Design, build, hosting, support</span>
          </div>
        </div>
      </header>

      {/* ===== The studio — white ========================================== */}
      <section className="sec p--white" data-ground="white">
        <article className="prose measure">
          <h2 className="res">A studio of one, deliberately.</h2>

          <p>
            Digital Consulting Services is a website design and build studio in Polegate, East
            Sussex. I started it in 2019 and I still run it. The address is local; the client list
            isn&rsquo;t &mdash; the work goes out across the UK, and where you are has never been
            the thing that decides whether I take it on.
          </p>

          <p>
            The ambition isn&rsquo;t modest. The work is meant to stand next to what comes out of a
            London or New York studio &mdash; not &ldquo;good for a small studio&rdquo;, genuinely
            comparable &mdash; for a fraction of the cost and a tiny fraction of your effort.
            That&rsquo;s a claim that&rsquo;s either true or it isn&rsquo;t, and there&rsquo;s
            exactly one honest way to check it before you spend anything: the page you&rsquo;re
            reading.
          </p>

          <p>
            Everything is handled in-house, and in-house means one person. Nothing is outsourced and
            nothing is offshored. Whoever replies to your first email is the person who designs the
            site, writes the words, builds it, hosts it, and is still the one who picks up when you
            want a service page added two years later. At most studios the person who pitched you is
            never the person who builds it. Here there is nobody else for the job to be handed to.
          </p>

          <h2 className="res">There&rsquo;s no photograph of me here.</h2>

          <p>
            No team photo either, because there is no team. A headshot would tell you what I look
            like, which is not the thing you&rsquo;re trying to find out. What you&rsquo;re trying
            to find out is whether the work is any good and whether one person can really carry the
            whole of it. Both of those are answerable, and neither of them is answerable by a face.
          </p>

          <figure>
            <div className="slot__well">
              <div
                className="mock"
                role="img"
                aria-label="A drawing of a browser window containing a generic website layout."
              >
                <div className="mock__row">
                  <span className="mock__dot"></span>
                  <span className="mock__dot"></span>
                  <span className="mock__dot"></span>
                </div>
                <div className="mock__bar w60"></div>
                <div className="mock__bar w45"></div>
                <span className="mock__live mock__live--aqua" data-anim="in">
                  <i></i>Live
                </span>
                <div className="mock__grid">
                  <div className="mock__cell"></div>
                  <div className="mock__cell on" data-anim="cell"></div>
                  <div className="mock__cell"></div>
                </div>
              </div>
            </div>
            <figcaption>
              An illustration, not a real site. The actual work is on the projects page &mdash;
              thirteen builds, with the brief and the outcome for each.
            </figcaption>
          </figure>

          <p>
            If the site you have makes you wince slightly when somebody asks for the address, or
            you&rsquo;ve been meaning to sort it out for about two years, that is the ordinary
            starting point rather than an unusual one. Almost everyone arrives that way. It is not a
            thing you need to have solved before getting in touch &mdash; solving it is the job.
          </p>

          <p>
            Have a look at <Link href="/projects">the work</Link>, or just{' '}
            <Link href="/contact">send me a note</Link> and tell me what you&rsquo;re running.
          </p>
        </article>

        <p className="quote__a measure" style={{ marginTop: 'clamp(28px,4vh,44px)' }}>
          Ricky Wilson <span>&mdash; Digital Consulting Services, Polegate</span>
        </p>
      </section>

      {/* ===== What one person means — ink ================================= */}
      <section className="sec p--ink" data-ground="ink">
        <div className="measure">
          <p className="eyeless">In practice</p>
          <h2 className="res">What one person actually means.</h2>
          <div className="detail__l">
            {DETAILS.map((detail) => (
              <div key={detail}>
                <CheckIcon />
                {detail}
              </div>
            ))}
          </div>
          <p className="lead" style={{ marginTop: 'clamp(28px,4vh,44px)' }}>
            There is no account manager and no ticket queue. That is the whole of the arrangement,
            and it is the reason it costs what it costs.
          </p>
        </div>
      </section>

      {/* ===== Who it's for — magenta ======================================= */}
      <section className="sec p--magenta" data-ground="magenta">
        <p className="eyeless">Who it&rsquo;s for</p>
        <h2 className="res">Small businesses of any kind.</h2>
        <p className="lead">
          Owner-run, usually somewhere between one and twenty people, where the person making the
          decision is the person paying the invoice. Time-poor. Not technical, and with no wish to
          become technical. Willing to pay properly for something that works and is looked after
          &mdash; and wanting to look as credible online as they already are in person.
        </p>
        <div className="svcs">
          {SECTORS.map((sector) => (
            <div className="svc" key={sector.name}>
              <span className="svc__n">{sector.name}</span>
              <span className="svc__d">{sector.description}</span>
            </div>
          ))}
        </div>
        <p className="lead" style={{ marginTop: 'clamp(28px,4vh,44px)' }}>
          Trades are a large and valued part of that. They are not the definition of it.
        </p>
      </section>

      {/* ===== One client, five years in — aqua ============================= */}
      <section className="sec p--aqua" data-ground="aqua">
        <p className="eyeless">A client, five years in</p>
        <blockquote>
          <p className="quote quote--hero res">
            Ricky has built and managed our online store for over 5 years. I couldn&rsquo;t be
            happier with his work.
          </p>
          <p className="quote__a">
            Sarah <span>&mdash; Cuddle Plush Fabrics</span>
          </p>
        </blockquote>
      </section>
    </>
  );
}
