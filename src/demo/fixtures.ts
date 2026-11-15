import {
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

export type Row = {
  id: string;
  name: string;
  status: "Đang mở" | "Xong";
  amount: number;
};

export const ROWS: Row[] = [
  { id: "1", name: "Ăn tối quận 1", status: "Đang mở", amount: 1250000 },
  { id: "2", name: "Cà phê sáng", status: "Xong", amount: 180000 },
  { id: "3", name: "Đi Đà Lạt", status: "Đang mở", amount: 4300000 },
  { id: "4", name: "Bún chả Hà Nội", status: "Xong", amount: 320000 },
  { id: "5", name: "Xem phim", status: "Đang mở", amount: 450000 },
];

export const ICONS = {
  Home,
  Inbox,
  User,
  Search,
  Settings,
  Bell,
  Mail,
  Calendar,
  Wallet,
  Filter,
  Download,
  Upload,
  Share2,
  Copy,
  Pencil,
  Trash2,
  Plus,
  Check,
  X,
  ChevronRight,
  Star,
  Heart,
  LogOut,
  Info,
};

export const FONT_WEIGHTS = [
  { className: "font-normal", label: "400 Regular" },
  { className: "font-medium", label: "500 Medium" },
  { className: "font-semibold", label: "600 Semibold" },
  { className: "font-bold", label: "700 Bold" },
];

export const FONT_SIZES = [
  "text-xs",
  "text-sm",
  "text-base",
  "text-lg",
  "text-xl",
  "text-2xl",
];

export const money = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
});

export const PHOTOS = [
  [1015, 600, 400, "Sông núi"],
  [1025, 400, 560, "Cún"],
  [1039, 600, 420, "Thác nước"],
  [1043, 400, 600, "Núi rừng"],
  [1050, 600, 380, "Biển"],
  [1062, 400, 500, "Chó con"],
].map(([id, w, h, title]) => ({
  src: `https://picsum.photos/id/${id}/${w}/${h}`,
  alt: String(title),
  title: String(title),
}));

export const LAYOUT_BOX =
  "rounded-ui border border-dashed border-primary/50 bg-primary-soft p-2 text-xs text-primary";

export const CITIES = [
  { value: "hcm", label: "TP. Hồ Chí Minh", description: "Miền Nam" },
  { value: "hn", label: "Hà Nội", description: "Miền Bắc" },
  { value: "dn", label: "Đà Nẵng", description: "Miền Trung" },
  { value: "ct", label: "Cần Thơ", description: "Miền Tây" },
  { value: "hp", label: "Hải Phòng", description: "Miền Bắc" },
  { value: "dl", label: "Đà Lạt", description: "Tây Nguyên" },
];

export const STEPS = [
  { id: "info", label: "Thông tin", description: "Tên, ngày" },
  { id: "people", label: "Thành viên", description: "Ai tham gia" },
  { id: "done", label: "Hoàn tất" },
];

export const NAV = [
  { id: "home", label: "Trang chủ", icon: Home },
  { id: "inbox", label: "Hộp thư", icon: Inbox, badge: 3 },
  { id: "profile", label: "Cá nhân", icon: User },
];
