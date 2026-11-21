import type { ReactNode } from "react";
import { cn } from "./cn";

export const ERROR_PAGE_STATUSES = [400, 401, 403, 404, 500, 503] as const;

export type ErrorPageStatus = (typeof ERROR_PAGE_STATUSES)[number];

const MESSAGES: Record<
  ErrorPageStatus,
  { title: string; description: string }
> = {
  400: {
    title: "Yêu cầu không hợp lệ",
    description: "Dữ liệu gửi lên bị sai. Kiểm tra lại rồi thử lần nữa.",
  },
  401: {
    title: "Bạn chưa đăng nhập",
    description: "Đăng nhập để xem trang này.",
  },
  403: {
    title: "Bạn không có quyền truy cập",
    description: "Liên hệ chủ sở hữu nếu bạn cần xem trang này.",
  },
  404: {
    title: "Không tìm thấy trang",
    description: "Đường dẫn sai hoặc trang đã bị xóa.",
  },
  500: {
    title: "Có lỗi ở phía máy chủ",
    description: "Không phải lỗi của bạn. Hãy thử lại sau ít phút.",
  },
  503: {
    title: "Dịch vụ đang bận",
    description: "Hệ thống đang bảo trì hoặc quá tải. Thử lại sau nhé.",
  },
};

export type ErrorPageProps = {
  status: ErrorPageStatus;
  title?: string;
  description?: string;
  /** Nut goi hanh dong, vi du "Ve trang chinh" hoac "Thu lai". */
  action?: ReactNode;
  fill?: "viewport" | "parent";
  className?: string;
};

export function ErrorPage({
  status,
  title,
  description,
  action,
  fill = "viewport",
  className,
}: ErrorPageProps) {
  const message = MESSAGES[status];
  return (
    <div
      role="alert"
      className={cn(
        "flex items-center justify-center bg-bg px-6 text-center",
        fill === "viewport" ? "min-h-dvh" : "h-full py-10",
        className,
      )}
    >
      <div className="flex max-w-sm flex-col items-center gap-3">
        <p className="text-6xl font-bold tabular-nums text-primary">{status}</p>
        <h1 className="text-lg font-semibold text-fg">
          {title ?? message.title}
        </h1>
        <p className="text-sm text-fg-muted">
          {description ?? message.description}
        </p>
        {action && <div className="mt-2">{action}</div>}
      </div>
    </div>
  );
}
