import { supportedLanguages, defaultLanguage } from '@/lib/i18n/config';

interface HreflangProps {
  path: string; // path without language prefix, e.g. "/conditions/diabetes"
}

const BASE_URL = 'https://themedicalatlas.com';

export function Hreflang({ path }: HreflangProps) {
  return (
    <>
      {supportedLanguages.map((lang) => (
        <link
          key={lang}
          rel="alternate"
          hrefLang={lang}
          href={`${BASE_URL}/${lang}${path}`}
        />
      ))}
      <link
        rel="alternate"
        hrefLang="x-default"
        href={`${BASE_URL}/${defaultLanguage}${path}`}
      />
    </>
  );
}

export function generateHreflangMetadata(path: string) {
  const alternates: Record<string, string> = {};
  for (const lang of supportedLanguages) {
    alternates[lang] = `${BASE_URL}/${lang}${path}`;
  }
  return {
    alternates: {
      canonical: `${BASE_URL}/${defaultLanguage}${path}`,
      languages: alternates,
    },
  };
}
