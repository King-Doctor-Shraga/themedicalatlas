import type { Metadata } from 'next';

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

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${title} | Medical Atlas`,
      description,
      url,
      siteName: 'Medical Atlas',
      locale: lang,
      type,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Medical Atlas`,
      description,
    },
  };
}
