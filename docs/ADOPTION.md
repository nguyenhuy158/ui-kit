# Adopting ui-kit

What every app with a web UI does to follow ui-kit, and which apps do it today.
Packages, CI and AGENTS skeleton are in
[kit `docs/ADOPTION.md`](https://github.com/nguyenhuy158/kit/blob/main/docs/ADOPTION.md).

## Checklist

1. **Tokens.** Copy `src/styles/tokens.css`; change values only, never names
   ([USAGE](../USAGE.md#cài-vào-project-mới)).
2. **Components.** Copy the `src/ui/*` files the app needs into its own
   `ui/` folder. A missing primitive goes into ui-kit first, then into the app.
   Do not hand-roll one in the app.
3. **One screen.** Screens use `Screen` and `PagedList` and fit one viewport
   with no scrolling; e2e checks it with `assertFitsViewport` from `@huyab/e2e`.
   The app's `AGENTS.md` carries the
   [one-screen sentence](https://github.com/nguyenhuy158/kit/blob/main/docs/AGENTS-SKELETON.md#one-screen-rule).
4. **Popups.** `ConfirmProvider` (`useConfirm`, `usePrompt`) and `Toast`
   replace native `alert`/`confirm`/`prompt`.
5. **Mobile keyboard.** Text fields use ui-kit `Input` or set `type`,
   `inputMode` and `autoComplete` by hand
   ([rule](https://github.com/nguyenhuy158/kit/blob/main/docs/AGENTS-SKELETON.md#mobile-keyboard-rule)).
   Not in the table: only a code review can tell.
6. **Front-End Checklist.** Critical and High rules from
   [frontendchecklist.io](https://frontendchecklist.io/rules) pass or the PR
   says why not. Not in the table either.

## Status

`✅` done, `❌` missing. "Components copied" counts files whose name matches a
ui-kit `src/ui/` file. Apps not on React (`games`, `webhook-tester`,
`badminton`, `resume`, `digest-vote`) need a redesign or a written exception:
see [#41](https://github.com/nguyenhuy158/ui-kit/issues/41).

Refresh from a kit checkout next to this repo:

```sh
node scripts/adoption.mjs ui ../ui-kit/docs/ADOPTION.md
```

<!-- adoption:ui:start -->
Generated 2026-11-19 by `kit/scripts/adoption.mjs ui`.

| Repo | tokens.css | Components copied | Screen + PagedList | ConfirmProvider | One-screen rule in AGENTS | Note |
| --- | --- | --- | --- | --- | --- | --- |
| sso | ✅ | 13/54 | ❌ | ✅ | ❌ | issuer, signs its own tokens |
| chiakeo | ✅ | 51/54 | ✅ | ❌ | ❌ |  |
| notes | ✅ | 14/54 | ❌ | ❌ | ❌ |  |
| monitor | ✅ | 32/54 | ❌ | ❌ | ❌ |  |
| share | ✅ | ❌ | ❌ | ❌ | ❌ |  |
| ai-english | ✅ | 19/54 | ❌ | ❌ | ❌ |  |
| webhook-tester | ❌ | ❌ | ❌ | ❌ | ❌ | hooks |
| games | ❌ | ❌ | ❌ | ❌ | ❌ |  |
| huyabhome | ✅ | ❌ | ❌ | ❌ | ❌ |  |
| home | ✅ | 18/54 | ✅ | ❌ | ❌ |  |
| zalo | ✅ | 17/54 | ❌ | ❌ | ❌ |  |
| badminton | ❌ | ❌ | ❌ | ❌ | ❌ |  |
| digest-vote | ❌ | ❌ | ❌ | ❌ | ❌ |  |
| resume | ❌ | ❌ | ❌ | ❌ | ❌ |  |
<!-- adoption:ui:end -->
