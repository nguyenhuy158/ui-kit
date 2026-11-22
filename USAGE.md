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
Riêng `Modal.tsx`, `Sheet.tsx`, `CommandPalette.tsx` cần thêm `use-overlay.ts`; `Menu.tsx`, `Popover.tsx`, `DatePicker.tsx` cần thêm `use-dismiss.ts`.
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

## Lưới và khoảng cách

4 cột trên mobile, 12 cột từ 768px. Lề trang, khoảng cách cột và khung tối đa lấy từ token trong `tokens.css`.

```tsx
import { Col, Container, Grid } from "./ui/Grid";

<Container>
  <Grid>
    <Col mobile={4} desktop={8}>Nội dung chính</Col>
    <Col mobile={4} desktop={4}>Cột phụ</Col>
    <Col mobile={2} desktop={3}>Nửa hàng trên mobile, 3/12 trên desktop</Col>
  </Grid>
</Container>
```

- `mobile` từ 1 đến 4 (mặc định 4 = cả hàng). `desktop` từ 1 đến 12; bỏ trống thì bằng `mobile × 3`.
- Không dùng component: gắn class `ui-container`, `ui-grid`, `ui-col` và đặt `--ui-col-mobile` / `--ui-col-desktop` bằng `style`.
- Khoảng cách trong khối chỉ dùng bậc Tailwind 1, 2, 3, 4, 6, 8, 12, 16 (4px mỗi bậc). Giữa các khối lớn dùng `--ui-space-section`.

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

Bàn phím điện thoại theo `type`: `email`, `tel`, `url`, `search`, `number`, `password` tự thêm `inputMode`, `autoComplete`, tắt viết hoa/sửa chính tả khi cần. Truyền prop riêng sẽ ghi đè. Số nguyên (tiền, số lượng, OTP) dùng `inputMode="numeric"` với `type` mặc định, không dùng `type="number"` (lăn chuột đổi giá trị, có nút tăng giảm). `usePrompt({ type: "email" })` cũng nhận `type`.

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

<Field label="Mã OTP">
  <Input inputMode="numeric" autoComplete="one-time-code" maxLength={6} />
</Field>

<Field label="Ghi chú">
  <Textarea rows={4} placeholder="Không bắt buộc" />
</Field>

<Field label="Mã trên máy" hint="Gõ hay dán ABCD-2345, abcd2345 đều được">
  <CodeInput value={code} onChange={setCode} />
</Field>

<Field label="Loại">
  <Select value={type} onChange={(e) => setType(e.target.value)}>
    <option value="an">Ăn uống</option>
    <option value="di">Đi lại</option>
  </Select>
</Field>
```

Truyền `error` là ô tự chuyển viền đỏ và đọc lỗi cho screen reader. Không cần tự set `invalid`.

`CodeInput` (chỉ cần `cn.ts`) nhận `value` là các ký tự **không có dấu gạch** (`"ABCD2345"`), `length` (mặc định 8), `groupSize` (mặc định 4, chèn dấu gạch giữa các nhóm) và `allowed` (regex một ký tự, mặc định chữ và số; chữ thường được viết hoa trước khi lọc). Dán `abcd-2345` hay `ABCD2345` đều ra cùng một giá trị. Dùng trong `Field` như `Input`; muốn bàn phím số thì thêm `inputMode="numeric"` và `allowed={/[0-9]/}`.

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
```

Trang lỗi: truyền `status`, chữ tiếng Việt tự điền, đổi được bằng `title` và `description`. `fill="parent"` khi đặt trong khung nhỏ.

```tsx
<ErrorPage status={404} action={<Button onClick={goHome}>Về trang chính</Button>} />
```

Cả trang hoặc route đang tải (fallback của `Suspense`, lần vào đầu tiên) thì dùng `PageLoading`, nó chiếm cả màn hình:

```tsx
<Suspense fallback={<PageLoading />}>{children}</Suspense>
```

```tsx
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

### Một màn hình, không cuộn: Screen + PagedList

Cài `@formkit/auto-animate` khi copy `PagedList.tsx`. Các dòng tự chuyển động
khi thêm, xoá, đổi thứ tự hoặc chuyển trang; tôn trọng `prefers-reduced-motion`.

```tsx
<Screen
  header={<HeaderBar sticky={false} title="Ăn tối quận 1" />}
  footer={<BottomNav inline active={tab} onChange={setTab} items={items} />}
>
  <div className="h-full px-3 pt-3">
    <PagedList
      items={expenses}
      rowHeight={56}
      getKey={(expense) => expense.id}
      renderItem={(expense) => <ExpenseRow expense={expense} />}
    />
  </div>
</Screen>
```

- `Screen` cao đúng `100dvh`, `overflow-hidden`; vùng giữa tự co. Đặt trong khung khác (ô nhúng, demo) thì dùng `fill="parent"`.
- `BottomNav` mặc định là `fixed`; trong `Screen` thêm `inline` để nó nằm trong luồng, không đè nội dung (nên không cần `pb-28`).
- `PagedList` tự đo chiều cao còn lại và tính mỗi trang chứa mấy dòng, đổi kích thước thì tính lại. Luôn chừa sẵn 48px cho thanh phân trang nên số dòng không bị tính vòng.
- Mọi dòng cao đúng `rowHeight`; nội dung dài hơn bị cắt, hãy dùng `truncate`.
- Cha của `PagedList` phải có chiều cao xác định (`h-full` trong `Screen`).
- Chưa đo được chiều cao (môi trường test, phần tử đang ẩn) thì `PagedList` hiện đủ mọi dòng thay vì chỉ một dòng.

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

```tsx
<Popover trigger={(props) => <Button variant="outline" {...props}>Bộ lọc</Button>}>
  {(close) => <FilterForm onDone={close} />}
</Popover>
```

`Popover` giống `Menu` nhưng chứa nội dung bất kỳ. `align="right"`, `side="top"` đổi hướng mở.

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

### useConfirm và usePrompt (thay `confirm()` / `prompt()` gốc)

Không dùng `alert()`, `confirm()`, `prompt()` của trình duyệt. Bọc app một lần bằng `ConfirmProvider` (trong `ToastProvider`), rồi gọi bằng `await` ở bất kỳ đâu:

```tsx
import { ConfirmProvider, useConfirm, usePrompt } from "./ui/ConfirmProvider";

<ToastProvider>
  <ConfirmProvider>
    <App />
  </ConfirmProvider>
</ToastProvider>

const confirm = useConfirm();
const prompt = usePrompt();
const toast = useToast();

async function remove() {
  // Thay: if (!window.confirm("Xoá?")) return;
  if (!(await confirm({ title: "Xoá khoản chi?", description: "Không hoàn tác được.", confirmLabel: "Xoá", destructive: true }))) return;
  await api.remove();
  toast.success("Đã xoá"); // Thay alert()
}

async function rename() {
  // Thay: const name = window.prompt("Tên mới", old);
  const name = await prompt({ title: "Đổi tên", defaultValue: old });
  if (name === null) return; // huỷ, giống window.prompt
  await api.rename(name);
}
```

`confirm` trả `true`/`false`, `prompt` trả chuỗi hoặc `null`. Esc và bấm ra ngoài là huỷ. Mỗi lúc chỉ có một hộp thoại: gọi hộp mới thì hộp cũ coi như bị huỷ. Focus ban đầu ở nút Huỷ (xác nhận bằng Enter chỉ có ở `usePrompt`), để thao tác xoá không dính Enter nhầm.

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

### useCachedFetch (tải dữ liệu có cache)

Cần `use-cached-fetch.ts`. Mọi component dùng cùng `key` chia một lần gọi API; dữ liệu còn mới (`staleMs`, mặc định 60 giây) thì không gọi lại, quay lại tab khi dữ liệu đã cũ mới tải lại ngầm. Không đặt `setInterval` để poll.

```tsx
const { data, error, loading, refresh } = useCachedFetch("/api/tasks", () =>
  fetch("/api/tasks").then((r) => r.json()),
);

async function save(task: Task) {
  await fetch("/api/tasks", { method: "POST", body: JSON.stringify(task) });
  invalidateCached("/api/tasks");
}
```

Phía server dùng `@huyab/cache` (kit) để một lượt tải lại cũng không đụng DB mỗi lần.

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

### Custom select, date range và textarea tự giãn

Xem [hướng dẫn form controls](docs/form-controls.md) cho `Listbox`, `DateRangePicker` và `<Textarea autoSize>`. Demo chạy tại `/picker-demo.html`.
