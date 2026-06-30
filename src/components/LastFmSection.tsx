import type { ReactNode } from "react";

interface LastFmSectionProps {
  title: string;
  hidden: boolean;
  items: any[];
  renderItem: (item: any, index: number) => ReactNode;
  footer?: ReactNode;
}

export function LastFmSection({
  title,
  hidden,
  items,
  renderItem,
  footer,
}: LastFmSectionProps) {
  return (
    <div className={`${hidden ? "hidden lg:block" : ""} min-w-0 w-full`}>
      <p className="text-xs uppercase tracking-[0.2em] text-muted mb-4">
        {title}
      </p>
      <div className="space-y-2 min-w-0 w-full">
        {items.map((item, index) => renderItem(item, index))}
      </div>
      {footer}
    </div>
  );
}
