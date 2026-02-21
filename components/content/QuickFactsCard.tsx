interface QuickFact {
  label: string;
  value: string;
}

interface QuickFactsCardProps {
  facts: QuickFact[];
  title?: string;
  className?: string;
}

export function QuickFactsCard({ facts, title, className = '' }: QuickFactsCardProps) {
  return (
    <div className={`glass-surface p-6 ${className}`}>
      {title && (
        <h3 className="text-overline text-[var(--color-text-tertiary)] mb-4">{title}</h3>
      )}
      <dl className="grid grid-cols-2 gap-4">
        {facts.map((fact, index) => (
          <div key={index} className="border-b border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.06)] pb-3 last:border-b-0">
            <dt className="text-caption text-[var(--color-text-tertiary)] mb-1">
              {fact.label}
            </dt>
            <dd className="text-body-small font-medium text-[var(--color-text-primary)]">
              {fact.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
