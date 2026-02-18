/**
 * CircularIconCard Component
 *
 * Large circular brand-colour icon with title, description, and optional link.
 * Part of the Orion theme component set (industrial/trade aesthetic).
 *
 * CSS requirement: `.icon-circle-lg` must be defined in the consuming site's
 * globals.css (or the orion theme globals.css once Step 4 is complete).
 *
 * @example
 * ```tsx
 * import { Zap } from "lucide-react";
 * import { CircularIconCard } from "@platform/core-components";
 *
 * <CircularIconCard
 *   icon={Zap}
 *   title="Electrical Installation"
 *   description="Professional electrical installations for homes and businesses"
 *   linkText="Learn More"
 *   linkHref="/services/electrical-installation"
 * />
 * ```
 */

import Link from "next/link";
import type { LucideIcon } from "lucide-react";

export interface CircularIconCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  linkText?: string;
  linkHref?: string;
}

export function CircularIconCard({
  icon: Icon,
  title,
  description,
  linkText,
  linkHref,
}: CircularIconCardProps) {
  return (
    <div className="flex flex-col items-center text-center group">
      {/* Circular Icon Container — .icon-circle-lg defined in orion/globals.css */}
      <div className="icon-circle-lg mb-6">
        <Icon className="w-12 h-12" aria-hidden="true" />
      </div>

      {/* Title */}
      <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>

      {/* Description */}
      <p className="text-gray-700 leading-relaxed mb-4">{description}</p>

      {/* Optional Link */}
      {linkText && linkHref && (
        <Link
          href={linkHref}
          className="text-brand-primary font-semibold hover:underline hover:text-brand-primary-hover transition-colors duration-200"
        >
          {linkText} &rarr;
        </Link>
      )}
    </div>
  );
}
