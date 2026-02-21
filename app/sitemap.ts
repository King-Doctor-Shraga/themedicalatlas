import { MetadataRoute } from 'next';
import { supportedLanguages } from '@/lib/i18n/config';
import { getAllConditions } from '@/lib/mock/conditions';
import { getAllDrugs } from '@/lib/mock/drugs';
import { getAllTests } from '@/lib/mock/tests';
import { getAllCalculators } from '@/lib/mock/calculators';

const BASE_URL = 'https://themedicalatlas.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const lang of supportedLanguages) {
    // Homepage
    entries.push({
      url: `${BASE_URL}/${lang}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    });

    // Index pages
    for (const section of ['conditions', 'drugs', 'tests', 'calculators']) {
      entries.push({
        url: `${BASE_URL}/${lang}/${section}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    }

    // Conditions
    for (const condition of getAllConditions()) {
      entries.push({
        url: `${BASE_URL}/${lang}/conditions/${condition.slug}`,
        lastModified: new Date(condition.lastUpdated),
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    }

    // Drugs
    for (const drug of getAllDrugs()) {
      entries.push({
        url: `${BASE_URL}/${lang}/drugs/${drug.slug}`,
        lastModified: new Date(drug.lastUpdated),
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    }

    // Tests
    for (const test of getAllTests()) {
      entries.push({
        url: `${BASE_URL}/${lang}/tests/${test.slug}`,
        lastModified: new Date(test.lastUpdated),
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    }

    // Calculators
    for (const calc of getAllCalculators()) {
      entries.push({
        url: `${BASE_URL}/${lang}/calculators/${calc.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
      });
    }
  }

  return entries;
}
