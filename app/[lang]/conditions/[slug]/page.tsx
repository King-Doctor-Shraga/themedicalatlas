import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { type Lang, supportedLanguages } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { generatePageMetadata } from '@/lib/utils/seo';
import { getConditionBySlug, getAllConditions } from '@/lib/mock/conditions';
import { Breadcrumbs } from '@/components/content/Breadcrumbs';
import { QuickFactsCard } from '@/components/content/QuickFactsCard';
import { ArticleBody } from '@/components/content/ArticleBody';
import { ReviewerBadge } from '@/components/content/ReviewerBadge';
import { SourcesList } from '@/components/content/SourcesList';
import { RelatedArticles } from '@/components/content/RelatedArticles';
import { Disclaimer } from '@/components/content/Disclaimer';
import { GlassTOC } from '@/components/ui/GlassTOC';
import { InContentAd } from '@/components/ads/InContentAd';
import { SidebarAd } from '@/components/ads/SidebarAd';
import { SchemaMarkup, generateConditionSchema, generateArticleSchema, generateBreadcrumbSchema } from '@/components/seo/SchemaMarkup';
import { Clock } from 'lucide-react';

export function generateStaticParams() {
  const conditions = getAllConditions();
  const params: { lang: string; slug: string }[] = [];
  for (const lang of supportedLanguages) {
    for (const condition of conditions) {
      params.push({ lang, slug: condition.slug });
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
  const condition = getConditionBySlug(slug);
  if (!condition) return {};

  return generatePageMetadata({
    title: condition.seoTitle[lang] || condition.seoTitle.en,
    description: condition.seoDescription[lang] || condition.seoDescription.en,
    lang,
    path: `/conditions/${slug}`,
    type: 'article',
  });
}

export default async function ConditionPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  const typedLang = lang as Lang;
  const condition = getConditionBySlug(slug);

  if (!condition) notFound();

  const dict = await getDictionary(typedLang);
  const title = condition.title[lang] || condition.title.en;
  const subtitle = condition.subtitle[lang] || condition.subtitle.en;
  const quickFacts = condition.quickFacts[lang] || condition.quickFacts.en;
  const sections = condition.sections[lang] || condition.sections.en;

  const tocSections = sections.map((s) => ({ id: s.id, title: s.title }));

  const breadcrumbs = [
    { label: dict.common.home, href: `/${lang}` },
    { label: dict.nav.conditions, href: `/${lang}/conditions` },
    { label: condition.category, href: `/${lang}/conditions/category/${condition.categorySlug}` },
    { label: title },
  ];

  // Schema.org data
  const conditionSchema = generateConditionSchema({
    name: title,
    alternateName: condition.aliases,
    description: subtitle,
    bodySystem: condition.bodySystem,
    symptoms: [],
    riskFactors: [],
    treatments: condition.relatedDrugs.map((d) => ({
      name: d.title,
      url: `https://themedicalatlas.com/${lang}/drugs/${d.slug}`,
    })),
    url: `https://themedicalatlas.com/${lang}/conditions/${slug}`,
    datePublished: condition.lastUpdated,
    dateModified: condition.lastUpdated,
    reviewerName: condition.reviewer.name,
    reviewerTitle: condition.reviewer.specialty,
    lang,
  });

  const articleSchema = generateArticleSchema({
    headline: condition.seoTitle[lang] || condition.seoTitle.en,
    description: condition.seoDescription[lang] || condition.seoDescription.en,
    datePublished: condition.lastUpdated,
    dateModified: condition.lastUpdated,
    reviewerName: condition.reviewer.name,
    reviewerTitle: condition.reviewer.specialty,
    lang,
    url: `https://themedicalatlas.com/${lang}/conditions/${slug}`,
  });

  const breadcrumbSchema = generateBreadcrumbSchema(
    breadcrumbs.map((b) => ({
      name: b.label,
      url: b.href ? `https://themedicalatlas.com${b.href}` : undefined,
    }))
  );

  // Split sections for ad placement (after section 2 and section 5)
  const firstSections = sections.slice(0, 2);
  const middleSections = sections.slice(2, 5);
  const lastSections = sections.slice(5);

  return (
    <>
      <SchemaMarkup schema={conditionSchema} />
      <SchemaMarkup schema={articleSchema} />
      <SchemaMarkup schema={breadcrumbSchema} />

      <div className="mx-auto max-w-[var(--content-max-width)] px-4 lg:px-6 py-8">
        <Breadcrumbs items={breadcrumbs} className="mb-6" />

        <div className="lg:flex lg:gap-8">
          {/* Main content */}
          <article className="flex-1 min-w-0">
            {/* Header */}
            <header className="mb-8">
              <h1
                className="text-h1 text-[var(--color-text-primary)] mb-3"
                style={{ fontFamily: typedLang === 'ar' ? 'var(--font-heading-ar)' : 'var(--font-heading)' }}
              >
                {title}
              </h1>
              <p className="text-body text-[var(--color-text-secondary)] mb-4">
                {subtitle}
              </p>
              <div className="flex items-center gap-4 text-caption text-[var(--color-text-tertiary)]">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {condition.readTime} {dict.article.minRead}
                </span>
                <span>{dict.article.lastUpdated}: {condition.lastUpdated}</span>
              </div>
            </header>

            {/* Quick Facts */}
            <QuickFactsCard facts={quickFacts} title={dict.article.quickFacts} className="mb-8" />

            {/* Article sections with ad slots */}
            <ArticleBody sections={firstSections} />
            <InContentAd position="after-symptoms" />
            <ArticleBody sections={middleSections} />
            <InContentAd position="after-treatment" />
            <ArticleBody sections={lastSections} />

            {/* Sources */}
            <SourcesList sources={condition.sources} title={dict.article.sources} />

            {/* Reviewer badge */}
            <ReviewerBadge
              reviewerName={condition.reviewer.name}
              specialty={condition.reviewer.specialty}
              lastUpdated={condition.lastUpdated}
              sourceCount={condition.sources.length}
              reviewedByLabel={dict.article.reviewedBy}
              lastUpdatedLabel={dict.article.lastUpdated}
              sourcesLabel={dict.article.sources}
              className="mt-8"
            />

            {/* Disclaimer */}
            <Disclaimer text={dict.disclaimer.text} />

            {/* Related articles */}
            <div className="mt-12 space-y-8">
              <RelatedArticles
                title={dict.article.relatedConditions}
                items={condition.relatedConditions.map((r) => ({
                  ...r,
                  title: r.title,
                }))}
                lang={lang}
              />
              <RelatedArticles
                title={dict.article.relatedDrugs}
                items={condition.relatedDrugs}
                lang={lang}
              />
              <RelatedArticles
                title={dict.article.relatedTests}
                items={condition.relatedTests}
                lang={lang}
              />
            </div>
          </article>

          {/* Sidebar (desktop only) */}
          <aside className="hidden lg:block w-[var(--sidebar-width)] flex-shrink-0">
            <GlassTOC sections={tocSections} className="mb-6" />
            <SidebarAd />
            <SidebarAd sticky className="mt-6" />
          </aside>
        </div>
      </div>
    </>
  );
}
