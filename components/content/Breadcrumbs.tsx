import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={`flex items-center gap-1.5 text-caption text-[var(--color-text-tertiary)] ${className}`}>
      {items.map((item, index) => (
        <span key={index} className="flex items-center gap-1.5">
          {index > 0 && (
            <ChevronRight className="w-3.5 h-3.5 breadcrumb-separator flex-shrink-0" />
          )}
          {item.href ? (
            <Link
              href={item.href}
              className="hover:text-[var(--color-accent)] transition-colors duration-150"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-[var(--color-text-secondary)] font-medium">
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}
