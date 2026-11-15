import { Search } from "lucide-react";
import { Button } from "../../ui/Button";
import { Card } from "../../ui/Card";
import { FONT_SIZES, FONT_WEIGHTS, ICONS, LAYOUT_BOX } from "../fixtures";
import { Section } from "../section";
import type { GroupProps } from "./types";

export function BasicsGroup(_: GroupProps) {
  return (
    <>
      <Section title="Button" id="s-button">
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
      <Section
        title="Layout: Box, Container, Grid, Stack (Tailwind)"
        id="s-layout"
      >
        <Card className="space-y-4">
          <p className="text-sm text-fg-muted">
            Không cần component: dùng class Tailwind. Container ={" "}
            <code>mx-auto max-w-3xl px-4</code>, Stack ={" "}
            <code>flex flex-col gap-3</code>, Grid ={" "}
            <code>grid grid-cols-12 gap-2</code>.
          </p>
          <div className="flex gap-2">
            {["Stack ngang", "flex gap-2", "items-center"].map((t) => (
              <div key={t} className={`${LAYOUT_BOX} flex-1`}>
                {t}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-12 gap-2">
            <div className={`${LAYOUT_BOX} col-span-12 sm:col-span-8`}>
              col-span-8
            </div>
            <div className={`${LAYOUT_BOX} col-span-12 sm:col-span-4`}>
              col-span-4
            </div>
            <div className={`${LAYOUT_BOX} col-span-6 sm:col-span-3`}>3</div>
            <div className={`${LAYOUT_BOX} col-span-6 sm:col-span-3`}>3</div>
            <div className={`${LAYOUT_BOX} col-span-12 sm:col-span-6`}>6</div>
          </div>
        </Card>
      </Section>
      <Section title="Font chữ" id="s-font">
        <Card className="space-y-4">
          <p className="text-sm text-fg-muted">
            Be Vietnam Pro, dự phòng Inter → system-ui. Tải từ Google Fonts
            trong{" "}
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
                <span className="inline-block w-20 text-xs text-fg-muted">
                  {size}
                </span>
                Chia kèo dễ dàng
              </p>
            ))}
          </div>
          <p className="tabular text-lg">
            <span className="mr-2 text-xs text-fg-muted">.tabular</span>
            1.111.111 ₫ · 8.888.888 ₫
          </p>
        </Card>
      </Section>
      <Section title="Icon (lucide-react)" id="s-icon">
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
    </>
  );
}
