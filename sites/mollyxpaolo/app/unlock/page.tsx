import { photos, heroOrder } from '@/lib/data';
import { safeNext } from '@/lib/access';

export const metadata = { title: 'Molly × Paolo' };

const ERRORS: Record<string, string> = {
  wrong: "That's not it. Check the message you were sent.",
  locked: 'Too many tries. Please wait ten minutes and try again.',
  link: 'That link has expired or been replaced. Enter the passcode instead, or ask for a new link.',
  config: 'The gallery is not set up yet.',
};

/*
 * The backdrop is the 16px blurred placeholder (an inline data URI), never a real image URL:
 * this page is public, and a real URL would hand out the bucket's path token.
 */
const backdrop = photos.find((p) => p.id === heroOrder[0])?.ph.colour;

export default async function UnlockPage({
  searchParams,
}: {
  searchParams: Promise<{ e?: string; next?: string }>;
}) {
  const { e, next } = await searchParams;
  return (
    <div className="gate">
      {backdrop && <div className="gate-bg" style={{ backgroundImage: `url(${backdrop})` }} />}
      <div className="gate-card">
        <h1>
          Molly<span className="x">×</span>Paolo
        </h1>
        <p>Las Vegas, 22 September 2026</p>
        <form method="post" action="/api/unlock" autoComplete="off">
          <input type="hidden" name="next" value={safeNext(next)} />
          <input
            name="passcode"
            type="password"
            placeholder="Passcode"
            aria-label="Passcode"
            autoCapitalize="off"
            spellCheck={false}
            required
            autoFocus
          />
          <button className="btn" type="submit">
            Enter
          </button>
        </form>
        <p className="err" role="alert">
          {e ? (ERRORS[e] ?? ERRORS.wrong) : ''}
        </p>
      </div>
    </div>
  );
}
