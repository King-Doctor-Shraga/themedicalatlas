import type { Metadata } from 'next';
import { supportedLanguages, defaultLanguage } from '@/lib/i18n/config';

const BASE_URL = 'https://themedicalatlas.com';

export function generatePageMetadata({
  title,
  description,
  lang,
  path,
  type = 'website',
}: {
  title: string;
  description: string;
  lang: string;
  path: string;
  type?: 'website' | 'article';
}): Metadata {
  const url = `${BASE_URL}/${lang}${path}`;

  // Build hreflang alternates
  const languages: Record<string, string> = {};
  for (const l of supportedLanguages) {
    languages[l] = `${BASE_URL}/${l}${path}`;
  }

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        ...languages,
        'x-default': `${BASE_URL}/${defaultLanguage}${path}`,
      },
    },
    openGraph: {
      title: `${title} | Medical Atlas`,
      description,
      url,
      siteName: 'Medical Atlas',
      locale: lang === 'ar' ? 'ar_SA' : 'en_US',
      type,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Medical Atlas`,
      description,
    },
  };
}
