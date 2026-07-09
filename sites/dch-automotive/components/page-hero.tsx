export function PageHero({ title, description }: { title: string; description?: string }) {
  return (
    <section className="py-16 sm:py-24 container mx-auto px-6 text-center">
      <h1 className="text-4xl sm:text-5xl font-heading font-black uppercase tracking-tight mb-6">
        {title}
      </h1>
      <div className="w-20 h-1.5 bg-brand-primary mx-auto mb-6" />
      {description && (
        <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">{description}</p>
      )}
    </section>
  );
}
