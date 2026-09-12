/**
 * Sourcing Gap Notice
 * ===================
 *
 * A visible, highlighted marker for facts a build's page genuinely does not have yet — driven by
 * a build's `sourcingGaps` frontmatter (lib/content-schemas.ts). Deliberately NOT a silent code
 * comment: the point is that an editor (or David, or Ricky) sees the gap on the rendered page
 * itself, not just in the MDX source. Uses the theme's `semantic.warning` token — see
 * theme.config.ts — rather than a hardcoded colour.
 *
 * Shared between the library ledger row (components list view) and the build detail page (single
 * build view) so the same gap reads identically in both places.
 */

export function SourcingGapNotice({ gaps }: { gaps?: string[] }) {
  if (!gaps || gaps.length === 0) return null;

  return (
    <div
      role="note"
      className="mb-[0.85rem] max-w-[42em] border border-semantic-warning bg-surface-card px-4 py-3"
    >
      <p className="m-0 mb-1.5 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-semantic-warning">
        Needs sourcing from David
      </p>
      <ul className="m-0 list-none p-0">
        {gaps.map((gap) => (
          <li
            key={gap}
            className="text-[0.8125rem] leading-[1.5] text-surface-foreground before:mr-2 before:content-['—']"
          >
            {gap}
          </li>
        ))}
      </ul>
    </div>
  );
}
