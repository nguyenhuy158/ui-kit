import {
  Copy,
  Download,
  Plus,
  QrCode,
  Share2,
  Users,
  Wallet,
} from "lucide-react";
import { useState } from "react";
import { Accordion } from "../../ui/Accordion";
import { BottomNav } from "../../ui/BottomNav";
import { Breadcrumbs } from "../../ui/Breadcrumbs";
import { Button } from "../../ui/Button";
import { Card } from "../../ui/Card";
import { HeaderBar } from "../../ui/HeaderBar";
import { Link } from "../../ui/Link";
import { PagedList } from "../../ui/PagedList";
import { Popover } from "../../ui/Popover";
import { Screen } from "../../ui/Screen";
import { Sheet } from "../../ui/Sheet";
import { SpeedDial } from "../../ui/SpeedDial";
import { Tabs } from "../../ui/Tabs";
import { useToast } from "../../ui/Toast";
import { Tooltip } from "../../ui/Tooltip";
import { NAV } from "../fixtures";
import { Anchor, Section } from "../section";
import type { GroupProps } from "./types";

export function NavGroup(_: GroupProps) {
  const toast = useToast();
  const [tab, setTab] = useState("all");
  const [drawer, setDrawer] = useState(false);
  const [screenTab, setScreenTab] = useState("spend");
  const spendItems = Array.from({ length: 25 }, (_, index) => ({
    id: `spend-${index + 1}`,
    title: `Khoản chi ${index + 1}`,
    amount: (index + 1) * 12_500,
  }));
  return (
    <>
      <Section
        title="Navigation: Breadcrumbs, Link, Drawer, Speed dial"
        id="s-navigation"
      >
        <Card className="space-y-5">
          <Anchor id="c-breadcrumbs" />
          <Breadcrumbs
            items={[
              { label: "Trang chủ", href: "#" },
              { label: "Cuộc chia", href: "#" },
              { label: "Đi Đà Lạt" },
            ]}
          />
          <Anchor id="c-link" />
          <p className="text-sm text-fg">
            <Link href="#">Link nội bộ</Link> ·{" "}
            <Link href="https://github.com/nguyenhuy158/ui-kit" external>
              Link ra ngoài
            </Link>
          </p>
          <p className="text-sm text-fg">
            Trong đoạn văn dùng{" "}
            <Link href="#" inline>
              Link inline
            </Link>{" "}
            để luôn có gạch chân, kể cả{" "}
            <Link href="https://github.com/nguyenhuy158/ui-kit" external inline>
              link ra ngoài
            </Link>
            .
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Anchor id="c-drawer" />
            <Button variant="outline" onClick={() => setDrawer(true)}>
              Mở Drawer
            </Button>
            <Anchor id="c-speeddial" />
            <SpeedDial
              direction="left"
              icon={<Plus size={24} />}
              actions={[
                {
                  label: "Sao chép",
                  icon: <Copy size={18} />,
                  onSelect: () => toast.info("Sao chép"),
                },
                {
                  label: "Chia sẻ",
                  icon: <Share2 size={18} />,
                  onSelect: () => toast.info("Chia sẻ"),
                },
                {
                  label: "Tải xuống",
                  icon: <Download size={18} />,
                  onSelect: () => toast.info("Tải xuống"),
                },
              ]}
            />
          </div>
          <p className="text-xs text-fg-muted">
            Có sẵn ở các mục khác: Bottom Navigation (thanh dưới), Menu (nút ⋯
            trên header), Pagination, Stepper, Tabs, FAB (nút + góc phải).
          </p>
        </Card>
      </Section>
      <Section
        title="Một màn hình, không cuộn: Screen và PagedList"
        id="s-screen"
      >
        <Anchor id="c-screen" />
        <Anchor id="c-pagedlist" />
        <p className="text-xs text-fg-muted">
          Trang không cuộn. Header và thanh dưới cố định, vùng giữa vừa khít chỗ
          còn lại. Danh sách dài chia trang: PagedList tự đo chiều cao để biết
          mỗi trang chứa mấy dòng. Mỗi dòng có chiều cao cố định.
        </p>
        <div
          data-testid="screen-demo"
          className="h-[26rem] overflow-hidden rounded-ui border border-border bg-bg"
        >
          <Screen
            fill="parent"
            header={
              <HeaderBar
                sticky={false}
                title="Cuộc chia mẫu"
                subtitle="25 khoản chi"
              />
            }
            footer={
              <BottomNav
                inline
                mobileOnly={false}
                active={screenTab}
                onChange={setScreenTab}
                items={[
                  { id: "people", label: "Người", icon: Users },
                  { id: "spend", label: "Chi", icon: Wallet },
                  { id: "summary", label: "Tổng kết", icon: QrCode },
                ]}
              />
            }
          >
            <div className="h-full px-3 pt-3">
              <PagedList
                items={spendItems}
                rowHeight={52}
                getKey={(item) => item.id}
                renderItem={(item) => (
                  <div className="flex h-full items-center justify-between rounded-ui border border-border bg-surface px-3 text-sm">
                    <span className="truncate font-medium text-fg">
                      {item.title}
                    </span>
                    <span className="tabular text-fg-muted">
                      {item.amount.toLocaleString("vi-VN")} ₫
                    </span>
                  </div>
                )}
              />
            </div>
          </Screen>
        </div>
      </Section>
      <Section title="Accordion và tooltip" id="s-accordion">
        <Anchor id="c-accordion" />
        <Accordion
          single
          defaultOpen={["a"]}
          items={[
            {
              id: "a",
              title: "Chia tiền kiểu gì?",
              content: "Chia đều hoặc nhập tay từng người.",
            },
            {
              id: "b",
              title: "Sửa được sau khi chốt không?",
              content: "Được, mọi thay đổi đều có lịch sử.",
            },
            {
              id: "c",
              title: "Xoá cuộc chia có lấy lại được?",
              content: "Nằm trong thùng rác 30 ngày.",
            },
          ]}
        />
        <div className="flex gap-2">
          <Anchor id="c-tooltip" />
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
          <Anchor id="c-popover" />
          <Popover
            trigger={(props) => (
              <Button variant="outline" size="sm" {...props}>
                Popover
              </Button>
            )}
          >
            {(close) => (
              <div className="flex flex-col gap-2 text-sm">
                <p>Nội dung tuỳ ý, không chỉ là danh sách lệnh.</p>
                <Button size="sm" onClick={close}>
                  Đóng
                </Button>
              </div>
            )}
          </Popover>
        </div>
      </Section>
      <Section title="Tabs" id="s-tabs">
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

      <Sheet
        open={drawer}
        onClose={() => setDrawer(false)}
        title="Drawer"
        side="right"
      >
        <nav className="flex flex-col gap-1">
          {NAV.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              block
              className="justify-start"
              onClick={() => setDrawer(false)}
            >
              <item.icon size={18} /> {item.label}
            </Button>
          ))}
        </nav>
      </Sheet>
    </>
  );
}
