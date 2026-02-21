export const languages = {
  en: {
    name: 'English',
    nativeName: 'English',
    direction: 'ltr' as const,
    locale: 'en',
    hreflang: 'en',
  },
  ar: {
    name: 'Arabic',
    nativeName: 'العربية',
    direction: 'rtl' as const,
    locale: 'ar',
    hreflang: 'ar',
  },
  es: {
    name: 'Spanish',
    nativeName: 'Español',
    direction: 'ltr' as const,
    locale: 'es',
    hreflang: 'es',
  },
  pt: {
    name: 'Portuguese',
    nativeName: 'Português',
    direction: 'ltr' as const,
    locale: 'pt',
    hreflang: 'pt',
  },
  hi: {
    name: 'Hindi',
    nativeName: 'हिन्दी',
    direction: 'ltr' as const,
    locale: 'hi',
    hreflang: 'hi',
  },
} as const;

export type Lang = keyof typeof languages;
export const supportedLanguages: Lang[] = ['en', 'ar'];
export const defaultLanguage: Lang = 'ar';

export function isRTL(lang: Lang): boolean {
  return languages[lang]?.direction === 'rtl';
}

export function getDirection(lang: Lang): 'rtl' | 'ltr' {
  return languages[lang]?.direction ?? 'ltr';
}
