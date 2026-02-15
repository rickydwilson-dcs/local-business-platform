import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';

export interface CircularIconCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  linkText?: string;
  linkHref?: string;
}

/**
 * CircularIconCard Component
 *
 * Large circular red icon with title, description, and optional link.
 * Matches Electro WordPress theme design pattern.
 *
 * Features:
 * - Large circular red background (w-24 h-24) with white icon
 * - Title below icon (text-xl font-semibold)
 * - Description text
 * - Optional "View More" link in red
 * - Hover effects: circle shadow, link underline
 *
 * @example
 * ```tsx
 * import { Zap } from 'lucide-react';
 * import { CircularIconCard } from '@/components/ui/circular-icon-card';
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
export function CircularIconCard({
  icon: Icon,
  title,
  description,
  linkText,
  linkHref,
}: CircularIconCardProps) {
  return (
    <div className="flex flex-col items-center text-center group">
      {/* Circular Icon Container - uses .icon-circle-lg from globals.css */}
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
          {linkText} →
        </Link>
      )}
    </div>
  );
}
