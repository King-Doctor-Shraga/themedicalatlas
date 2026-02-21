import Link from 'next/link';

interface GlassCardProps {
  title: string;
  description: string;
  category: string;
  categoryColor?: string;
  readTime?: string | number;
  href: string;
  className?: string;
}

export function GlassCard({
  title,
  description,
  category,
  categoryColor = 'var(--color-accent)',
  readTime,
  href,
  className = '',
}: GlassCardProps) {
  return (
    <Link href={href} className={`glass-card block p-6 no-underline ${className}`}>
      {/* Category overline */}
      <span
        className="text-overline mb-2 block"
        style={{ color: categoryColor }}
      >
        {category}
      </span>

      {/* Title */}
      <h3
        className="text-h4 mb-2"
        style={{ fontFamily: 'var(--font-heading, var(--font-heading-ar)), serif' }}
      >
        {title}
      </h3>

      {/* Description — clamped to 2 lines */}
      <p className="text-body-small text-[var(--color-text-secondary)] line-clamp-2 mb-4">
        {description}
      </p>

      {/* Read time */}
      {readTime != null && (
        <span className="text-caption text-[var(--color-text-tertiary)]">
          {typeof readTime === 'number' ? `${readTime} min` : readTime}
        </span>
      )}
    </Link>
  );
}
