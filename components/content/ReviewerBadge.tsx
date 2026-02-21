import { CheckCircle } from 'lucide-react';

interface ReviewerBadgeProps {
  reviewerName: string;
  specialty: string;
  lastUpdated: string;
  sourceCount: number;
  reviewedByLabel: string;
  lastUpdatedLabel: string;
  sourcesLabel: string;
  className?: string;
}

export function ReviewerBadge({
  reviewerName,
  specialty,
  lastUpdated,
  sourceCount,
  reviewedByLabel,
  lastUpdatedLabel,
  sourcesLabel,
  className = '',
}: ReviewerBadgeProps) {
  return (
    <div className={`glass-surface-light p-5 ${className}`}>
      <div className="flex items-start gap-3">
        <CheckCircle className="w-5 h-5 text-[var(--color-success)] flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="text-body-small font-medium text-[var(--color-text-primary)]">
            {reviewedByLabel}
          </p>
          <p className="text-body-small text-[var(--color-text-secondary)]">
            {reviewerName}, {specialty}
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1">
            <span className="text-caption text-[var(--color-text-tertiary)]">
              {lastUpdatedLabel}: {lastUpdated}
            </span>
            <span className="text-caption text-[var(--color-text-tertiary)]">
              {sourcesLabel}: {sourceCount}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
