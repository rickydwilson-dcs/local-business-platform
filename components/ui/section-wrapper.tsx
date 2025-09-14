interface SectionWrapperProps {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
}

export function SectionWrapper({
  children,
  className = "py-16 bg-white",
  containerClassName = "mx-auto w-full lg:w-[90%] px-6"
}: SectionWrapperProps) {
  return (
    <section className={className}>
      <div className={containerClassName}>
        {children}
      </div>
    </section>
  );
}
