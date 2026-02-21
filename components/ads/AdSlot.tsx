interface AdSlotProps {
  type: 'leaderboard' | 'rectangle' | 'mobile';
  position?: string;
  className?: string;
}

export function AdSlot({ type, position, className = '' }: AdSlotProps) {
  const sizeClasses = {
    leaderboard: 'min-h-[130px] w-full',
    rectangle: 'min-h-[290px] w-[300px]',
    mobile: 'min-h-[140px] w-full',
  };

  return (
    <div
      className={`ad-container my-8 p-4 bg-[rgba(245,245,240,0.5)] dark:bg-[rgba(30,30,30,0.4)] backdrop-blur-sm border border-[rgba(0,0,0,0.04)] dark:border-[rgba(255,255,255,0.06)] rounded-2xl text-center ${sizeClasses[type]} ${className}`}
      data-ad-position={position}
    >
      <span className="block text-[11px] uppercase tracking-widest text-[rgba(0,0,0,0.3)] dark:text-[rgba(255,255,255,0.25)] mb-2">
        Advertisement
      </span>
      {/* Google AdSense slot will be injected here */}
      <div className="flex items-center justify-center h-full text-[var(--color-text-tertiary)] text-caption">
        Ad Space
      </div>
    </div>
  );
}
