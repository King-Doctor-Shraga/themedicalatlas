import { AlertTriangle } from 'lucide-react';

interface DisclaimerProps {
  text: string;
  className?: string;
}

export function Disclaimer({ text, className = '' }: DisclaimerProps) {
  return (
    <div
      className={`mt-12 p-4 bg-[var(--color-bg-secondary)] rounded-xl border border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.06)] ${className}`}
    >
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-[var(--color-text-tertiary)] flex-shrink-0 mt-0.5" />
        <p className="text-body-small text-[var(--color-text-secondary)] leading-relaxed">
          {text}
        </p>
      </div>
    </div>
  );
}
