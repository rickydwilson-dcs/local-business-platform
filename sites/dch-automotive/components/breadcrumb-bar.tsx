import Link from 'next/link';
import type { BreadcrumbItem } from '@platform/core-components';

export function BreadcrumbBar({ items }: { items: BreadcrumbItem[] }) {
  return (
    <div className="bg-[#080807] border-b border-white/5 py-4">
      <div className="container mx-auto px-6">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs uppercase tracking-widest"
        >
          {items.map((item, i) => (
            <span key={item.href} className="flex items-center gap-2">
              {i > 0 && <span className="text-white/30">/</span>}
              {item.current ? (
                <span className="text-brand-primary font-bold">{item.name}</span>
              ) : (
                <Link href={item.href} className="text-white/50 hover:text-white transition-colors">
                  {item.name}
                </Link>
              )}
            </span>
          ))}
        </nav>
      </div>
    </div>
  );
}
