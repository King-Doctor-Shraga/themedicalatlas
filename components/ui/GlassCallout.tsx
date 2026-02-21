import { ReactNode } from 'react';
import { AlertTriangle, AlertCircle, Info, Lightbulb } from 'lucide-react';

type CalloutType = 'emergency' | 'warning' | 'info' | 'tip';

interface GlassCalloutProps {
  type: CalloutType;
  title?: string;
  children: ReactNode;
}

const calloutConfig = {
  emergency: {
    icon: AlertTriangle,
    bgClass: 'bg-red-50/80 dark:bg-red-950/30',
    borderClass: 'border-s-4 border-s-[var(--color-emergency)]',
    iconColor: 'var(--color-emergency)',
    titleColor: 'text-[var(--color-emergency)]',
  },
  warning: {
    icon: AlertCircle,
    bgClass: 'bg-amber-50/80 dark:bg-amber-950/30',
    borderClass: 'border-s-4 border-s-[var(--color-warning)]',
    iconColor: 'var(--color-warning)',
    titleColor: 'text-amber-800 dark:text-amber-300',
  },
  info: {
    icon: Info,
    bgClass: 'bg-blue-50/60 dark:bg-blue-950/20 glass-surface-light',
    borderClass: 'border-s-4 border-s-[var(--color-info)]',
    iconColor: 'var(--color-info)',
    titleColor: 'text-[var(--color-info)]',
  },
  tip: {
    icon: Lightbulb,
    bgClass: 'bg-teal-50/60 dark:bg-teal-950/20 glass-surface-light',
    borderClass: 'border-s-4 border-s-[var(--color-teal)]',
    iconColor: 'var(--color-teal)',
    titleColor: 'text-[var(--color-teal)]',
  },
};

export function GlassCallout({ type, title, children }: GlassCalloutProps) {
  const config = calloutConfig[type];
  const Icon = config.icon;

  return (
    <div
      className={`rounded-xl p-4 my-4 ${config.bgClass} ${config.borderClass}`}
      role={type === 'emergency' ? 'alert' : 'note'}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <Icon
          size={20}
          className="mt-0.5 shrink-0"
          style={{ color: config.iconColor }}
          aria-hidden="true"
        />

        <div className="flex-1 min-w-0">
          {/* Optional title */}
          {title && (
            <p className={`text-body-small font-semibold mb-1 ${config.titleColor}`}>
              {title}
            </p>
          )}

          {/* Content */}
          <div className="text-body-small text-[var(--color-text-primary)]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
