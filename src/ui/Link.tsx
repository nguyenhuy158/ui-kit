import type { AnchorHTMLAttributes } from "react";
import { cn } from "./cn";

export type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  /** Mo tab moi kem rel an toan va icon mui ten ra ngoai. */
  external?: boolean;
  inline?: boolean;
};

/** The <a> mau primary, gach chan khi hover; `inline` (link giua doan van) luon gach chan. Router link thi boc className nay vao Link cua router. */
export function Link({
  external,
  inline,
  className,
  children,
  ...rest
}: LinkProps) {
  return (
    <a
      {...(external && { target: "_blank", rel: "noopener noreferrer" })}
      className={cn(
        "rounded font-medium text-primary underline-offset-4 transition",
        inline
          ? "underline hover:decoration-2"
          : "inline-flex items-center gap-1 hover:underline",
        "outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
      {...rest}
    >
      {children}
      {external && (
        <svg
          viewBox="0 0 20 20"
          aria-hidden="true"
          className={cn("size-3.5", inline && "ml-0.5 inline align-[-0.125em]")}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            d="M8 4H4v12h12v-4M11 4h5v5M16 4l-7 7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </a>
  );
}
