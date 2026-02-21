import { ReactNode } from 'react';

type GlassVariant = 'default' | 'light' | 'strong';

interface GlassSurfaceProps {
  children: ReactNode;
  variant?: GlassVariant;
  className?: string;
  as?: 'div' | 'section' | 'aside' | 'nav';
}

export function GlassSurface({
  children,
  variant = 'default',
  className = '',
  as: Component = 'div',
}: GlassSurfaceProps) {
  const variantClass = {
    default: 'glass-surface',
    light: 'glass-surface-light',
    strong: 'glass-surface-strong',
  }[variant];

  return (
    <Component className={`${variantClass} ${className}`}>
      {children}
    </Component>
  );
}
