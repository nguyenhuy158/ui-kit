// Chay E2E mot lenh: build gallery -> bat `vite preview` -> chay smoke -> tat
// server. ui-kit khong co deploy nen chi co ban dev (khong co e2e:prod).
//
// Bien moi truong:
// - E2E_PORT: cong cho vite preview (mac dinh 4173)
// - E2E_SKIP_BUILD=1: bo qua `pnpm build` (dung khi ./dist da moi)
// - PLAYWRIGHT_CHROMIUM_PATH: chi dinh Chromium cu the
import { spawn } from "node:child_process";

const PORT = process.env.E2E_PORT || "4173";
const BASE = `http://127.0.0.1:${PORT}`;
const SERVER_TIMEOUT_MS = 60_000;
const POLL_INTERVAL_MS = 500;
const STOP_GRACE_MS = 5000;

/** Chay mot lenh den khi ket thuc; loi thi nem. */
function run(command, args, label) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: "inherit", env: { ...process.env, E2E_BASE_URL: BASE } });
    child.on("error", reject);
    child.on("exit", (code) =>
      code === 0 ? resolve() : reject(new Error(`${label} that bai (exit ${code})`)),
    );
  });
}

/** Doi tan server tra loi trang chu, hoac nem khi qua han. */
async function waitForServer(child) {
  const deadline = Date.now() + SERVER_TIMEOUT_MS;
  while (Date.now() < deadline) {
    if (child.exitCode !== null) throw new Error(`vite preview tat som (exit ${child.exitCode})`);
    try {
      const response = await fetch(BASE + "/");
      if (response.ok) return;
    } catch {
      // Server chua san sang, thu lai.
    }
    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
  }
  throw new Error(`vite preview khong len sau ${SERVER_TIMEOUT_MS}ms`);
}

if (process.env.E2E_SKIP_BUILD !== "1") {
  await run("pnpm", ["build"], "build");
}

// `detached` cho server mot process group rieng: `pnpm exec` sinh them tang
// node con, kill rieng PID cha se bo mo coi server giu cong.
const server = spawn(
  "pnpm",
  ["exec", "vite", "preview", "--host", "127.0.0.1", "--port", PORT, "--strictPort"],
  { stdio: ["ignore", "inherit", "inherit"], detached: true },
);

/** Gui signal toi ca process group cua server (bo qua neu da tat). */
function killServer(signal) {
  try {
    process.kill(-server.pid, signal);
  } catch {
    // Group da tat.
  }
}

// Group tach rieng nen Ctrl-C khong toi server: tu don truoc khi thoat.
process.once("SIGINT", () => {
  killServer("SIGKILL");
  process.exit(130);
});

let failed = false;
try {
  await waitForServer(server);
  console.log(`\nServer san sang tai ${BASE}, bat dau smoke suite\n`);
  await run("node", ["e2e/gallery-smoke.mjs"], "smoke suite");
} catch (error) {
  failed = true;
  console.error("E2E FAIL:", error.message);
} finally {
  const exited = new Promise((resolve) => server.once("exit", () => resolve(true)));
  killServer("SIGTERM");
  await Promise.race([exited, new Promise((resolve) => setTimeout(resolve, STOP_GRACE_MS))]);
  killServer("SIGKILL");
}

process.exit(failed ? 1 : 0);
