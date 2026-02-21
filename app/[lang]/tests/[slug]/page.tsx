import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { type Lang, supportedLanguages } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { generatePageMetadata } from '@/lib/utils/seo';
import { getTestBySlug, getAllTests } from '@/lib/mock/tests';
import { Breadcrumbs } from '@/components/content/Breadcrumbs';
import { QuickFactsCard } from '@/components/content/QuickFactsCard';
import { ArticleBody } from '@/components/content/ArticleBody';
import { ReviewerBadge } from '@/components/content/ReviewerBadge';
import { SourcesList } from '@/components/content/SourcesList';
import { Disclaimer } from '@/components/content/Disclaimer';
import { GlassTOC } from '@/components/ui/GlassTOC';
import { InContentAd } from '@/components/ads/InContentAd';
import { SchemaMarkup, generateArticleSchema, generateBreadcrumbSchema } from '@/components/seo/SchemaMarkup';
import { Clock } from 'lucide-react';

export function generateStaticParams() {
  const tests = getAllTests();
  const params: { lang: string; slug: string }[] = [];
  for (const lang of supportedLanguages) {
    for (const test of tests) {
      params.push({ lang, slug: test.slug });
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
  const test = getTestBySlug(slug);
  if (!test) return {};
  return generatePageMetadata({
    title: test.seoTitle[lang] || test.seoTitle.en,
    description: test.seoDescription[lang] || test.seoDescription.en,
    lang,
    path: `/tests/${slug}`,
    type: 'article',
  });
}

export default async function TestPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  const typedLang = lang as Lang;
  const test = getTestBySlug(slug);
  if (!test) notFound();

  const dict = await getDictionary(typedLang);
  const title = test.title[lang] || test.title.en;
  const subtitle = test.subtitle[lang] || test.subtitle.en;
  const quickFacts = test.quickFacts[lang] || test.quickFacts.en;
  const sections = test.sections[lang] || test.sections.en;
  const tocSections = sections.map((s) => ({ id: s.id, title: s.title }));

  const breadcrumbs = [
    { label: dict.common.home, href: `/${lang}` },
    { label: dict.nav.tests, href: `/${lang}/tests` },
    { label: title },
  ];

  const articleSchema = generateArticleSchema({
    headline: test.seoTitle[lang] || test.seoTitle.en,
    description: test.seoDescription[lang] || test.seoDescription.en,
    datePublished: test.lastUpdated,
    dateModified: test.lastUpdated,
    reviewerName: test.reviewer.name,
    reviewerTitle: test.reviewer.specialty,
    lang,
    url: `https://themedicalatlas.com/${lang}/tests/${slug}`,
  });

  const breadcrumbSchema = generateBreadcrumbSchema(
    breadcrumbs.map((b) => ({
      name: b.label,
      url: b.href ? `https://themedicalatlas.com${b.href}` : undefined,
    }))
  );

  const firstSections = sections.slice(0, 3);
  const lastSections = sections.slice(3);

  return (
    <>
      <SchemaMarkup schema={articleSchema} />
      <SchemaMarkup schema={breadcrumbSchema} />

      <div className="mx-auto max-w-[var(--content-max-width)] px-4 lg:px-6 py-8">
        <Breadcrumbs items={breadcrumbs} className="mb-6" />

        <div className="lg:flex lg:gap-8">
          <article className="flex-1 min-w-0">
            <header className="mb-8">
              <h1
                className="text-h1 text-[var(--color-text-primary)] mb-3"
                style={{ fontFamily: typedLang === 'ar' ? 'var(--font-heading-ar)' : 'var(--font-heading)' }}
              >
                {title}
              </h1>
              <p className="text-body text-[var(--color-text-secondary)] mb-4">{subtitle}</p>
              <div className="flex items-center gap-4 text-caption text-[var(--color-text-tertiary)]">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {test.readTime} {dict.article.minRead}
                </span>
              </div>
            </header>

            <QuickFactsCard facts={quickFacts} className="mb-8" />

            <ArticleBody sections={firstSections} />
            <InContentAd position="mid-content" />
            <ArticleBody sections={lastSections} />

            <SourcesList sources={test.sources} title={dict.article.sources} />
            <ReviewerBadge
              reviewerName={test.reviewer.name}
              specialty={test.reviewer.specialty}
              lastUpdated={test.lastUpdated}
              sourceCount={test.sources.length}
              reviewedByLabel={dict.article.reviewedBy}
              lastUpdatedLabel={dict.article.lastUpdated}
              sourcesLabel={dict.article.sources}
              className="mt-8"
            />
            <Disclaimer text={dict.disclaimer.text} />
          </article>

          <aside className="hidden lg:block w-[var(--sidebar-width)] flex-shrink-0">
            <GlassTOC sections={tocSections} />
          </aside>
        </div>
      </div>
    </>
  );
}
