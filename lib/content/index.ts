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

// ─── Build Condition from MDX ───────────────────────────────────────

function buildCondition(parsed: ParsedContent, folderCategory: string): Condition {
  const { frontmatter, sections } = parsed;
  const { category, categorySlug } = resolveCategory(frontmatter, folderCategory);

  return {
    slug: frontmatter.slug,
    type: 'condition',
    title: { en: frontmatter.title },
    subtitle: { en: frontmatter.description },
    category,
    categorySlug,
    aliases: frontmatter.tags?.slice(0, 3) || [],
    affectedArea: frontmatter.medicalSpecialty || category,
    bodySystem: frontmatter.medicalSpecialty || category,
    specialty: frontmatter.medicalSpecialty || category,
    commonIn: '',
    treatable: 'Manageable',
    urgency: 'Routine',
    quickFacts: { en: toQuickFacts(frontmatter.keyFacts) },
    sections: { en: sections },
    sources: toSources(frontmatter.references),
    reviewer: toReviewer(frontmatter.reviewedBy, frontmatter.medicalSpecialty),
    lastUpdated: frontmatter.updatedAt || frontmatter.publishedAt || '2024-01-01',
    readTime: frontmatter.readingTimeMinutes || 8,
    relatedConditions: (frontmatter.relatedSlugs || []).map((slug) => ({
      slug,
      title: slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      type: 'condition' as const,
    })),
    relatedDrugs: [],
    relatedTests: [],
    seoTitle: { en: frontmatter.title + ' | Medical Atlas' },
    seoDescription: { en: frontmatter.description },
  };
}

// ─── Build Drug from MDX ────────────────────────────────────────────

function buildDrug(parsed: ParsedContent): Drug {
  const { frontmatter, sections } = parsed;

  // Extract drug info from keyFacts
  const drugClassFact = frontmatter.keyFacts?.find((f) =>
    f.label.toLowerCase().includes('class')
  );
  const doseFact = frontmatter.keyFacts?.find((f) =>
    f.label.toLowerCase().includes('dose') || f.label.toLowerCase().includes('dosing')
  );
  const routeFact = frontmatter.keyFacts?.find((f) =>
    f.label.toLowerCase().includes('route')
  );

  return {
    slug: frontmatter.slug,
    type: 'drug',
    genericName: frontmatter.slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    brandNames: [],
    drugClass: drugClassFact?.value || frontmatter.medicalSpecialty || '',
    form: routeFact?.value || 'Oral',
    prescriptionRequired: true,
    pregnancyCategory: '',
    title: { en: frontmatter.title },
    subtitle: { en: frontmatter.description },
    category: frontmatter.medicalSpecialty || 'Medications',
    categorySlug: 'medications',
    quickFacts: { en: toQuickFacts(frontmatter.keyFacts) },
    sections: { en: sections },
    sources: toSources(frontmatter.references),
    reviewer: toReviewer(frontmatter.reviewedBy, frontmatter.medicalSpecialty),
    lastUpdated: frontmatter.updatedAt || frontmatter.publishedAt || '2024-01-01',
    readTime: frontmatter.readingTimeMinutes || 10,
    relatedConditions: (frontmatter.relatedSlugs || []).map((slug) => ({
      slug,
      title: slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      type: 'condition' as const,
    })),
    relatedDrugs: [],
    relatedTests: [],
    seoTitle: { en: frontmatter.title + ' | Medical Atlas' },
    seoDescription: { en: frontmatter.description },
  };
}

// ─── Build MedicalTest from MDX ─────────────────────────────────────

function buildTest(parsed: ParsedContent): MedicalTest {
  const { frontmatter, sections } = parsed;

  const fastingFact = frontmatter.keyFacts?.find((f) =>
    f.label.toLowerCase().includes('fasting')
  );
  const sampleFact = frontmatter.keyFacts?.find((f) =>
    f.label.toLowerCase().includes('sample') || f.label.toLowerCase().includes('type')
  );

  return {
    slug: frontmatter.slug,
    type: 'test',
    testType: sampleFact?.value || 'Blood Test',
    fastingRequired: fastingFact?.value?.toLowerCase() === 'yes',
    duration: '5-15 minutes',
    painLevel: 'Minimal',
    title: { en: frontmatter.title },
    subtitle: { en: frontmatter.description },
    category: frontmatter.medicalSpecialty || 'Lab Tests',
    categorySlug: 'lab-tests',
    quickFacts: { en: toQuickFacts(frontmatter.keyFacts) },
    sections: { en: sections },
    sources: toSources(frontmatter.references),
    reviewer: toReviewer(frontmatter.reviewedBy, frontmatter.medicalSpecialty),
    lastUpdated: frontmatter.updatedAt || frontmatter.publishedAt || '2024-01-01',
    readTime: frontmatter.readingTimeMinutes || 8,
    relatedConditions: [],
    relatedDrugs: [],
    relatedTests: [],
    seoTitle: { en: frontmatter.title + ' | Medical Atlas' },
    seoDescription: { en: frontmatter.description },
  };
}

// ─── Load All Content ───────────────────────────────────────────────

function loadAllContent() {
  if (_conditions && _drugs && _tests) return;

  const conditions: Condition[] = [];
  const drugs: Drug[] = [];
  const tests: MedicalTest[] = [];

  const files = scanContentFiles();

  for (const { filePath, folderCategory } of files) {
    try {
      const parsed = parseMDXFile(filePath);

      if (DRUG_FOLDERS.has(folderCategory)) {
        drugs.push(buildDrug(parsed));
      } else if (TEST_FOLDERS.has(folderCategory)) {
        tests.push(buildTest(parsed));
      } else if (CONDITION_FOLDERS.has(folderCategory)) {
        conditions.push(buildCondition(parsed, folderCategory));
      }
    } catch (err) {
      console.warn(`Failed to parse ${filePath}:`, err);
    }
  }

  // Sort alphabetically by English title
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
