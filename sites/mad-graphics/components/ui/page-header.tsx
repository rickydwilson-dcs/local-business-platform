interface PageHeaderProps {
  overline?: string;
  title: string;
  description?: string;
  showDivider?: boolean;
}

export function PageHeader({ overline, title, description, showDivider = true }: PageHeaderProps) {
  return (
    <div className="px-8 pt-8 pb-0">
      <div className="max-w-7xl mx-auto">
        {overline && <span className="label-overline mb-4 inline-block">{overline}</span>}
        <h1 className="text-7xl md:text-8xl font-headline font-bold italic tracking-tight leading-none mb-8">
          {title}
        </h1>
        {description && (
          <p className="text-xl text-surface-muted-foreground font-body leading-relaxed max-w-2xl mb-8">
            {description}
          </p>
        )}
        {showDivider && <div className="h-[2px] bg-surface-card-border/30 w-full" />}
      </div>
    </div>
  );
}
