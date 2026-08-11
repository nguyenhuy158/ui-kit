# ui-kit

Bộ component React chuẩn dùng cho mọi project cá nhân: Tailwind v4, không phụ thuộc thư viện UI nào.
Cách dùng là **copy file sang project khác** (kiểu shadcn), không cài qua npm — mỗi project sửa thoải mái mà không sợ vỡ project khác.

```bash
pnpm install
pnpm dev      # http://127.0.0.1:5173 — trang gallery xem toàn bộ component
```

## Có gì

| File | Component |
|---|---|
| `Button.tsx` | `Button` (primary / secondary / outline / ghost / danger, size sm-md-lg-icon, loading, block) |
| `Input.tsx` | `Input` (leading/trailing icon), `Textarea`, `Select` |
| `Field.tsx` | `Field` — label + hint + lỗi, tự nối `id` / `aria-describedby` |
| `Checkbox.tsx` | `Checkbox` (có trạng thái indeterminate) |
| `Radio.tsx` | `Radio`, `RadioGroup` |
| `Switch.tsx` | `Switch` |
| `Badge.tsx` | `Badge` (5 tone, có chấm trạng thái) |
| `Card.tsx` | `Card`, `CardHeader`, `Metric` |
| `Alert.tsx` | `Alert` — thông báo nằm tại chỗ (khác Toast là thoáng qua) |
| `Progress.tsx` | `Progress` |
| `Table.tsx` | `Table` — cuộn ngang, ẩn cột trên mobile, cột số canh phải |
| `Pagination.tsx` | `Pagination` — tự rút gọn bằng dấu `…` |
| `Accordion.tsx` | `Accordion` — mở nhiều hoặc chỉ một mục |
| `Tooltip.tsx` | `Tooltip` |
| `Avatar.tsx` | `Avatar` — chữ cái đầu, màu suy ra từ tên |
| `states.tsx` | `Skeleton`, `SkeletonListRow`, `EmptyState`, `LoadingState` |
| `Modal.tsx` | `Modal`, `ConfirmDialog` |
| `Sheet.tsx` | `Sheet` — ngăn trượt từ dưới / trái / phải |
| `Toast.tsx` | `ToastProvider`, `useToast` |
| `HeaderBar.tsx` | `HeaderBar` — thanh tiêu đề dính, an toàn với notch |
| `BottomNav.tsx` | `BottomNav`, `Fab` |
| `Tabs.tsx` | `Tabs` (line / pill) |
| `Menu.tsx` | `Menu` — menu thả xuống |
| `theme.tsx` | `ThemeProvider`, `ThemeToggle`, `useTheme` — sáng / tối / theo hệ thống |
| `Spinner.tsx` | `Spinner` |
| `cn.ts` | ghép class |
| `use-overlay.ts` | Esc để đóng + khoá cuộn + giam focus, dùng chung cho Modal/Sheet |

## Copy sang project khác

1. Copy `src/styles/tokens.css`, import nó thay cho `@import "tailwindcss"` trong file CSS gốc.
2. Copy `src/ui/cn.ts` và những file component thực sự cần. Mỗi component chỉ phụ thuộc `cn.ts` + biến màu trong `tokens.css` (riêng `Modal`/`Sheet` cần thêm `use-overlay.ts`).
3. Bọc app bằng `ThemeProvider` và `ToastProvider` nếu dùng theme / toast.

Không copy `src/ui/index.ts` trừ khi lấy gần hết — nó import mọi thứ, để lại sẽ kéo cả bộ vào bundle.

Yêu cầu: React 19, Tailwind v4, `lucide-react` (chỉ demo dùng; component tự vẽ SVG, không bắt buộc).

## Đổi màu theo project

Sửa 3 dòng đầu trong `tokens.css`, không đụng vào component:

```css
:root {
  --ui-primary: oklch(53% 0.23 300);       /* tím */
  --ui-primary-hover: oklch(47% 0.23 300);
  --ui-primary-fg: oklch(100% 0 0);        /* chữ nằm trên nền primary */
}
```

Component chỉ xài class ngữ nghĩa (`bg-primary`, `text-fg-muted`, `border-border`, `rounded-ui`),
không hardcode `violet-600` hay `stone-200`, nên đổi biến là đổi cả app. Bo góc chỉnh ở `--ui-radius`.

## Vài quy ước cố ý

- **Chữ trong input là 16px trên mobile.** Dưới 16px thì iOS Safari tự phóng to trang khi focus. Chỉ hạ xuống 14px ở `sm:pointer-fine:` (màn rộng *và* có chuột thật) — iPad rộng hơn 640px nhưng vẫn bị zoom.
- **Vùng chạm tối thiểu 44px** trên mobile, thu lại từ `sm:` trở lên.
- **`safe-top` / `safe-bottom`** cho notch và thanh home của iPhone.
- **Bảng dữ liệu dùng class `.tabular`** để số thẳng cột.
- **Biến thể `peer-*` không áp cho con cháu**, chỉ áp cho anh em của input. Nên Checkbox/Radio đổi màu ô ngoài và để dấu tick ăn theo `currentColor`, thay vì đặt `peer-checked` thẳng lên dấu tick.
- **Modal/Sheet giam focus và trả focus** về đúng nút đã mở nó khi đóng.
- **Toast dùng `aria-live="polite"`**, toast lỗi để lâu gấp đôi.
- **Accordion tháo hẳn phần đang đóng khỏi DOM**, không chỉ ẩn — tránh Tab lạc vào chỗ không nhìn thấy.
- **Tooltip chỉ dùng cho chú thích thêm.** Thiết bị cảm ứng không có "rê chuột", việc gì quan trọng thì viết thẳng ra màn hình.
