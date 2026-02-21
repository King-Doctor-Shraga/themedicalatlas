import { AdSlot } from './AdSlot';

interface SidebarAdProps {
  sticky?: boolean;
  className?: string;
}

export function SidebarAd({ sticky = false, className = '' }: SidebarAdProps) {
  return (
    <div className={`${sticky ? 'sticky top-20' : ''} ${className}`}>
      <AdSlot type="rectangle" position={sticky ? 'sidebar-sticky' : 'sidebar'} />
    </div>
  );
}
