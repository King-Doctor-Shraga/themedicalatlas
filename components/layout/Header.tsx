'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Search, Sun, Moon } from 'lucide-react';
import { type Lang } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/dictionaries';
import { LanguageSelector } from './LanguageSelector';

interface HeaderProps {
  lang: Lang;
  dict: Dictionary;
}

const NAV_ITEMS = [
  { key: 'conditions' as const, path: '/conditions' },
  { key: 'drugs' as const, path: '/drugs' },
  { key: 'tests' as const, path: '/tests' },
  { key: 'calculators' as const, path: '/calculators' },
];

export function Header({ lang, dict }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // Initialize dark mode from localStorage / system preference
  useEffect(() => {
    const stored = localStorage.getItem('theme');
    if (stored === 'dark') {
      setIsDark(true);
    } else if (!stored) {
      setIsDark(document.documentElement.classList.contains('dark'));
    }
  }, []);

  // Scroll listener for shrink effect
  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 10);
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Toggle dark mode
  const toggleDarkMode = useCallback(() => {
    const nextDark = !isDark;
    setIsDark(nextDark);

    if (nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const logoText = lang === 'ar' ? 'أطلس الطب' : 'Medical Atlas';

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 glass-surface transition-all duration-300
        ${isScrolled ? 'h-12' : 'h-14 lg:h-16'}
        !rounded-none !border-x-0 !border-t-0`}
    >
      <nav
        className="mx-auto flex h-full max-w-[var(--content-max-width)] items-center justify-between px-4 lg:px-6"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link
          href={`/${lang}`}
          className="flex-shrink-0 text-[var(--color-text-primary)] hover:text-[var(--color-accent)]
                     transition-colors duration-150"
          style={{ fontFamily: lang === 'ar' ? 'var(--font-heading-ar)' : 'var(--font-heading)' }}
        >
          <span
            className={`font-bold tracking-tight transition-all duration-300
              ${isScrolled ? 'text-base lg:text-lg' : 'text-lg lg:text-xl'}`}
          >
            {logoText}
          </span>
        </Link>

        {/* Center nav links — hidden on mobile */}
        <div className="hidden lg:flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.key}
              href={`/${lang}${item.path}`}
              className="px-3 py-1.5 rounded-lg text-sm font-medium
                         text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]
                         hover:bg-black/5 dark:hover:bg-white/5
                         transition-colors duration-150"
            >
              {dict.nav[item.key]}
            </Link>
          ))}
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Search button */}
          <Link
            href={`/${lang}/search`}
            className="flex items-center justify-center w-9 h-9 rounded-full
                       text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]
                       hover:bg-black/5 dark:hover:bg-white/5
                       transition-colors duration-150"
            aria-label={dict.nav.search}
          >
            <Search className="w-[18px] h-[18px]" />
          </Link>

          {/* Dark mode toggle */}
          <button
            onClick={toggleDarkMode}
            className="flex items-center justify-center w-9 h-9 rounded-full
                       text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]
                       hover:bg-black/5 dark:hover:bg-white/5
                       transition-colors duration-150 cursor-pointer"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? (
              <Sun className="w-[18px] h-[18px]" />
            ) : (
              <Moon className="w-[18px] h-[18px]" />
            )}
          </button>

          {/* Language selector */}
          <LanguageSelector lang={lang} />
        </div>
      </nav>
    </header>
  );
}
