import { StarRating } from './star-rating';

/**
 * Testimonial card props
 */
interface TestimonialCardProps {
  /** Customer name */
  name: string;
  /** Customer location or company */
  location?: string;
  /** Rating value (1-5) */
  rating: number;
  /** Testimonial text */
  text: string;
  /** Optional testimonial title/headline */
  title?: string;
  /** Date of the review (ISO string) */
  date?: string;
  /** Whether this is a featured testimonial */
  featured?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Testimonial Card Component
 *
 * Displays a customer testimonial with rating, quote, and attribution.
 * Supports featured variant for highlighted testimonials.
 *
 * @example
 * ```tsx
 * <TestimonialCard
 *   name="John Smith"
 *   location="Brighton"
 *   rating={5}
 *   text="Excellent service! Professional team..."
 *   title="Highly Recommended"
 *   date="2025-01-15"
 * />
 * ```
 */
export function TestimonialCard({
  name,
  location,
  rating,
  text,
  title,
  date,
  featured = false,
  className = '',
}: TestimonialCardProps) {
  const formattedDate = date
    ? new Date(date).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : null;

  return (
    <div
      className={`
        relative bg-surface-background rounded-2xl p-6 border
        ${featured ? 'border-brand-primary shadow-lg' : 'border-surface-border shadow-sm'}
        ${className}
      `}
    >
      {/* Featured badge */}
      {featured && (
        <div className="absolute -top-3 left-6">
          <span className="px-3 py-1 bg-brand-primary text-brand-on-primary text-xs font-semibold rounded-full">
            Featured Review
          </span>
        </div>
      )}

      {/* Rating */}
      <div className="flex items-center justify-between mb-4">
        <StarRating rating={rating} size="md" />
        {formattedDate && <span className="text-sm text-surface-muted">{formattedDate}</span>}
      </div>

      {/* Title */}
      {title && <h3 className="text-lg font-semibold text-surface-foreground mb-2">{title}</h3>}

      {/* Quote */}
      <blockquote className="text-surface-foreground leading-relaxed mb-4">
        &ldquo;{text}&rdquo;
      </blockquote>

      {/* Attribution */}
      <footer className="flex items-center gap-3">
        {/* Avatar */}
        <div className="w-10 h-10 bg-brand-primary rounded-full flex items-center justify-center text-brand-on-primary font-semibold">
          {name.charAt(0)}
        </div>
        <div>
          <p className="font-semibold text-surface-foreground">{name}</p>
          {location && <p className="text-sm text-surface-muted">{location}</p>}
        </div>
      </footer>
    </div>
  );
}
