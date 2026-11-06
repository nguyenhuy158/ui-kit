import { useState } from "react";
import { createRoot } from "react-dom/client";
import "../styles/tokens.css";
import { Button } from "../ui/Button";
import { DatePicker, type DateRange, DateRangePicker } from "../ui/DatePicker";
import { Field } from "../ui/Field";
import { Textarea } from "../ui/Input";
import { Listbox } from "../ui/Listbox";

function Pickers() {
  const [project, setProject] = useState("");
  const [range, setRange] = useState<DateRange>({
    start: "2026-11-06",
    end: "2026-11-15",
  });
  const [day, setDay] = useState("2028-02-28");
  const [notes, setNotes] = useState(
    "Kiểm tra đồng bộ contact giữa các hệ thống.\nKhông tạo trùng khi nhận lại cùng sự kiện.",
  );
  const [result, setResult] = useState("");
  return (
    <main className="mx-auto max-w-2xl space-y-5 p-4 sm:p-6">
      <header className="flex items-center justify-between gap-3">
        <a className="text-primary underline" href="./">
          ← Gallery
        </a>
        <Button
          variant="outline"
          onClick={() => document.documentElement.classList.toggle("dark")}
        >
          Sáng / tối
        </Button>
      </header>
      <h1 className="text-2xl font-semibold">Chọn ngày và danh sách</h1>
      <p className="text-fg-muted">
        Demo với dữ liệu mẫu. Listbox là dropdown tùy chỉnh; DateRangePicker
        chọn hai mốc trong cùng lịch.
      </p>
      <form
        className="space-y-5 rounded-ui border border-border bg-surface p-4"
        onSubmit={(event) => {
          event.preventDefault();
          setResult(
            JSON.stringify({
              ...Object.fromEntries(new FormData(event.currentTarget)),
              ...range,
            }),
          );
        }}
      >
        <Field
          label="Dự án"
          required
          hint="Mũi tên để di chuyển, Enter để chọn; mục tạm khóa không chọn được."
        >
          <Listbox
            name="project"
            value={project}
            onChange={setProject}
            options={[
              {
                value: "fn",
                label: "FarmNet",
                description: "Quản lý vận hành",
              },
              { value: "locked", label: "Tạm khóa", disabled: true },
              {
                value: "fl",
                label: "FarmLink",
                description: "Đồng bộ nghiệp vụ",
              },
              ...Array.from({ length: 16 }, (_, index) => ({
                value: `demo-${index}`,
                label: `Dự án mẫu ${index + 1}`,
              })),
            ]}
          />
        </Field>
        <Field
          label="Khoảng thực hiện"
          hint="Từ 01/11/2026 đến 31/12/2026. Chỉ lưu sau khi chọn đủ hai mốc."
        >
          <DateRangePicker
            value={range}
            onChange={setRange}
            min="2026-11-01"
            max="2026-12-31"
          />
        </Field>
        <Field
          label="Một ngày"
          hint="Lịch cũ vẫn hoạt động; có ngày 29/02/2028."
        >
          <DatePicker
            value={day}
            onChange={setDay}
            min="2028-02-01"
            max="2028-03-31"
          />
        </Field>
        <Field label="Không thể sửa">
          <Listbox
            disabled
            value="fixed"
            onChange={() => {}}
            options={[{ value: "fixed", label: "Đã khóa" }]}
          />
        </Field>
        <Field
          label="Checklist tự giãn"
          hint="Gõ hoặc dán nhiều dòng; ô tự dài ra và co lại khi xóa."
        >
          <Textarea
            autoSize
            name="notes"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
          />
        </Field>
        <Button
          type="button"
          variant="outline"
          onClick={() => setNotes("Một dòng ngắn")}
        >
          Rút gọn nội dung
        </Button>
        <Button type="submit">Lưu lựa chọn</Button>
        <output
          className="block break-all text-sm text-fg-muted"
          aria-live="polite"
        >
          {result || "Chưa gửi form"}
        </output>
      </form>
      <p className="text-sm text-fg-muted" id="range-value">
        {range.start} → {range.end}
      </p>
    </main>
  );
}

const root = document.getElementById("root");
if (root) createRoot(root).render(<Pickers />);
