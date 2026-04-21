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
