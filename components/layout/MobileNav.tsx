'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, Search, LayoutGrid, Menu, X, ChevronRight } from 'lucide-react';
import { type Lang } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/dictionaries';

interface MobileNavProps {
  lang: Lang;
  dict: Dictionary;
}

type TabKey = 'home' | 'search' | 'categories' | 'more';

export function MobileNav({ lang, dict }: MobileNavProps) {
  const pathname = usePathname();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Determine active tab
  const getActiveTab = useCallback((): TabKey => {
    if (pathname === `/${lang}` || pathname === `/${lang}/`) return 'home';
    if (pathname.startsWith(`/${lang}/search`)) return 'search';
    if (
      pathname.startsWith(`/${lang}/conditions`) ||
      pathname.startsWith(`/${lang}/drugs`) ||
      pathname.startsWith(`/${lang}/tests`)
    ) {
      return 'categories';
    }
    return 'home';
  }, [pathname, lang]);

  const activeTab = getActiveTab();

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isDrawerOpen]);

  // Close drawer on route change
  useEffect(() => {
    setIsDrawerOpen(false);
  }, [pathname]);

  const drawerLinks = [
    { label: dict.nav.home, href: `/${lang}`, icon: Home },
    { label: dict.nav.conditions, href: `/${lang}/conditions`, icon: LayoutGrid },
    { label: dict.nav.drugs, href: `/${lang}/drugs`, icon: LayoutGrid },
    { label: dict.nav.tests, href: `/${lang}/tests`, icon: LayoutGrid },
    { label: dict.nav.calculators, href: `/${lang}/calculators`, icon: LayoutGrid },
    { label: dict.nav.bodyMap, href: `/${lang}/body`, icon: LayoutGrid },
  ];

  return (
    <>
      {/* Bottom tab bar */}
      <nav
        className="fixed bottom-0 inset-x-0 z-50 glass-surface !rounded-none !border-x-0 !border-b-0
                   lg:hidden"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        aria-label="Mobile navigation"
      >
        <div className="flex items-center justify-around h-14">
          {/* Home tab */}
          <Link
            href={`/${lang}`}
            className={`flex flex-col items-center justify-center gap-0.5 w-full h-full
                       transition-colors duration-150
              ${activeTab === 'home'
                ? 'text-[var(--color-accent)]'
                : 'text-[var(--color-text-tertiary)]'
              }`}
            aria-label={dict.common.home}
            aria-current={activeTab === 'home' ? 'page' : undefined}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] font-medium">{dict.common.home}</span>
          </Link>

          {/* Search tab */}
          <Link
            href={`/${lang}/search`}
            className={`flex flex-col items-center justify-center gap-0.5 w-full h-full
                       transition-colors duration-150
              ${activeTab === 'search'
                ? 'text-[var(--color-accent)]'
                : 'text-[var(--color-text-tertiary)]'
              }`}
            aria-label={dict.nav.search}
            aria-current={activeTab === 'search' ? 'page' : undefined}
          >
            <Search className="w-5 h-5" />
            <span className="text-[10px] font-medium">{dict.nav.search.replace('...', '')}</span>
          </Link>

          {/* Categories tab */}
          <Link
            href={`/${lang}/conditions`}
            className={`flex flex-col items-center justify-center gap-0.5 w-full h-full
                       transition-colors duration-150
              ${activeTab === 'categories'
                ? 'text-[var(--color-accent)]'
                : 'text-[var(--color-text-tertiary)]'
              }`}
            aria-label={dict.nav.conditions}
            aria-current={activeTab === 'categories' ? 'page' : undefined}
          >
            <LayoutGrid className="w-5 h-5" />
            <span className="text-[10px] font-medium">{dict.nav.conditions}</span>
          </Link>

          {/* More tab — opens drawer */}
          <button
            onClick={() => setIsDrawerOpen(true)}
            className={`flex flex-col items-center justify-center gap-0.5 w-full h-full
                       transition-colors duration-150 cursor-pointer
              ${isDrawerOpen
                ? 'text-[var(--color-accent)]'
                : 'text-[var(--color-text-tertiary)]'
              }`}
            aria-label="More navigation options"
            aria-expanded={isDrawerOpen}
          >
            <Menu className="w-5 h-5" />
            <span className="text-[10px] font-medium">
              {lang === 'ar' ? 'المزيد' : 'More'}
            </span>
          </button>
        </div>
      </nav>

      {/* Full-screen drawer overlay */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/30 dark:bg-black/50"
            onClick={() => setIsDrawerOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer panel */}
          <div
            className="absolute inset-y-0 end-0 w-full max-w-sm glass-surface-strong !rounded-none
                       flex flex-col overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            {/* Drawer header */}
            <div className="flex items-center justify-between px-5 h-14 border-b border-black/5 dark:border-white/5">
              <span
                className="text-lg font-bold text-[var(--color-text-primary)]"
                style={{
                  fontFamily: lang === 'ar' ? 'var(--font-heading-ar)' : 'var(--font-heading)',
                }}
              >
                {dict.site.name}
              </span>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="flex items-center justify-center w-9 h-9 rounded-full
                           text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]
                           hover:bg-black/5 dark:hover:bg-white/5
                           transition-colors duration-150 cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer links */}
            <div className="flex-1 px-3 py-4">
              <ul className="space-y-1">
                {drawerLinks.map((link) => {
                  const isActive = pathname === link.href || pathname.startsWith(link.href + '/');

                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className={`flex items-center justify-between px-4 py-3 rounded-xl
                                   transition-colors duration-150
                          ${
                            isActive
                              ? 'bg-[var(--color-accent)]/10 text-[var(--color-accent)] font-medium'
                              : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-black/5 dark:hover:bg-white/5'
                          }`}
                      >
                        <div className="flex items-center gap-3">
                          <link.icon className="w-5 h-5" />
                          <span className="text-sm">{link.label}</span>
                        </div>
                        <ChevronRight
                          className={`w-4 h-4 text-[var(--color-text-tertiary)]
                            ${lang === 'ar' ? 'rotate-180' : ''}`}
                        />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Drawer footer */}
            <div
              className="px-5 py-4 border-t border-black/5 dark:border-white/5"
              style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 16px)' }}
            >
              <p className="text-xs text-[var(--color-text-tertiary)] leading-relaxed">
                {dict.disclaimer.text}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
