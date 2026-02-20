interface ThemeFrameProps {
  theme: string;
  vars?: Record<string, string>;
  children: React.ReactNode;
  className?: string;
}

export function ThemeFrame({ theme, vars, children, className }: ThemeFrameProps) {
  return (
    <div
      data-theme={theme !== 'custom' ? theme : undefined}
      style={vars as React.CSSProperties | undefined}
      className={className}
    >
      {children}
    </div>
  );
}
