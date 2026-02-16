import type { LucideIcon } from 'lucide-react';

export interface DarkStatCardProps {
  value: string;
  label: string;
  icon: LucideIcon;
}

/**
 * DarkStatCard Component
 *
 * Dark background stat card with red left border accent.
 * Displays large numeric values with icon and label.
 * Matches Electro WordPress theme dark sections.
 *
 * Features:
 * - Black/gray-900 background with red left border (4px)
 * - White text on dark background
 * - Large value display (text-5xl font-bold)
 * - Icon in top-right corner
 * - Padding and shadow for depth
 * - Uses .stat-card-dark from globals.css
 *
 * @example
 * ```tsx
 * import { Users } from 'lucide-react';
 * import { DarkStatCard } from '@/components/ui/dark-stat-card';
 *
 * <DarkStatCard
 *   value="3K+"
 *   label="Happy Clients"
 *   icon={Users}
 * />
 * ```
 */
export function DarkStatCard({ value, label, icon: Icon }: DarkStatCardProps) {
  return (
    <div className="stat-card-dark relative">
      {/* Icon in top-right */}
      <div className="absolute top-6 right-6 opacity-20">
        <Icon className="w-12 h-12 text-white" aria-hidden="true" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Large Value */}
        <div className="text-5xl font-bold text-white mb-2 tracking-tight">{value}</div>

        {/* Label */}
        <p className="text-gray-300 text-lg font-medium">{label}</p>
      </div>
    </div>
  );
}
