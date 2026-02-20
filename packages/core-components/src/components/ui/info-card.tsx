/**
 * InfoCard Component
 *
 * Clean informational card with icon, heading, and text.
 * White background with subtle shadow and hover lift effect.
 * Part of the Orion theme component set.
 *
 * CSS requirement: `.card-interactive` must be defined in the consuming site's
 * globals.css (or the orion theme globals.css once Step 4 is complete).
 *
 * @example
 * ```tsx
 * import { Shield } from "lucide-react";
 * import { InfoCard } from "@platform/core-components";
 *
 * <InfoCard
 *   icon={Shield}
 *   heading="Fully Insured"
 *   text="All our work is covered by comprehensive insurance for your peace of mind."
 * />
 * ```
 */

import type { LucideIcon } from "lucide-react";

export interface InfoCardProps {
  icon: LucideIcon;
  heading: string;
  text: string;
}

export function InfoCard({ icon: Icon, heading, text }: InfoCardProps) {
  return (
    <div className="card-interactive text-center">
      {/* Icon Container */}
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 rounded-full bg-brand-primary/10 flex items-center justify-center">
          <Icon className="w-8 h-8 text-brand-primary" aria-hidden="true" />
        </div>
      </div>

      {/* Heading */}
      <h3 className="text-xl font-semibold text-surface-foreground mb-3">{heading}</h3>

      {/* Text */}
      <p className="text-surface-secondary leading-relaxed">{text}</p>
    </div>
  );
}
