import { getAllConditions } from '@/lib/mock/conditions';
import { getAllDrugs } from '@/lib/mock/drugs';
import { getAllTests } from '@/lib/mock/tests';
import { SearchClient, type SearchItem } from '@/components/search/SearchClient';
import { supportedLanguages } from '@/lib/i18n/config';

export function generateStaticParams() {
  return supportedLanguages.map((lang) => ({ lang }));
}

export default async function SearchPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  const items: SearchItem[] = [
    ...getAllConditions().map((c) => ({
      slug: c.slug,
      title: c.title[lang] || c.title.en,
      subtitle: c.subtitle[lang] || c.subtitle.en,
      type: 'condition' as const,
      category: c.category,
    })),
    ...getAllDrugs().map((d) => ({
      slug: d.slug,
      title: d.title[lang] || d.title.en,
      subtitle: d.subtitle[lang] || d.subtitle.en,
      type: 'drug' as const,
      category: d.category,
    })),
    ...getAllTests().map((t) => ({
      slug: t.slug,
      title: t.title[lang] || t.title.en,
      subtitle: t.subtitle[lang] || t.subtitle.en,
      type: 'test' as const,
      category: t.category,
    })),
  ];

  return <SearchClient items={items} lang={lang} />;
}
