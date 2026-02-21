export interface QuickFact {
  label: string;
  value: string;
}

export interface ContentSection {
  id: string;
  title: string;
  content: string; // HTML string
}

export interface Source {
  id: number;
  text: string;
  url?: string;
}

export interface Reviewer {
  name: string;
  specialty: string;
  imageUrl?: string;
}

export interface RelatedItem {
  slug: string;
  title: string;
  type: 'condition' | 'drug' | 'test' | 'calculator';
  category?: string;
}

export interface BaseArticle {
  slug: string;
  title: Record<string, string>; // keyed by language
  subtitle: Record<string, string>;
  category: string;
  categorySlug: string;
  quickFacts: Record<string, QuickFact[]>;
  sections: Record<string, ContentSection[]>;
  sources: Source[];
  reviewer: Reviewer;
  lastUpdated: string;
  readTime: number;
  relatedConditions: RelatedItem[];
  relatedDrugs: RelatedItem[];
  relatedTests: RelatedItem[];
  seoTitle: Record<string, string>;
  seoDescription: Record<string, string>;
}

export interface Condition extends BaseArticle {
  type: 'condition';
  aliases: string[];
  affectedArea: string;
  bodySystem: string;
  specialty: string;
  commonIn: string;
  treatable: 'Yes' | 'No' | 'Manageable';
  urgency: 'Routine' | 'Urgent' | 'Emergency';
}

export interface Drug extends BaseArticle {
  type: 'drug';
  genericName: string;
  brandNames: string[];
  drugClass: string;
  form: string;
  prescriptionRequired: boolean;
  pregnancyCategory: string;
}

export interface MedicalTest extends BaseArticle {
  type: 'test';
  testType: string;
  fastingRequired: boolean;
  duration: string;
  painLevel: string;
}

export interface Calculator {
  slug: string;
  title: Record<string, string>;
  description: Record<string, string>;
  category: string;
  seoTitle: Record<string, string>;
  seoDescription: Record<string, string>;
}
