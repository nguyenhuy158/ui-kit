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

const browser = await chromium.launch({ executablePath: findChromium() });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
const pageErrors = [];
page.on("pageerror", (error) => pageErrors.push(error.message));

try {
  await page.goto(BASE + "/");
  await page.getByText("UI Kit", { exact: true }).waitFor(WAIT);
  await page.getByRole("heading", { name: "Button" }).waitFor(WAIT);
  ok("gallery renders header and sections");

  await checkDismiss("Menu", page.locator("header button[aria-expanded]"), page.getByRole("menu"));
  await checkDismiss(
    "DatePicker",
    page.locator('button[aria-haspopup="dialog"]').first(),
    page.getByRole("dialog", { name: "Chọn ngày" }),
  );

  const html = page.locator("html");
  const before = await html.getAttribute("class");
  await page.getByRole("button", { name: /^Giao diện:/ }).click();
  if ((await html.getAttribute("class")) === before) {
    // Che do "theo he thong" co the trung class cu; bam them mot lan.
    await page.getByRole("button", { name: /^Giao diện:/ }).click();
  }
  if ((await html.getAttribute("class")) === before) throw new Error("ThemeToggle khong doi class <html>");
  ok("ThemeToggle switches the <html> theme class");

  if (pageErrors.length > 0) throw new Error(`loi JS tren trang: ${pageErrors.join(" | ")}`);
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
