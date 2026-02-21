import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { type Lang, supportedLanguages } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { generatePageMetadata } from '@/lib/utils/seo';
import { getCalculatorBySlug, getAllCalculators } from '@/lib/mock/calculators';
import { Breadcrumbs } from '@/components/content/Breadcrumbs';
import { Disclaimer } from '@/components/content/Disclaimer';
import { BMICalculator } from '@/components/calculators/BMICalculator';
import { BloodSugarConverter } from '@/components/calculators/BloodSugarConverter';

export function generateStaticParams() {
  const calculators = getAllCalculators();
  const params: { lang: string; slug: string }[] = [];
  for (const lang of supportedLanguages) {
    for (const calc of calculators) {
      params.push({ lang, slug: calc.slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  const calc = getCalculatorBySlug(slug);
  if (!calc) return {};
  return generatePageMetadata({
    title: calc.seoTitle[lang] || calc.seoTitle.en,
    description: calc.seoDescription[lang] || calc.seoDescription.en,
    lang,
    path: `/calculators/${slug}`,
  });
}

const calculatorComponents: Record<string, React.ComponentType<{ lang: string; labels: { calculate: string; result: string; reset: string } }>> = {
  bmi: BMICalculator,
  'blood-sugar-converter': BloodSugarConverter,
};

export default async function CalculatorPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  const typedLang = lang as Lang;
  const calc = getCalculatorBySlug(slug);
  if (!calc) notFound();

  const dict = await getDictionary(typedLang);
  const title = calc.title[lang] || calc.title.en;
  const description = calc.description[lang] || calc.description.en;

  const CalculatorComponent = calculatorComponents[slug];

  const breadcrumbs = [
    { label: dict.common.home, href: `/${lang}` },
    { label: dict.nav.calculators, href: `/${lang}/calculators` },
    { label: title },
  ];

  return (
    <div className="mx-auto max-w-[var(--content-max-width)] px-4 lg:px-6 py-8">
      <Breadcrumbs items={breadcrumbs} className="mb-6" />

      <div className="text-center mb-8">
        <h1
          className="text-h1 text-[var(--color-text-primary)] mb-3"
          style={{ fontFamily: typedLang === 'ar' ? 'var(--font-heading-ar)' : 'var(--font-heading)' }}
        >
          {title}
        </h1>
        <p className="text-body text-[var(--color-text-secondary)] max-w-lg mx-auto">
          {description}
        </p>
      </div>

      {CalculatorComponent ? (
        <CalculatorComponent
          lang={lang}
          labels={{
            calculate: dict.calculator.calculate,
            result: dict.calculator.result,
            reset: dict.calculator.reset,
          }}
        />
      ) : (
        <div className="glass-surface p-8 text-center">
          <p className="text-body text-[var(--color-text-secondary)]">
            {typedLang === 'ar' ? 'الحاسبة قيد التطوير' : 'Calculator coming soon'}
          </p>
        </div>
      )}

      <Disclaimer text={dict.disclaimer.text} className="max-w-md mx-auto" />
    </div>
  );
}
