import { AdSlot } from './AdSlot';

interface InContentAdProps {
  position: string;
  className?: string;
}

export function InContentAd({ position, className = '' }: InContentAdProps) {
  return (
    <div className={className}>
      {/* Desktop: leaderboard */}
      <div className="hidden md:block">
        <AdSlot type="leaderboard" position={position} />
      </div>
      {/* Mobile: mobile banner */}
      <div className="block md:hidden">
        <AdSlot type="mobile" position={position} />
      </div>
    </div>
  );
}
