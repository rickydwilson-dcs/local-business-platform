import { describe, expect, it } from "vitest";
import { buildAlphaColumns, buildGroupedColumns } from "../nav-grouping";

describe("buildAlphaColumns", () => {
  it("returns [] for empty input", () => {
    expect(buildAlphaColumns([])).toEqual([]);
  });

  it("sorts and splits items into the requested number of columns", () => {
    const items = [
      { label: "Uckfield", href: "/locations/uckfield" },
      { label: "Brighton", href: "/locations/brighton" },
      { label: "Eastbourne", href: "/locations/eastbourne" },
      { label: "Lewes", href: "/locations/lewes" },
    ];
    const cols = buildAlphaColumns(items, 2);
    expect(cols).toHaveLength(2);
    expect(cols[0].items.map((i) => i.label)).toEqual(["Brighton", "Eastbourne"]);
    expect(cols[1].items.map((i) => i.label)).toEqual(["Lewes", "Uckfield"]);
  });
});

describe("buildGroupedColumns", () => {
  it("returns [] for empty input", () => {
    expect(buildGroupedColumns([])).toEqual([]);
  });

  it("groups items by parent and preserves parent labels as column headers", () => {
    const source = [
      {
        parentLabel: "East Sussex",
        items: [
          { label: "Brighton", href: "/locations/brighton" },
          { label: "Eastbourne", href: "/locations/eastbourne" },
          { label: "Lewes", href: "/locations/lewes" },
        ],
      },
      {
        parentLabel: "Kent",
        items: [
          { label: "Canterbury", href: "/locations/canterbury" },
          { label: "Dover", href: "/locations/dover" },
        ],
      },
    ];
    const cols = buildGroupedColumns(source);
    expect(cols).toHaveLength(2);
    expect(cols[0].label).toBe("East Sussex");
    expect(cols[0].items.map((i) => i.label)).toEqual(["Brighton", "Eastbourne", "Lewes"]);
    expect(cols[1].label).toBe("Kent");
    expect(cols[1].items.map((i) => i.label)).toEqual(["Canterbury", "Dover"]);
  });

  it("caps each group at maxItemsPerGroup", () => {
    const items = Array.from({ length: 15 }, (_, i) => ({
      label: `Town${String(i).padStart(2, "0")}`,
      href: `/locations/town${i}`,
    }));
    const cols = buildGroupedColumns([{ parentLabel: "East Sussex", items }], {
      maxItemsPerGroup: 5,
    });
    expect(cols[0].items).toHaveLength(5);
    expect(cols[0].items.map((i) => i.label)).toEqual([
      "Town00",
      "Town01",
      "Town02",
      "Town03",
      "Town04",
    ]);
  });

  it("drops groups with no items", () => {
    const cols = buildGroupedColumns([
      { parentLabel: "Empty", items: [] },
      { parentLabel: "Kent", items: [{ label: "Dover", href: "/locations/dover" }] },
    ]);
    expect(cols).toHaveLength(1);
    expect(cols[0].label).toBe("Kent");
  });

  it("sorts items alphabetically within each group", () => {
    const cols = buildGroupedColumns([
      {
        parentLabel: "East Sussex",
        items: [
          { label: "Uckfield", href: "/a" },
          { label: "Brighton", href: "/b" },
          { label: "Lewes", href: "/c" },
        ],
      },
    ]);
    expect(cols[0].items.map((i) => i.label)).toEqual(["Brighton", "Lewes", "Uckfield"]);
  });
});
