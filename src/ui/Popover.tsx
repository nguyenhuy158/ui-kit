import {
  autoUpdate,
  flip,
  offset,
  shift,
  useFloating,
} from "@floating-ui/react";
import { type ReactNode, useState } from "react";
import { cn } from "./cn";
import { useDismiss } from "./use-dismiss";
import { motion, usePresence } from "./use-presence";

const PANEL_OFFSET_PX = 4;

export type PopoverProps = {
  trigger: (props: {
    onClick: () => void;
    "aria-expanded": boolean;
    "aria-haspopup": "dialog";
  }) => ReactNode;
  children: ReactNode | ((close: () => void) => ReactNode);
  align?: "left" | "right";
  side?: "top" | "bottom";
  className?: string;
  panelClassName?: string;
};

export function Popover({
  trigger,
  children,
  align = "left",
  side = "bottom",
  className,
  panelClassName,
}: PopoverProps) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const ref = useDismiss(open, close);
  const { refs, floatingStyles } = useFloating({
    open,
    placement: `${side}-${align === "right" ? "end" : "start"}`,
    middleware: [offset(PANEL_OFFSET_PX), flip(), shift({ padding: 8 })],
    transform: false,
    whileElementsMounted: autoUpdate,
  });
  const { mounted, closing } = usePresence(open);

  return (
    <div
      ref={(node) => {
        ref.current = node;
        refs.setReference(node);
      }}
      className={cn("relative inline-block", className)}
    >
      {trigger({
        onClick: () => setOpen((value) => !value),
        "aria-expanded": open,
        "aria-haspopup": "dialog",
      })}

      {mounted && (
        <div
          ref={refs.setFloating}
          role="dialog"
          style={{
            ...floatingStyles,
            animation: motion(
              closing,
              "ui-slide-down var(--ui-dur-fast) var(--ui-ease-out)",
              "ui-slide-down-out var(--ui-dur-fast) var(--ui-ease-in)",
            ),
          }}
          className={cn(
            closing && "pointer-events-none",
            "z-50 min-w-56 rounded-ui border border-border ui-acrylic p-3 shadow-lg",
            panelClassName,
          )}
        >
          {typeof children === "function" ? children(close) : children}
        </div>
      )}
    </div>
  );
}
