import { useId, useState, type ReactNode } from "react";
import { cn } from "./cn";
import { useDismiss } from "./use-dismiss";

export type ListboxOption = {
  value: string;
  label: string;
  /** Chu phu ben duoi, vi du mo ta ngan. */
  description?: string;
  icon?: ReactNode;
};

export type ListboxProps = {
  options: ListboxOption[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  invalid?: boolean;
  className?: string;
};

/**
 * O chon tu ve, dong bo giao dien voi phan con lai (khac popup xam cua <select>).
 * Danh sach ngan, khong can tim. Dai tu ~10 muc thi dung <Combobox>.
 * Phim: Enter/Space/mui ten mo; mui ten len xuong di chuyen; Enter chon; Esc dong.
 */
export function Listbox({
  options,
  value,
  onChange,
  placeholder = "Chọn...",
  disabled,
  invalid,
  className,
}: ListboxProps) {
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const ref = useDismiss(open, () => setOpen(false));
  const listId = useId();

  const selected = options.find((option) => option.value === value);

  const show = () => {
    setHighlight(Math.max(0, options.findIndex((option) => option.value === value)));
    setOpen(true);
  };

  const commit = (option: ListboxOption) => {
    onChange(option.value);
    setOpen(false);
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (!open) {
      if (["Enter", " ", "ArrowDown", "ArrowUp"].includes(event.key)) {
        event.preventDefault();
        show();
      }
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlight((index) => Math.min(index + 1, options.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlight((index) => Math.max(index - 1, 0));
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      const option = options[highlight];
      if (option) commit(option);
    } else if (event.key === "Tab") {
      setOpen(false);
    }
  };

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => (open ? setOpen(false) : show())}
        onKeyDown={onKeyDown}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-invalid={invalid || undefined}
        className={cn(
          "flex h-11 w-full items-center gap-2 rounded-ui border border-border bg-surface px-3 pr-9 text-left text-fg sm:h-10",
          "text-base sm:pointer-fine:text-sm",
          "outline-none transition focus:border-primary focus:ring-2 focus:ring-ring",
          "disabled:cursor-not-allowed disabled:opacity-60",
          open && "border-primary ring-2 ring-ring",
          invalid && "border-danger",
        )}
      >
        {selected?.icon}
        <span className={cn("min-w-0 flex-1 truncate", !selected && "text-fg-muted")}>
          {selected?.label ?? placeholder}
        </span>
      </button>

      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        className={cn(
          "pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-muted transition",
          open && "rotate-180",
        )}
      >
        <path d="M6 8l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>

      {open && (
        <ul
          id={listId}
          role="listbox"
          style={{ animation: "ui-slide-down 120ms ease-out" }}
          className="absolute z-50 mt-1 max-h-64 w-full overflow-y-auto rounded-ui border border-border bg-surface p-1 shadow-lg"
        >
          {options.map((option, index) => {
            const isSelected = option.value === value;
            return (
              <li key={option.value}>
                <button
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  tabIndex={-1}
                  onClick={() => commit(option)}
                  onPointerEnter={() => setHighlight(index)}
                  className={cn(
                    "flex w-full items-center gap-2.5 rounded-[calc(var(--ui-radius)-4px)] px-2.5 py-2 text-left text-sm transition",
                    index === highlight ? "bg-surface-muted" : "bg-transparent",
                    isSelected ? "font-semibold text-primary" : "text-fg",
                  )}
                >
                  {option.icon}
                  <span className="min-w-0 flex-1">
                    <span className="block truncate">{option.label}</span>
                    {option.description && (
                      <span className="block truncate text-xs font-normal text-fg-muted">
                        {option.description}
                      </span>
                    )}
                  </span>
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className={cn("h-4 w-4 shrink-0", !isSelected && "invisible")}
                  >
                    <path d="M5 10.5l3 3 7-7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
