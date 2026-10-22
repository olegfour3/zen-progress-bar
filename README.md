# Zen Progress Bar

Full-width thin loading bar with glow for [Zen Browser](https://zen-browser.app/), installed via [Sine Mods](https://github.com/CosmoCreeper/Sine).

Thin full-width glow bar while a page loads. Uses a small `zen-progress-bar.uc.js` that inserts `#zpb-bar` and toggles `:root[zpb-active]` from Zia’s `zia-loading` and tab `busy`/`progress` — so it works even when Zia hides Zen’s native pill.

## Install (Sine)

1. Install [Sine](https://github.com/CosmoCreeper/Sine) for Zen Browser if you do not have it yet.
2. Open **Settings → Sine mods**.
3. Enter `olegfour3/zen-progress-bar` and click **Install**.
4. Enable **Zen Progress Bar**, then **restart Zen** (or toggle the mod off/on) so the chrome sheet reloads.

### Updates

Sine decides “is there an update?” by comparing **`updatedAt`** in `theme.json` (not `version`). Bump **`version`** yourself when the change matters; **`updatedAt`** is set automatically on every commit via [`.githooks/pre-commit`](.githooks/pre-commit) (enable once: `git config core.hooksPath .githooks`).

- If **Auto-update mods** is off (`sine.auto-updates`), click **Check for updates** / manual update in Sine.
- After an update, restart Zen (or toggle the mod) so CSS applies.

### Manual fallback

1. Copy this folder into your profile: `chrome/sine-mods/zen-progress-bar/`.
2. Register the mod in Sine / `mods.json` (or install again via `owner/repo`).
3. Restart Zen / clear startup cache via `about:support` if needed.

## Settings

Available in the Sine mod preferences panel (`uc.zen-progress-bar.*`):

| Setting | Default | Notes |
|--------|---------|--------|
| Enable progress bar | on | Master toggle |
| Bar height | 2px | 1 / 2 / 3 / 4 px |
| Custom color | empty | Any CSS color; empty → `--zen-primary-color` |
| Glow effect | on | Soft drop-shadow using the bar color |
| Glow strength | medium | soft / medium / strong |
| Position | top | top or bottom of the content area |
| Rounded leading edge | on | Round the growing end of the bar |

## Acceptance checklist

- [ ] Mod appears after installing `olegfour3/zen-progress-bar` in Sine
- [ ] Navigating to a page shows a thin glowing bar across the content width
- [ ] Changing height / color / glow in Sine prefs updates the bar without editing files
- [ ] Dual-toolbar / compact / single-toolbar layouts keep the bar under (or clear of) the navbar
- [ ] Zen Glance overlay does not leave a full-bleed bar behind the glance card

## Compatibility notes

- **Works with Zia.** Zia hides `#zen-loading-progress-bar` and uses a urlbar loader (`zia-loading`). We draw our own overlay on `#zen-appcontent-wrapper::after` from that flag — Zia stays on.
- **Sine:** CSS must not be wrapped in `@-moz-document` — Sine injects chrome sheets itself.
- **Sine updates:** detection uses `updatedAt` (strictly newer ISO date); `version` is for humans / display.
- **Zen updates:** Chrome selectors can change after major Zen releases; re-check the bar if it jumps.

## License

MIT — see [LICENSE](LICENSE).
