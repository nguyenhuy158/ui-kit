// Quet axe-core tren tung nhom gallery, ca sang va toi, desktop va mobile.
// Fail khi co vi pham muc serious/critical (WCAG 2.2 AA).
// Bien moi truong giong gallery-smoke.mjs.
import { createRequire } from "node:module";
import { findChromium } from "@huyab/e2e";
import { chromium } from "playwright-core";

const BASE = process.env.E2E_BASE_URL || "http://127.0.0.1:4173";
const AXE_PATH = createRequire(import.meta.url).resolve("axe-core/axe.min.js");
const GROUPS = ["basics", "form", "data", "nav", "feedback", "interact"];
const THEMES = ["light", "dark"];
const VIEWPORTS = {
  desktop: { width: 1280, height: 800 },
  mobile: { width: 390, height: 844 },
};
const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];
const BLOCKING_IMPACTS = new Set(["serious", "critical"]);
const THEME_STORAGE_KEY = "ui-theme";

const browser = await chromium.launch({ executablePath: findChromium() });
const failures = [];
try {
  for (const [viewportName, viewport] of Object.entries(VIEWPORTS)) {
    for (const theme of THEMES) {
      const context = await browser.newContext({ viewport });
      await context.addInitScript(
        ([key, value]) => localStorage.setItem(key, value),
        [THEME_STORAGE_KEY, theme],
      );
      const page = await context.newPage();
      for (const group of GROUPS) {
        await page.goto(`${BASE}/#${group}`);
        await page.reload();
        await page.getByText("UI Kit", { exact: true }).waitFor();
        await page.addScriptTag({ path: AXE_PATH });
        const violations = await page.evaluate(
          async (tags) =>
            (
              await window.axe.run(document, {
                runOnly: { type: "tag", values: tags },
              })
            ).violations,
          WCAG_TAGS,
        );
        const blocking = violations.filter((v) =>
          BLOCKING_IMPACTS.has(v.impact),
        );
        const label = `${viewportName}/${theme}/${group}`;
        if (blocking.length === 0) {
          console.log(`PASS ${label}`);
          continue;
        }
        for (const v of blocking) {
          const targets = v.nodes
            .slice(0, 5)
            .map((n) => `${n.target.join(" ")} ${n.html.slice(0, 160)}`);
          failures.push(
            `${label} ${v.id} (${v.nodes.length}): ${targets.join(" | ")}`,
          );
        }
        console.log(`FAIL ${label}`);
      }
      await context.close();
    }
  }
} finally {
  await browser.close();
}

for (const failure of failures) console.log(failure);
console.log(`\n${failures.length} blocking violations`);
process.exit(failures.length > 0 ? 1 : 0);
