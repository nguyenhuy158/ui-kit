import { useState } from "react";
import {
  AlertTriangle,
  Bell,
  Calendar,
  Check,
  ChevronRight,
  Copy,
  Download,
  Filter,
  Heart,
  Home,
  Inbox,
  Info,
  LogOut,
  Mail,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Settings,
  Share2,
  Star,
  Trash2,
  Upload,
  User,
  Wallet,
  X,
} from "lucide-react";
import { Accordion } from "../ui/Accordion";
import { Listbox } from "../ui/Listbox";
import { Backdrop } from "../ui/Backdrop";
import { Breadcrumbs } from "../ui/Breadcrumbs";
import { Chip } from "../ui/Chip";
import { Link } from "../ui/Link";
import { Slider } from "../ui/Slider";
import { SpeedDial } from "../ui/SpeedDial";
import { TransferList } from "../ui/TransferList";
import { ImageList } from "../ui/ImageList";
import { Timeline } from "../ui/Timeline";
import { Alert } from "../ui/Alert";
import { Avatar } from "../ui/Avatar";
import { Badge } from "../ui/Badge";
import { Combobox } from "../ui/Combobox";
import { CommandPalette, useCommandPalette } from "../ui/CommandPalette";
import { DatePicker } from "../ui/DatePicker";
import { FileUpload } from "../ui/FileUpload";
import { Pagination } from "../ui/Pagination";
import { Stepper } from "../ui/Stepper";
import { Progress } from "../ui/Progress";
import { Table } from "../ui/Table";
import { Tooltip } from "../ui/Tooltip";
import { BottomNav, Fab } from "../ui/BottomNav";
import { Button } from "../ui/Button";
import { Card, CardHeader, Metric } from "../ui/Card";
import { Checkbox } from "../ui/Checkbox";
import { Field } from "../ui/Field";
import { HeaderBar } from "../ui/HeaderBar";
import { Input, Select, Textarea } from "../ui/Input";
import { Menu } from "../ui/Menu";
import { ConfirmDialog, Modal } from "../ui/Modal";
import { RadioGroup } from "../ui/Radio";
import { Sheet } from "../ui/Sheet";
import { EmptyState, LoadingState, SkeletonListRow } from "../ui/states";
import { Switch } from "../ui/Switch";
import { Tabs } from "../ui/Tabs";
import { ThemeToggle } from "../ui/theme";
import { useToast } from "../ui/Toast";

type Row = { id: string; name: string; status: "Đang mở" | "Xong"; amount: number };

const ROWS: Row[] = [
  { id: "1", name: "Ăn tối quận 1", status: "Đang mở", amount: 1250000 },
  { id: "2", name: "Cà phê sáng", status: "Xong", amount: 180000 },
  { id: "3", name: "Đi Đà Lạt", status: "Đang mở", amount: 4300000 },
  { id: "4", name: "Bún chả Hà Nội", status: "Xong", amount: 320000 },
  { id: "5", name: "Xem phim", status: "Đang mở", amount: 450000 },
];

const ICONS = {
  Home, Inbox, User, Search, Settings, Bell, Mail, Calendar, Wallet, Filter, Download,
  Upload, Share2, Copy, Pencil, Trash2, Plus, Check, X, ChevronRight, Star, Heart, LogOut, Info,
};

const FONT_WEIGHTS = [
  { className: "font-normal", label: "400 Regular" },
  { className: "font-medium", label: "500 Medium" },
  { className: "font-semibold", label: "600 Semibold" },
  { className: "font-bold", label: "700 Bold" },
];

const FONT_SIZES = ["text-xs", "text-sm", "text-base", "text-lg", "text-xl", "text-2xl"];

const money = new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" });

const PHOTOS = [
  [1015, 600, 400, "Sông núi"], [1025, 400, 560, "Cún"], [1039, 600, 420, "Thác nước"],
  [1043, 400, 600, "Núi rừng"], [1050, 600, 380, "Biển"], [1062, 400, 500, "Chó con"],
].map(([id, w, h, title]) => ({ src: `https://picsum.photos/id/${id}/${w}/${h}`, alt: String(title), title: String(title) }));

const LAYOUT_BOX = "rounded-ui border border-dashed border-primary/50 bg-primary-soft p-2 text-xs text-primary";

const CITIES = [
  { value: "hcm", label: "TP. Hồ Chí Minh", description: "Miền Nam" },
  { value: "hn", label: "Hà Nội", description: "Miền Bắc" },
  { value: "dn", label: "Đà Nẵng", description: "Miền Trung" },
  { value: "ct", label: "Cần Thơ", description: "Miền Tây" },
  { value: "hp", label: "Hải Phòng", description: "Miền Bắc" },
  { value: "dl", label: "Đà Lạt", description: "Tây Nguyên" },
];

const STEPS = [
  { id: "info", label: "Thông tin", description: "Tên, ngày" },
  { id: "people", label: "Thành viên", description: "Ai tham gia" },
  { id: "done", label: "Hoàn tất" },
];

const NAV = [
  { id: "home", label: "Trang chủ", icon: Home },
  { id: "inbox", label: "Hộp thư", icon: Inbox, badge: 3 },
  { id: "profile", label: "Cá nhân", icon: User },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-fg-muted">{title}</h2>
      {children}
    </section>
  );
}

export function Gallery() {
  const toast = useToast();
  const [tab, setTab] = useState("all");
  const [nav, setNav] = useState("home");
  const [checked, setChecked] = useState(true);
  const [notify, setNotify] = useState(true);
  const [plan, setPlan] = useState("free");
  const [email, setEmail] = useState("");
  const [modal, setModal] = useState(false);
  const [sheet, setSheet] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [page, setPage] = useState(3);
  const [date, setDate] = useState("");
  const [city, setCity] = useState("");
  const [accountType, setAccountType] = useState("personal");
  const [drawer, setDrawer] = useState(false);
  const [backdrop, setBackdrop] = useState(false);
  const [volume, setVolume] = useState(60);
  const [filters, setFilters] = useState<string[]>(["food"]);
  const [tags, setTags] = useState(["Đà Lạt", "Cuối tuần", "Bạn bè"]);
  const [members, setMembers] = useState<string[]>(["an"]);
  const [files, setFiles] = useState<File[]>([]);
  const [step, setStep] = useState(1);
  const [paletteOpen, setPaletteOpen] = useCommandPalette();

  const emailError =
    email.length > 0 && !email.includes("@") ? "Email phải có ký tự @" : undefined;

  return (
    <div className="min-h-dvh pb-28">
      <HeaderBar
        title="UI Kit"
        subtitle="Component chuẩn, copy sang project khác là chạy"
        actions={
          <>
            <Tooltip label="Ctrl K">
              <Button variant="ghost" size="icon" onClick={() => setPaletteOpen(true)}>
                <Search size={18} />
              </Button>
            </Tooltip>
            <ThemeToggle />
            <Menu
              trigger={(props) => (
                <Button variant="ghost" size="icon" {...props}>
                  <MoreHorizontal size={18} />
                </Button>
              )}
              items={[
                { label: "Sửa", icon: <Pencil size={16} />, onSelect: () => toast.info("Sửa") },
                { label: "Cài đặt", icon: <Settings size={16} />, onSelect: () => toast.info("Cài đặt") },
                {
                  label: "Xoá",
                  icon: <Trash2 size={16} />,
                  destructive: true,
                  onSelect: () => setConfirm(true),
                },
              ]}
            />
          </>
        }
      />

      <main className="mx-auto max-w-3xl space-y-8 px-4 py-6">
        <Section title="Button">
          <div className="flex flex-wrap gap-2">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
            <Button loading>Đang lưu</Button>
            <Button disabled>Tắt</Button>
            <Button size="icon" variant="outline">
              <Search size={18} />
            </Button>
          </div>
        </Section>

        <Section title="Form">
          <Card className="space-y-4">
            <Field label="Tên hiển thị" hint="Người khác sẽ thấy tên này" required>
              <Input placeholder="Nguyễn Văn A" />
            </Field>

            <Field label="Email" error={emailError} required>
              <Input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                leading={<Search size={16} />}
                placeholder="ban@email.com"
              />
            </Field>

            <Field label="Loại tài khoản">
              <Listbox
                value={accountType}
                onChange={setAccountType}
                options={[
                  { value: "personal", label: "Cá nhân", icon: <User size={16} />, description: "Một người dùng" },
                  { value: "team", label: "Nhóm", icon: <Inbox size={16} />, description: "Chia sẻ với thành viên" },
                ]}
              />
            </Field>

            <Field label="Select gốc (mobile dùng picker hệ điều hành)">
              <Select defaultValue="personal">
                <option value="personal">Cá nhân</option>
                <option value="team">Nhóm</option>
              </Select>
            </Field>

            <Field label="Ghi chú" hint="Không bắt buộc">
              <Textarea placeholder="Vài dòng mô tả..." />
            </Field>

            <Checkbox
              checked={checked}
              onChange={(event) => setChecked(event.target.checked)}
              label="Đồng ý điều khoản"
              description="Bạn có thể đổi lại bất cứ lúc nào"
            />

            <RadioGroup
              label="Gói dịch vụ"
              name="plan"
              value={plan}
              onChange={setPlan}
              options={[
                { value: "free", label: "Miễn phí", description: "3 project" },
                { value: "pro", label: "Pro", description: "Không giới hạn" },
              ]}
            />

            <Switch
              checked={notify}
              onChange={setNotify}
              label="Nhận thông báo"
              description="Gửi qua email mỗi khi có thay đổi"
            />
          </Card>
        </Section>

        <Section title="Hiển thị dữ liệu">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <Metric label="Tổng thu" value="12.400.000 ₫" />
            <Metric label="Đã chi" value="8.150.000 ₫" />
            <Metric label="Còn lại" value="4.250.000 ₫" />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge>Mặc định</Badge>
            <Badge tone="primary">Mới</Badge>
            <Badge tone="success" dot>
              Đang chạy
            </Badge>
            <Badge tone="warning">Chờ duyệt</Badge>
            <Badge tone="danger">Lỗi</Badge>
          </div>

          <div className="flex items-center gap-3">
            <Avatar name="Nguyễn Văn A" size="sm" />
            <Avatar name="Trần Thị Bích" />
            <Avatar name="Lê Hoàng" size="lg" />
          </div>
        </Section>

        <Section title="Chọn ngày, Autocomplete (Combobox), tải tệp">
          <Card className="space-y-4">
            <Field label="Ngày đi" hint="Không cho chọn ngày trong quá khứ">
              <DatePicker value={date} onChange={setDate} min="2026-08-11" />
            </Field>

            <Field label="Thành phố" hint="Gõ không dấu vẫn tìm ra">
              <Combobox
                value={city}
                onChange={setCity}
                options={CITIES}
                placeholder="Tìm thành phố..."
              />
            </Field>

            <Field label="Ảnh hoá đơn">
              <FileUpload
                files={files}
                onChange={setFiles}
                accept="image/*,.pdf"
                maxSize={2 * 1024 * 1024}
                maxFiles={3}
              />
            </Field>
          </Card>
        </Section>

        <Section title="Slider, Chip, Transfer list">
          <Card className="space-y-5">
            <Field label="Âm lượng">
              <Slider value={volume} onChange={setVolume} format={(v) => `${v}%`} />
            </Field>
            <div className="space-y-2">
              <p className="text-sm font-medium text-fg">Chip lọc</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: "food", label: "Ăn uống", icon: <Wallet size={14} /> },
                  { id: "travel", label: "Du lịch", icon: <Calendar size={14} /> },
                  { id: "fav", label: "Yêu thích", icon: <Heart size={14} /> },
                ].map((chip) => (
                  <Chip
                    key={chip.id}
                    icon={chip.icon}
                    selected={filters.includes(chip.id)}
                    onClick={() =>
                      setFilters((list) =>
                        list.includes(chip.id) ? list.filter((id) => id !== chip.id) : [...list, chip.id],
                      )
                    }
                  >
                    {chip.label}
                  </Chip>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-fg">Chip tag (bấm x để xoá)</p>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Chip key={tag} onRemove={() => setTags((list) => list.filter((t) => t !== tag))}>
                    {tag}
                  </Chip>
                ))}
              </div>
            </div>
            <TransferList
              titles={["Bạn bè", "Thành viên"]}
              selected={members}
              onChange={setMembers}
              items={[
                { value: "an", label: "An" },
                { value: "binh", label: "Bình" },
                { value: "chi", label: "Chi" },
                { value: "dung", label: "Dũng" },
                { value: "giang", label: "Giang" },
              ]}
            />
          </Card>
        </Section>

        <Section title="Navigation: Breadcrumbs, Link, Drawer, Speed dial">
          <Card className="space-y-5">
            <Breadcrumbs
              items={[
                { label: "Trang chủ", href: "#" },
                { label: "Cuộc chia", href: "#" },
                { label: "Đi Đà Lạt" },
              ]}
            />
            <p className="text-sm text-fg">
              <Link href="#">Link nội bộ</Link> ·{" "}
              <Link href="https://github.com/nguyenhuy158/ui-kit" external>
                Link ra ngoài
              </Link>
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Button variant="outline" onClick={() => setDrawer(true)}>
                Mở Drawer
              </Button>
              <SpeedDial
                direction="left"
                icon={<Plus size={24} />}
                actions={[
                  { label: "Sao chép", icon: <Copy size={18} />, onSelect: () => toast.info("Sao chép") },
                  { label: "Chia sẻ", icon: <Share2 size={18} />, onSelect: () => toast.info("Chia sẻ") },
                  { label: "Tải xuống", icon: <Download size={18} />, onSelect: () => toast.info("Tải xuống") },
                ]}
              />
            </div>
            <p className="text-xs text-fg-muted">
              Có sẵn ở các mục khác: Bottom Navigation (thanh dưới), Menu (nút ⋯ trên header), Pagination, Stepper, Tabs, FAB (nút + góc phải).
            </p>
          </Card>
        </Section>

        <Section title="Layout: Box, Container, Grid, Stack (Tailwind)">
          <Card className="space-y-4">
            <p className="text-sm text-fg-muted">
              Không cần component: dùng class Tailwind. Container = <code>mx-auto max-w-3xl px-4</code>, Stack ={" "}
              <code>flex flex-col gap-3</code>, Grid = <code>grid grid-cols-12 gap-2</code>.
            </p>
            <div className="flex gap-2">
              {["Stack ngang", "flex gap-2", "items-center"].map((t) => (
                <div key={t} className={`${LAYOUT_BOX} flex-1`}>{t}</div>
              ))}
            </div>
            <div className="grid grid-cols-12 gap-2">
              <div className={`${LAYOUT_BOX} col-span-12 sm:col-span-8`}>col-span-8</div>
              <div className={`${LAYOUT_BOX} col-span-12 sm:col-span-4`}>col-span-4</div>
              <div className={`${LAYOUT_BOX} col-span-6 sm:col-span-3`}>3</div>
              <div className={`${LAYOUT_BOX} col-span-6 sm:col-span-3`}>3</div>
              <div className={`${LAYOUT_BOX} col-span-12 sm:col-span-6`}>6</div>
            </div>
          </Card>
        </Section>

        <Section title="Image list, Masonry, Timeline">
          <Card className="space-y-5">
            <ImageList items={PHOTOS} cols={3} onSelect={(item) => toast.info(item.title ?? "")} />
            <ImageList items={PHOTOS} variant="masonry" cols={3} />
            <Timeline
              items={[
                { id: "1", title: "Tạo cuộc chia", time: "08:00", description: "An tạo “Đi Đà Lạt”" },
                { id: "2", title: "Thêm 4 thành viên", time: "08:05" },
                { id: "3", title: "Ghi khoản 1.250.000 ₫", time: "12:30", description: "Ăn trưa ở chợ" },
                { id: "4", title: "Đang chờ thanh toán", time: "Bây giờ", active: true },
              ]}
            />
          </Card>
        </Section>

        <Section title="Stepper">
          <Card className="space-y-6">
            <Stepper
              steps={STEPS}
              current={step}
              onStepClick={setStep}
            />
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={step === 0}
                onClick={() => setStep((current) => current - 1)}
              >
                Quay lại
              </Button>
              <Button
                size="sm"
                disabled={step >= STEPS.length - 1}
                onClick={() => setStep((current) => current + 1)}
              >
                Tiếp tục
              </Button>
            </div>
            <Stepper steps={STEPS} current={step} orientation="vertical" onStepClick={setStep} />
          </Card>
        </Section>

        <Section title="Bảng và phân trang">
          <Table
            columns={[
              { key: "name", header: "Cuộc chia", cell: (row) => row.name, sortValue: (row) => row.name },
              {
                key: "status",
                header: "Trạng thái",
                hideOnMobile: true,
                sortValue: (row) => row.status,
                cell: (row) => (
                  <Badge tone={row.status === "Xong" ? "success" : "primary"}>{row.status}</Badge>
                ),
              },
              {
                key: "amount",
                header: "Số tiền",
                numeric: true,
                sortValue: (row) => row.amount,
                cell: (row) => money.format(row.amount),
              },
            ]}
            rows={ROWS}
            rowKey={(row) => row.id}
            onRowClick={(row) => toast.info(row.name)}
          />
          <Pagination page={page} pageCount={12} onChange={setPage} />
        </Section>

        <Section title="Font chữ">
          <Card className="space-y-4">
            <p className="text-sm text-fg-muted">
              Be Vietnam Pro, dự phòng Inter → system-ui. Tải từ Google Fonts trong{" "}
              <code className="rounded bg-surface-muted px-1">index.html</code>.
            </p>
            <div className="space-y-1">
              {FONT_WEIGHTS.map((weight) => (
                <p key={weight.label} className={`text-lg ${weight.className}`}>
                  {weight.label} — Tiếng Việt có dấu: Ắ Ặ Ỡ Ữ đường phố
                </p>
              ))}
            </div>
            <div className="space-y-1">
              {FONT_SIZES.map((size) => (
                <p key={size} className={size}>
                  <span className="inline-block w-20 text-xs text-fg-muted">{size}</span>Chia kèo dễ dàng
                </p>
              ))}
            </div>
            <p className="tabular text-lg">
              <span className="mr-2 text-xs text-fg-muted">.tabular</span>1.111.111 ₫ · 8.888.888 ₫
            </p>
          </Card>
        </Section>

        <Section title="Icon (lucide-react)">
          <Card>
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
              {Object.entries(ICONS).map(([name, Icon]) => (
                <div
                  key={name}
                  className="flex flex-col items-center gap-1.5 rounded-ui p-2 text-fg-muted hover:bg-surface-muted hover:text-fg"
                >
                  <Icon size={20} />
                  <span className="truncate text-[10px]">{name}</span>
                </div>
              ))}
            </div>
          </Card>
        </Section>

        <Section title="Alert và tiến độ">
          <Alert tone="info" title="Bản nháp chưa lưu" icon={<Info size={18} />}>
            Thay đổi sẽ mất nếu bạn rời trang.
          </Alert>
          <Alert
            tone="warning"
            title="Sắp hết dung lượng"
            icon={<AlertTriangle size={18} />}
            action={
              <Button size="sm" variant="outline">
                Nâng cấp
              </Button>
            }
          >
            Đã dùng 4,6 GB trên 5 GB.
          </Alert>
          <Alert tone="danger" title="Không kết nối được máy chủ" />

          <Card className="space-y-3">
            <Progress value={92} label="Dung lượng" showValue tone="warning" />
            <Progress value={38} label="Tiến độ chia tiền" showValue />
          </Card>
        </Section>

        <Section title="Accordion và tooltip">
          <Accordion
            single
            defaultOpen={["a"]}
            items={[
              { id: "a", title: "Chia tiền kiểu gì?", content: "Chia đều hoặc nhập tay từng người." },
              { id: "b", title: "Sửa được sau khi chốt không?", content: "Được, mọi thay đổi đều có lịch sử." },
              { id: "c", title: "Xoá cuộc chia có lấy lại được?", content: "Nằm trong thùng rác 30 ngày." },
            ]}
          />
          <div className="flex gap-2">
            <Tooltip label="Sao chép mã mời">
              <Button variant="outline" size="sm">
                Rê chuột vào đây
              </Button>
            </Tooltip>
            <Tooltip label="Hiện bên dưới" side="bottom">
              <Button variant="outline" size="sm">
                Hoặc đây
              </Button>
            </Tooltip>
          </div>
        </Section>

        <Section title="Tabs">
          <Tabs
            items={[
              { id: "all", label: "Tất cả", count: 12 },
              { id: "open", label: "Đang mở", count: 4 },
              { id: "done", label: "Xong", count: 8 },
            ]}
            active={tab}
            onChange={setTab}
          />
          <Tabs
            variant="pill"
            items={[
              { id: "all", label: "Tất cả" },
              { id: "open", label: "Đang mở" },
              { id: "done", label: "Xong" },
            ]}
            active={tab}
            onChange={setTab}
          />
        </Section>

        <Section title="Trạng thái">
          <Card padded={false} className="divide-y divide-border px-4">
            <SkeletonListRow avatar />
            <SkeletonListRow avatar />
          </Card>
          <LoadingState />
          <EmptyState
            title="Chưa có gì ở đây"
            description="Tạo mục đầu tiên để bắt đầu."
            icon={<Inbox size={28} />}
            action={<Button size="sm">Tạo mới</Button>}
          />
        </Section>

        <Section title="Lớp phủ và thông báo">
          <Card>
            <CardHeader title="Thử các lớp phủ" description="Esc để đóng, Tab bị giữ bên trong" />
            <div className="mt-3 flex flex-wrap gap-2">
              <Button variant="outline" onClick={() => setModal(true)}>
                Modal
              </Button>
              <Button variant="outline" onClick={() => setSheet(true)}>
                Bottom sheet
              </Button>
              <Button variant="outline" onClick={() => setConfirm(true)}>
                Xác nhận xoá
              </Button>
              <Button variant="outline" onClick={() => {
                setBackdrop(true);
                setTimeout(() => setBackdrop(false), 2000);
              }}>
                Backdrop 2 giây
              </Button>
            </div>
          </Card>
        </Section>

        <Section title="Snackbar (Toast)">
          <Card>
            <CardHeader title="Thông báo nổi" description="Tự tắt sau 4 giây, bấm vào để tắt ngay" />
            <div className="mt-3 flex flex-wrap gap-2">
              <Button variant="outline" onClick={() => toast.info("Đã sao chép liên kết")}>
                Info
              </Button>
              <Button variant="outline" onClick={() => toast.success("Đã lưu")}>
                Success
              </Button>
              <Button
                variant="outline"
                onClick={() => toast.warning("Sắp hết dung lượng", { description: "Còn 5% bộ nhớ" })}
              >
                Warning
              </Button>
              <Button
                variant="outline"
                onClick={() => toast.error("Lưu thất bại", { description: "Mất kết nối máy chủ" })}
              >
                Error
              </Button>
              <Button
                variant="ghost"
                onClick={() => toast.info("Giữ lâu hơn", { description: "duration: 10000", duration: 10000 })}
              >
                Tuỳ thời gian
              </Button>
            </div>
          </Card>
        </Section>
      </main>

      <Fab onClick={() => toast.info("Thêm mới")} label="Thêm mới" icon={<Plus size={24} />} />
      <BottomNav items={NAV} active={nav} onChange={setNav} mobileOnly={false} />

      <Modal
        open={modal}
        onClose={() => setModal(false)}
        title="Sửa thông tin"
        description="Thay đổi được lưu ngay khi bấm Lưu."
        footer={
          <>
            <Button variant="ghost" onClick={() => setModal(false)}>
              Huỷ
            </Button>
            <Button
              onClick={() => {
                setModal(false);
                toast.success("Đã lưu");
              }}
            >
              Lưu
            </Button>
          </>
        }
      >
        <Field label="Tên">
          <Input defaultValue="Nguyễn Văn A" />
        </Field>
      </Modal>

      <Sheet open={drawer} onClose={() => setDrawer(false)} title="Drawer" side="right">
        <nav className="flex flex-col gap-1">
          {NAV.map((item) => (
            <Button key={item.id} variant="ghost" block className="justify-start" onClick={() => setDrawer(false)}>
              <item.icon size={18} /> {item.label}
            </Button>
          ))}
        </nav>
      </Sheet>

      <Backdrop open={backdrop} />

      <Sheet open={sheet} onClose={() => setSheet(false)} title="Tuỳ chọn">
        <div className="flex flex-col gap-1">
          <Button variant="ghost" block className="justify-start">
            Chia sẻ
          </Button>
          <Button variant="ghost" block className="justify-start">
            Nhân bản
          </Button>
          <Button variant="ghost" block className="justify-start text-danger">
            Xoá
          </Button>
        </div>
      </Sheet>

      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        commands={[
          {
            id: "new",
            label: "Tạo cuộc chia mới",
            group: "Hành động",
            shortcut: "N",
            icon: <Plus size={16} />,
            onRun: () => toast.success("Tạo mới"),
          },
          {
            id: "settings",
            label: "Mở cài đặt",
            group: "Hành động",
            icon: <Settings size={16} />,
            onRun: () => toast.info("Cài đặt"),
          },
          {
            id: "home",
            label: "Về trang chủ",
            group: "Điều hướng",
            keywords: "trang chu home",
            icon: <Home size={16} />,
            onRun: () => setNav("home"),
          },
          {
            id: "inbox",
            label: "Hộp thư",
            group: "Điều hướng",
            icon: <Inbox size={16} />,
            onRun: () => setNav("inbox"),
          },
        ]}
      />

      <ConfirmDialog
        open={confirm}
        onClose={() => setConfirm(false)}
        onConfirm={() => {
          setConfirm(false);
          toast.success("Đã xoá");
        }}
        title="Xoá mục này?"
        description="Hành động này không hoàn tác được."
        confirmLabel="Xoá"
        destructive
      />
    </div>
  );
}
