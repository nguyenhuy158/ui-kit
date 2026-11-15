// Smoke gallery: mo trang da build, kiem trang render va popover (Menu,
// DatePicker) dong khi bam Esc / bam ra ngoai. Chi doc, khong co backend.
// Dung `pnpm e2e` de tu build + bat `vite preview`; hoac `pnpm e2e:smoke`
// khi da co server chay san.
//
// Bien moi truong:
// - E2E_BASE_URL: mac dinh http://127.0.0.1:4173
// - PLAYWRIGHT_CHROMIUM_PATH: xem findChromium() trong @huyab/e2e
import { findChromium } from "@huyab/e2e";
import { chromium } from "playwright-core";

const BASE = process.env.E2E_BASE_URL || "http://127.0.0.1:4173";
const WAIT = { timeout: 15000 };

let passed = 0;
let failed = 0;

function ok(name) {
  passed += 1;
  console.log(`PASS ${name}`);
}

/** Mo popover bang `trigger`, roi dong bang Esc va bang bam ra ngoai. */
async function checkDismiss(name, trigger, popover) {
  await trigger.click();
  await popover.waitFor({ state: "visible", ...WAIT });
  await page.keyboard.press("Escape");
  await popover.waitFor({ state: "hidden", ...WAIT });

  await trigger.click();
  await popover.waitFor({ state: "visible", ...WAIT });
  await page.mouse.click(1, page.viewportSize().height - 1);
  await popover.waitFor({ state: "hidden", ...WAIT });
  ok(`${name} closes on Escape and outside click`);
}

const MENU_BUTTON = "Mở menu nhóm";

async function openMenu() {
  await page.getByRole("button", { name: MENU_BUTTON }).click();
  return page.getByRole("navigation", { name: "Nhóm component" });
}

/** Mo drawer, bung tung cap theo `path`, bam la cuoi cung. */
async function goTo(...path) {
  const nav = await openMenu();
  for (const [index, label] of path.entries()) {
    await nav.getByRole("button", { name: label, exact: true }).click();
    if (index === path.length - 1) break;
  }
  await page
    .getByRole("dialog", { name: "Nhóm component" })
    .waitFor({ state: "hidden", ...WAIT });
}

const browser = await chromium.launch({ executablePath: findChromium() });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
const pageErrors = [];
page.on("pageerror", (error) => pageErrors.push(error.message));

try {
  await page.goto(`${BASE}/`);
  await page.getByText("UI Kit", { exact: true }).waitFor(WAIT);
  await page.getByRole("heading", { name: "Button" }).waitFor(WAIT);
  ok("gallery renders header and sections");

  const nav = await openMenu();
  if (
    (await nav.getByRole("button", { name: "Tabs", exact: true }).count()) > 0
  ) {
    throw new Error("menu khong gap san: thay muc con khi chua bung nhom");
  }
  await nav.getByRole("button", { name: "Điều hướng", exact: true }).click();
  await nav
    .getByRole("button", { name: "Tabs", exact: true })
    .waitFor({ state: "visible", ...WAIT });
  await nav.getByRole("button", { name: "Tabs", exact: true }).click();
  await page.getByRole("heading", { name: "Tabs" }).waitFor(WAIT);
  ok("drawer menu starts folded and opens a section");

  await goTo("Form", "Trường nhập liệu", "Select");
  await page
    .getByText("Select gốc", { exact: false })
    .waitFor({ state: "visible", ...WAIT });
  const selectTop = await page
    .getByText("Select gốc", { exact: false })
    .evaluate((el) => el.getBoundingClientRect().top);
  if (selectTop < 0 || selectTop > 400)
    throw new Error(`khong cuon toi Select (top=${selectTop})`);
  if (!page.url().endsWith("#form/c-select"))
    throw new Error(`hash sai: ${page.url()}`);
  ok("3-level menu scrolls to the component and sets the hash");

  await checkDismiss(
    "Group drawer",
    page.getByRole("button", { name: MENU_BUTTON }),
    page.getByRole("dialog", { name: "Nhóm component" }),
  );

  await checkDismiss(
    "Menu",
    page.locator("header button[aria-expanded]"),
    page.getByRole("menu"),
  );
  await goTo("Điều hướng", "Accordion và tooltip", "Popover");
  await checkDismiss(
    "Popover",
    page.getByRole("button", { name: "Popover", exact: true }),
    page.getByRole("dialog"),
  );
  await goTo("Form", "Ngày, Combobox, tải tệp", "DatePicker");
  await checkDismiss(
    "DatePicker",
    page.locator('main button[aria-haspopup="dialog"]').first(),
    page.getByRole("dialog", { name: "Chọn ngày" }),
  );

  await goTo("Tương tác", "Lightbox, Swipe, Celebrate", "Lightbox");
  await page.getByRole("button", { name: "Mở ảnh toàn màn hình" }).click();
  const lightbox = page
    .getByRole("dialog")
    .filter({ has: page.getByRole("button", { name: "Ảnh sau" }) });
  await lightbox.waitFor({ state: "visible", ...WAIT });
  await page.keyboard.press("ArrowRight");
  await lightbox.getByText(/^2\//).waitFor(WAIT);
  await page.keyboard.press("Escape");
  await lightbox.waitFor({ state: "hidden", ...WAIT });
  ok("Lightbox navigates with arrows and closes on Escape");

  await page.getByRole("button", { name: "Bắn pháo giấy" }).click();
  const pieces = await page.locator("[data-celebrate-piece]").count();
  if (pieces < 10) throw new Error(`Celebrate render ${pieces} manh`);
  ok("Celebrate renders the confetti burst");

  const html = page.locator("html");
  const before = await html.getAttribute("class");
  await page.getByRole("button", { name: /^Giao diện:/ }).click();
  if ((await html.getAttribute("class")) === before) {
    // Che do "theo he thong" co the trung class cu; bam them mot lan.
    await page.getByRole("button", { name: /^Giao diện:/ }).click();
  }
  if ((await html.getAttribute("class")) === before)
    throw new Error("ThemeToggle khong doi class <html>");
  ok("ThemeToggle switches the <html> theme class");

  const touchActions = await page.evaluate(() => {
    const style = document.createElement("style");
    style.textContent =
      "@layer utilities { .e2e-touch-none { touch-action: none; } }";
    document.head.append(style);
    const plain = document.createElement("button");
    const withUtility = document.createElement("button");
    withUtility.className = "e2e-touch-none";
    document.body.append(plain, withUtility);
    const result = [
      getComputedStyle(plain).touchAction,
      getComputedStyle(withUtility).touchAction,
    ];
    plain.remove();
    withUtility.remove();
    style.remove();
    return result;
  });
  if (touchActions[0] !== "manipulation" || touchActions[1] !== "none")
    throw new Error(`touch-action sai: ${touchActions.join(", ")}`);
  ok("button keeps touch-action manipulation and a utility class overrides it");

  if (pageErrors.length > 0)
    throw new Error(`loi JS tren trang: ${pageErrors.join(" | ")}`);
  ok("no uncaught page errors");
} catch (error) {
  failed += 1;
  console.log("FAIL:", error.message);
  await page.screenshot({ path: "e2e-failure.png" }).catch(() => {});
} finally {
  await browser.close();
}

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
