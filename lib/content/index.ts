import type { Condition, Drug, MedicalTest } from '../mock/types';
import {
  scanContentFiles,
  parseMDXFile,
  toQuickFacts,
  toSources,
  toReviewer,
  resolveCategory,
  type ParsedContent,
} from './parser';

// ─── Content Cache (parsed once at build time) ──────────────────────

let _conditions: Condition[] | null = null;
let _drugs: Drug[] | null = null;
let _tests: MedicalTest[] | null = null;

// Which top-level folders map to which content type
const CONDITION_FOLDERS = new Set([
  'conditions',
  'mental-health',
  'womens-health',
  'childrens-health',
  'senior-health',
  'emergency-first-aid',
  'nutrition-lifestyle',
  'preventive-health',
]);
const DRUG_FOLDERS = new Set(['medications']);
const TEST_FOLDERS = new Set(['lab-tests']);

// ─── Build partial Condition from MDX ───────────────────────────────

function buildConditionPartial(parsed: ParsedContent, folderCategory: string, locale: string) {
  const { frontmatter, sections } = parsed;
  const { category, categorySlug } = resolveCategory(frontmatter, folderCategory);

  return {
    slug: frontmatter.slug,
    locale,
    type: 'condition' as const,
    title: frontmatter.title,
    subtitle: frontmatter.description,
    category,
    categorySlug,
    aliases: frontmatter.tags?.slice(0, 3) || [],
    affectedArea: frontmatter.medicalSpecialty || category,
    bodySystem: frontmatter.medicalSpecialty || category,
    specialty: frontmatter.medicalSpecialty || category,
    quickFacts: toQuickFacts(frontmatter.keyFacts),
    sections,
    sources: toSources(frontmatter.references),
    reviewer: toReviewer(frontmatter.reviewedBy, frontmatter.medicalSpecialty),
    lastUpdated: frontmatter.updatedAt || frontmatter.publishedAt || '2024-01-01',
    readTime: frontmatter.readingTimeMinutes || 8,
    relatedSlugs: frontmatter.relatedSlugs || [],
    seoTitle: frontmatter.title + ' | Medical Atlas',
    seoDescription: frontmatter.description,
  };
}

// ─── Build partial Drug from MDX ────────────────────────────────────

function buildDrugPartial(parsed: ParsedContent, locale: string) {
  const { frontmatter, sections } = parsed;

  const drugClassFact = frontmatter.keyFacts?.find((f) =>
    f.label.toLowerCase().includes('class') || f.label.includes('فئة')
  );
  const routeFact = frontmatter.keyFacts?.find((f) =>
    f.label.toLowerCase().includes('route') || f.label.includes('طريقة')
  );

  return {
    slug: frontmatter.slug,
    locale,
    type: 'drug' as const,
    genericName: frontmatter.slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    drugClass: drugClassFact?.value || frontmatter.medicalSpecialty || '',
    form: routeFact?.value || 'Oral',
    title: frontmatter.title,
    subtitle: frontmatter.description,
    category: frontmatter.medicalSpecialty || 'Medications',
    quickFacts: toQuickFacts(frontmatter.keyFacts),
    sections,
    sources: toSources(frontmatter.references),
    reviewer: toReviewer(frontmatter.reviewedBy, frontmatter.medicalSpecialty),
    lastUpdated: frontmatter.updatedAt || frontmatter.publishedAt || '2024-01-01',
    readTime: frontmatter.readingTimeMinutes || 10,
    relatedSlugs: frontmatter.relatedSlugs || [],
    seoTitle: frontmatter.title + ' | Medical Atlas',
    seoDescription: frontmatter.description,
  };
}

// ─── Build partial MedicalTest from MDX ─────────────────────────────

function buildTestPartial(parsed: ParsedContent, locale: string) {
  const { frontmatter, sections } = parsed;

  const fastingFact = frontmatter.keyFacts?.find((f) =>
    f.label.toLowerCase().includes('fasting') || f.label.includes('صيام')
  );
  const sampleFact = frontmatter.keyFacts?.find((f) =>
    f.label.toLowerCase().includes('sample') || f.label.toLowerCase().includes('type') || f.label.includes('عينة')
  );

  return {
    slug: frontmatter.slug,
    locale,
    type: 'test' as const,
    testType: sampleFact?.value || 'Blood Test',
    fastingRequired: fastingFact?.value?.toLowerCase() === 'yes' || fastingFact?.value === 'نعم',
    duration: '5-15 minutes',
    painLevel: 'Minimal',
    title: frontmatter.title,
    subtitle: frontmatter.description,
    category: frontmatter.medicalSpecialty || 'Lab Tests',
    quickFacts: toQuickFacts(frontmatter.keyFacts),
    sections,
    sources: toSources(frontmatter.references),
    reviewer: toReviewer(frontmatter.reviewedBy, frontmatter.medicalSpecialty),
    lastUpdated: frontmatter.updatedAt || frontmatter.publishedAt || '2024-01-01',
    readTime: frontmatter.readingTimeMinutes || 8,
    relatedSlugs: [],
    seoTitle: frontmatter.title + ' | Medical Atlas',
    seoDescription: frontmatter.description,
  };
}

// ─── Assemble full item from locale partials ────────────────────────

type PartialItem = { slug: string; locale: string; [key: string]: unknown };

function assembleCondition(partials: PartialItem[]): Condition {
  const en = partials.find((p) => p.locale === 'en') || partials[0];
  const ar = partials.find((p) => p.locale === 'ar');

  return {
    slug: en.slug,
    type: 'condition',
    title: { en: en.title as string, ...(ar && { ar: ar.title as string }) },
    subtitle: { en: en.subtitle as string, ...(ar && { ar: ar.subtitle as string }) },
    category: en.category as string,
    categorySlug: en.categorySlug as string,
    aliases: en.aliases as string[],
    affectedArea: en.affectedArea as string,
    bodySystem: en.bodySystem as string,
    specialty: en.specialty as string,
    commonIn: '',
    treatable: 'Manageable',
    urgency: 'Routine',
    quickFacts: { en: en.quickFacts as Condition['quickFacts']['en'], ...(ar && { ar: ar.quickFacts as Condition['quickFacts']['en'] }) },
    sections: { en: en.sections as Condition['sections']['en'], ...(ar && { ar: ar.sections as Condition['sections']['en'] }) },
    sources: en.sources as Condition['sources'],
    reviewer: en.reviewer as Condition['reviewer'],
    lastUpdated: en.lastUpdated as string,
    readTime: en.readTime as number,
    relatedConditions: ((en.relatedSlugs as string[]) || []).map((slug) => ({
      slug,
      title: slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      type: 'condition' as const,
    })),
    relatedDrugs: [],
    relatedTests: [],
    seoTitle: { en: en.seoTitle as string, ...(ar && { ar: ar.seoTitle as string }) },
    seoDescription: { en: en.seoDescription as string, ...(ar && { ar: ar.seoDescription as string }) },
  };
}

function assembleDrug(partials: PartialItem[]): Drug {
  const en = partials.find((p) => p.locale === 'en') || partials[0];
  const ar = partials.find((p) => p.locale === 'ar');

  return {
    slug: en.slug,
    type: 'drug',
    genericName: en.genericName as string,
    brandNames: [],
    drugClass: en.drugClass as string,
    form: en.form as string,
    prescriptionRequired: true,
    pregnancyCategory: '',
    title: { en: en.title as string, ...(ar && { ar: ar.title as string }) },
    subtitle: { en: en.subtitle as string, ...(ar && { ar: ar.subtitle as string }) },
    category: en.category as string,
    categorySlug: 'medications',
    quickFacts: { en: en.quickFacts as Drug['quickFacts']['en'], ...(ar && { ar: ar.quickFacts as Drug['quickFacts']['en'] }) },
    sections: { en: en.sections as Drug['sections']['en'], ...(ar && { ar: ar.sections as Drug['sections']['en'] }) },
    sources: en.sources as Drug['sources'],
    reviewer: en.reviewer as Drug['reviewer'],
    lastUpdated: en.lastUpdated as string,
    readTime: en.readTime as number,
    relatedConditions: ((en.relatedSlugs as string[]) || []).map((slug) => ({
      slug,
      title: slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      type: 'condition' as const,
    })),
    relatedDrugs: [],
    relatedTests: [],
    seoTitle: { en: en.seoTitle as string, ...(ar && { ar: ar.seoTitle as string }) },
    seoDescription: { en: en.seoDescription as string, ...(ar && { ar: ar.seoDescription as string }) },
  };
}

function assembleTest(partials: PartialItem[]): MedicalTest {
  const en = partials.find((p) => p.locale === 'en') || partials[0];
  const ar = partials.find((p) => p.locale === 'ar');

  return {
    slug: en.slug,
    type: 'test',
    testType: en.testType as string,
    fastingRequired: en.fastingRequired as boolean,
    duration: '5-15 minutes',
    painLevel: 'Minimal',
    title: { en: en.title as string, ...(ar && { ar: ar.title as string }) },
    subtitle: { en: en.subtitle as string, ...(ar && { ar: ar.subtitle as string }) },
    category: en.category as string,
    categorySlug: 'lab-tests',
    quickFacts: { en: en.quickFacts as MedicalTest['quickFacts']['en'], ...(ar && { ar: ar.quickFacts as MedicalTest['quickFacts']['en'] }) },
    sections: { en: en.sections as MedicalTest['sections']['en'], ...(ar && { ar: ar.sections as MedicalTest['sections']['en'] }) },
    sources: en.sources as MedicalTest['sources'],
    reviewer: en.reviewer as MedicalTest['reviewer'],
    lastUpdated: en.lastUpdated as string,
    readTime: en.readTime as number,
    relatedConditions: [],
    relatedDrugs: [],
    relatedTests: [],
    seoTitle: { en: en.seoTitle as string, ...(ar && { ar: ar.seoTitle as string }) },
    seoDescription: { en: en.seoDescription as string, ...(ar && { ar: ar.seoDescription as string }) },
  };
}

// ─── Load All Content ───────────────────────────────────────────────

function loadAllContent() {
  if (_conditions && _drugs && _tests) return;

  // Collect partials by slug
  const conditionPartials = new Map<string, PartialItem[]>();
  const drugPartials = new Map<string, PartialItem[]>();
  const testPartials = new Map<string, PartialItem[]>();

  for (const locale of ['en', 'ar']) {
    const files = scanContentFiles(locale);

    for (const { filePath, folderCategory } of files) {
      try {
        const parsed = parseMDXFile(filePath);
        const slug = parsed.frontmatter.slug;

        if (DRUG_FOLDERS.has(folderCategory)) {
          const partial = buildDrugPartial(parsed, locale);
          if (!drugPartials.has(slug)) drugPartials.set(slug, []);
          drugPartials.get(slug)!.push(partial as unknown as PartialItem);
        } else if (TEST_FOLDERS.has(folderCategory)) {
          const partial = buildTestPartial(parsed, locale);
          if (!testPartials.has(slug)) testPartials.set(slug, []);
          testPartials.get(slug)!.push(partial as unknown as PartialItem);
        } else if (CONDITION_FOLDERS.has(folderCategory)) {
          const partial = buildConditionPartial(parsed, folderCategory, locale);
          if (!conditionPartials.has(slug)) conditionPartials.set(slug, []);
          conditionPartials.get(slug)!.push(partial as unknown as PartialItem);
        }
      } catch (err) {
        console.warn(`Failed to parse ${filePath}:`, err);
      }
    }
  }

  // Assemble full items from partials
  const conditions = Array.from(conditionPartials.values()).map(assembleCondition);
  const drugs = Array.from(drugPartials.values()).map(assembleDrug);
  const tests = Array.from(testPartials.values()).map(assembleTest);

  conditions.sort((a, b) => (a.title.en || '').localeCompare(b.title.en || ''));
  drugs.sort((a, b) => (a.title.en || '').localeCompare(b.title.en || ''));
  tests.sort((a, b) => (a.title.en || '').localeCompare(b.title.en || ''));

  _conditions = conditions;
  _drugs = drugs;
  _tests = tests;
}

// ─── Public API ─────────────────────────────────────────────────────

export function getAllConditions(): Condition[] {
  loadAllContent();
  return _conditions!;
}

export function getConditionBySlug(slug: string): Condition | undefined {
  loadAllContent();
  return _conditions!.find((c) => c.slug === slug);
}

export function getAllDrugs(): Drug[] {
  loadAllContent();
  return _drugs!;
}

export function getDrugBySlug(slug: string): Drug | undefined {
  loadAllContent();
  return _drugs!.find((d) => d.slug === slug);
}

export function getAllTests(): MedicalTest[] {
  loadAllContent();
  return _tests!;
}

export function getTestBySlug(slug: string): MedicalTest | undefined {
  loadAllContent();
  return _tests!.find((t) => t.slug === slug);
}
