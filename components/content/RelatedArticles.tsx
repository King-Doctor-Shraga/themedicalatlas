import Link from 'next/link';

interface RelatedItem {
  slug: string;
  title: string;
  type: 'condition' | 'drug' | 'test' | 'calculator';
  category?: string;
}

interface RelatedArticlesProps {
  title: string;
  items: RelatedItem[];
  lang: string;
  className?: string;
}

const typeToPath: Record<string, string> = {
  condition: 'conditions',
  drug: 'drugs',
  test: 'tests',
  calculator: 'calculators',
};

const typeColors: Record<string, string> = {
  condition: 'var(--color-accent)',
  drug: 'var(--color-teal)',
  test: 'var(--color-info)',
  calculator: 'var(--color-gold)',
};

export function RelatedArticles({ title, items, lang, className = '' }: RelatedArticlesProps) {
  if (items.length === 0) return null;

  return (
    <div className={className}>
      <h3 className="text-h4 font-semibold text-[var(--color-text-primary)] mb-4">
        {title}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <Link
            key={item.slug}
            href={`/${lang}/${typeToPath[item.type]}/${item.slug}`}
            className="glass-card p-4 block"
          >
            {item.category && (
              <span
                className="text-overline mb-2 block"
                style={{ color: typeColors[item.type] }}
              >
                {item.category}
              </span>
            )}
            <span className="text-body-small font-medium text-[var(--color-text-primary)] block">
              {item.title}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
