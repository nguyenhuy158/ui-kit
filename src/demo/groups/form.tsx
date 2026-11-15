import { Calendar, Heart, Inbox, Search, User, Wallet } from "lucide-react";
import { useState } from "react";
import { Card } from "../../ui/Card";
import { Checkbox } from "../../ui/Checkbox";
import { Chip } from "../../ui/Chip";
import { Combobox } from "../../ui/Combobox";
import { DatePicker } from "../../ui/DatePicker";
import { Field } from "../../ui/Field";
import { FileUpload } from "../../ui/FileUpload";
import { Input, Select, Textarea } from "../../ui/Input";
import { Listbox } from "../../ui/Listbox";
import { RadioGroup } from "../../ui/Radio";
import { Slider } from "../../ui/Slider";
import { Switch } from "../../ui/Switch";
import { TransferList } from "../../ui/TransferList";
import { CITIES } from "../fixtures";
import { Anchor, Section } from "../section";
import type { GroupProps } from "./types";

export function FormGroup(_: GroupProps) {
  const [checked, setChecked] = useState(true);
  const [notify, setNotify] = useState(true);
  const [plan, setPlan] = useState("free");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [city, setCity] = useState("");
  const [accountType, setAccountType] = useState("personal");
  const [volume, setVolume] = useState(60);
  const [filters, setFilters] = useState<string[]>(["food"]);
  const [tags, setTags] = useState(["Đà Lạt", "Cuối tuần", "Bạn bè"]);
  const [members, setMembers] = useState<string[]>(["an"]);
  const [files, setFiles] = useState<File[]>([]);
  const emailError =
    email.length > 0 && !email.includes("@")
      ? "Email phải có ký tự @"
      : undefined;
  return (
    <>
      <Section title="Form" id="s-form">
        <Card className="space-y-4">
          <Anchor id="c-input" />
          <Field
            label="Tên hiển thị"
            hint="Người khác sẽ thấy tên này"
            required
          >
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

          <Anchor id="c-listbox" />
          <Field label="Loại tài khoản">
            <Listbox
              value={accountType}
              onChange={setAccountType}
              options={[
                {
                  value: "personal",
                  label: "Cá nhân",
                  icon: <User size={16} />,
                  description: "Một người dùng",
                },
                {
                  value: "team",
                  label: "Nhóm",
                  icon: <Inbox size={16} />,
                  description: "Chia sẻ với thành viên",
                },
              ]}
            />
          </Field>

          <Anchor id="c-select" />
          <Field label="Select gốc (mobile dùng picker hệ điều hành)">
            <Select defaultValue="personal">
              <option value="personal">Cá nhân</option>
              <option value="team">Nhóm</option>
            </Select>
          </Field>

          <Anchor id="c-textarea" />
          <Field label="Ghi chú" hint="Không bắt buộc">
            <Textarea placeholder="Vài dòng mô tả..." />
          </Field>

          <Anchor id="c-checkbox" />
          <Checkbox
            checked={checked}
            onChange={(event) => setChecked(event.target.checked)}
            label="Đồng ý điều khoản"
            description="Bạn có thể đổi lại bất cứ lúc nào"
          />

          <Anchor id="c-radio" />
          <RadioGroup
            label="Gói dịch vụ"
            name="plan"
            value={plan}
            onChange={setPlan}
            options={[
              {
                value: "free",
                label: "Miễn phí",
                description: "3 project",
              },
              {
                value: "pro",
                label: "Pro",
                description: "Không giới hạn",
              },
            ]}
          />

          <Anchor id="c-switch" />
          <Switch
            checked={notify}
            onChange={setNotify}
            label="Nhận thông báo"
            description="Gửi qua email mỗi khi có thay đổi"
          />
        </Card>
      </Section>
      <Section
        title="Chọn ngày, Autocomplete (Combobox), tải tệp"
        id="s-pickers"
      >
        <Card className="space-y-4">
          <Anchor id="c-datepicker" />
          <Field label="Ngày đi" hint="Không cho chọn ngày trong quá khứ">
            <DatePicker value={date} onChange={setDate} min="2026-08-11" />
          </Field>

          <Anchor id="c-combobox" />
          <Field label="Thành phố" hint="Gõ không dấu vẫn tìm ra">
            <Combobox
              value={city}
              onChange={setCity}
              options={CITIES}
              placeholder="Tìm thành phố..."
            />
          </Field>

          <Anchor id="c-fileupload" />
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
      <Section title="Slider, Chip, Transfer list" id="s-slider">
        <Card className="space-y-5">
          <Anchor id="c-slider" />
          <Field label="Âm lượng">
            <Slider
              value={volume}
              onChange={setVolume}
              format={(v) => `${v}%`}
            />
          </Field>
          <div className="space-y-2">
            <Anchor id="c-chip-filter" />
            <p className="text-sm font-medium text-fg">Chip lọc</p>
            <div className="flex flex-wrap gap-2">
              {[
                {
                  id: "food",
                  label: "Ăn uống",
                  icon: <Wallet size={14} />,
                },
                {
                  id: "travel",
                  label: "Du lịch",
                  icon: <Calendar size={14} />,
                },
                {
                  id: "fav",
                  label: "Yêu thích",
                  icon: <Heart size={14} />,
                },
              ].map((chip) => (
                <Chip
                  key={chip.id}
                  icon={chip.icon}
                  selected={filters.includes(chip.id)}
                  onClick={() =>
                    setFilters((list) =>
                      list.includes(chip.id)
                        ? list.filter((id) => id !== chip.id)
                        : [...list, chip.id],
                    )
                  }
                >
                  {chip.label}
                </Chip>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Anchor id="c-chip-tag" />
            <p className="text-sm font-medium text-fg">
              Chip tag (bấm x để xoá)
            </p>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Chip
                  key={tag}
                  onRemove={() =>
                    setTags((list) => list.filter((t) => t !== tag))
                  }
                >
                  {tag}
                </Chip>
              ))}
            </div>
          </div>
          <Anchor id="c-transfer" />
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
    </>
  );
}
