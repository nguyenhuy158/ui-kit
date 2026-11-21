import { Inbox } from "lucide-react";
import { useState } from "react";
import { Avatar } from "../../ui/Avatar";
import { Badge } from "../../ui/Badge";
import { Button } from "../../ui/Button";
import { Card, Metric } from "../../ui/Card";
import { ImageList } from "../../ui/ImageList";
import { formatMoney } from "../../ui/locale";
import { Pagination } from "../../ui/Pagination";
import { Stepper } from "../../ui/Stepper";
import {
  EmptyState,
  LoadingState,
  PageLoading,
  SkeletonListRow,
} from "../../ui/states";
import { Table } from "../../ui/Table";
import { Timeline } from "../../ui/Timeline";
import { useToast } from "../../ui/Toast";
import { useCachedFetch } from "../../ui/use-cached-fetch";
import { PHOTOS, ROWS, STEPS } from "../fixtures";
import { Anchor, Section } from "../section";
import type { GroupProps } from "./types";

const PAGE_LOADING_DEMO_MS = 1500;

function PageLoadingDemo() {
  const [open, setOpen] = useState(false);

  function show() {
    setOpen(true);
    setTimeout(() => setOpen(false), PAGE_LOADING_DEMO_MS);
  }

  return (
    <>
      <Button variant="secondary" onClick={show}>
        Xem PageLoading
      </Button>
      {open && (
        <div className="fixed inset-0 z-50">
          <PageLoading />
        </div>
      )}
    </>
  );
}

const DEMO_KEY = "demo:summary";
const DEMO_DELAY_MS = 600;
const DEMO_STALE_MS = 30_000;
let demoCalls = 0;

function fetchDemoSummary() {
  demoCalls += 1;
  const call = demoCalls;
  return new Promise<{ call: number; at: string }>((resolve) =>
    setTimeout(
      () => resolve({ call, at: new Date().toLocaleTimeString("vi-VN") }),
      DEMO_DELAY_MS,
    ),
  );
}

function CachedReader({ label }: { label: string }) {
  const { data, loading } = useCachedFetch(DEMO_KEY, fetchDemoSummary, {
    staleMs: DEMO_STALE_MS,
  });
  return (
    <Card>
      <p className="text-sm text-fg-muted">{label}</p>
      <p className="mt-1 font-medium">
        {data ? `Lần gọi API #${data.call} lúc ${data.at}` : "Đang tải…"}
      </p>
      {loading && data && (
        <p className="text-xs text-fg-muted">Đang làm mới ngầm…</p>
      )}
    </Card>
  );
}

function CachedFetchDemo() {
  const [readers, setReaders] = useState([1, 2]);
  const { refresh } = useCachedFetch(DEMO_KEY, fetchDemoSummary, {
    staleMs: DEMO_STALE_MS,
  });
  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-3">
        {readers.map((reader) => (
          <CachedReader key={reader} label={`Thẻ ${reader}`} />
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant="secondary"
          onClick={() => setReaders((ids) => [...ids, ids.length + 1])}
        >
          Thêm thẻ (không gọi API)
        </Button>
        <Button size="sm" onClick={() => refresh()}>
          Làm mới
        </Button>
      </div>
    </div>
  );
}

export function DataGroup(_: GroupProps) {
  const toast = useToast();
  const [page, setPage] = useState(3);
  const [step, setStep] = useState(1);
  return (
    <>
      <Section title="Hiển thị dữ liệu" id="s-display">
        <Anchor id="c-metric" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Metric label="Tổng thu" value="12.400.000 ₫" />
          <Metric label="Đã chi" value="8.150.000 ₫" />
          <Metric label="Còn lại" value="4.250.000 ₫" />
        </div>

        <Anchor id="c-badge" />
        <div className="flex flex-wrap items-center gap-2">
          <Badge>Mặc định</Badge>
          <Badge tone="primary">Mới</Badge>
          <Badge tone="success" dot>
            Đang chạy
          </Badge>
          <Badge tone="warning">Chờ duyệt</Badge>
          <Badge tone="danger">Lỗi</Badge>
        </div>

        <Anchor id="c-avatar" />
        <div className="flex items-center gap-3">
          <Avatar name="Nguyễn Văn A" size="sm" />
          <Avatar name="Trần Thị Bích" />
          <Avatar name="Lê Hoàng" size="lg" />
        </div>
      </Section>
      <Section title="Image list, Masonry, Timeline" id="s-images">
        <Card className="space-y-5">
          <Anchor id="c-imagelist" />
          <ImageList
            items={PHOTOS}
            cols={3}
            onSelect={(item) => toast.info(item.title ?? "")}
          />
          <Anchor id="c-masonry" />
          <ImageList items={PHOTOS} variant="masonry" cols={3} />
          <Anchor id="c-timeline" />
          <Timeline
            items={[
              {
                id: "1",
                title: "Tạo cuộc chia",
                time: "08:00",
                description: "An tạo “Đi Đà Lạt”",
              },
              { id: "2", title: "Thêm 4 thành viên", time: "08:05" },
              {
                id: "3",
                title: "Ghi khoản 1.250.000 ₫",
                time: "12:30",
                description: "Ăn trưa ở chợ",
              },
              {
                id: "4",
                title: "Đang chờ thanh toán",
                time: "Bây giờ",
                active: true,
              },
            ]}
          />
        </Card>
      </Section>
      <Section title="Stepper" id="s-stepper">
        <Card className="space-y-6">
          <Stepper steps={STEPS} current={step} onStepClick={setStep} />
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
          <Stepper
            steps={STEPS}
            current={step}
            orientation="vertical"
            onStepClick={setStep}
          />
        </Card>
      </Section>
      <Section title="Bảng và phân trang" id="s-table">
        <Anchor id="c-table" />
        <Table
          columns={[
            {
              key: "name",
              header: "Cuộc chia",
              cell: (row) => row.name,
              sortValue: (row) => row.name,
            },
            {
              key: "status",
              header: "Trạng thái",
              hideOnMobile: true,
              sortValue: (row) => row.status,
              cell: (row) => (
                <Badge tone={row.status === "Xong" ? "success" : "primary"}>
                  {row.status}
                </Badge>
              ),
            },
            {
              key: "amount",
              header: "Số tiền",
              numeric: true,
              sortValue: (row) => row.amount,
              cell: (row) => formatMoney(row.amount),
            },
          ]}
          rows={ROWS}
          rowKey={(row) => row.id}
          onRowClick={(row) => toast.info(row.name)}
        />
        <Anchor id="c-pagination" />
        <Pagination page={page} pageCount={12} onChange={setPage} />
      </Section>
      <Section title="Tải dữ liệu có cache" id="s-cached-fetch">
        <Anchor id="c-cached-fetch" />
        <CachedFetchDemo />
      </Section>
      <Section title="Trạng thái" id="s-states">
        <Anchor id="c-skeleton" />
        <Card padded={false} className="divide-y divide-border px-4">
          <SkeletonListRow avatar />
          <SkeletonListRow avatar />
        </Card>
        <Anchor id="c-loading" />
        <LoadingState />
        <Anchor id="c-page-loading" />
        <PageLoadingDemo />
        <Anchor id="c-empty" />
        <EmptyState
          title="Chưa có gì ở đây"
          description="Tạo mục đầu tiên để bắt đầu."
          icon={<Inbox size={28} />}
          action={<Button size="sm">Tạo mới</Button>}
        />
      </Section>
    </>
  );
}
