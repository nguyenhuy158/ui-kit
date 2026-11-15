export type MenuItem = { id: string; label: string };

export type MenuSection = MenuItem & { items?: MenuItem[] };

export type MenuGroup = MenuItem & { sections: MenuSection[] };

export type Route = { group: string; anchor?: string };

export const MENU: MenuGroup[] = [
  {
    id: "basics",
    label: "Cơ bản",
    sections: [
      { id: "s-button", label: "Button" },
      { id: "s-layout", label: "Layout" },
      { id: "s-font", label: "Font chữ" },
      { id: "s-icon", label: "Icon" },
    ],
  },
  {
    id: "form",
    label: "Form",
    sections: [
      {
        id: "s-form",
        label: "Trường nhập liệu",
        items: [
          { id: "c-input", label: "Input" },
          { id: "c-listbox", label: "Listbox" },
          { id: "c-select", label: "Select" },
          { id: "c-textarea", label: "Textarea" },
          { id: "c-checkbox", label: "Checkbox" },
          { id: "c-radio", label: "RadioGroup" },
          { id: "c-switch", label: "Switch" },
        ],
      },
      {
        id: "s-pickers",
        label: "Ngày, Combobox, tải tệp",
        items: [
          { id: "c-datepicker", label: "DatePicker" },
          { id: "c-combobox", label: "Combobox" },
          { id: "c-fileupload", label: "FileUpload" },
        ],
      },
      {
        id: "s-slider",
        label: "Slider, Chip, Transfer",
        items: [
          { id: "c-slider", label: "Slider" },
          { id: "c-chip-filter", label: "Chip lọc" },
          { id: "c-chip-tag", label: "Chip tag" },
          { id: "c-transfer", label: "TransferList" },
        ],
      },
    ],
  },
  {
    id: "data",
    label: "Dữ liệu",
    sections: [
      {
        id: "s-display",
        label: "Hiển thị dữ liệu",
        items: [
          { id: "c-metric", label: "Metric" },
          { id: "c-badge", label: "Badge" },
          { id: "c-avatar", label: "Avatar" },
        ],
      },
      {
        id: "s-table",
        label: "Bảng và phân trang",
        items: [
          { id: "c-table", label: "Table" },
          { id: "c-pagination", label: "Pagination" },
        ],
      },
      {
        id: "s-images",
        label: "Image list, Timeline",
        items: [
          { id: "c-imagelist", label: "ImageList" },
          { id: "c-masonry", label: "Masonry" },
          { id: "c-timeline", label: "Timeline" },
        ],
      },
      { id: "s-stepper", label: "Stepper" },
      {
        id: "s-states",
        label: "Trạng thái",
        items: [
          { id: "c-skeleton", label: "Skeleton" },
          { id: "c-loading", label: "LoadingState" },
          { id: "c-empty", label: "EmptyState" },
        ],
      },
    ],
  },
  {
    id: "nav",
    label: "Điều hướng",
    sections: [
      {
        id: "s-navigation",
        label: "Navigation",
        items: [
          { id: "c-breadcrumbs", label: "Breadcrumbs" },
          { id: "c-link", label: "Link" },
          { id: "c-drawer", label: "Drawer" },
          { id: "c-speeddial", label: "SpeedDial" },
        ],
      },
      { id: "s-tabs", label: "Tabs" },
      {
        id: "s-accordion",
        label: "Accordion và tooltip",
        items: [
          { id: "c-accordion", label: "Accordion" },
          { id: "c-tooltip", label: "Tooltip" },
          { id: "c-popover", label: "Popover" },
        ],
      },
    ],
  },
  {
    id: "feedback",
    label: "Phản hồi",
    sections: [
      {
        id: "s-alert",
        label: "Alert và tiến độ",
        items: [
          { id: "c-alert", label: "Alert" },
          { id: "c-progress", label: "Progress" },
        ],
      },
      { id: "s-overlays", label: "Lớp phủ" },
      { id: "s-toast", label: "Snackbar (Toast)" },
    ],
  },
  {
    id: "interact",
    label: "Tương tác",
    sections: [
      {
        id: "s-gestures",
        label: "Lightbox, Swipe, Celebrate",
        items: [
          { id: "c-lightbox", label: "Lightbox" },
          { id: "c-swipe", label: "SwipeAction" },
          { id: "c-celebrate", label: "Celebrate" },
        ],
      },
    ],
  },
];

export const DEFAULT_GROUP = MENU[0].id;

export const SECTION_GROUP: Record<string, string> = Object.fromEntries(
  MENU.flatMap((group) =>
    group.sections.map((section) => [section.id, group.id]),
  ),
);

export function parseRoute(hash: string): Route {
  const [group, anchor] = hash.replace(/^#/, "").split("/");
  return MENU.some((item) => item.id === group)
    ? { group, anchor: anchor || undefined }
    : { group: DEFAULT_GROUP };
}

export function routeHash(route: Route): string {
  return route.anchor ? `${route.group}/${route.anchor}` : route.group;
}
