import { DarkStatCard } from '@platform/core-components';
import { Award, Briefcase, Star } from 'lucide-react';
import type { ElementDefinition } from './index';

const renderDarkStats = () => (
  <div className="grid grid-cols-3 gap-4 p-4 bg-surface-inverse">
    <DarkStatCard value="500+" label="Projects Completed" icon={Award} />
    <DarkStatCard value="20yr" label="Industry Experience" icon={Briefcase} />
    <DarkStatCard value="4.9★" label="Average Rating" icon={Star} />
  </div>
);

export const statsElements: ElementDefinition[] = [
  {
    slug: 'dark-stat-card',
    name: 'Dark Stat Card',
    category: 'Stats',
    description: 'Dark background stat cards with brand-colour accent and large numeric values',
    renders: {
      orion: renderDarkStats,
      vega: renderDarkStats,
    },
  },
];
