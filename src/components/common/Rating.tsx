import { Star } from 'lucide-react';

interface RatingProps {
  value: number;
  count?: number;
  className?: string;
}

/** Five-star rating display. Stars are rounded to the nearest whole star. */
export default function Rating({ value, count, className = '' }: RatingProps) {
  const filled = Math.round(value);

  return (
    <div
      className={`flex items-center gap-1.5 ${className}`}
      aria-label={`Rated ${value.toFixed(1)} out of 5`}
    >
      <div className="flex">
        {Array.from({ length: 5 }, (_, index) => (
          <Star
            key={index}
            aria-hidden="true"
            className={`h-3 w-3 ${
              index < filled ? 'fill-gold-400 text-gold-400' : 'text-onyx-600'
            }`}
          />
        ))}
      </div>
      <span className="text-xs text-ivory-300">
        {value.toFixed(1)}
        {count !== undefined && (
          <span className="text-ivory-400"> ({count.toLocaleString('en-IN')})</span>
        )}
      </span>
    </div>
  );
}
