'use client';

import { useState } from 'react';

interface BloodSugarConverterProps {
  lang: string;
  labels: {
    calculate: string;
    result: string;
    reset: string;
  };
}

export function BloodSugarConverter({ labels }: BloodSugarConverterProps) {
  const [value, setValue] = useState('');
  const [unit, setUnit] = useState<'mgdl' | 'mmol'>('mgdl');
  const [result, setResult] = useState<string | null>(null);

  const handleConvert = () => {
    const num = parseFloat(value);
    if (isNaN(num) || num <= 0) return;

    if (unit === 'mgdl') {
      setResult(`${(num / 18.0182).toFixed(2)} mmol/L`);
    } else {
      setResult(`${(num * 18.0182).toFixed(0)} mg/dL`);
    }
  };

  const handleReset = () => {
    setValue('');
    setResult(null);
  };

  return (
    <div className="glass-surface p-6 sm:p-8 max-w-md mx-auto">
      <div className="space-y-4">
        <div>
          <label className="block text-body-small font-medium text-[var(--color-text-primary)] mb-2">
            Blood Sugar Value
          </label>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={unit === 'mgdl' ? '100' : '5.5'}
            min="0"
            className="w-full px-4 py-3 rounded-full bg-[var(--color-bg-secondary)] border border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.08)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] transition-shadow"
          />
        </div>

        <div>
          <label className="block text-body-small font-medium text-[var(--color-text-primary)] mb-2">
            Unit
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => setUnit('mgdl')}
              className={`flex-1 px-4 py-2.5 rounded-full text-body-small font-medium transition-all ${
                unit === 'mgdl'
                  ? 'bg-[var(--color-accent)] text-white'
                  : 'glass-capsule text-[var(--color-text-secondary)]'
              }`}
            >
              mg/dL
            </button>
            <button
              onClick={() => setUnit('mmol')}
              className={`flex-1 px-4 py-2.5 rounded-full text-body-small font-medium transition-all ${
                unit === 'mmol'
                  ? 'bg-[var(--color-accent)] text-white'
                  : 'glass-capsule text-[var(--color-text-secondary)]'
              }`}
            >
              mmol/L
            </button>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={handleConvert}
            className="flex-1 px-6 py-3 rounded-full bg-[var(--color-accent)] text-white font-medium hover:opacity-90 transition-opacity"
          >
            {labels.calculate}
          </button>
          <button
            onClick={handleReset}
            className="px-6 py-3 rounded-full glass-capsule text-[var(--color-text-secondary)] font-medium"
          >
            {labels.reset}
          </button>
        </div>
      </div>

      {result && (
        <div className="mt-6 pt-6 border-t border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.08)] text-center">
          <p className="text-caption text-[var(--color-text-tertiary)] mb-1">{labels.result}</p>
          <p className="text-display font-bold text-[var(--color-accent)]">
            {result}
          </p>
        </div>
      )}
    </div>
  );
}
