import { X } from "lucide-react";
import { type PointerEvent, type ReactNode, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { cn } from "./cn";
import { useOverlay } from "./use-overlay";
import { motion, usePresence } from "./use-presence";

export type SheetProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  /** "bottom" cho mobile (mac dinh), "left"/"right" cho menu ngan keo. */
  side?: "bottom" | "left" | "right";
  size?: SheetSize;
  closeLabel?: string;
  children?: ReactNode;
};

export type SheetSize = "sm" | "md" | "lg";

const SIDE_PANEL_WIDTH: Record<SheetSize, string> = {
  sm: "w-[85%] max-w-xs",
  md: "w-[85%] max-w-lg",
  lg: "w-full sm:w-[85%] max-w-3xl",
};

const SHEET_EXIT_MS = 200;
const DISMISS_DISTANCE_PX = 80;
const DISMISS_VELOCITY_PX_PER_MS = 0.5;
const MIN_FLING_DISTANCE_PX = 10;
const SNAP_BACK = "transform var(--ui-dur) var(--ui-ease-out)";

const SIDE = {
  bottom: {
    position: "inset-x-0 bottom-0 max-h-[85dvh] w-full rounded-t-2xl",
    animation: "ui-slide-up var(--ui-dur-gentle) var(--ui-ease-out)",
    exit: "ui-sheet-out-bottom var(--ui-dur) var(--ui-ease-in)",
  },
  left: {
    position: "inset-y-0 left-0 h-full",
    animation: "ui-slide-in-left var(--ui-dur-gentle) var(--ui-ease-out)",
    exit: "ui-sheet-out-left var(--ui-dur) var(--ui-ease-in)",
  },
  right: {
    position: "inset-y-0 right-0 h-full",
    animation: "ui-slide-in-right var(--ui-dur-gentle) var(--ui-ease-out)",
    exit: "ui-sheet-out-right var(--ui-dur) var(--ui-ease-in)",
  },
};

function dragDistance(side: SheetProps["side"], dx: number, dy: number) {
  if (side === "left") return -dx;
  if (side === "right") return dx;
  return dy;
}

function dragTransform(side: SheetProps["side"], distance: number) {
  if (side === "left") return `translateX(${-distance}px)`;
  if (side === "right") return `translateX(${distance}px)`;
  return `translateY(${distance}px)`;
}

/**
 * Vuot de dong: keo vung tieu de theo huong ra mep man hinh. Tha ra khi da keo
 * du xa hoac du nhanh thi dong, con khong thi bat ve cho cu.
 */
function useSheetDrag(side: SheetProps["side"], onClose: () => void) {
  const start = useRef<{ x: number; y: number; time: number } | null>(null);
  const distance = useRef(0);

  const panelOf = (event: PointerEvent<HTMLDivElement>) =>
    event.currentTarget.closest<HTMLElement>('[role="dialog"]');

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    const panel = panelOf(event);
    if (!panel) return;
    start.current = {
      x: event.clientX,
      y: event.clientY,
      time: event.timeStamp,
    };
    distance.current = 0;
    panel.style.transition = "none";
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const origin = start.current;
    const panel = panelOf(event);
    if (!origin || !panel) return;
    distance.current = Math.max(
      0,
      dragDistance(side, event.clientX - origin.x, event.clientY - origin.y),
    );
    panel.style.transform = dragTransform(side, distance.current);
  };

  const onPointerEnd = (event: PointerEvent<HTMLDivElement>) => {
    const origin = start.current;
    const panel = panelOf(event);
    start.current = null;
    if (!origin || !panel) return;
    const elapsed = Math.max(1, event.timeStamp - origin.time);
    const farEnough = distance.current > DISMISS_DISTANCE_PX;
    const fastEnough =
      distance.current > MIN_FLING_DISTANCE_PX &&
      distance.current / elapsed > DISMISS_VELOCITY_PX_PER_MS;
    panel.style.transition = SNAP_BACK;
    if (event.type === "pointerup" && (farEnough || fastEnough)) {
      onClose();
      return;
    }
    panel.style.transform = "";
  };

  return {
    onPointerDown,
    onPointerMove,
    onPointerUp: onPointerEnd,
    onPointerCancel: onPointerEnd,
  };
}

/** Ngan truot tu canh man hinh. Tren mobile de bam hon Modal vi gan ngon tay hon. */
export function Sheet({
  open,
  onClose,
  title,
  side = "bottom",
  size = "sm",
  closeLabel = "Đóng",
  children,
}: SheetProps) {
  const ref = useOverlay(open, onClose);
  const titleId = useId();
  const { mounted, closing } = usePresence(open, SHEET_EXIT_MS);
  const drag = useSheetDrag(side, onClose);

  if (!mounted) return null;

  return createPortal(
    <div
      className={cn("fixed inset-0 z-50", closing && "pointer-events-none")}
      style={{
        animation: motion(
          closing,
          "ui-fade-in var(--ui-dur-fast) var(--ui-ease-out)",
          "ui-fade-out var(--ui-dur) var(--ui-ease-in)",
        ),
      }}
    >
      <div
        aria-hidden="true"
        onClick={onClose}
        className="absolute inset-0 bg-black/50"
      />

      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        style={{
          animation: motion(closing, SIDE[side].animation, SIDE[side].exit),
        }}
        className={cn(
          "absolute flex flex-col bg-surface shadow-xl outline-none",
          SIDE[side].position,
          side !== "bottom" && SIDE_PANEL_WIDTH[size],
        )}
      >
        {/* Vung keo: tieu de (va thanh keo o Sheet duoi) de vuot ra mep dong lai. */}
        <div className="touch-none select-none" {...drag}>
          {side === "bottom" && (
            <div
              aria-hidden="true"
              className="mx-auto mt-2 h-1 w-10 rounded-full bg-border"
            />
          )}

          <div className="flex items-start gap-2 py-2 ps-4 pe-2">
            <h2
              id={titleId}
              className="min-w-0 flex-1 py-1 text-base font-semibold text-fg"
            >
              {title}
            </h2>
            <button
              type="button"
              aria-label={closeLabel}
              onClick={onClose}
              onPointerDown={(event) => event.stopPropagation()}
              className="grid size-11 shrink-0 place-items-center rounded-ui text-fg-muted outline-none transition hover:bg-surface-muted hover:text-fg focus-visible:ring-2 focus-visible:ring-ring"
            >
              <X size={18} aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="safe-bottom min-h-0 flex-1 overflow-y-auto px-4 pb-4">
          {children}
        </div>
      </div>
    </div>,
    document.body,
  );
}
