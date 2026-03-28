/**
 * DarkStatCard Component
 *
 * Dark background stat card with brand-colour left border accent.
 * Displays large numeric values with an icon and label.
 * Part of the Orion theme component set.
 *
 * CSS requirement: `.stat-card-dark` must be defined in the consuming site's
 * globals.css (or the orion theme globals.css once Step 4 is complete).
 *
 * @example
 * ```tsx
 * import { Users } from "lucide-react";
 * import { DarkStatCard } from "@platform/core-components";
 *
 * <DarkStatCard value="3K+" label="Happy Clients" icon={Users} />
 * ```
 */

import type { LucideIcon } from "lucide-react";

export interface DarkStatCardProps {
  value: string;
  label: string;
  icon: LucideIcon;
}

export function DarkStatCard({ value, label, icon: Icon }: DarkStatCardProps) {
  return (
    <div className="stat-card-dark relative">
      {/* Icon in top-right corner */}
      <div className="absolute top-6 right-6 opacity-20">
        <Icon className="w-12 h-12 text-white" aria-hidden="true" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <div className="text-5xl font-bold text-white mb-2 tracking-tight">{value}</div>
        <p className="text-on-inverse-muted text-lg font-medium">{label}</p>
      </div>
    </div>
  );
}
