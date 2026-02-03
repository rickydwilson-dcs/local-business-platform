/**
 * Star rating props
 */
interface StarRatingProps {
  /** Rating value (0-5) */
  rating: number;
  /** Maximum number of stars */
  maxStars?: number;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Whether to show the numeric rating */
  showValue?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Size configuration
 */
const sizeConfig = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
};

const textSizeConfig = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
};

/**
 * Star Rating Component
 *
 * Displays a star rating with filled and empty stars.
 * Supports partial ratings (half stars displayed as full).
 *
 * @example
 * ```tsx
 * <StarRating rating={4.5} />
 * <StarRating rating={3} size="lg" showValue />
 * ```
 */
export function StarRating({
  rating,
  maxStars = 5,
  size = 'md',
  showValue = false,
  className = '',
}: StarRatingProps) {
  const starSize = sizeConfig[size];
  const textSize = textSizeConfig[size];

  // Round to nearest 0.5
  const roundedRating = Math.round(rating * 2) / 2;
  const fullStars = Math.floor(roundedRating);
  const hasHalfStar = roundedRating % 1 !== 0;
  const emptyStars = maxStars - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {/* Full stars */}
      {Array.from({ length: fullStars }).map((_, i) => (
        <svg
          key={`full-${i}`}
          className={`${starSize} text-yellow-400`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}

      {/* Half star (rendered as full for simplicity) */}
      {hasHalfStar && (
        <svg className={`${starSize} text-yellow-400`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      )}

      {/* Empty stars */}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <svg
          key={`empty-${i}`}
          className={`${starSize} text-gray-200`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}

      {/* Numeric value */}
      {showValue && (
        <span className={`ml-2 font-medium text-surface-foreground ${textSize}`}>
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
