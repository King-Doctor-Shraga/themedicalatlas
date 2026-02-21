'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';

export interface SearchItem {
  slug: string;
  title: string;
  subtitle: string;
  type: 'condition' | 'drug' | 'test';
  category: string;
}

const typeToPath: Record<string, string> = {
  condition: 'conditions',
  drug: 'drugs',
  test: 'tests',
};

const typeColors: Record<string, string> = {
  condition: 'var(--color-accent)',
  drug: 'var(--color-teal)',
  test: 'var(--color-info)',
};

export function SearchClient({ items, lang }: { items: SearchItem[]; lang: string }) {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
    );
  }, [query, items]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="relative mb-8">
        <Search className="absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-tertiary)]" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={lang === 'ar' ? 'ابحث عن الأمراض، الأدوية، الفحوصات...' : 'Search conditions, drugs, tests...'}
          autoFocus
          className="w-full ps-12 pe-4 py-4 rounded-2xl glass-surface-strong text-body text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
        />
      </div>

      {query.trim() && (
        <p className="text-body-small text-[var(--color-text-tertiary)] mb-4">
          {results.length} {lang === 'ar' ? 'نتيجة' : 'results'}
        </p>
      )}

      <div className="space-y-3">
        {results.map((item) => (
          <Link
            key={`${item.type}-${item.slug}`}
            href={`/${lang}/${typeToPath[item.type]}/${item.slug}`}
            className="glass-card p-4 block"
          >
            <span
              className="text-overline mb-1 block"
              style={{ color: typeColors[item.type] }}
            >
              {item.category}
            </span>
            <span className="text-body font-medium text-[var(--color-text-primary)] block">
              {item.title}
            </span>
            <span className="text-body-small text-[var(--color-text-secondary)] block mt-1 line-clamp-1">
              {item.subtitle}
            </span>
          </Link>
        ))}
      </div>

      {query.trim() && results.length === 0 && (
        <div className="text-center py-12">
          <p className="text-body text-[var(--color-text-secondary)]">
            {lang === 'ar' ? 'لم يتم العثور على نتائج' : 'No results found'}
          </p>
        </div>
      )}
    </div>
  );
}
