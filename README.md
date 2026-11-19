# ui-kit

Bộ component React chuẩn dùng cho mọi project cá nhân: Tailwind v4, không phụ thuộc thư viện UI nào.
Cách dùng là **copy file sang project khác** (kiểu shadcn), không cài qua npm — mỗi project sửa thoải mái mà không sợ vỡ project khác.
Checklist cho app và app nào đã làm đủ: [docs/ADOPTION.md](docs/ADOPTION.md).

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
| `Combobox.tsx` | `Combobox` — chọn có tìm kiếm, gõ không dấu vẫn ra |
| `DatePicker.tsx` | `DatePicker`, `DateRangePicker`, `formatDate` — chọn một ngày hoặc khoảng ngày |
| `FileUpload.tsx` | `FileUpload`, `formatBytes` — kéo thả, giới hạn dung lượng và số tệp |
| `Stepper.tsx` | `Stepper` — ngang hoặc dọc |
| `CommandPalette.tsx` | `CommandPalette`, `useCommandPalette` — Ctrl/Cmd + K |
| `Checkbox.tsx` | `Checkbox` (có trạng thái indeterminate) |
| `Radio.tsx` | `Radio`, `RadioGroup` |
| `Switch.tsx` | `Switch` |
| `Badge.tsx` | `Badge` (5 tone, có chấm trạng thái) |
| `Grid.tsx` | `Container`, `Grid`, `Col` — lưới 4 cột trên mobile, 12 cột từ 768px (class `ui-container`, `ui-grid`, `ui-col` trong `tokens.css`) |
| `Card.tsx` | `Card`, `CardHeader`, `Metric` |
| `Alert.tsx` | `Alert` — thông báo nằm tại chỗ (khác Toast là thoáng qua) |
| `Progress.tsx` | `Progress` |
| `Table.tsx` | `Table` — cuộn ngang, ẩn cột trên mobile, cột số canh phải |
| `Pagination.tsx` | `Pagination` — tự rút gọn bằng dấu `…` |
| `Accordion.tsx` | `Accordion` — mở nhiều hoặc chỉ một mục |
| `Tooltip.tsx` | `Tooltip` |
| `Avatar.tsx` | `Avatar` — chữ cái đầu, màu suy ra từ tên |
| `states.tsx` | `Skeleton`, `SkeletonListRow`, `EmptyState`, `LoadingState` |
| `use-cached-fetch.ts` | `useCachedFetch`, `invalidateCached` — tải dữ liệu có cache dùng chung theo key, gộp request trùng, chỉ tải lại khi dữ liệu cũ (quay lại tab hoặc sau khi ghi), không poll |
| `Modal.tsx` | `Modal`, `ConfirmDialog` |
| `ConfirmProvider.tsx` | `ConfirmProvider`, `useConfirm`, `usePrompt` (thay `confirm()`/`prompt()` gốc, gọi bằng `await`; cần `Modal`, `Button`, `Input`, `Field`) |
| `Sheet.tsx` | `Sheet` — ngăn trượt từ dưới / trái / phải (keyframe `ui-slide-up`, `ui-slide-in-left`, `ui-slide-in-right` trong `tokens.css`) |
| `Toast.tsx` | `ToastProvider`, `useToast` |
| `HeaderBar.tsx` | `HeaderBar` — thanh tiêu đề dính, an toàn với notch |
| `BottomNav.tsx` | `BottomNav` (`inline` để đặt trong `Screen`), `Fab` |
| `Screen.tsx` | `Screen` — khung vừa viewport: header và thanh dưới cố định, vùng giữa tự co, không cuộn |
| `PagedList.tsx` | `PagedList` — danh sách chia trang theo chiều cao còn lại, mỗi dòng cao cố định, thanh phân trang gọn `‹ 1/7 ›` |
| `Tabs.tsx` | `Tabs` (line / pill) |
| `Menu.tsx` | `Menu` — menu thả xuống |
| `Popover.tsx` | `Popover` — bong bóng chứa nội dung tuỳ ý (cần `use-dismiss.ts`) |
| `theme.tsx` | `ThemeProvider`, `ThemeToggle`, `useTheme` — sáng / tối / theo hệ thống |
| `locale.ts` | `applyLocale` (gọi một lần lúc khởi động, đặt `<html lang>` theo trình duyệt: vi/en, mặc định vi), `detectTimeZone`, `formatDateTime`, `formatNumber`, `formatMoney`. `Table` và `DatePicker` đọc `<html lang>` nên tự theo |
| `Spinner.tsx` | `Spinner` |
| `Lightbox.tsx` | `Lightbox`, `LightboxButton` — xem ảnh toàn màn hình, ← → / vuốt, khe `actions` + `footer` (cần `use-overlay.ts`) |
| `SwipeAction.tsx` | `SwipeAction` — vuốt trái lộ một nút hành động (chỉ cảm ứng) |
| `Celebrate.tsx` | `Celebrate` — pháo giấy + pop quanh nội dung khi thành công (keyframe `ui-celebrate`, `ui-pop` trong `tokens.css`) |
| `cn.ts` | ghép class |
| `use-overlay.ts` | Esc để đóng + khoá cuộn + giam focus, dùng chung cho Modal/Sheet |
| `use-dismiss.ts` | Bấm ra ngoài / Esc để đóng popover, dùng chung cho Menu/Popover/DatePicker |

## Copy sang project khác

1. Copy `src/styles/tokens.css`, import nó thay cho `@import "tailwindcss"` trong file CSS gốc.
2. Copy `src/ui/cn.ts` và những file component thực sự cần. Mỗi component chỉ phụ thuộc `cn.ts` + biến màu trong `tokens.css` (riêng `Modal`/`Sheet` cần thêm `use-overlay.ts`, `Menu`/`Popover`/`DatePicker` cần thêm `use-dismiss.ts`).
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

Lưới và khoảng cách: 4 cột trên mobile, 12 cột từ 768px (`md`). Lề trang `--ui-grid-margin` (16px / 32px), khoảng cách cột `--ui-grid-gutter` (16px / 24px), khung tối đa `--ui-container-max` (80rem), khoảng cách giữa các khối lớn `--ui-space-section`. Khoảng cách trong khối chỉ dùng bậc 4px của Tailwind: 1, 2, 3, 4, 6, 8, 12, 16.

Phong cách theo Fluent: chuyển động vào chậm dần / ra nhanh dần (`--ui-ease-out`, `--ui-ease-in`,
`--ui-dur-*`), đổ bóng hai lớp (`shadow-sm` … `shadow-xl`), và hai lớp vật liệu: `.ui-acrylic`
(nền mờ cho thanh, menu nổi) và `.ui-mica` (nền trang nhuốm màu thương hiệu). `Sheet` vuốt về mép
màn hình để đóng; `Modal`/`Sheet`/`Toast`/`Menu`... có animation đóng nhờ `use-presence.ts`.

## Vài quy ước cố ý

- **Một màn hình, không cuộn.** Mọi màn hình phải vừa viewport, cả điện thoại lẫn desktop: trang và khung bên trong đều không cuộn. Dùng `Screen` làm khung trang; danh sách có thể dài thì dùng `PagedList` (chia trang), không để cuộn. Chỉ có hai ngoại lệ: trang chỉ để đọc (hướng dẫn, điều khoản) và bên trong `Sheet`/`Modal` chứa form. Mỗi dòng của `PagedList` phải có chiều cao cố định (`rowHeight`) để số dòng mỗi trang tính đúng; nội dung dài hơn thì cắt bằng `truncate`.
- **Chữ trong input là 16px trên mobile.** Dưới 16px thì iOS Safari tự phóng to trang khi focus. Chỉ hạ xuống 14px ở `sm:pointer-fine:` (màn rộng *và* có chuột thật) — iPad rộng hơn 640px nhưng vẫn bị zoom.
- **Vùng chạm tối thiểu 44px** trên mobile, thu lại từ `sm:` trở lên.
- **`safe-top` / `safe-bottom`** cho notch và thanh home của iPhone.
- **Bảng dữ liệu dùng class `.tabular`** để số thẳng cột.
- **Biến thể `peer-*` không áp cho con cháu**, chỉ áp cho anh em của input. Nên Checkbox/Radio đổi màu ô ngoài và để dấu tick ăn theo `currentColor`, thay vì đặt `peer-checked` thẳng lên dấu tick.
- **Không dùng `alert()`, `confirm()`, `prompt()` gốc của trình duyệt** (kể cả `window.confirm`): chúng không theo theme và trông như lỗi trình duyệt. Dùng `useConfirm()` (có/không), `usePrompt()` (nhập chữ) và Toast (thông báo). `@huyab/config` bắt lỗi này bằng Biome.
- **Modal/Sheet giam focus và trả focus** về đúng nút đã mở nó khi đóng.
- **Toast dùng `aria-live="polite"`**, toast lỗi để lâu gấp đôi.
- **Accordion tháo hẳn phần đang đóng khỏi DOM**, không chỉ ẩn — tránh Tab lạc vào chỗ không nhìn thấy.
- **Ngày luôn là chuỗi `"YYYY-MM-DD"`, không dùng `Date` làm giá trị.** `new Date("2026-01-01")` là 00:00 UTC — ở múi giờ âm sẽ đọc ra 31/12. Với ngày-tháng-năm thuần thì chuỗi mới là kiểu dữ liệu đúng, và so sánh `<` `>` giữa hai chuỗi cũng ra đúng thứ tự thời gian.
- **Combobox / CommandPalette bỏ dấu khi tìm** (NFD rồi xoá `U+0300–U+036F`, `đ` → `d`), gõ "da nang" vẫn ra "Đà Nẵng".
- **Combobox chọn bằng `pointerdown`, không phải `click`.** Click xảy ra sau `blur` của ô nhập, lúc đó danh sách đã đóng nên không bắt được lựa chọn.
- **Stepper chỉ cho bấm quay lại bước đã xong**, nhảy tới bước chưa làm thường bỏ qua bước kiểm tra dữ liệu ở giữa.
- **Tooltip chỉ dùng cho chú thích thêm.** Thiết bị cảm ứng không có "rê chuột", việc gì quan trọng thì viết thẳng ra màn hình.

Static JavaScript apps: [DOM buttons, loading, toast and action gate](docs/dom-feedback.md).

[Custom select, date range và textarea tự giãn](docs/form-controls.md) · demo `/picker-demo.html`.

[Dùng token không cần copy hay build (trang tĩnh)](docs/hosted.md).
