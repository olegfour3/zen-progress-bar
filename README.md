# Zen Progress Bar

Full-width loading bar for [Zen Browser](https://zen-browser.app/), installed via [Sine Mods](https://github.com/CosmoCreeper/Sine).

Inserts `#zpb-bar` into the selected `.browserSidebarContainer` and toggles `:root[zpb-active]` from Zia’s `zia-loading`, tab `busy`/`progress`, and top-level window load state. Works when Zia hides Zen’s native pill.

**Styles** (under `styles/`, `@import`ed from `chrome.css`):

- **Neon** — glow + continuous pulse
- **Windows XP** — fixed-width green blocks on white (clip reveal)
- **Soft track** — muted full-width track + rounded fill
- **RGB prism** — full rainbow on Color mode **Rainbow** (default); tight hue band on Preset / Accent / Custom

**Progress:** Zia-like smooth bar (`shown` → `target` with estimate creep). Bytes from `onProgressChange` only push the target up (capped at 95%); finish eases to 100% then hides.

## Install (Sine)

1. Install [Sine](https://github.com/CosmoCreeper/Sine) for Zen Browser if you do not have it yet.
2. Open **Settings → Sine mods**.
3. Enter `olegfour3/zen-progress-bar` and click **Install**.
4. In Sine settings, enable **Allow unsafe JavaScript** (`sine.allow-unsafe-js`) — required for GitHub-installed mods with scripts (store mods like Zia load JS without this).
5. Enable **Zen Progress Bar**, then **restart Zen** so the script and CSS load.

### Updates

Sine decides “is there an update?” by comparing **`updatedAt`** in `theme.json` (not `version`). Bump **`version`** yourself when the change matters; **`updatedAt`** is set automatically on every commit via [`.githooks/pre-commit`](.githooks/pre-commit) (enable once: `git config core.hooksPath .githooks`).

- If **Auto-update mods** is off (`sine.auto-updates`), click **Check for updates** / manual update in Sine.
- After an update, restart Zen (or toggle the mod) so CSS applies.

### Manual fallback

1. Copy this folder into your profile: `chrome/sine-mods/zen-progress-bar/` (include `styles/`).
2. Register the mod in Sine / `mods.json` (or install again via `owner/repo`).
3. Restart Zen / clear startup cache via `about:support` if needed.

## Settings

Available in the Sine mod preferences panel (`uc.zen-progress-bar.*`):

| Setting | Default | Notes |
|--------|---------|--------|
| Enable progress bar | on | Master toggle |
| Style | Neon | Neon / Windows XP / Soft track / RGB prism |
| Bar height | 2px | Neon, Soft, RGB — 1 / 2 / 3 / 4 px (not XP) |
| Color mode | Rainbow | All styles — rainbow / contrast / Zen accent / preset / custom |
| Preset color | Blue | All styles — 10 colours when mode is Preset |
| Custom color | (custom mode) | All styles — any CSS color |
| Glow effect | on | Neon, Soft, RGB |
| Glow strength | medium | soft / medium / strong |
| Position | top | All styles — top or bottom |
| Rounded leading edge | on | Neon, Soft, RGB (Soft is pill-shaped when on) |
| Keep sidebar hidden on tab open/close | on | Forces `zen.view.compact.toolbar-flash-popup` off (Compact Mode) |

**Progress behavior:** starts near ~25%, eases toward ~90% while loading (estimate), real bytes can advance the target sooner; on complete, eases to full width then disappears (~150ms). Neon also pulses while visible.

## Acceptance checklist

- [ ] Mod appears after installing `olegfour3/zen-progress-bar` in Sine
- [ ] Neon / XP / Soft / RGB switch in Sine prefs and look distinct
- [ ] Height / color / glow work for Neon, Soft, RGB
- [ ] On navigation the bar grows smoothly (not stuck as a short stub)
- [ ] Neon pulses while visible; width still follows progress
- [ ] After load, bar reaches full width then hides
- [ ] Dual-toolbar / compact / single-toolbar layouts keep the bar under (or clear of) the navbar
- [ ] Zen Glance overlay does not leave a full-bleed bar behind the glance card

## Compatibility notes

- **Works with Zia.** Zia hides `#zen-loading-progress-bar` and uses a urlbar loader (`zia-loading`). We draw `#zpb-bar` inside `.browserSidebarContainer` from that flag and tab/window load state — Zia stays on.
- **Sine:** CSS must not be wrapped in `@-moz-document` — Sine injects chrome sheets itself. Shared tokens live in `styles/tokens.css`.
- **Sine updates:** detection uses `updatedAt` (strictly newer ISO date); `version` is for humans / display.
- **Zen updates:** Chrome selectors can change after major Zen releases; re-check the bar if it jumps.

## License

MIT — see [LICENSE](LICENSE).
