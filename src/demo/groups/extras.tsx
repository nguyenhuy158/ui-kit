import { useState } from "react";
import { AnimatedList } from "../../ui/AnimatedList";
import { Button } from "../../ui/Button";
import { Card } from "../../ui/Card";
import { Carousel } from "../../ui/Carousel";
import { Sheet } from "../../ui/Sheet";
import { VirtualList } from "../../ui/VirtualList";
import { Anchor, Section } from "../section";
import type { GroupProps } from "./types";

const LONG_LIST_SIZE = 10_000;
const LONG_ROW_HEIGHT_PX = 44;
const INITIAL_CHIPS = ["Cầu lông", "Bóng bàn", "Pickleball"];

const SLIDE_TITLES = ["Trang 1", "Trang 2", "Trang 3", "Trang 4"];

const SLIDES = SLIDE_TITLES.map((title) => (
  <div
    key={title}
    className="flex h-36 items-center justify-center bg-primary-soft text-lg font-semibold text-primary"
  >
    {title}
  </div>
));

const LONG_ROWS = Array.from({ length: LONG_LIST_SIZE }, (_, index) => ({
  id: `row-${index + 1}`,
  label: `Dòng ${index + 1}`,
}));

export function ExtrasGroup(_: GroupProps) {
  const [chips, setChips] = useState(INITIAL_CHIPS);
  const [nextId, setNextId] = useState(1);
  const [sheetOpen, setSheetOpen] = useState(false);
  return (
    <>
      <Section title="Carousel (embla-carousel)" id="s-carousel">
        <Anchor id="c-carousel" />
        <Card>
          <Carousel label="Ví dụ carousel" slides={SLIDES} />
        </Card>
      </Section>
      <Section title="AnimatedList (auto-animate)" id="s-animated">
        <Anchor id="c-animated" />
        <Card className="space-y-3">
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => {
                setChips((value) => [...value, `Môn ${nextId}`]);
                setNextId((value) => value + 1);
              }}
            >
              Thêm
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setChips((value) => value.slice(1))}
              disabled={chips.length === 0}
            >
              Xoá đầu
            </Button>
          </div>
          <AnimatedList as="ul" className="space-y-2">
            {chips.map((chip) => (
              <li
                key={chip}
                className="rounded-ui border border-border px-3 py-2 text-sm"
              >
                {chip}
              </li>
            ))}
          </AnimatedList>
        </Card>
      </Section>
      <Section title="VirtualList (tanstack virtual)" id="s-virtual">
        <Anchor id="c-virtual" />
        <Card className="space-y-3">
          <p className="text-xs text-fg-muted">
            10.000 dòng, chỉ vẽ các dòng đang thấy. Mở trong Sheet vì danh sách
            dài được phép cuộn ở đó.
          </p>
          <Button size="sm" onClick={() => setSheetOpen(true)}>
            Mở danh sách dài
          </Button>
        </Card>
        <Sheet
          open={sheetOpen}
          onClose={() => setSheetOpen(false)}
          title="10.000 dòng"
        >
          <div className="h-[60dvh]">
            <VirtualList
              label="Danh sách dài"
              items={LONG_ROWS}
              getKey={(row) => row.id}
              rowHeight={LONG_ROW_HEIGHT_PX}
              renderItem={(row) => (
                <div className="flex h-full items-center border-b border-border px-3 text-sm">
                  {row.label}
                </div>
              )}
            />
          </div>
        </Sheet>
      </Section>
    </>
  );
}
