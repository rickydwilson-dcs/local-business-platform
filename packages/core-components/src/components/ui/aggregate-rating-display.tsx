import { StarRating } from "./star-rating";

/**
 * Aggregate rating display props
 */
interface AggregateRatingDisplayProps {
  /** Average rating value */
  ratingValue: number;
  /** Total number of reviews */
  reviewCount: number;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Layout variant */
  variant?: "inline" | "stacked";
  /** Additional CSS classes */
  className?: string;
}

/**
 * Aggregate Rating Display Component
 *
 * Displays an aggregate rating with stars, numeric value, and review count.
 * Commonly used in headers or summary sections.
 *
 * @example
 * ```tsx
 * <AggregateRatingDisplay ratingValue={4.8} reviewCount={127} />
 * <AggregateRatingDisplay
 *   ratingValue={4.5}
 *   reviewCount={50}
 *   size="lg"
 *   variant="stacked"
 * />
 * ```
 */
export function AggregateRatingDisplay({
  ratingValue,
  reviewCount,
  size = "md",
  variant = "inline",
  className = "",
}: AggregateRatingDisplayProps) {
  const textSizes = {
    sm: { rating: "text-lg", count: "text-xs" },
    md: { rating: "text-2xl", count: "text-sm" },
    lg: { rating: "text-3xl", count: "text-base" },
  };

  if (variant === "stacked") {
    return (
      <div className={`text-center ${className}`}>
        <div className={`font-bold text-surface-foreground ${textSizes[size].rating}`}>
          {ratingValue.toFixed(1)}
        </div>
        <StarRating rating={ratingValue} size={size} className="justify-center my-2" />
        <div className={`text-surface-muted ${textSizes[size].count}`}>
          Based on {reviewCount} review{reviewCount !== 1 ? "s" : ""}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <StarRating rating={ratingValue} size={size} />
      <div className="flex items-baseline gap-2">
        <span className={`font-bold text-surface-foreground ${textSizes[size].rating}`}>
          {ratingValue.toFixed(1)}
        </span>
        <span className={`text-surface-muted ${textSizes[size].count}`}>
          ({reviewCount} review{reviewCount !== 1 ? "s" : ""})
        </span>
      </div>
    </div>
  );
}
