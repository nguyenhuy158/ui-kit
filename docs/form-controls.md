# Form controls

## Custom select

Use `Listbox` for a dropdown drawn with the kit style. Use the existing `Combobox`
when users need to search. `Select` in `Input.tsx` remains the native browser select
for compatibility.

```tsx
<Field label="Dự án" required>
  <Listbox name="project" value={project} onChange={setProject} options={[
    { value: "fn", label: "FarmNet" },
    { value: "paused", label: "Tạm khóa", disabled: true },
    { value: "fl", label: "FarmLink" },
  ]} />
</Field>
```

Values must be unique nonempty strings. Arrow keys, Home/End and Enter/Space
navigate/select; Escape and Tab close. Disabled options are skipped. The trigger
retains focus and announces the active option. A hidden native select supplies
`FormData` and required validation; the visible popup is custom. Reset controlled
values in the parent when resetting a form.

Copy `Listbox.tsx`, `cn.ts`, `use-dismiss.ts`, and the token stylesheet.

## Date range

```tsx
const [range, setRange] = useState<DateRange>();
<Field label="Khoảng thực hiện">
  <DateRangePicker value={range} onChange={setRange}
    min="2026-11-01" max="2026-12-31" />
</Field>
```

Exported from `DatePicker.tsx`. `DateRange` is `{ start: string, end: string }`,
using valid `YYYY-MM-DD` local dates. First click starts a preview; second click
commits a complete, ordered pair. Same-day ranges are allowed. Escape or outside
click discards the incomplete selection. Keep range values in parent state and
include them explicitly in the submitted payload. This control does not render
named form inputs or implement required validation.

Arrow keys move one day/week, Home/End move within the week, PageUp/PageDown move
between months. Enter/Space selects. Min/max include their boundary day and also
restrict the Today action. Single-date `DatePicker` uses the same calendar.

Copy `DatePicker.tsx`, `cn.ts`, `use-dismiss.ts`, and tokens. Mobile uses a centered
popup that stays within the viewport; long calendar content scrolls inside it.

## Growing textarea

```tsx
<Textarea autoSize value={notes} onChange={(event) => setNotes(event.target.value)} />
```

`autoSize` is opt-in, so existing textareas keep their behavior. It grows for
initial text, typing, paste, controlled value updates and width changes; it shrinks
when content is removed. `rows` and CSS `min-height` remain the minimum size.
Do not set a fixed/max height on an autosized textarea. The page or editor pane
still scrolls when the complete content is taller than the viewport.

`Input.tsx` now also needs `src/dom/textarea.mjs` and `textarea.d.mts` at the same
relative path. Native-module apps can copy just `textarea.mjs`:

```js
import { autosizeTextarea } from './textarea.mjs';
const controller = autosizeTextarea(document.querySelector('textarea'));
controller.resize();
controller.destroy();
```

Call `resize()` after programmatically replacing `.value` and when revealing a
previously hidden element. Call `destroy()` before removing the element to release
its input listener and ResizeObserver. No provider/network calls are involved.

## Demo and verification

Run `pnpm dev --port 5179`, open `/picker-demo.html` (fixture data), and run
`python3 e2e/pickers.py` with shared Chrome CDP on port 9223. `E2E_BASE_URL` and
`E2E_ARTIFACTS` override the page and screenshot directory. The check covers form
validation, keyboard/disabled options, ranges across months, reversed/same-day
ranges, cancellation, leap day, bounds, textarea growth/shrink and mobile layouts.
