'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Globe } from 'lucide-react';
import { languages, supportedLanguages, type Lang } from '@/lib/i18n/config';

interface LanguageSelectorProps {
  lang: Lang;
  className?: string;
}

export function LanguageSelector({ lang, className = '' }: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  function getLocalizedPath(targetLang: Lang): string {
    // Replace the current language segment with the target language
    // pathname is like /en/conditions or /ar/drugs
    const segments = pathname.split('/');
    if (segments.length >= 2 && supportedLanguages.includes(segments[1] as Lang)) {
      segments[1] = targetLang;
    }
    return segments.join('/') || `/${targetLang}`;
  }

  const currentLanguage = languages[lang];

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="glass-capsule flex items-center gap-1.5 px-3 py-1.5 text-sm
                   text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]
                   transition-colors duration-150 cursor-pointer"
        aria-label="Select language"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <Globe className="w-4 h-4" />
        <span className="hidden sm:inline">{currentLanguage.nativeName}</span>
      </button>

      {isOpen && (
        <div
          className="absolute top-full mt-2 end-0 glass-surface min-w-[160px] py-1 z-50
                     rounded-xl overflow-hidden"
          role="listbox"
          aria-label="Available languages"
        >
          {supportedLanguages.map((code) => {
            const langInfo = languages[code];
            const isActive = code === lang;

            return (
              <Link
                key={code}
                href={getLocalizedPath(code)}
                onClick={() => setIsOpen(false)}
                role="option"
                aria-selected={isActive}
                className={`flex items-center justify-between px-4 py-2.5 text-sm transition-colors duration-150
                  ${
                    isActive
                      ? 'text-[var(--color-accent)] bg-[var(--color-accent)]/10 font-medium'
                      : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
              >
                <span>{langInfo.nativeName}</span>
                <span className="text-[var(--color-text-tertiary)] text-xs">
                  {langInfo.name}
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
