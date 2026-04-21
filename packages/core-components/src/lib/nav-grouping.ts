export interface HeaderDropdownItem {
  label: string;
  href: string;
}

export interface HeaderDropdownGroup {
  label: string;
  items: HeaderDropdownItem[];
}

export function buildAlphaColumns(
  items: HeaderDropdownItem[],
  numCols: number = 4
): HeaderDropdownGroup[] {
  if (items.length === 0) return [];

  const sorted = [...items].sort((a, b) =>
    a.label.localeCompare(b.label, undefined, { sensitivity: "base" })
  );

  const colSize = Math.ceil(sorted.length / numCols);
  const groups: HeaderDropdownGroup[] = [];

  for (let i = 0; i < numCols; i++) {
    const chunk = sorted.slice(i * colSize, (i + 1) * colSize);
    if (chunk.length === 0) continue;
    const first = chunk[0].label[0].toUpperCase();
    const last = chunk[chunk.length - 1].label[0].toUpperCase();
    const label = first === last ? first : `${first}-${last}`;
    groups.push({ label, items: chunk });
  }

  return groups;
}

/**
 * Group a flat list of items by a parent key into mega-menu columns.
 *
 * Used by sites whose locations are organised by a parent region (e.g.
 * Colossus Scaffolding groups towns by county). Each resulting column is
 * labelled with the parent name; items within a column are sorted
 * alphabetically and capped by `maxItemsPerGroup`.
 */
export interface GroupedSource<T extends HeaderDropdownItem> {
  parentLabel: string;
  items: T[];
}

export function buildGroupedColumns<T extends HeaderDropdownItem>(
  source: GroupedSource<T>[],
  opts: { maxItemsPerGroup?: number } = {}
): HeaderDropdownGroup[] {
  const maxItems = opts.maxItemsPerGroup ?? 10;
  return source
    .filter((g) => g.items.length > 0)
    .map((g) => {
      const sorted = [...g.items].sort((a, b) =>
        a.label.localeCompare(b.label, undefined, { sensitivity: "base" })
      );
      return {
        label: g.parentLabel,
        items: sorted.slice(0, maxItems).map((it) => ({ label: it.label, href: it.href })),
      };
    });
}
