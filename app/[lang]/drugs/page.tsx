import type { Metadata } from 'next';
import { type Lang } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { generatePageMetadata } from '@/lib/utils/seo';
import { getAllDrugs } from '@/lib/mock/drugs';
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
    title: dict.nav.drugs,
    description: `${dict.nav.drugs} — ${dict.site.name}`,
    lang,
    path: '/drugs',
  });
}

export default async function DrugsIndexPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const typedLang = lang as Lang;
  const dict = await getDictionary(typedLang);
  const drugs = getAllDrugs();

  return (
    <div className="mx-auto max-w-[var(--content-max-width)] px-4 lg:px-6 py-8">
      <Breadcrumbs
        items={[
          { label: dict.common.home, href: `/${lang}` },
          { label: dict.nav.drugs },
        ]}
        className="mb-6"
      />

      <h1
        className="text-h1 text-[var(--color-text-primary)] mb-2"
        style={{ fontFamily: typedLang === 'ar' ? 'var(--font-heading-ar)' : 'var(--font-heading)' }}
      >
        {dict.nav.drugs}
      </h1>
      <p className="text-body text-[var(--color-text-secondary)] mb-8">
        {typedLang === 'ar' ? 'دليل شامل للأدوية' : 'Comprehensive medication guide'}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {drugs.map((drug) => (
          <GlassCard
            key={drug.slug}
            title={drug.title[lang] || drug.title.en}
            description={drug.subtitle[lang] || drug.subtitle.en}
            category={drug.category}
            categoryColor="var(--color-teal)"
            readTime={drug.readTime}
            href={`/${lang}/drugs/${drug.slug}`}
          />
        ))}
      </div>
    </div>
  );
}
