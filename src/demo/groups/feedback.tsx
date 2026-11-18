import { AlertTriangle, Info } from "lucide-react";
import { useState } from "react";
import { Alert } from "../../ui/Alert";
import { Backdrop } from "../../ui/Backdrop";
import { Button } from "../../ui/Button";
import { Card, CardHeader } from "../../ui/Card";
import { useConfirm, usePrompt } from "../../ui/ConfirmProvider";
import { Field } from "../../ui/Field";
import { Input } from "../../ui/Input";
import { Modal } from "../../ui/Modal";
import { Progress } from "../../ui/Progress";
import { Sheet } from "../../ui/Sheet";
import { useToast } from "../../ui/Toast";
import { Anchor, Section } from "../section";
import type { GroupProps } from "./types";

export function FeedbackGroup({ onAskConfirm }: GroupProps) {
  const toast = useToast();
  const confirm = useConfirm();
  const prompt = usePrompt();
  const [modal, setModal] = useState(false);
  const [sheet, setSheet] = useState(false);
  const [backdrop, setBackdrop] = useState(false);
  return (
    <>
      <Section title="Alert và tiến độ" id="s-alert">
        <Anchor id="c-alert" />
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
          <Anchor id="c-progress" />
          <Progress value={92} label="Dung lượng" showValue tone="warning" />
          <Progress value={38} label="Tiến độ chia tiền" showValue />
        </Card>
      </Section>
      <Section title="Lớp phủ và thông báo" id="s-overlays">
        <Card>
          <CardHeader
            title="Thử các lớp phủ"
            description="Esc để đóng, Tab bị giữ bên trong"
          />
          <div className="mt-3 flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => setModal(true)}>
              Modal
            </Button>
            <Button variant="outline" onClick={() => setSheet(true)}>
              Bottom sheet
            </Button>
            <Button variant="outline" onClick={() => onAskConfirm()}>
              Xác nhận xoá
            </Button>
            <Button
              variant="outline"
              onClick={async () => {
                const yes = await confirm({
                  title: "Xoá khoản chi?",
                  description: "Gọi bằng await, thay cho window.confirm.",
                  confirmLabel: "Xoá",
                  destructive: true,
                });
                toast.info(yes ? "Đã đồng ý" : "Đã huỷ");
              }}
            >
              useConfirm
            </Button>
            <Button
              variant="outline"
              onClick={async () => {
                const name = await prompt({
                  title: "Đổi tên cuộc chơi",
                  defaultValue: "Cầu lông thứ Bảy",
                });
                toast.info(name === null ? "Đã huỷ" : `Tên: ${name}`);
              }}
            >
              usePrompt
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setBackdrop(true);
                setTimeout(() => setBackdrop(false), 2000);
              }}
            >
              Backdrop 2 giây
            </Button>
          </div>
        </Card>
      </Section>
      <Section title="Snackbar (Toast)" id="s-toast">
        <Card>
          <CardHeader
            title="Thông báo nổi"
            description="Tự tắt sau 4 giây, bấm vào để tắt ngay"
          />
          <div className="mt-3 flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={() => toast.info("Đã sao chép liên kết")}
            >
              Info
            </Button>
            <Button variant="outline" onClick={() => toast.success("Đã lưu")}>
              Success
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                toast.warning("Sắp hết dung lượng", {
                  description: "Còn 5% bộ nhớ",
                })
              }
            >
              Warning
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                toast.error("Lưu thất bại", {
                  description: "Mất kết nối máy chủ",
                })
              }
            >
              Error
            </Button>
            <Button
              variant="ghost"
              onClick={() =>
                toast.info("Giữ lâu hơn", {
                  description: "duration: 10000",
                  duration: 10000,
                })
              }
            >
              Tuỳ thời gian
            </Button>
          </div>
        </Card>
      </Section>

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
    </>
  );
}
