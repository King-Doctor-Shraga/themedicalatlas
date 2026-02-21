import { ReactNode, ButtonHTMLAttributes } from 'react';
import Link from 'next/link';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface GlassButtonBaseProps {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

interface GlassButtonAsButton extends GlassButtonBaseProps {
  href?: undefined;
  onClick?: ButtonHTMLAttributes<HTMLButtonElement>['onClick'];
  type?: ButtonHTMLAttributes<HTMLButtonElement>['type'];
}

interface GlassButtonAsLink extends GlassButtonBaseProps {
  href: string;
  onClick?: never;
  type?: never;
}

type GlassButtonProps = GlassButtonAsButton | GlassButtonAsLink;

export function GlassButton({
  children,
  variant = 'primary',
  size = 'md',
  href,
  onClick,
  className = '',
  type = 'button',
}: GlassButtonProps) {
  const sizeClasses = {
    sm: 'px-4 py-1.5 text-caption',
    md: 'px-6 py-2.5 text-body-small',
    lg: 'px-8 py-3 text-body',
  }[size];

  const variantClasses = {
    primary:
      'bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] active:scale-[0.97]',
    secondary:
      'glass-capsule text-[var(--color-text-primary)] hover:bg-white/70 dark:hover:bg-white/10',
    ghost:
      'bg-transparent text-[var(--color-text-primary)] hover:bg-black/5 dark:hover:bg-white/10 active:bg-black/10 dark:active:bg-white/15',
  }[variant];

  const baseClasses = `inline-flex items-center justify-center rounded-full font-medium transition-all duration-[var(--duration-fast)] ease-[var(--ease-smooth)] cursor-pointer select-none ${sizeClasses} ${variantClasses} ${className}`;

  if (href) {
    return (
      <Link href={href} className={baseClasses}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={baseClasses}>
      {children}
    </button>
  );
}
