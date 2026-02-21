import type { Metadata } from 'next';
import { type Lang } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { generatePageMetadata } from '@/lib/utils/seo';
import { getAllCalculators } from '@/lib/mock/calculators';
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
    title: dict.nav.calculators,
    description: `${dict.nav.calculators} — ${dict.site.name}`,
    lang,
    path: '/calculators',
  });
}

export default async function CalculatorsIndexPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const typedLang = lang as Lang;
  const dict = await getDictionary(typedLang);
  const calculators = getAllCalculators();

  return (
    <div className="mx-auto max-w-[var(--content-max-width)] px-4 lg:px-6 py-8">
      <Breadcrumbs
        items={[
          { label: dict.common.home, href: `/${lang}` },
          { label: dict.nav.calculators },
        ]}
        className="mb-6"
      />

      <h1
        className="text-h1 text-[var(--color-text-primary)] mb-2"
        style={{ fontFamily: typedLang === 'ar' ? 'var(--font-heading-ar)' : 'var(--font-heading)' }}
      >
        {dict.nav.calculators}
      </h1>
      <p className="text-body text-[var(--color-text-secondary)] mb-8">
        {typedLang === 'ar' ? 'أدوات صحية تفاعلية' : 'Interactive health tools'}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {calculators.map((calc) => (
          <GlassCard
            key={calc.slug}
            title={calc.title[lang] || calc.title.en}
            description={calc.description[lang] || calc.description.en}
            category={calc.category}
            categoryColor="var(--color-gold)"
            href={`/${lang}/calculators/${calc.slug}`}
          />
        ))}
      </div>
    </div>
  );
}
