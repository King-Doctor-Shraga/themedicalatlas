import type { Lang } from './config';

const dictionaries = {
  en: () => import('./dictionaries/en.json').then((module) => module.default),
  ar: () => import('./dictionaries/ar.json').then((module) => module.default),
};

export type Dictionary = Awaited<ReturnType<(typeof dictionaries)['en']>>;

export async function getDictionary(lang: Lang): Promise<Dictionary> {
  if (lang in dictionaries) {
    return dictionaries[lang as keyof typeof dictionaries]();
  }
  return dictionaries.en();
}
