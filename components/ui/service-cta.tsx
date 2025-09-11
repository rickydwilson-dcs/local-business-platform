import Link from "next/link";

interface ServiceCTAProps {
  title: string;
  description: string;
  primaryAction: string;
  primaryUrl: string;
  secondaryAction?: string;
  secondaryUrl?: string;
}

export function ServiceCTA({
  title,
  description,
  primaryAction,
  primaryUrl,
  secondaryAction,
  secondaryUrl
}: ServiceCTAProps) {
  return (
    <section className="py-16 bg-brand-blue text-white">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-serif font-bold mb-4">{title}</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
          {description}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={primaryUrl}
            className="inline-flex items-center justify-center px-8 py-4 bg-white text-brand-blue font-semibold rounded-lg hover:bg-gray-100 transition-colors"
          >
            {primaryAction}
          </Link>
          {secondaryAction && secondaryUrl && (
            <Link
              href={secondaryUrl}
              className="inline-flex items-center justify-center px-8 py-4 border border-white text-white font-semibold rounded-lg hover:bg-white hover:text-brand-blue transition-colors"
            >
              {secondaryAction}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
