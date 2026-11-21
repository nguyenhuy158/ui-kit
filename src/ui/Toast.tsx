import {
  CircleCheck,
  CircleX,
  Info,
  type LucideIcon,
  TriangleAlert,
  X,
} from "lucide-react";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "./cn";
import { EXIT_MS, motion } from "./use-presence";

export type ToastTone = "info" | "success" | "warning" | "error";

type Toast = {
  id: number;
  tone: ToastTone;
  message: string;
  description?: string;
  closing?: boolean;
};

type ToastOptions = { description?: string; duration?: number };

type ToastApi = {
  show: (tone: ToastTone, message: string, options?: ToastOptions) => void;
  info: (message: string, options?: ToastOptions) => void;
  success: (message: string, options?: ToastOptions) => void;
  warning: (message: string, options?: ToastOptions) => void;
  error: (message: string, options?: ToastOptions) => void;
  dismiss: (id: number) => void;
};

const ToastContext = createContext<ToastApi | null>(null);

export function useToast(): ToastApi {
  const api = useContext(ToastContext);
  if (!api) throw new Error("useToast phai nam trong ToastProvider");
  return api;
}

const TONE: Record<ToastTone, string> = {
  info: "border-border bg-surface text-fg",
  success: "border-success/40 bg-success-soft text-success-strong",
  warning: "border-warning/40 bg-warning-soft text-warning-strong",
  error: "border-danger/40 bg-danger-soft text-danger-strong",
};

/** Boc quanh app mot lan. Khong dung thu vien ngoai de copy sang project khac la chay. */
const TONE_ICON: Record<ToastTone, LucideIcon> = {
  info: Info,
  success: CircleCheck,
  warning: TriangleAlert,
  error: CircleX,
};

const DEFAULT_MAX_VISIBLE = 3;

function isSameActive(toast: Toast, tone: ToastTone, message: string) {
  return !toast.closing && toast.tone === tone && toast.message === message;
}

function withinLimit(list: Toast[], max: number) {
  const overflow = list.filter((toast) => !toast.closing).length - max;
  if (overflow <= 0) return list;
  const dropped = new Set(
    list
      .filter((toast) => !toast.closing)
      .slice(0, overflow)
      .map((toast) => toast.id),
  );
  return list.filter((toast) => !dropped.has(toast.id));
}

export function ToastProvider({
  children,
  duration = 4000,
  max = DEFAULT_MAX_VISIBLE,
  label = "Thông báo",
  dismissLabel = "Đóng thông báo",
}: {
  children: ReactNode;
  duration?: number;
  max?: number;
  label?: string;
  dismissLabel?: string;
}) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(1);

  const dismiss = useCallback((id: number) => {
    setToasts((list) =>
      list.map((toast) =>
        toast.id === id ? { ...toast, closing: true } : toast,
      ),
    );
    window.setTimeout(() => {
      setToasts((list) => list.filter((toast) => toast.id !== id));
    }, EXIT_MS);
  }, []);

  const show = useCallback(
    (tone: ToastTone, message: string, options?: ToastOptions) => {
      const id = nextId.current;
      nextId.current += 1;
      setToasts((list) =>
        list.some((toast) => isSameActive(toast, tone, message))
          ? list
          : withinLimit(
              [
                ...list,
                { id, tone, message, description: options?.description },
              ],
              max,
            ),
      );
      // Loi thuong can doc ky hon nen de lau gap doi.
      const ms =
        options?.duration ?? (tone === "error" ? duration * 2 : duration);
      window.setTimeout(() => dismiss(id), ms);
    },
    [dismiss, duration, max],
  );

  const api = useMemo<ToastApi>(
    () => ({
      show,
      dismiss,
      info: (message, options) => show("info", message, options),
      success: (message, options) => show("success", message, options),
      warning: (message, options) => show("warning", message, options),
      error: (message, options) => show("error", message, options),
    }),
    [show, dismiss],
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      {createPortal(
        <section
          aria-label={label}
          className="safe-top pointer-events-none fixed inset-x-0 top-0 z-[60] flex flex-col items-center gap-2 px-4 sm:inset-x-auto sm:end-4 sm:items-end"
        >
          {toasts.map((toast) => {
            const Icon = TONE_ICON[toast.tone];
            return (
              <div
                key={toast.id}
                role={toast.tone === "error" ? "alert" : "status"}
                style={{
                  animation: motion(
                    toast.closing === true,
                    "ui-slide-down var(--ui-dur) var(--ui-ease-out)",
                    "ui-slide-down-out var(--ui-dur-fast) var(--ui-ease-in)",
                  ),
                }}
                className={cn(
                  "pointer-events-auto flex w-full max-w-sm items-start gap-2 rounded-ui border py-3 ps-4 pe-2 shadow-lg",
                  TONE[toast.tone],
                )}
              >
                <Icon
                  size={20}
                  aria-hidden="true"
                  className="mt-0.5 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{toast.message}</p>
                  {toast.description && (
                    <p className="mt-0.5 text-xs opacity-80">
                      {toast.description}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  aria-label={dismissLabel}
                  onClick={() => dismiss(toast.id)}
                  className="-my-2 grid size-11 shrink-0 place-items-center rounded-ui opacity-70 outline-none transition hover:opacity-100 focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <X size={16} aria-hidden="true" />
                </button>
              </div>
            );
          })}
        </section>,
        document.body,
      )}
    </ToastContext.Provider>
  );
}
