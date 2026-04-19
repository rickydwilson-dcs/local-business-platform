"use client";
import { useState } from "react";

interface UILibraryToggleProps {
  children: React.ReactNode;
  componentName: string;
}

export function UILibraryToggle({ children, componentName }: UILibraryToggleProps) {
  const [showLabels, setShowLabels] = useState(false);

  return (
    <div>
      <div data-show-field-labels={showLabels ? "true" : "false"} data-component={componentName}>
        {children}
      </div>
      <div className="flex items-center gap-3 px-6 py-3 bg-surface-subtle border-t border-surface-card-border">
        <button
          type="button"
          onClick={() => setShowLabels((v) => !v)}
          className="text-sm font-medium text-brand-primary hover:underline focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:outline-none rounded"
        >
          {showLabels ? "Hide field labels" : "Show field labels"}
        </button>
        {showLabels && (
          <span className="text-xs text-surface-muted-foreground">
            Coloured outlines show which data field maps to which element
          </span>
        )}
      </div>
    </div>
  );
}
