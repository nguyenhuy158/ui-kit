# Hosted tokens (no copy, no build)

For a page that cannot run a build step, load the tokens at runtime with the
Tailwind v4 browser runtime. Components are not covered: they are React files
and still need to be copied.

```html
<script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4.3.2/dist/index.global.js"></script>
<script
  src="https://cdn.jsdelivr.net/gh/nguyenhuy158/ui-kit@<tag-or-sha>/hosted/loader.js"
  data-tokens="https://cdn.jsdelivr.net/gh/nguyenhuy158/ui-kit@<tag-or-sha>/src/styles/tokens.css"
></script>
```

Then use the semantic classes as usual (`bg-primary`, `text-fg-muted`,
`rounded-ui`). Dark mode is still the `.dark` class on `<html>`.

- `loader.js` fetches `data-tokens` and injects it as `<style type="text/tailwindcss">`.
  A remote `@import` does not work in the browser runtime, so the loader is needed.
- Pin `<tag-or-sha>`. jsDelivr caches a branch name such as `main` for hours.
- Any other host works if it serves the file with `Access-Control-Allow-Origin`.
- Brand colors: add a `<style>` with your `--ui-primary*` values. A plain `:root`
  override also wins in dark mode, so repeat it under `.dark` with the dark values.

Trade-offs: the page needs JavaScript, Tailwind builds the CSS in the browser on
every load (unstyled flash is possible), and a strict CSP must allow
`cdn.jsdelivr.net`. For real apps keep copying `tokens.css`.
