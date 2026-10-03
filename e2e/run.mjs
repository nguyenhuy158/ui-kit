// Chay E2E mot lenh: build gallery -> bat `vite preview` -> chay smoke -> tat
// server. ui-kit khong co deploy nen chi co ban dev (khong co e2e:prod).
//
// Bien moi truong:
// - E2E_PORT: cong cho vite preview (mac dinh 4173)
// - E2E_SKIP_BUILD=1: bo qua `pnpm build` (dung khi ./dist da moi)
// - PLAYWRIGHT_CHROMIUM_PATH: chi dinh Chromium cu the
import { run, startServer } from "@huyab/e2e";

const PORT = process.env.E2E_PORT || "4173";
const BASE = `http://127.0.0.1:${PORT}`;

let failed = false;
let server;
try {
  if (process.env.E2E_SKIP_BUILD !== "1") {
    await run("pnpm", ["build"], { label: "build" });
  }
  server = await startServer({
    command: "pnpm",
    args: [
      "exec",
      "vite",
      "preview",
      "--host",
      "127.0.0.1",
      "--port",
      PORT,
      "--strictPort",
    ],
    readyUrl: `${BASE}/`,
    timeoutMs: 60_000,
  });
  console.log(`\nServer san sang tai ${BASE}, bat dau smoke suite\n`);
  await run("node", ["e2e/gallery-smoke.mjs"], {
    label: "smoke suite",
    env: { E2E_BASE_URL: BASE },
  });
} catch (error) {
  failed = true;
  console.error("E2E FAIL:", error.message);
} finally {
  await server?.stop();
}

process.exit(failed ? 1 : 0);
