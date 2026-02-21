import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { type Lang, supportedLanguages } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { generatePageMetadata } from '@/lib/utils/seo';
import { getDrugBySlug, getAllDrugs } from '@/lib/mock/drugs';
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
import { SchemaMarkup, generateDrugSchema, generateArticleSchema, generateBreadcrumbSchema } from '@/components/seo/SchemaMarkup';
import { Clock } from 'lucide-react';

export function generateStaticParams() {
  const drugs = getAllDrugs();
  const params: { lang: string; slug: string }[] = [];
  for (const lang of supportedLanguages) {
    for (const drug of drugs) {
      params.push({ lang, slug: drug.slug });
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
  const drug = getDrugBySlug(slug);
  if (!drug) return {};
  return generatePageMetadata({
    title: drug.seoTitle[lang] || drug.seoTitle.en,
    description: drug.seoDescription[lang] || drug.seoDescription.en,
    lang,
    path: `/drugs/${slug}`,
    type: 'article',
  });
}

export default async function DrugPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  const typedLang = lang as Lang;
  const drug = getDrugBySlug(slug);
  if (!drug) notFound();

  const dict = await getDictionary(typedLang);
  const title = drug.title[lang] || drug.title.en;
  const subtitle = drug.subtitle[lang] || drug.subtitle.en;
  const quickFacts = drug.quickFacts[lang] || drug.quickFacts.en;
  const sections = drug.sections[lang] || drug.sections.en;
  const tocSections = sections.map((s) => ({ id: s.id, title: s.title }));

  const breadcrumbs = [
    { label: dict.common.home, href: `/${lang}` },
    { label: dict.nav.drugs, href: `/${lang}/drugs` },
    { label: title },
  ];

  const drugSchema = generateDrugSchema({
    name: title,
    nonProprietaryName: drug.genericName,
    drugClass: drug.drugClass,
    administrationRoute: 'Oral',
    dosageForm: drug.form,
    prescriptionStatus: drug.prescriptionRequired ? 'PrescriptionOnly' : 'OTC',
  });

  const articleSchema = generateArticleSchema({
    headline: drug.seoTitle[lang] || drug.seoTitle.en,
    description: drug.seoDescription[lang] || drug.seoDescription.en,
    datePublished: drug.lastUpdated,
    dateModified: drug.lastUpdated,
    reviewerName: drug.reviewer.name,
    reviewerTitle: drug.reviewer.specialty,
    lang,
    url: `https://themedicalatlas.com/${lang}/drugs/${slug}`,
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
      <SchemaMarkup schema={drugSchema} />
      <SchemaMarkup schema={articleSchema} />
      <SchemaMarkup schema={breadcrumbSchema} />

      <div className="mx-auto max-w-[var(--content-max-width)] px-4 lg:px-6 py-8">
        <Breadcrumbs items={breadcrumbs} className="mb-6" />

        <div className="lg:flex lg:gap-8">
          <article className="flex-1 min-w-0">
            <header className="mb-8">
              <h1
                className="text-h1 text-[var(--color-text-primary)] mb-2"
                style={{ fontFamily: typedLang === 'ar' ? 'var(--font-heading-ar)' : 'var(--font-heading)' }}
              >
                {title}
              </h1>
              {drug.brandNames.length > 0 && (
                <p className="text-body-small text-[var(--color-text-secondary)] mb-3">
                  {dict.drug.brandNames}: {drug.brandNames.join(', ')}
                </p>
              )}
              <p className="text-body text-[var(--color-text-secondary)] mb-4">{subtitle}</p>
              <div className="flex items-center gap-4 text-caption text-[var(--color-text-tertiary)]">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {drug.readTime} {dict.article.minRead}
                </span>
              </div>
            </header>

            <QuickFactsCard facts={quickFacts} title={dict.article.quickFacts} className="mb-8" />

            <ArticleBody sections={firstSections} />
            <InContentAd position="after-dosage" />
            <ArticleBody sections={lastSections} />

            <SourcesList sources={drug.sources} title={dict.article.sources} />
            <ReviewerBadge
              reviewerName={drug.reviewer.name}
              specialty={drug.reviewer.specialty}
              lastUpdated={drug.lastUpdated}
              sourceCount={drug.sources.length}
              reviewedByLabel={dict.article.reviewedBy}
              lastUpdatedLabel={dict.article.lastUpdated}
              sourcesLabel={dict.article.sources}
              className="mt-8"
            />
            <Disclaimer text={dict.disclaimer.text} />

            <div className="mt-12 space-y-8">
              <RelatedArticles title={dict.article.relatedConditions} items={drug.relatedConditions} lang={lang} />
            </div>
          </article>

          <aside className="hidden lg:block w-[var(--sidebar-width)] flex-shrink-0">
            <GlassTOC sections={tocSections} className="mb-6" />
            <SidebarAd />
          </aside>
        </div>
      </div>
    </>
  );
}
