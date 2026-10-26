import type { ReactNode } from 'react';
import { useInView } from '../../hooks/useInView';

interface RevealOnScrollProps {
  children: ReactNode;
  /** Delay before the reveal animation starts, in milliseconds. */
  delay?: number;
  className?: string;
}

/** Fades children up the first time they scroll into view. */
export default function RevealOnScroll({
  children,
  delay = 0,
  className = '',
}: RevealOnScrollProps) {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <div
      ref={ref}
      style={{ animationDelay: `${delay}ms` }}
      className={`${inView ? 'animate-fade-up' : 'opacity-0'} ${className}`}
    >
      {children}
    </div>
  );
}
