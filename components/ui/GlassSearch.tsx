'use client';

import { useEffect, useRef, useCallback } from 'react';
import { Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface GlassSearchProps {
  isOpen: boolean;
  onClose: () => void;
  lang?: string;
  placeholder?: string;
}

export function GlassSearch({
  isOpen,
  onClose,
  lang = 'en',
  placeholder = 'Search Medical Atlas...',
}: GlassSearchProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';

      // Focus input after animation
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = '';
        clearTimeout(timer);
      };
    }
  }, [isOpen, handleKeyDown]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="glass-overlay fixed inset-0 z-50 flex items-start justify-center pt-[15vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Search"
        >
          <motion.div
            className="glass-surface-strong w-full max-w-2xl mx-4 p-2 overflow-hidden"
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search input row */}
            <div className="flex items-center gap-3 px-4 py-3">
              <Search
                size={22}
                className="shrink-0 text-[var(--color-text-tertiary)]"
                aria-hidden="true"
              />
              <input
                ref={inputRef}
                type="search"
                placeholder={placeholder}
                dir={lang === 'ar' ? 'rtl' : 'ltr'}
                className="
                  flex-1 bg-transparent border-none outline-none
                  text-h4 text-[var(--color-text-primary)]
                  placeholder:text-[var(--color-text-tertiary)]
                "
              />
              <button
                onClick={onClose}
                className="
                  shrink-0 p-1.5 rounded-full
                  text-[var(--color-text-tertiary)]
                  hover:text-[var(--color-text-primary)]
                  hover:bg-black/5 dark:hover:bg-white/10
                  transition-colors cursor-pointer bg-transparent border-none
                "
                aria-label="Close search"
              >
                <X size={20} />
              </button>
            </div>

            {/* Divider */}
            <div className="mx-4 border-t border-black/5 dark:border-white/10" />

            {/* Recent searches placeholder */}
            <div className="px-4 py-6">
              <p className="text-caption text-[var(--color-text-tertiary)] text-center">
                Start typing to search articles, conditions, and more
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
