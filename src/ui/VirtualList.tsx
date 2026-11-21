import { useVirtualizer } from "@tanstack/react-virtual";
import { type ReactNode, useRef } from "react";
import { cn } from "./cn";

export type VirtualListProps<T> = {
  items: T[];
  getKey: (item: T) => string;
  renderItem: (item: T, index: number) => ReactNode;
  rowHeight: number;
  label: string;
  className?: string;
};

const OVERSCAN_ROWS = 6;

/**
 * Danh sach rat dai chi ve cac dong dang thay. Day la ngoai le co chu y cua
 * luat "khong cuon": chi dung ben trong Sheet/Modal chua danh sach dai. Man
 * hinh chinh van dung PagedList.
 */
export function VirtualList<T>({
  items,
  getKey,
  renderItem,
  rowHeight,
  label,
  className,
}: VirtualListProps<T>) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => rowHeight,
    overscan: OVERSCAN_ROWS,
    getItemKey: (index) => getKey(items[index] as T),
  });

  return (
    <div
      ref={scrollRef}
      className={cn("h-full min-h-0 overflow-y-auto", className)}
    >
      <ul
        aria-label={label}
        className="relative m-0 w-full list-none p-0"
        style={{ height: virtualizer.getTotalSize() }}
      >
        {virtualizer.getVirtualItems().map((row) => (
          <li
            key={row.key}
            className="absolute start-0 top-0 w-full"
            style={{
              height: row.size,
              transform: `translateY(${row.start}px)`,
            }}
          >
            {renderItem(items[row.index] as T, row.index)}
          </li>
        ))}
      </ul>
    </div>
  );
}
