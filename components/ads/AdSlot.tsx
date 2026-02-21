'use client';

import { useEffect, useRef } from 'react';

interface AdSlotProps {
  type: 'leaderboard' | 'rectangle' | 'mobile';
  position?: string;
  className?: string;
}

const adFormats: Record<string, { style: React.CSSProperties; format: string }> = {
  leaderboard: {
    style: { display: 'block', minHeight: '90px', width: '100%' },
    format: 'horizontal',
  },
  rectangle: {
    style: { display: 'block', minHeight: '250px', width: '300px' },
    format: 'rectangle',
  },
  mobile: {
    style: { display: 'block', minHeight: '100px', width: '100%' },
    format: 'horizontal',
  },
};

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

export function AdSlot({ type, position, className = '' }: AdSlotProps) {
  const adRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);
  const publisherId = process.env.NEXT_PUBLIC_ADSENSE_ID;
  const { style, format } = adFormats[type];

  useEffect(() => {
    if (!publisherId || pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      // AdSense not loaded yet — that's fine
    }
  }, [publisherId]);

  // If no AdSense ID configured, show placeholder
  if (!publisherId) {
    return (
      <div
        className={`ad-container my-8 p-4 bg-[rgba(245,245,240,0.5)] dark:bg-[rgba(30,30,30,0.4)] backdrop-blur-sm border border-[rgba(0,0,0,0.04)] dark:border-[rgba(255,255,255,0.06)] rounded-2xl text-center ${className}`}
        style={{ minHeight: style.minHeight }}
        data-ad-position={position}
      >
        <span className="block text-[11px] uppercase tracking-widest text-[rgba(0,0,0,0.3)] dark:text-[rgba(255,255,255,0.25)] mb-2">
          Advertisement
        </span>
        <div className="flex items-center justify-center h-full text-[var(--color-text-tertiary)] text-caption">
          Ad Space
        </div>
      </div>
    );
  }

  return (
    <div
      className={`ad-container my-8 rounded-2xl overflow-hidden ${className}`}
      data-ad-position={position}
    >
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={style}
        data-ad-client={publisherId}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
