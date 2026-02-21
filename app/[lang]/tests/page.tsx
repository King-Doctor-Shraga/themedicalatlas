import type { Metadata } from 'next';
import { type Lang } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { generatePageMetadata } from '@/lib/utils/seo';
import { getAllTests } from '@/lib/mock/tests';
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
    title: dict.nav.tests,
    description: `${dict.nav.tests} — ${dict.site.name}`,
    lang,
    path: '/tests',
  });
}

export default async function TestsIndexPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const typedLang = lang as Lang;
  const dict = await getDictionary(typedLang);
  const tests = getAllTests();

  return (
    <div className="mx-auto max-w-[var(--content-max-width)] px-4 lg:px-6 py-8">
      <Breadcrumbs
        items={[
          { label: dict.common.home, href: `/${lang}` },
          { label: dict.nav.tests },
        ]}
        className="mb-6"
      />

      <h1
        className="text-h1 text-[var(--color-text-primary)] mb-2"
        style={{ fontFamily: typedLang === 'ar' ? 'var(--font-heading-ar)' : 'var(--font-heading)' }}
      >
        {dict.nav.tests}
      </h1>
      <p className="text-body text-[var(--color-text-secondary)] mb-8">
        {typedLang === 'ar' ? 'فحوصات طبية وإجراءات تشخيصية' : 'Medical tests and diagnostic procedures explained'}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {tests.map((test) => (
          <GlassCard
            key={test.slug}
            title={test.title[lang] || test.title.en}
            description={test.subtitle[lang] || test.subtitle.en}
            category={test.category}
            categoryColor="var(--color-info)"
            readTime={test.readTime}
            href={`/${lang}/tests/${test.slug}`}
          />
        ))}
      </div>
    </div>
  );
}
