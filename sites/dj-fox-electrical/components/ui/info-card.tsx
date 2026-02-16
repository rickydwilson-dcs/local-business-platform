import type { LucideIcon } from 'lucide-react';

export interface InfoCardProps {
  icon: LucideIcon;
  heading: string;
  text: string;
}

/**
 * InfoCard Component
 *
 * Clean informational card with icon, heading, and text.
 * White background with subtle shadow and hover lift effect.
 * Matches Electro WordPress theme feature card design.
 *
 * Features:
 * - White background with subtle shadow
 * - Centered layout
 * - Red icon at top
 * - Heading (text-xl font-semibold)
 * - Body text below
 * - Hover: slight lift (-translate-y-2) and shadow increase
 * - Uses .card-interactive from globals.css for hover effects
 *
 * @example
 * ```tsx
 * import { Shield } from 'lucide-react';
 * import { InfoCard } from '@/components/ui/info-card';
 *
 * <InfoCard
 *   icon={Shield}
 *   heading="Fully Insured"
 *   text="All our work is covered by comprehensive insurance for your peace of mind."
 * />
 * ```
 */
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
      <h3 className="text-xl font-semibold text-gray-900 mb-3">{heading}</h3>

      {/* Text */}
      <p className="text-gray-700 leading-relaxed">{text}</p>
    </div>
  );
}
