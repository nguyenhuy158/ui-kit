# Repository Guidelines

## Project Structure & Module Organization

`ui-kit` is a copy-paste React 19 + Tailwind v4 component kit (shadcn style),
not an npm package. Other personal projects copy the files they need and own
them afterwards. The repo itself is a Vite app that renders a gallery of every
component.

```text
src/
  styles/tokens.css   # Design-token source of truth for every personal repo
  ui/                 # One self-contained component per file (Button.tsx, Modal.tsx, ...)
    cn.ts             #   Class-name joiner, the only shared helper
    use-overlay.ts    #   Esc/scroll-lock/focus-trap shared by Modal and Sheet
    use-dismiss.ts    #   Outside-click/Esc close shared by Menu and DatePicker
    use-cached-fetch.ts #   useCachedFetch: keyed client cache, dedupe, revalidate when stale, no polling
    theme.tsx         #   ThemeProvider/ThemeToggle: toggles `.dark` on <html>
    index.ts          #   Barrel export for the gallery; do not copy it to apps
  demo/               # Gallery page showing every component
    Gallery.tsx       #   Shell: header, drawer menu, shared overlays, renders the active group
    menu.ts           #   Menu tree (group > section > component) and the URL hash route
    GroupMenu.tsx     #   Folded 3-level tree shown in the drawer
    section.tsx       #   `Section` and `Anchor` (scroll targets for the menu)
    fixtures.ts       #   Sample data shared by the demos
    groups/           #   One file per group (basics, form, data, nav, feedback, interact), each with its own state
  main.tsx            # Entry: imports tokens.css, wraps Gallery in providers
e2e/                  # Playwright smoke over the built gallery
  run.mjs             #   `pnpm e2e`: build -> vite preview -> smoke -> stop (`@huyab/e2e`)
  gallery-smoke.mjs   #   Render + popover dismiss + theme toggle (`pnpm e2e:smoke`)
hosted/loader.js      # Injects tokens.css into the Tailwind browser runtime (docs/hosted.md)
index.html            # HTML shell
README.md             # Component list, copy instructions, deliberate conventions
USAGE.md              # Per-component usage snippets (Vietnamese)
```

### Design tokens (`src/styles/tokens.css`)

This file is the single source of design tokens for all personal web repos.
Its contract:

- Raw values are CSS variables named `--ui-*` on `:root` (light) and
  overridden on `.dark` (dark mode is class-based, toggled on `<html>`, never
  `prefers-color-scheme` alone).
- `@theme inline` maps every `--ui-*` var to a Tailwind utility name
  (`--color-surface` -> `bg-surface`, `--radius-ui` -> `rounded-ui`), so
  `.dark` swaps colors without regenerating utilities.
- Token names: `bg`, `surface`, `surface-muted`, `border`, `fg`, `fg-muted`,
  `primary`, `primary-hover`, `primary-fg`, `primary-soft`, `success(-soft)`,
  `warning(-soft)`, `danger(-soft)`, `ring`, `radius`, `shadow-{sm,md,lg,xl}`
  (two-layer Fluent shadows), motion vars `--ui-ease-out`, `--ui-ease-in`,
  `--ui-dur-fast`, `--ui-dur`, `--ui-dur-gentle`, and the `.ui-acrylic` /
  `.ui-mica` material classes, and the layout vars `--ui-grid-cols` (4, 12 from
  48rem), `--ui-grid-gutter`, `--ui-grid-margin`, `--ui-container-max`,
  `--ui-space-section` with the `.ui-container` / `.ui-grid` / `.ui-col` classes.
- Consumers copy the file and may change only the values (brand hue). Adding,
  renaming, or removing a token name happens here first, then gets synced to
  the apps. Components use semantic classes only (`bg-primary`,
  `text-fg-muted`), never palette classes like `violet-600`.

## Ecosystem

See the [huyab.cfd ecosystem map](https://github.com/nguyenhuy158/kit/blob/main/docs/ECOSYSTEM.md) for how all personal repos connect.

- Kit packages: `@huyab/config` (Biome + tsconfig base), `@huyab/e2e`
  (`startServer`, `run`, `findChromium` in `e2e/`), reusable CI
  `nguyenhuy158/kit/.github/workflows/check.yml@v0.1.0`.
- Talks to: no repo at runtime. `src/styles/tokens.css` and components are
  copied into ai-english, chia-keo, notes, monitor, share, cardstat and huyabhome.
- Layout: apps with a frontend and a Worker backend use `frontend/src/` and
  `backend/src/` (kit `docs/AGENTS-SKELETON.md`, "Layout rule"), so copy
  components to `frontend/src/ui/` there. This repo has no backend and keeps `src/`.

## Build, Test, and Development Commands

- `pnpm install`: install dependencies.
- `pnpm dev`: start the gallery on `http://127.0.0.1:5173`.
- `pnpm check`: TypeScript project check (`tsc -b`).
- `pnpm lint`: Biome lint + format check (`biome check .`).
- `pnpm format`: apply Biome formatting (`biome format --write .`).
- `pnpm build`: type-check, then build the gallery with Vite.
- `pnpm preview`: preview the production build on `127.0.0.1`.
- `pnpm e2e`: build the gallery, serve it with `vite preview` on
  `127.0.0.1:4173` (`E2E_PORT`), run `e2e/gallery-smoke.mjs` in Chromium,
  then stop the server. `E2E_SKIP_BUILD=1` reuses `dist/`.
- `pnpm e2e:smoke`: run only the smoke against a running server
  (`E2E_BASE_URL`).

Use `pnpm` for all package commands. There is no unit test suite and no
`e2e:prod`; the gallery is the visual check.

## Coding Style & Naming Conventions

Check UI work against the [Front-End Checklist rules](https://frontendchecklist.io/rules)
(kit `docs/AGENTS-SKELETON.md`, "Frontend checklist rule"). Use logical
properties (`ms-`, `pe-`, `start-`, `end-`, `text-start`) unless the
direction is the meaning (Sheet side, swipe). Text on a `*-soft` background
uses the `*-strong` token; text on solid `bg-danger` uses `text-danger-fg`.

TypeScript with strict settings (`noUnusedLocals`, `verbatimModuleSyntax`), so
use `import type` for types. Two-space indentation, double quotes, trailing
commas. Components are PascalCase files with named exports. Each component
file depends only on `cn.ts` and the tokens (plus `use-overlay.ts` for
overlays, `use-dismiss.ts` for popovers) so it can be copied alone. Open the right phone keyboard: set `type` (`email`, `tel`, `url`, `search`) or `inputMode="numeric"` for whole numbers; `Input` adds the matching `inputMode`/`autoComplete`. Keep inputs at 16px on mobile (iOS zoom),
touch targets at least 44px, and dates as `"YYYY-MM-DD"` strings; see
"Vài quy ước cố ý" in `README.md` before changing those.

## Testing Guidelines

No unit tests. `pnpm e2e` (also a CI job) smoke-tests the built gallery:
it renders, Menu/DatePicker close on Escape and outside click, ThemeToggle
switches the `<html>` class, and no uncaught page errors. Then
`e2e/a11y.mjs` (`pnpm e2e:a11y` against a running server) runs axe-core
(WCAG 2.2 AA) on every gallery group in light and dark, desktop and mobile,
and fails on serious or critical violations. Still verify
changes in the gallery (`pnpm dev`) in both light and dark mode, at a mobile
width and at desktop width, and keep `pnpm check`, `pnpm build` and
`pnpm e2e` green. A failed run saves `e2e-failure.png`.

## Commit & Pull Request Guidelines

Conventional Commits with an emoji and scope, for example
`✨ feat(ui): add Combobox` or `🐛 fix(overlay): restore focus on close`.
Describe what changed and attach a gallery screenshot for visual changes.

## Deploy & CI

The gallery is served at `https://uikit.huyab.cfd` by a Cloudflare Worker with
static assets (`wrangler.jsonc`, Worker name `ui-kit`, assets from `dist/`).
Delivery rule (all repos, see `kit/docs/AGENTS-SKELETON.md`): CI runs lint and
check on every pull request, and the site is deployed only by Cloudflare Workers
Builds from `main`. Never run `wrangler deploy` from a local machine.
Workers Builds is connected (repo `nguyenhuy158/ui-kit`, branch `main`, build
`pnpm run build`, deploy `npx wrangler deploy`), so a push to `main` updates the
site. The `Pages` workflow still publishes the same build to GitHub Pages under
`/ui-kit/`.

## Agent-Specific Instructions

Keep responses short and focused. If a requirement is unclear, ask before making
assumptions.
Design every screen to fit one viewport with no scrolling at all, on phones
and on desktop: neither the page nor any pane inside it scrolls. Use `Screen`
as the page frame and `PagedList` (paging) for any list that can grow. Only
exceptions: reading-only pages (help, legal) and the inside of a Sheet or
Modal that holds a form. Apps check this in e2e with `assertFitsViewport`
from `@huyab/e2e` (kit).
No native `alert()`, `confirm()` or `prompt()` anywhere (not even `window.confirm`): use
`useConfirm()`, `usePrompt()` (`ConfirmProvider`) and Toast. `@huyab/config` lints the bare globals.
Help pages: an app builds its `/help` page with `Accordion` (items with `id`, `title`,
`content`), never a hand-rolled one. The text stays in the app as data. ui-kit has no
help component, because the content is specific to each app. Rule: kit
`docs/AGENTS-SKELETON.md` ("Help rule"); reference: `chia-keo` `HelpPage.tsx`.
Settings pages: an app builds its Settings page from `Card`, `Switch`, `Radio`, `Listbox`,
`Field`, `Input` and `ThemeToggle`, never from hand-rolled controls. ui-kit has no settings
component, because the options are specific to each app. Rule: kit
`docs/AGENTS-SKELETON.md` ("Settings rule"); reference: `notes` `SettingsScreen.tsx`.
Access control: components in `src/ui/` never decide who may do what. An app computes
what the user may do and passes it as props (`disabled`, or it does not render the
control); the server is the only real check. A disabled action says why (text or
`Tooltip`). Do not add role names or permission logic to `src/ui/`. Rule and
checklist: kit `docs/AGENTS-SKELETON.md` ("Access control rule") and
`docs/RBAC-CHECKLIST.md`.
Never commit secrets. Every machine runs huyabhome `scripts/install-tools.sh`,
which installs gitleaks and a global pre-commit hook that scans staged changes.
Do not bypass it: no `git commit --no-verify`, no change to `core.hooksPath`.
CI runs gitleaks on every push and PR, so a leak that slips through blocks the
merge.
ui-kit is the only source of UI primitives for the consumer apps listed under
Ecosystem. When an app needs a primitive that is missing here, add it here
first (generic API, Gallery demo, tests), then the app copies it; apps must
not hand-roll or fork primitives locally.
When changing `tokens.css`, keep the token names stable and update this file,
`README.md`, and every component that relies on a renamed token.
Every repo keeps a full `.gitignore` and `.dockerignore` (rule: `kit/docs/AGENTS-SKELETON.md`, "Ignore files rule").
