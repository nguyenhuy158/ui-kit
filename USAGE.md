# Hướng dẫn dùng nhanh

Ví dụ ngắn cho từng component. Xem toàn bộ chạy thật: `pnpm dev`.

- [Cài vào project mới](#cài-vào-project-mới)
- [Nút và form](#nút-và-form)
- [Chọn nâng cao](#chọn-nâng-cao)
- [Hiển thị dữ liệu](#hiển-thị-dữ-liệu)
- [Điều hướng](#điều-hướng)
- [Lớp phủ và thông báo](#lớp-phủ-và-thông-báo)
- [Giao diện sáng tối](#giao-diện-sáng-tối)
- [Bẫy hay gặp](#bẫy-hay-gặp)

## Cài vào project mới

**1. Chép file.** Từ repo này sang project của bạn:

```bash
UIKIT=~/personal-projects/ui-kit
mkdir -p src/ui src/styles
cp $UIKIT/src/styles/tokens.css src/styles/
cp $UIKIT/src/ui/{cn.ts,Button.tsx,Input.tsx,Field.tsx} src/ui/
```

Chỉ chép cái nào cần. Mỗi component chỉ phụ thuộc `cn.ts` và biến màu trong `tokens.css`.
Riêng `Modal.tsx`, `Sheet.tsx`, `CommandPalette.tsx` cần thêm `use-overlay.ts`.
Đừng chép `index.ts` trừ khi lấy gần hết — nó import mọi thứ nên sẽ kéo cả bộ vào bundle.

**2. Đổi file CSS gốc.** Thay `@import "tailwindcss"` bằng:

```css
@import "./styles/tokens.css";
```

**3. Bọc app** nếu dùng theme hoặc toast:

```tsx
import { ThemeProvider } from "./ui/theme";
import { ToastProvider } from "./ui/Toast";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider>
    <ToastProvider>
      <App />
    </ToastProvider>
  </ThemeProvider>,
);
```

**4. Đổi màu cho hợp project.** Sửa trong `tokens.css`, không đụng component:

```css
:root {
  --ui-primary: oklch(60% 0.16 250);       /* xanh dương */
  --ui-primary-hover: oklch(54% 0.16 250);
  --ui-primary-fg: oklch(100% 0 0);
  --ui-radius: 0.5rem;                     /* bo góc ít hơn */
}
```

Nhớ sửa cả khối `.dark { ... }` bên dưới cho chế độ tối.

## Nút và form

```tsx
import { Button } from "./ui/Button";
import { Field } from "./ui/Field";
import { Input, Textarea, Select } from "./ui/Input";
import { Checkbox } from "./ui/Checkbox";
import { RadioGroup } from "./ui/Radio";
import { Switch } from "./ui/Switch";
```

### Button

```tsx
<Button onClick={save}>Lưu</Button>
<Button variant="outline" size="sm">Huỷ</Button>
<Button variant="danger" onClick={remove}>Xoá</Button>
<Button loading={saving}>Đang lưu</Button>
<Button block leftIcon={<Plus size={18} />}>Thêm khoản chi</Button>
<Button size="icon" variant="ghost" aria-label="Tìm"><Search size={18} /></Button>
```

`variant`: `primary` (mặc định) · `secondary` · `outline` · `ghost` · `danger`
`size`: `sm` · `md` · `lg` · `icon`
`loading` tự khoá nút và hiện spinner. `block` cho nút chiếm trọn chiều ngang — hay dùng cho nút chính trên mobile.

### Field + Input

`Field` tự sinh `id`, nối `label` với ô nhập và nối lỗi vào `aria-describedby`. Đừng tự đặt `id` trừ khi cần.

```tsx
<Field label="Tên nhóm" hint="Người khác sẽ thấy tên này" required>
  <Input value={name} onChange={(e) => setName(e.target.value)} />
</Field>

<Field label="Email" error={emailError}>
  <Input type="email" leading={<Mail size={16} />} />
</Field>

<Field label="Số tiền">
  <Input inputMode="numeric" trailing="₫" className="tabular" />
</Field>

<Field label="Ghi chú">
  <Textarea rows={4} placeholder="Không bắt buộc" />
</Field>

<Field label="Loại">
  <Select value={type} onChange={(e) => setType(e.target.value)}>
    <option value="an">Ăn uống</option>
    <option value="di">Đi lại</option>
  </Select>
</Field>
```

Truyền `error` là ô tự chuyển viền đỏ và đọc lỗi cho screen reader. Không cần tự set `invalid`.

Icon trong ô tên là `leading` / `trailing`, **không phải** `prefix` / `suffix` — hai cái sau là thuộc tính HTML thật, đè lên sẽ sai kiểu.

### Checkbox, Radio, Switch

```tsx
<Checkbox
  checked={agree}
  onChange={(e) => setAgree(e.target.checked)}
  label="Đồng ý điều khoản"
  description="Có thể đổi lại sau"
/>

{/* Ô "chọn tất cả" khi mới chọn một phần */}
<Checkbox checked={all} indeterminate={some && !all} onChange={toggleAll} label="Chọn tất cả" />

<RadioGroup
  label="Cách chia"
  name="split"
  value={split}
  onChange={setSplit}
  options={[
    { value: "even", label: "Chia đều" },
    { value: "manual", label: "Nhập tay", description: "Từng người một số khác nhau" },
  ]}
/>

<Switch checked={notify} onChange={setNotify} label="Nhận thông báo" />
```

`Checkbox` / `Radio` là input thật (ẩn bằng `sr-only`) nên vẫn submit theo form.
`Switch` là `<button role="switch">` — dùng cho hành động có hiệu lực ngay, không phải trường dữ liệu chờ submit.

## Chọn nâng cao

### Combobox — chọn có tìm kiếm

Dùng khi danh sách dài quá cho `<Select>`, khoảng từ 10 mục trở lên. Ngắn hơn thì `<Select>` vẫn tốt hơn vì trên mobile nó mở picker của hệ điều hành.

```tsx
<Field label="Thành phố">
  <Combobox
    value={city}
    onChange={setCity}
    options={[
      { value: "hcm", label: "TP. Hồ Chí Minh", description: "Miền Nam" },
      { value: "dn", label: "Đà Nẵng", description: "Miền Trung" },
    ]}
  />
</Field>
```

Gõ không dấu vẫn tìm ra: `"da nang"` → `Đà Nẵng`. Lên/xuống để chọn, Enter để xác nhận, Esc để đóng.

### DatePicker

```tsx
const [date, setDate] = useState("");            // "2026-08-11"

<Field label="Ngày đi">
  <DatePicker value={date} onChange={setDate} min="2026-08-11" />
</Field>

formatDate(date)   // "11/08/2026"
```

Giá trị là **chuỗi `"YYYY-MM-DD"`**, không phải `Date`. Gửi thẳng lên API được, so sánh `date >= min` cũng ra đúng thứ tự thời gian. Lý do ở [Bẫy hay gặp](#bẫy-hay-gặp).

### FileUpload

```tsx
const [files, setFiles] = useState<File[]>([]);

<FileUpload
  files={files}
  onChange={setFiles}
  accept="image/*,.pdf"
  maxSize={2 * 1024 * 1024}   // 2 MB mỗi tệp
  maxFiles={5}
/>
```

Tệp quá cỡ bị loại sẵn và hiện dòng báo đã bỏ bao nhiêu tệp. Component chỉ giữ danh sách `File` — việc upload lên server bạn tự làm:

```tsx
const form = new FormData();
files.forEach((file) => form.append("files", file));
await fetch("/api/upload", { method: "POST", body: form });
```

## Hiển thị dữ liệu

### Card, Metric, Badge, Avatar

```tsx
<Card>
  <CardHeader
    title="Ăn tối quận 1"
    description="3 người · 11/08/2026"
    action={<Button size="sm" variant="ghost">Sửa</Button>}
  />
  <p className="mt-3 text-sm text-fg-muted">Nội dung...</p>
</Card>

<div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
  <Metric label="Tổng thu" value="12.400.000 ₫" />
  <Metric label="Đã chi" value="8.150.000 ₫" />
</div>

<Badge tone="success" dot>Đang chạy</Badge>
<Badge tone="danger">Lỗi</Badge>

<Avatar name="Nguyễn Văn A" />          {/* chữ đầu, màu suy từ tên */}
<Avatar name="Trần Bích" src={url} size="lg" />
```

`Avatar` không có ảnh thì lấy 2 chữ cái đầu, màu nền suy ra từ tên — cùng một người luôn ra cùng màu ở mọi máy, không cần lưu gì trong DB.

### Table

```tsx
<Table
  rows={games}
  rowKey={(row) => row.id}
  onRowClick={(row) => navigate(`/game/${row.id}`)}
  empty={<EmptyState title="Chưa có cuộc chia nào" />}
  columns={[
    { key: "name", header: "Cuộc chia", cell: (row) => row.name },
    {
      key: "status",
      header: "Trạng thái",
      hideOnMobile: true,
      cell: (row) => <Badge tone="primary">{row.status}</Badge>,
    },
    {
      key: "amount",
      header: "Số tiền",
      numeric: true,                    // canh phải + số thẳng cột
      cell: (row) => money.format(row.amount),
    },
  ]}
/>
```

Bảng cuộn ngang khi hẹp. Nhiều cột quá thì đánh dấu `hideOnMobile` cho cột phụ, hoặc đổi hẳn sang danh sách card ở breakpoint nhỏ.

### Pagination, Progress, Alert

```tsx
<Pagination page={page} pageCount={12} onChange={setPage} />

<Progress value={92} label="Dung lượng" showValue tone="warning" />

<Alert tone="warning" title="Sắp hết dung lượng" icon={<AlertTriangle size={18} />}
       action={<Button size="sm" variant="outline">Nâng cấp</Button>}>
  Đã dùng 4,6 GB trên 5 GB.
</Alert>
```

`Alert` là thông báo nằm tại chỗ, `Toast` là thông báo thoáng qua. Lỗi của cả form thì dùng `Alert`, lưu thành công thì dùng `Toast`.

### Trạng thái rỗng và đang tải

```tsx
if (isLoading) return <LoadingState />;
if (rows.length === 0) {
  return (
    <EmptyState
      title="Chưa có gì ở đây"
      description="Tạo cuộc chia đầu tiên để bắt đầu."
      icon={<Inbox size={28} />}
      action={<Button size="sm" onClick={create}>Tạo mới</Button>}
    />
  );
}
```

Khung xám khi chờ dữ liệu:

```tsx
<Card padded={false} className="divide-y divide-border px-4">
  {Array.from({ length: 3 }, (_, i) => <SkeletonListRow key={i} avatar />)}
</Card>
```

## Điều hướng

### HeaderBar + BottomNav + Fab

```tsx
const [tab, setTab] = useState<"people" | "expenses" | "more">("people");

<HeaderBar
  title="Ăn tối quận 1"
  subtitle="3 người"
  leading={<Button size="icon" variant="ghost" onClick={back}><ChevronLeft size={20} /></Button>}
  actions={<ThemeToggle />}
/>

<main className="pb-28">{/* chừa chỗ cho bottom nav */}</main>

<Fab onClick={addExpense} label="Thêm khoản chi" icon={<Plus size={24} />} />

<BottomNav
  active={tab}
  onChange={setTab}
  items={[
    { id: "people", label: "Người", icon: Users },
    { id: "expenses", label: "Chi", icon: Wallet, badge: 3 },
    { id: "more", label: "Khác", icon: LayoutGrid },
  ]}
/>
```

`icon` truyền **component**, không phải element: `icon: Users` chứ không phải `icon: <Users />`.

`BottomNav` mặc định ẩn từ `lg` trở lên (giả định desktop có sidebar riêng). App chỉ có một layout thì đặt `mobileOnly={false}`.

Nhớ chừa `padding-bottom` cho nội dung, nếu không bottom nav sẽ che mất phần cuối trang.

### Dùng với router thật

`BottomNav` đổi nội dung tại chỗ bằng state. Nếu muốn deep link và nút Back của trình duyệt chạy đúng, chép file rồi đổi `<button>` thành `<Link>` của router:

```tsx
<Link to="/game/$id/people" activeProps={{ className: "text-primary" }}>
```

Nhớ đổi `role="tablist"` thành `<nav>` và `aria-selected` thành `aria-current="page"` — hai bộ thuộc tính này ứng với hai ý nghĩa khác nhau.

### Tabs, Accordion, Menu

```tsx
<Tabs
  active={tab}
  onChange={setTab}
  items={[
    { id: "all", label: "Tất cả", count: 12 },
    { id: "open", label: "Đang mở", count: 4 },
  ]}
/>
<Tabs variant="pill" ... />   {/* nền bo tròn, hợp bộ lọc */}

<Accordion
  single                       {/* chỉ mở một mục một lúc */}
  defaultOpen={["a"]}
  items={[{ id: "a", title: "Chia tiền kiểu gì?", content: "Chia đều hoặc nhập tay." }]}
/>

<Menu
  trigger={(props) => (
    <Button variant="ghost" size="icon" {...props}><MoreHorizontal size={18} /></Button>
  )}
  items={[
    { label: "Sửa", icon: <Pencil size={16} />, onSelect: edit },
    { label: "Xoá", icon: <Trash2 size={16} />, destructive: true, onSelect: remove },
  ]}
/>
```

`Menu` truyền `trigger` là hàm — nó tiêm sẵn `onClick` và `aria-expanded` vào nút của bạn.

### Stepper

```tsx
<Stepper
  steps={[
    { id: "info", label: "Thông tin", description: "Tên, ngày" },
    { id: "people", label: "Thành viên" },
    { id: "done", label: "Hoàn tất" },
  ]}
  current={step}
  onStepClick={setStep}        {/* bỏ đi nếu chỉ để hiển thị */}
/>
<Stepper ... orientation="vertical" />
```

Chỉ bấm quay lại được bước đã xong, không nhảy tới bước chưa làm.

## Lớp phủ và thông báo

Cả ba lớp phủ đều: Esc để đóng, khoá cuộn trang nền, giam focus bên trong, trả focus về đúng nút đã mở khi đóng.

### Modal và ConfirmDialog

```tsx
<Modal
  open={open}
  onClose={() => setOpen(false)}
  title="Sửa khoản chi"
  description="Thay đổi lưu ngay khi bấm Lưu."
  footer={
    <>
      <Button variant="ghost" onClick={() => setOpen(false)}>Huỷ</Button>
      <Button loading={saving} onClick={save}>Lưu</Button>
    </>
  }
>
  <Field label="Số tiền"><Input inputMode="numeric" /></Field>
</Modal>

{/* Thay cho window.confirm */}
<ConfirmDialog
  open={confirm}
  onClose={() => setConfirm(false)}
  onConfirm={remove}
  title="Xoá khoản chi này?"
  description="Hành động này không hoàn tác được."
  confirmLabel="Xoá"
  destructive
  loading={removing}
/>
```

Trên mobile `Modal` tự dính đáy màn hình, từ `sm` trở lên mới ra giữa.

### Sheet

```tsx
<Sheet open={open} onClose={close} title="Tuỳ chọn">
  <Button variant="ghost" block className="justify-start">Chia sẻ</Button>
  <Button variant="ghost" block className="justify-start text-danger">Xoá</Button>
</Sheet>

<Sheet side="left" ... />    {/* menu ngăn kéo */}
```

Trên mobile `Sheet` dễ bấm hơn `Modal` vì gần ngón tay hơn.

### Toast

```tsx
const toast = useToast();

toast.success("Đã lưu");
toast.error("Lưu thất bại", { description: "Mất kết nối máy chủ" });
toast.info("Đang đồng bộ", { duration: 10_000 });
```

Toast lỗi tự để lâu gấp đôi. Bấm vào toast để tắt sớm.

### CommandPalette

```tsx
const [open, setOpen] = useCommandPalette();   // tự bắt Ctrl/Cmd + K

<CommandPalette
  open={open}
  onClose={() => setOpen(false)}
  commands={[
    { id: "new", label: "Tạo cuộc chia", group: "Hành động", shortcut: "N", onRun: create },
    { id: "home", label: "Về trang chủ", group: "Điều hướng", keywords: "trang chu", onRun: goHome },
  ]}
/>
```

Gõ không dấu vẫn ra. `keywords` để tìm được lệnh bằng từ không có trong tên.

## Giao diện sáng tối

```tsx
<ThemeToggle />                        {/* nút xoay vòng system → light → dark */}

const { mode, resolved, setMode } = useTheme();
// mode: "system" | "light" | "dark"  — người dùng đã chọn gì
// resolved: "light" | "dark"          — thực tế đang hiển thị gì
```

Lựa chọn lưu vào `localStorage`, chế độ `system` tự đổi theo cài đặt máy ngay cả khi app đang mở.

Muốn chặn nháy trắng lúc tải trang, thêm script này vào `<head>` của `index.html`:

```html
<script>
  const saved = localStorage.getItem("ui-theme");
  const dark = saved === "dark" ||
    ((!saved || saved === "system") && matchMedia("(prefers-color-scheme: dark)").matches);
  if (dark) document.documentElement.classList.add("dark");
</script>
```

## Bẫy hay gặp

**Đừng đặt chữ nhỏ hơn 16px cho ô nhập trên mobile.** iOS Safari tự phóng to trang khi focus vào ô có chữ dưới 16px. Cần chữ nhỏ thì dùng `sm:pointer-fine:text-sm` (màn rộng *và* có chuột thật) như các component ở đây, đừng dùng `text-sm` trần.

**Ngày dùng chuỗi, đừng dùng `Date`.** `new Date("2026-01-01")` là 00:00 UTC — ở múi giờ âm đọc ra thành 31/12. Với ngày-tháng-năm thuần thì chuỗi `"YYYY-MM-DD"` mới đúng, và so sánh `<` `>` giữa hai chuỗi cũng ra đúng thứ tự thời gian.

**`peer-*` của Tailwind không áp cho con cháu.** Nó sinh ra `.peer:checked ~ .peer-checked\:x` — chỉ khớp *anh em* của input. Nên `Checkbox`/`Radio` đổi màu ô ngoài rồi để dấu tick ăn theo `currentColor`. Sửa lại theo cách khác là hỏng ngay.

**Đừng hardcode màu Tailwind trong component.** Dùng `bg-primary` `text-fg-muted` `border-border` `rounded-ui`, không dùng `bg-violet-600` `text-stone-500`. Hardcode là mất khả năng đổi màu theo project và hỏng chế độ tối.

**Bảng đầy trên mobile thì đổi sang card.** `Table` cuộn ngang được nhưng cuộn ngang vốn khó dùng. Quá 3 cột thì cân nhắc render danh sách `Card` ở màn nhỏ.

**Nội dung bị bottom nav che.** Thêm `pb-28` (hoặc hơn) cho phần nội dung khi có `BottomNav`.
