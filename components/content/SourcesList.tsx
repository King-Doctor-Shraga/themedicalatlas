interface Source {
  id: number;
  text: string;
  url?: string;
}

interface SourcesListProps {
  sources: Source[];
  title: string;
  className?: string;
}

export function SourcesList({ sources, title, className = '' }: SourcesListProps) {
  return (
    <div className={`mt-12 pt-8 border-t border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.08)] ${className}`}>
      <h3 className="text-h4 font-semibold text-[var(--color-text-primary)] mb-4">
        {title}
      </h3>
      <ol className="space-y-2">
        {sources.map((source) => (
          <li key={source.id} className="text-body-small text-[var(--color-text-secondary)] flex gap-2">
            <span className="text-[var(--color-text-tertiary)] flex-shrink-0">
              [{source.id}]
            </span>
            {source.url ? (
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-accent)] hover:underline"
              >
                {source.text}
              </a>
            ) : (
              <span>{source.text}</span>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
