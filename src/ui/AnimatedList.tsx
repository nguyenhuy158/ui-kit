import { useAutoAnimate } from "@formkit/auto-animate/react";
import type { ElementType, ReactNode } from "react";

export type AnimatedListProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  durationMs?: number;
};

const DEFAULT_DURATION_MS = 200;

export function AnimatedList({
  children,
  as: Tag = "div",
  className,
  durationMs = DEFAULT_DURATION_MS,
}: AnimatedListProps) {
  const [ref] = useAutoAnimate({ duration: durationMs });
  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
