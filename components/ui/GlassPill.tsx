import Link from 'next/link';

type PillSize = 'sm' | 'md';

interface GlassPillProps {
  label: string;
  color?: string;
  href?: string;
  size?: PillSize;
}

export function GlassPill({
  label,
  color = 'var(--color-accent)',
  href,
  size = 'md',
}: GlassPillProps) {
  const sizeClasses = {
    sm: 'px-2.5 py-0.5 text-[11px]',
    md: 'px-3 py-1 text-[12px]',
  }[size];

  const pillContent = (
    <span
      className={`text-overline inline-flex items-center rounded-full ${sizeClasses}`}
      style={{
        backgroundColor: `color-mix(in srgb, ${color} 12%, transparent)`,
        color: color,
      }}
    >
      {label}
    </span>
  );

  if (href) {
    return (
      <Link href={href} className="no-underline hover:opacity-80 transition-opacity">
        {pillContent}
      </Link>
    );
  }

  return pillContent;
}
