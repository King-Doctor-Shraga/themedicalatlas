import Link from 'next/link';
import type { Metadata } from 'next';
import { type Lang } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { generatePageMetadata } from '@/lib/utils/seo';
import { getAllConditions } from '@/lib/mock/conditions';
import { GlassCard } from '@/components/ui/GlassCard';
import { Breadcrumbs } from '@/components/content/Breadcrumbs';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang as Lang);
  return generatePageMetadata({
    title: dict.nav.conditions,
    description: `${dict.nav.conditions} — ${dict.site.name}`,
    lang,
    path: '/conditions',
  });
}

export default async function ConditionsIndexPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const typedLang = lang as Lang;
  const dict = await getDictionary(typedLang);
  const conditions = getAllConditions();

  const breadcrumbs = [
    { label: dict.common.home, href: `/${lang}` },
    { label: dict.nav.conditions },
  ];

  return (
    <div className="mx-auto max-w-[var(--content-max-width)] px-4 lg:px-6 py-8">
      <Breadcrumbs items={breadcrumbs} className="mb-6" />

      <h1
        className="text-h1 text-[var(--color-text-primary)] mb-2"
        style={{ fontFamily: typedLang === 'ar' ? 'var(--font-heading-ar)' : 'var(--font-heading)' }}
      >
        {dict.nav.conditions}
      </h1>
      <p className="text-body text-[var(--color-text-secondary)] mb-8">
        {typedLang === 'ar'
          ? 'تصفح جميع الأمراض والحالات الطبية'
          : 'Browse all diseases and medical conditions'}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {conditions.map((condition) => (
          <GlassCard
            key={condition.slug}
            title={condition.title[lang] || condition.title.en}
            description={condition.subtitle[lang] || condition.subtitle.en}
            category={condition.category}
            categoryColor="var(--color-accent)"
            readTime={condition.readTime}
            href={`/${lang}/conditions/${condition.slug}`}
          />
        ))}
      </div>
    </div>
  );
}
