import Link from 'next/link';
import type { Metadata } from 'next';
import { type Lang } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { generatePageMetadata } from '@/lib/utils/seo';
import { getAllConditions } from '@/lib/mock/conditions';
import { getAllDrugs } from '@/lib/mock/drugs';
import { getAllTests } from '@/lib/mock/tests';
import { getAllCalculators } from '@/lib/mock/calculators';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';
import { Stethoscope, Pill, TestTube, Calculator, Search } from 'lucide-react';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang as Lang);
  return generatePageMetadata({
    title: `${dict.site.name} — ${dict.site.tagline}`,
    description: dict.site.tagline,
    lang,
    path: '',
  });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const typedLang = lang as Lang;
  const dict = await getDictionary(typedLang);

  const conditions = getAllConditions();
  const drugs = getAllDrugs();
  const tests = getAllTests();
  const calculators = getAllCalculators();

  const categories = [
    {
      label: dict.nav.conditions,
      href: `/${lang}/conditions`,
      icon: Stethoscope,
      count: conditions.length,
      color: 'var(--color-accent)',
    },
    {
      label: dict.nav.drugs,
      href: `/${lang}/drugs`,
      icon: Pill,
      count: drugs.length,
      color: 'var(--color-teal)',
    },
    {
      label: dict.nav.tests,
      href: `/${lang}/tests`,
      icon: TestTube,
      count: tests.length,
      color: 'var(--color-info)',
    },
    {
      label: dict.nav.calculators,
      href: `/${lang}/calculators`,
      icon: Calculator,
      count: calculators.length,
      color: 'var(--color-gold)',
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-16 sm:py-24 lg:py-32 px-4">
        <div className="mx-auto max-w-[var(--content-max-width)] text-center">
          <h1
            className="text-display text-[var(--color-text-primary)] mb-4"
            style={{ fontFamily: typedLang === 'ar' ? 'var(--font-heading-ar)' : 'var(--font-heading)' }}
          >
            {dict.site.name}
          </h1>
          <p className="text-h3 text-[var(--color-text-secondary)] font-normal mb-8 max-w-xl mx-auto">
            {dict.site.tagline}
          </p>

          {/* Search bar */}
          <div className="max-w-lg mx-auto">
            <Link
              href={`/${lang}/search`}
              className="flex items-center gap-3 glass-surface-strong px-6 py-4 w-full text-start hover:shadow-lg transition-shadow"
            >
              <Search className="w-5 h-5 text-[var(--color-text-tertiary)]" />
              <span className="text-body text-[var(--color-text-tertiary)]">
                {dict.common.searchPlaceholder}
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Category Quick Links */}
      <section className="px-4 pb-16">
        <div className="mx-auto max-w-[var(--content-max-width)]">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.href}
                  href={cat.href}
                  className="glass-card p-5 flex flex-col items-center text-center gap-3"
                >
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center"
                    style={{ backgroundColor: `color-mix(in srgb, ${cat.color} 12%, transparent)` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: cat.color }} />
                  </div>
                  <span className="text-body-small font-medium text-[var(--color-text-primary)]">
                    {cat.label}
                  </span>
                  <span className="text-caption text-[var(--color-text-tertiary)]">
                    {cat.count} {typedLang === 'ar' ? 'مقال' : 'articles'}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trending Conditions */}
      <section className="px-4 pb-16">
        <div className="mx-auto max-w-[var(--content-max-width)]">
          <div className="flex items-center justify-between mb-6">
            <h2
              className="text-h2 text-[var(--color-text-primary)]"
              style={{ fontFamily: typedLang === 'ar' ? 'var(--font-heading-ar)' : 'var(--font-heading)' }}
            >
              {dict.nav.conditions}
            </h2>
            <GlassButton variant="ghost" href={`/${lang}/conditions`} size="sm">
              {dict.common.viewAll}
            </GlassButton>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {conditions.slice(0, 3).map((condition) => (
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
      </section>

      {/* Drugs Section */}
      <section className="px-4 pb-16">
        <div className="mx-auto max-w-[var(--content-max-width)]">
          <div className="flex items-center justify-between mb-6">
            <h2
              className="text-h2 text-[var(--color-text-primary)]"
              style={{ fontFamily: typedLang === 'ar' ? 'var(--font-heading-ar)' : 'var(--font-heading)' }}
            >
              {dict.nav.drugs}
            </h2>
            <GlassButton variant="ghost" href={`/${lang}/drugs`} size="sm">
              {dict.common.viewAll}
            </GlassButton>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {drugs.slice(0, 3).map((drug) => (
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
      </section>

      {/* Calculators CTA */}
      <section className="px-4 pb-16">
        <div className="mx-auto max-w-[var(--content-max-width)]">
          <div className="glass-surface-strong p-8 sm:p-12 text-center">
            <Calculator className="w-10 h-10 mx-auto mb-4" style={{ color: 'var(--color-gold)' }} />
            <h2
              className="text-h2 text-[var(--color-text-primary)] mb-3"
              style={{ fontFamily: typedLang === 'ar' ? 'var(--font-heading-ar)' : 'var(--font-heading)' }}
            >
              {dict.nav.calculators}
            </h2>
            <p className="text-body text-[var(--color-text-secondary)] mb-6 max-w-md mx-auto">
              {typedLang === 'ar'
                ? 'أدوات تفاعلية لمساعدتك في فهم صحتك'
                : 'Interactive tools to help you understand your health'}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {calculators.map((calc) => (
                <GlassButton
                  key={calc.slug}
                  variant="secondary"
                  href={`/${lang}/calculators/${calc.slug}`}
                >
                  {calc.title[lang] || calc.title.en}
                </GlassButton>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
