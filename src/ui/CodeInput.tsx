import { Fragment, type InputHTMLAttributes, useState } from "react";
import { cn } from "./cn";

const DEFAULT_ALLOWED = /[A-Z0-9]/;
const DEFAULT_LENGTH = 8;
const DEFAULT_GROUP_SIZE = 4;
const GROUP_SEPARATOR = "-";

/** Viet hoa, bo ky tu khong cho phep (dau gach, khoang trang...), cat cho vua `length`. */
export function normalizeCode(
  raw: string,
  length = DEFAULT_LENGTH,
  allowed: RegExp = DEFAULT_ALLOWED,
) {
  return [...raw.toUpperCase()]
    .filter((char) => allowed.test(char))
    .join("")
    .slice(0, length);
}

export type CodeInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "value" | "onChange" | "maxLength" | "type"
> & {
  /** Cac ky tu cua ma, khong co dau gach: "ABCD2345". */
  value: string;
  onChange: (value: string) => void;
  /** So ky tu cua ma (so o). */
  length?: number;
  /** Cu moi `groupSize` o chen mot dau gach cho de doc. */
  groupSize?: number;
  /** Mot ky tu (da viet hoa) co duoc giu hay khong. Khong dung co `g` hay `y`. */
  allowed?: RegExp;
  invalid?: boolean;
};

/**
 * O nhap ma ngan (ma thiet bi, OTP). Mot <input> that nam de len cac o ve, nen
 * dan, tu dien va doc man hinh van chay nhu o nhap thuong. Nhan chu hoa hay
 * thuong, co hay khong dau gach, ca khi dan vao.
 */
export function CodeInput({
  value,
  onChange,
  length = DEFAULT_LENGTH,
  groupSize = DEFAULT_GROUP_SIZE,
  allowed = DEFAULT_ALLOWED,
  invalid,
  disabled,
  className,
  onFocus,
  onBlur,
  ...rest
}: CodeInputProps) {
  const [focused, setFocused] = useState(false);
  const chars = normalizeCode(value, length, allowed);
  const active = Math.min(chars.length, length - 1);

  return (
    <div
      className={cn(
        "relative flex h-14 w-full items-center gap-1.5",
        className,
      )}
    >
      {Array.from({ length }, (_, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: the slots are fixed positions
        <Fragment key={index}>
          {index > 0 && index % groupSize === 0 && (
            <span aria-hidden="true" className="text-fg-muted">
              {GROUP_SEPARATOR}
            </span>
          )}
          <span
            aria-hidden="true"
            className={cn(
              "flex h-full min-w-0 flex-1 items-center justify-center rounded-ui border bg-surface font-mono text-xl text-fg transition",
              invalid
                ? "border-danger"
                : focused && index === active
                  ? "border-primary ring-2 ring-ring"
                  : "border-border",
              disabled && "opacity-60",
            )}
          >
            {chars[index]}
          </span>
        </Fragment>
      ))}
      <input
        value={chars}
        disabled={disabled}
        aria-invalid={invalid || undefined}
        autoComplete="one-time-code"
        autoCapitalize="characters"
        spellCheck={false}
        // 16px de iOS khong tu zoom; trong suot vi cac o ben duoi moi la phan nhin thay.
        className="absolute inset-0 h-full w-full cursor-text bg-transparent text-base text-transparent caret-transparent opacity-0 outline-none disabled:cursor-not-allowed"
        onChange={(event) =>
          onChange(normalizeCode(event.target.value, length, allowed))
        }
        // Dau tro luon o cuoi: ma nhap lien tuc, khong chen giua.
        onSelect={(event) => {
          const input = event.currentTarget;
          const end = input.value.length;
          if (input.selectionStart !== end || input.selectionEnd !== end) {
            input.setSelectionRange(end, end);
          }
        }}
        onFocus={(event) => {
          setFocused(true);
          onFocus?.(event);
        }}
        onBlur={(event) => {
          setFocused(false);
          onBlur?.(event);
        }}
        {...rest}
      />
    </div>
  );
}
