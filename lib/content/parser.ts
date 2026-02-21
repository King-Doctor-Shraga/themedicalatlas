import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';
import type { QuickFact, ContentSection, Source, Reviewer, RelatedItem } from '../mock/types';

// ─── MDX Frontmatter Types ─────────────────────────────────────────

export interface MDXFrontmatter {
  title: string;
  slug: string;
  locale: string;
  category: string;
  subcategory: string;
  description: string;
  excerpt: string;
  featuredImage: string;
  featuredImageAlt: string;
  author: string;
  reviewedBy: string;
  publishedAt: string;
  updatedAt: string;
  tags: string[];
  readingTimeMinutes: number;
  medicalSpecialty: string;
  schemaType: string;
  icd10Code?: string;
  keyFacts: Array<{ label: string; value: string }>;
  references: Array<{
    pmid: string;
    title: string;
    authors: string;
    journal: string;
    year: number;
    doi: string;
  }>;
  relatedSlugs: string[];
}

// ─── MDX Custom Component Handling ──────────────────────────────────

function stripMDXComponents(mdxContent: string): string {
  let content = mdxContent;

  // Remove <DrugInfoBox ... /> self-closing tags
  content = content.replace(/<DrugInfoBox[^/]*\/>/g, '');

  // Convert <InfoBox title="...">content</InfoBox> to styled HTML
  content = content.replace(
    /<InfoBox\s+title="([^"]*)">\s*([\s\S]*?)\s*<\/InfoBox>/g,
    '<div class="callout-info"><strong>$1</strong><br>$2</div>'
  );

  // Convert <WarningBox>content</WarningBox> to styled HTML
  content = content.replace(
    /<WarningBox>\s*([\s\S]*?)\s*<\/WarningBox>/g,
    '<div class="callout-warning"><strong>Warning</strong><br>$1</div>'
  );

  // Convert <ClinicalNote>content</ClinicalNote> to styled HTML
  content = content.replace(
    /<ClinicalNote>\s*([\s\S]*?)\s*<\/ClinicalNote>/g,
    '<div class="callout-info"><strong>Clinical Note</strong><br>$1</div>'
  );

  // Remove <CitationRef index={N} /> — keep text flow clean
  content = content.replace(/<CitationRef\s+index=\{(\d+)\}\s*\/>/g, '');

  return content;
}

// ─── Markdown → HTML Sections ───────────────────────────────────────

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export function parseMarkdownSections(mdBody: string): ContentSection[] {
  const cleaned = stripMDXComponents(mdBody);
  const sections: ContentSection[] = [];

  // Split by ## headings
  const parts = cleaned.split(/^## /m);

  for (let i = 1; i < parts.length; i++) {
    const part = parts[i];
    const newlineIndex = part.indexOf('\n');
    if (newlineIndex === -1) continue;

    const title = part.substring(0, newlineIndex).trim();
    const body = part.substring(newlineIndex + 1).trim();

    if (!body) continue;

    const html = marked.parse(body, { async: false }) as string;

    sections.push({
      id: slugify(title),
      title,
      content: html,
    });
  }

  return sections;
}

// ─── Parse Single MDX File ──────────────────────────────────────────

export interface ParsedContent {
  frontmatter: MDXFrontmatter;
  sections: ContentSection[];
}

export function parseMDXFile(filePath: string): ParsedContent {
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);
  const frontmatter = data as MDXFrontmatter;
  const sections = parseMarkdownSections(content);

  return { frontmatter, sections };
}

// ─── Convert Frontmatter to Our Types ───────────────────────────────

export function toQuickFacts(keyFacts: MDXFrontmatter['keyFacts']): QuickFact[] {
  return (keyFacts || []).map((f) => ({ label: f.label, value: f.value }));
}

export function toSources(refs: MDXFrontmatter['references']): Source[] {
  return (refs || []).map((r, i) => ({
    id: i + 1,
    text: `${r.authors}. "${r.title}." ${r.journal}, ${r.year}.`,
    url: r.doi ? `https://doi.org/${r.doi}` : undefined,
  }));
}

export function toReviewer(reviewedBy: string, specialty: string): Reviewer {
  return { name: reviewedBy, specialty };
}

// ─── Category Mapping ───────────────────────────────────────────────

const CATEGORY_MAP: Record<string, { category: string; categorySlug: string }> = {
  cardiology: { category: 'Cardiology', categorySlug: 'cardiology' },
  dermatology: { category: 'Dermatology', categorySlug: 'dermatology' },
  endocrinology: { category: 'Endocrinology', categorySlug: 'endocrinology' },
  ent: { category: 'ENT', categorySlug: 'ent' },
  gastroenterology: { category: 'Gastroenterology', categorySlug: 'gastroenterology' },
  hematology: { category: 'Hematology', categorySlug: 'hematology' },
  'infectious-diseases': { category: 'Infectious Diseases', categorySlug: 'infectious-diseases' },
  nephrology: { category: 'Nephrology', categorySlug: 'nephrology' },
  neurology: { category: 'Neurology', categorySlug: 'neurology' },
  ophthalmology: { category: 'Ophthalmology', categorySlug: 'ophthalmology' },
  orthopedics: { category: 'Orthopedics', categorySlug: 'orthopedics' },
  pulmonology: { category: 'Pulmonology', categorySlug: 'pulmonology' },
  rheumatology: { category: 'Rheumatology', categorySlug: 'rheumatology' },
  urology: { category: 'Urology', categorySlug: 'urology' },
  'mental-health': { category: 'Mental Health', categorySlug: 'mental-health' },
  'womens-health': { category: "Women's Health", categorySlug: 'womens-health' },
  'childrens-health': { category: "Children's Health", categorySlug: 'childrens-health' },
  'senior-health': { category: 'Senior Health', categorySlug: 'senior-health' },
  'emergency-first-aid': { category: 'Emergency & First Aid', categorySlug: 'emergency-first-aid' },
  'nutrition-lifestyle': { category: 'Nutrition & Lifestyle', categorySlug: 'nutrition-lifestyle' },
  'preventive-health': { category: 'Preventive Health', categorySlug: 'preventive-health' },
  medications: { category: 'Medications', categorySlug: 'medications' },
  'lab-tests': { category: 'Lab Tests', categorySlug: 'lab-tests' },
};

export function resolveCategory(frontmatter: MDXFrontmatter, folderCategory: string): { category: string; categorySlug: string } {
  // Use subcategory first (e.g., "cardiology"), then folder category
  const key = frontmatter.subcategory !== 'general' ? frontmatter.subcategory : folderCategory;
  return CATEGORY_MAP[key] || { category: folderCategory, categorySlug: folderCategory };
}

// ─── Scan Content Directory ─────────────────────────────────────────

const CONTENT_BASE = path.resolve(process.cwd(), 'Content');

export function scanContentFiles(locale: string = 'en'): Array<{ filePath: string; folderCategory: string }> {
  const root = path.join(CONTENT_BASE, locale);
  const results: Array<{ filePath: string; folderCategory: string }> = [];

  if (!fs.existsSync(root)) return results;

  function walk(dir: string, topCategory: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath, topCategory || entry.name);
      } else if (entry.name.endsWith('.mdx')) {
        results.push({ filePath: fullPath, folderCategory: topCategory });
      }
    }
  }

  const topDirs = fs.readdirSync(root, { withFileTypes: true });
  for (const dir of topDirs) {
    if (dir.isDirectory()) {
      walk(path.join(root, dir.name), dir.name);
    }
  }

  return results;
}
