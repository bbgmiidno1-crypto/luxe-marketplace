import type { ButtonHTMLAttributes, ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonClassOptions {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

/**
 * Returns the Tailwind classes for a button style.
 * Use this on <a> tags when a link should look like a button.
 */
export function buttonClasses({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
}: ButtonClassOptions = {}): string {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-md font-semibold tracking-wide transition duration-300 ease-out active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50';

  const variants: Record<ButtonVariant, string> = {
    primary: 'bg-gold-400 text-onyx-950 shadow-gold-soft hover:bg-gold-300',
    outline:
      'border border-gold-400/60 bg-onyx-950 text-gold-300 hover:border-gold-300 hover:bg-onyx-850',
    ghost: 'text-ivory-200 hover:text-gold-300',
  };

  const sizes: Record<ButtonSize, string> = {
    sm: 'px-3 py-2 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3.5 text-base',
  };

  return [base, variants[variant], sizes[size], fullWidth ? 'w-full' : ''].join(' ');
}

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    ButtonClassOptions {
  children: ReactNode;
}

export default function Button({
  variant,
  size,
  fullWidth,
  className = '',
  type = 'button',
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`${buttonClasses({ variant, size, fullWidth })} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
