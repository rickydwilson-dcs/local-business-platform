'use client';

import { Suspense } from 'react';
import { CustomBrandProvider } from './CustomBrandProvider';

interface BrandInjectorPanelProps {
  children: React.ReactNode;
}

export function BrandInjectorPanel({ children }: BrandInjectorPanelProps) {
  return (
    <Suspense fallback={<div className="p-4 text-sm text-gray-400">Loading brand injector...</div>}>
      <CustomBrandProvider overrides={{}}>
        {children}
      </CustomBrandProvider>
    </Suspense>
  );
}
