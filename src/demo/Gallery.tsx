import {
  Home,
  Inbox,
  Menu as MenuIcon,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Settings,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { BottomNav, Fab } from "../ui/BottomNav";
import { Button } from "../ui/Button";
import { CommandPalette, useCommandPalette } from "../ui/CommandPalette";
import { HeaderBar } from "../ui/HeaderBar";
import { Menu } from "../ui/Menu";
import { ConfirmDialog } from "../ui/Modal";
import { Sheet } from "../ui/Sheet";
import { useToast } from "../ui/Toast";
import { Tooltip } from "../ui/Tooltip";
import { ThemeToggle } from "../ui/theme";
import { NAV } from "./fixtures";
import { GroupMenu } from "./GroupMenu";
import { GROUP_VIEWS } from "./groups";
import { parseRoute, type Route, routeHash } from "./menu";

export function Gallery() {
  const toast = useToast();
  const [nav, setNav] = useState("home");
  const [confirm, setConfirm] = useState(false);
  const [paletteOpen, setPaletteOpen] = useCommandPalette();
  const [route, setRoute] = useState<Route>(() =>
    parseRoute(window.location.hash),
  );
  const [groupMenu, setGroupMenu] = useState(false);

  useEffect(() => {
    const onHashChange = () => setRoute(parseRoute(window.location.hash));
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  useEffect(() => {
    if (route.anchor) document.getElementById(route.anchor)?.scrollIntoView();
  }, [route]);

  const selectTarget = (group: string, anchor: string) => {
    const next: Route = { group, anchor };
    window.history.pushState(null, "", `#${routeHash(next)}`);
    setRoute(next);
    setGroupMenu(false);
  };

  const View = GROUP_VIEWS[route.group];

  return (
    <div className="ui-mica min-h-dvh pb-28">
      <HeaderBar
        title="UI Kit"
        subtitle="Component chuẩn, copy sang project khác là chạy"
        leading={
          <Button
            variant="ghost"
            size="icon"
            aria-label="Mở menu nhóm"
            aria-haspopup="dialog"
            onClick={() => setGroupMenu(true)}
          >
            <MenuIcon size={20} />
          </Button>
        }
        actions={
          <>
            <Tooltip label="Ctrl K">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setPaletteOpen(true)}
              >
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
                {
                  label: "Sửa",
                  icon: <Pencil size={16} />,
                  onSelect: () => toast.info("Sửa"),
                },
                {
                  label: "Cài đặt",
                  icon: <Settings size={16} />,
                  onSelect: () => toast.info("Cài đặt"),
                },
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

      <Sheet
        open={groupMenu}
        onClose={() => setGroupMenu(false)}
        title="Nhóm component"
        side="left"
      >
        <GroupMenu route={route} onSelect={selectTarget} />
      </Sheet>

      <div className="mx-auto max-w-3xl px-4">
        <main className="space-y-8 py-6">
          {View && <View onAskConfirm={() => setConfirm(true)} />}
        </main>
      </div>

      <Fab
        onClick={() => toast.info("Thêm mới")}
        label="Thêm mới"
        icon={<Plus size={24} />}
      />
      <BottomNav
        items={NAV}
        active={nav}
        onChange={setNav}
        mobileOnly={false}
      />

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
