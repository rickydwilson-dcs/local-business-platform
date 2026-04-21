"use client";

import { useId, useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import type { TownFinderTown } from "./town-finder-section";

interface TownFinderClientProps {
  towns: TownFinderTown[];
  placeholder?: string;
  showCountyBadge: boolean;
}

export function TownFinderClient({ towns, placeholder, showCountyBadge }: TownFinderClientProps) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const listboxId = useId();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length === 0) return [];
    return towns
      .filter((t) => t.name.toLowerCase().includes(q) || (t.county ?? "").toLowerCase().includes(q))
      .slice(0, 10);
  }, [query, towns]);

  const showResults = isFocused && results.length > 0;

  return (
    <div
      className="relative"
      role="combobox"
      aria-expanded={showResults}
      aria-haspopup="listbox"
      aria-owns={listboxId}
    >
      <label className="sr-only" htmlFor={`town-finder-${listboxId}`}>
        Search for a town
      </label>
      <div className="relative">
        <Search
          className="w-5 h-5 text-surface-muted-foreground absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
          aria-hidden
        />
        <input
          id={`town-finder-${listboxId}`}
          type="search"
          autoComplete="off"
          placeholder={placeholder ?? "Search by town or county…"}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 150)}
          aria-controls={listboxId}
          className="w-full pl-12 pr-4 py-4 rounded-xl border border-surface-card-border bg-surface-card text-surface-foreground text-base focus:outline-none focus:ring-2 focus:ring-brand-primary"
        />
      </div>

      {showResults && (
        <ul
          id={listboxId}
          role="listbox"
          className="absolute z-40 top-full left-0 right-0 mt-2 bg-surface-card border border-surface-card-border rounded-xl shadow-xl max-h-96 overflow-auto"
        >
          {results.map((town) => (
            <li key={`${town.slug}-${town.county ?? ""}`} role="option" aria-selected={false}>
              <Link
                href={town.href}
                className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-surface-subtle text-surface-foreground"
                onMouseDown={(e) => e.preventDefault()}
              >
                <span className="text-sm font-medium">{town.name}</span>
                {showCountyBadge && town.county && (
                  <span className="text-xs text-surface-muted-foreground">{town.county}</span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
