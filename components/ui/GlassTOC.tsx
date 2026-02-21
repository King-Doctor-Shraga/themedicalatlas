'use client';

import { useEffect, useState } from 'react';

interface TOCSection {
  id: string;
  title: string;
}

interface GlassTOCProps {
  sections: TOCSection[];
  className?: string;
}

export function GlassTOC({ sections, className = '' }: GlassTOCProps) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    sections.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (!element) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveId(id);
            }
          });
        },
        {
          rootMargin: '-80px 0px -60% 0px',
          threshold: 0,
        }
      );

      observer.observe(element);
      observers.push(observer);
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, [sections]);

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (sections.length === 0) return null;

  return (
    <nav
      className={`glass-surface-light sticky top-[calc(var(--navbar-height)+24px)] p-4 ${className}`}
      aria-label="Table of contents"
    >
      <p className="text-overline text-[var(--color-text-tertiary)] mb-3">
        On this page
      </p>

      <ul className="space-y-1 list-none p-0 m-0">
        {sections.map(({ id, title }) => {
          const isActive = activeId === id;

          return (
            <li key={id}>
              <button
                onClick={() => handleClick(id)}
                className={`
                  flex items-center gap-2.5 w-full text-start py-1.5 px-2 rounded-lg
                  text-body-small transition-colors duration-[var(--duration-fast)]
                  cursor-pointer bg-transparent border-none
                  ${
                    isActive
                      ? 'font-medium text-[var(--color-accent)]'
                      : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                  }
                `}
              >
                {/* Dot indicator */}
                <span
                  className={`
                    shrink-0 w-2 h-2 rounded-full border transition-colors duration-[var(--duration-fast)]
                    ${
                      isActive
                        ? 'bg-[var(--color-accent)] border-[var(--color-accent)]'
                        : 'bg-transparent border-[var(--color-text-tertiary)]'
                    }
                  `}
                  aria-hidden="true"
                />
                {title}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
