import {
  autoUpdate,
  flip,
  offset,
  shift,
  useFloating,
} from "@floating-ui/react";
import { type ReactNode, useId, useState } from "react";
import { cn } from "./cn";
import { motion, usePresence } from "./use-presence";

export type TooltipProps = {
  label: string;
  side?: "top" | "bottom";
  children: ReactNode;
  className?: string;
};

const TOOLTIP_OFFSET_PX = 6;

/**
 * Chu goi y khi ro chuot hoac focus ban phim.
 *
 * Tren thiet bi cam ung khong co "ro chuot", nen dung tooltip cho thong tin
 * bat buoc phai doc — chi dung cho phan giai thich them. Viec gi quan trong
 * thi viet thang ra man hinh.
 */
export function Tooltip({
  label,
  side = "top",
  children,
  className,
}: TooltipProps) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const { mounted, closing } = usePresence(open);
  const { refs, floatingStyles } = useFloating({
    open,
    placement: side,
    middleware: [offset(TOOLTIP_OFFSET_PX), flip(), shift({ padding: 8 })],
    transform: false,
    whileElementsMounted: autoUpdate,
  });

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: hover and focus listeners only toggle the hint
    <span
      ref={refs.setReference}
      className={cn("relative inline-flex", className)}
      onPointerEnter={() => setOpen(true)}
      onPointerLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      {/* aria-describedby tren the boc: screen reader doc them chu goi y sau noi dung. */}
      <span aria-describedby={open ? id : undefined}>{children}</span>

      {mounted && (
        <span
          ref={refs.setFloating}
          id={id}
          role="tooltip"
          style={{
            ...floatingStyles,
            animation: motion(
              closing,
              "ui-slide-down var(--ui-dur-fast) var(--ui-ease-out)",
              "ui-slide-down-out var(--ui-dur-fast) var(--ui-ease-in)",
            ),
          }}
          className={cn(
            "pointer-events-none z-50 whitespace-nowrap",
            "rounded-md bg-fg px-2 py-1 text-xs font-medium text-bg shadow-lg",
          )}
        >
          {label}
        </span>
      )}
    </span>
  );
}
