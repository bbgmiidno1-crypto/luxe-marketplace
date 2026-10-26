import { brand } from '../../config/brand';

/**
 * Text-based logo PLACEHOLDER.
 * Later, replace the contents of this component with your final logo image or SVG.
 * The brand name and mark letter come from src/config/brand.ts.
 */
type LogoSize = 'sm' | 'md' | 'lg';

interface BrandLogoProps {
  variant?: 'full' | 'mark';
  size?: LogoSize;
  className?: string;
}

const markSize: Record<LogoSize, string> = {
  sm: 'h-8 w-8 text-lg',
  md: 'h-10 w-10 text-2xl',
  lg: 'h-20 w-20 text-4xl',
};

const textSize: Record<LogoSize, string> = {
  sm: 'text-base',
  md: 'text-xl',
  lg: 'text-3xl',
};

export default function BrandLogo({
  variant = 'full',
  size = 'md',
  className = '',
}: BrandLogoProps) {
  return (
    <span
      role="img"
      aria-label={brand.name}
      className={`inline-flex items-center gap-2.5 ${className}`}
    >
      <span
        aria-hidden="true"
        className={`animate-fade-up flex shrink-0 items-center justify-center rounded-full border border-gold-400/70 font-display font-bold text-gold-metallic ${markSize[size]}`}
      >
        {brand.shortMark}
      </span>
      {variant === 'full' && (
        <span
          className={`animate-logo-reveal whitespace-nowrap font-display font-semibold uppercase text-gold-metallic ${textSize[size]}`}
        >
          {brand.name}
        </span>
      )}
    </span>
  );
}
