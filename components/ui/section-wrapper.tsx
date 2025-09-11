interface SectionWrapperProps {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
}

export function SectionWrapper({
  children,
  className = "py-16 bg-white",
  containerClassName = "max-w-6xl mx-auto px-6"
}: SectionWrapperProps) {
  return (
    <section className={className}>
      <div className={containerClassName}>
        {children}
      </div>
    </section>
  );
}
