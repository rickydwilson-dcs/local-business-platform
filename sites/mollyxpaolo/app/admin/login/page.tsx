export const metadata = { title: 'Curate · Molly × Paolo' };

const ERRORS: Record<string, string> = {
  wrong: 'Wrong password.',
  locked: 'Too many tries. Please wait ten minutes and try again.',
  config: 'Admin is not set up yet.',
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ e?: string }>;
}) {
  const { e } = await searchParams;
  return (
    <div className="gate">
      <div className="gate-card">
        <h1>Curate</h1>
        <p>For Molly &amp; Paolo only.</p>
        <form method="post" action="/api/admin/login" autoComplete="off">
          <input
            name="password"
            type="password"
            placeholder="Admin password"
            aria-label="Admin password"
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
