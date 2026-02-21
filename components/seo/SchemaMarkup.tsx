interface SchemaMarkupProps {
  schema: Record<string, unknown>;
}

export function SchemaMarkup({ schema }: SchemaMarkupProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Schema generators

export function generateConditionSchema(data: {
  name: string;
  alternateName?: string[];
  description: string;
  bodySystem: string;
  symptoms: string[];
  riskFactors: string[];
  treatments: { name: string; url?: string }[];
  url: string;
  datePublished: string;
  dateModified: string;
  reviewerName: string;
  reviewerTitle: string;
  lang: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalCondition',
    name: data.name,
    ...(data.alternateName && { alternateName: data.alternateName }),
    description: data.description,
    associatedAnatomy: {
      '@type': 'AnatomicalStructure',
      name: data.bodySystem,
    },
    signOrSymptom: data.symptoms.map((s) => ({
      '@type': 'MedicalSignOrSymptom',
      name: s,
    })),
    riskFactor: data.riskFactors.map((r) => ({
      '@type': 'MedicalRiskFactor',
      name: r,
    })),
    possibleTreatment: data.treatments.map((t) => ({
      '@type': 'Drug',
      name: t.name,
      ...(t.url && { url: t.url }),
    })),
  };
}

export function generateDrugSchema(data: {
  name: string;
  nonProprietaryName?: string;
  drugClass: string;
  administrationRoute: string;
  dosageForm: string;
  prescriptionStatus: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Drug',
    name: data.name,
    ...(data.nonProprietaryName && { nonProprietaryName: data.nonProprietaryName }),
    drugClass: { '@type': 'DrugClass', name: data.drugClass },
    administrationRoute: data.administrationRoute,
    dosageForm: data.dosageForm,
    prescriptionStatus: data.prescriptionStatus,
  };
}

export function generateMedicalTestSchema(data: {
  name: string;
  diagnoses: string[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalTest',
    name: data.name,
    usedToDiagnose: data.diagnoses.map((d) => ({
      '@type': 'MedicalCondition',
      name: d,
    })),
  };
}

export function generateArticleSchema(data: {
  headline: string;
  description: string;
  datePublished: string;
  dateModified: string;
  reviewerName: string;
  reviewerTitle: string;
  lang: string;
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalWebPage',
    headline: data.headline,
    description: data.description,
    datePublished: data.datePublished,
    dateModified: data.dateModified,
    author: { '@type': 'Organization', name: 'Medical Atlas' },
    reviewedBy: {
      '@type': 'Person',
      name: data.reviewerName,
      jobTitle: data.reviewerTitle,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Medical Atlas',
      logo: {
        '@type': 'ImageObject',
        url: 'https://themedicalatlas.com/logo.png',
      },
    },
    inLanguage: data.lang,
    isAccessibleForFree: true,
    url: data.url,
  };
}

export function generateBreadcrumbSchema(items: { name: string; url?: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      ...(item.url && { item: item.url }),
    })),
  };
}
