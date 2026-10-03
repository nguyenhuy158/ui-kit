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
    theme.tsx         #   ThemeProvider/ThemeToggle: toggles `.dark` on <html>
    index.ts          #   Barrel export for the gallery; do not copy it to apps
  demo/Gallery.tsx    # Gallery page showing every component
  main.tsx            # Entry: imports tokens.css, wraps Gallery in providers
e2e/                  # Playwright smoke over the built gallery
  run.mjs             #   `pnpm e2e`: build -> vite preview -> smoke -> stop
  gallery-smoke.mjs   #   Render + popover dismiss + theme toggle (`pnpm e2e:smoke`)
  chromium.mjs        #   Finds Chromium (env, Playwright cache, system Chrome)
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
  `warning(-soft)`, `danger(-soft)`, `ring`, `radius`.
- Consumers copy the file and may change only the values (brand hue). Adding,
  renaming, or removing a token name happens here first, then gets synced to
  the apps. Components use semantic classes only (`bg-primary`,
  `text-fg-muted`), never palette classes like `violet-600`.

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
deploy target (so no `e2e:prod`); the gallery is the visual check.

## Coding Style & Naming Conventions

TypeScript with strict settings (`noUnusedLocals`, `verbatimModuleSyntax`), so
use `import type` for types. Two-space indentation, double quotes, trailing
commas. Components are PascalCase files with named exports. Each component
file depends only on `cn.ts` and the tokens (plus `use-overlay.ts` for
overlays, `use-dismiss.ts` for popovers) so it can be copied alone. Keep inputs at 16px on mobile (iOS zoom),
touch targets at least 44px, and dates as `"YYYY-MM-DD"` strings; see
"Vài quy ước cố ý" in `README.md` before changing those.

## Testing Guidelines

No unit tests. `pnpm e2e` (also a CI job) smoke-tests the built gallery:
it renders, Menu/DatePicker close on Escape and outside click, ThemeToggle
switches the `<html>` class, and no uncaught page errors. Still verify
changes in the gallery (`pnpm dev`) in both light and dark mode, at a mobile
width and at desktop width, and keep `pnpm check`, `pnpm build` and
`pnpm e2e` green. A failed run saves `e2e-failure.png`.

## Commit & Pull Request Guidelines

Conventional Commits with an emoji and scope, for example
`✨ feat(ui): add Combobox` or `🐛 fix(overlay): restore focus on close`.
Describe what changed and attach a gallery screenshot for visual changes.

## Agent-Specific Instructions

Keep responses short and focused. If a requirement is unclear, ask before making
assumptions.
Design UI/UX to fit inside a single viewport by default. Avoid page-level
scrolling; use compact layouts, tabs, panes, or contained internal lists when
content can overflow.
When changing `tokens.css`, keep the token names stable and update this file,
`README.md`, and every component that relies on a renamed token.
