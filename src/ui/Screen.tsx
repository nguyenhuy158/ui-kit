import { type ReactNode, useId } from "react";
import { cn } from "./cn";

export type ScreenProps = {
  header?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  fill?: "viewport" | "parent";
  skipLinkLabel?: string;
  className?: string;
};

const DEFAULT_SKIP_LINK_LABEL = "Bỏ qua tới nội dung";

export function SkipLink({
  targetId,
  label = DEFAULT_SKIP_LINK_LABEL,
}: {
  targetId: string;
  label?: string;
}) {
  return (
    <a
      href={`#${targetId}`}
      className="sr-only rounded-ui bg-surface text-sm font-medium text-fg shadow-md outline-none ring-2 ring-ring focus:not-sr-only focus:fixed focus:start-2 focus:top-2 focus:z-[100] focus:px-3 focus:py-2"
    >
      {label}
    </a>
  );
}

export function Screen({
  header,
  footer,
  children,
  fill = "viewport",
  skipLinkLabel,
  className,
}: ScreenProps) {
  const mainId = useId();
  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden",
        fill === "viewport" ? "h-dvh" : "h-full",
        className,
      )}
    >
      {header && <SkipLink targetId={mainId} label={skipLinkLabel} />}
      {header && <div className="shrink-0">{header}</div>}
      <main
        id={mainId}
        tabIndex={-1}
        className="min-h-0 flex-1 overflow-hidden outline-none"
      >
        {children}
      </main>
      {footer && <div className="shrink-0">{footer}</div>}
    </div>
  );
}
