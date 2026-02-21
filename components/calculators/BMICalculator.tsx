'use client';

import { useState } from 'react';

interface BMICalculatorProps {
  lang: string;
  labels: {
    calculate: string;
    result: string;
    reset: string;
  };
}

interface BMIResult {
  bmi: number;
  category: string;
  color: string;
}

function calculateBMI(weight: number, height: number): BMIResult | null {
  if (weight <= 0 || height <= 0) return null;
  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);

  let category: string;
  let color: string;

  if (bmi < 18.5) {
    category = 'Underweight';
    color = 'var(--color-info)';
  } else if (bmi < 25) {
    category = 'Normal weight';
    color = 'var(--color-success)';
  } else if (bmi < 30) {
    category = 'Overweight';
    color = 'var(--color-warning)';
  } else {
    category = 'Obese';
    color = 'var(--color-emergency)';
  }

  return { bmi: Math.round(bmi * 10) / 10, category, color };
}

export function BMICalculator({ labels }: BMICalculatorProps) {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [result, setResult] = useState<BMIResult | null>(null);

  const handleCalculate = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    setResult(calculateBMI(w, h));
  };

  const handleReset = () => {
    setWeight('');
    setHeight('');
    setResult(null);
  };

  return (
    <div className="glass-surface p-6 sm:p-8 max-w-md mx-auto">
      <div className="space-y-4">
        <div>
          <label className="block text-body-small font-medium text-[var(--color-text-primary)] mb-2">
            Weight (kg)
          </label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="70"
            min="1"
            max="500"
            className="w-full px-4 py-3 rounded-full bg-[var(--color-bg-secondary)] border border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.08)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] transition-shadow"
          />
        </div>

        <div>
          <label className="block text-body-small font-medium text-[var(--color-text-primary)] mb-2">
            Height (cm)
          </label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder="170"
            min="1"
            max="300"
            className="w-full px-4 py-3 rounded-full bg-[var(--color-bg-secondary)] border border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.08)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] transition-shadow"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={handleCalculate}
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
          <p className="text-display font-bold" style={{ color: result.color }}>
            {result.bmi}
          </p>
          <p className="text-h4 font-medium mt-1" style={{ color: result.color }}>
            {result.category}
          </p>
        </div>
      )}
    </div>
  );
}
