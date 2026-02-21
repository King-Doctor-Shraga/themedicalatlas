import Link from 'next/link';
import { type Lang, supportedLanguages, languages } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/dictionaries';

interface FooterProps {
  lang: Lang;
  dict: Dictionary;
}

export function Footer({ lang, dict }: FooterProps) {
  const contentLinks = [
    { label: dict.nav.conditions, href: `/${lang}/conditions` },
    { label: dict.nav.drugs, href: `/${lang}/drugs` },
    { label: dict.nav.tests, href: `/${lang}/tests` },
    { label: dict.nav.bodyMap, href: `/${lang}/body` },
  ];

  const resourceLinks = [
    { label: dict.footer.bmiCalculator, href: `/${lang}/calculators/bmi` },
    { label: dict.footer.pregnancyCalc, href: `/${lang}/calculators/pregnancy` },
    { label: dict.footer.heartRiskCalc, href: `/${lang}/calculators/heart-risk` },
  ];

  const legalLinks = [
    { label: dict.footer.about, href: `/${lang}/about` },
    { label: dict.footer.editorialPolicy, href: `/${lang}/editorial-policy` },
    { label: dict.footer.privacy, href: `/${lang}/privacy` },
    { label: dict.footer.terms, href: `/${lang}/terms` },
    { label: dict.footer.disclaimer, href: `/${lang}/disclaimer` },
    { label: dict.footer.contact, href: `/${lang}/contact` },
  ];

  return (
    <footer
      className="bg-[var(--color-bg-secondary)] border-t border-black/5 dark:border-white/5
                 pb-24 lg:pb-0"
    >
      <div className="mx-auto max-w-[var(--content-max-width)] px-4 lg:px-6 py-12 lg:py-16">
        {/* Main grid: 4 columns on desktop, 2 on tablet, 1 on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand section */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link
              href={`/${lang}`}
              className="inline-block text-[var(--color-text-primary)]"
              style={{
                fontFamily: lang === 'ar' ? 'var(--font-heading-ar)' : 'var(--font-heading)',
              }}
            >
              <span className="text-xl font-bold">{dict.site.name}</span>
            </Link>
            <p className="mt-3 text-sm text-[var(--color-text-secondary)] leading-relaxed max-w-xs">
              {dict.site.tagline}
            </p>
          </div>

          {/* Content links */}
          <div>
            <h3 className="text-overline text-[var(--color-text-tertiary)] mb-4">
              {dict.footer.content}
            </h3>
            <ul className="space-y-2.5">
              {contentLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]
                               transition-colors duration-150"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources links */}
          <div>
            <h3 className="text-overline text-[var(--color-text-tertiary)] mb-4">
              {dict.footer.resources}
            </h3>
            <ul className="space-y-2.5">
              {resourceLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]
                               transition-colors duration-150"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal links */}
          <div>
            <h3 className="text-overline text-[var(--color-text-tertiary)] mb-4">
              {dict.footer.legal}
            </h3>
            <ul className="space-y-2.5">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]
                               transition-colors duration-150"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-12 pt-8 border-t border-black/5 dark:border-white/5">
          {/* Language switcher row */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            {supportedLanguages.map((code) => {
              const langInfo = languages[code];
              const isActive = code === lang;

              return (
                <Link
                  key={code}
                  href={`/${code}`}
                  className={`text-sm transition-colors duration-150
                    ${
                      isActive
                        ? 'text-[var(--color-accent)] font-medium'
                        : 'text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)]'
                    }`}
                >
                  {langInfo.nativeName}
                </Link>
              );
            })}
          </div>

          {/* Medical disclaimer */}
          <p className="text-xs text-[var(--color-text-tertiary)] leading-relaxed max-w-2xl mb-4">
            {dict.disclaimer.text}
          </p>

          {/* Copyright */}
          <p className="text-xs text-[var(--color-text-tertiary)]">
            {dict.site.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
