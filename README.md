# Zen Progress Bar

Full-width loading bar for [Zen Browser](https://zen-browser.app/), installed via [Sine Mods](https://github.com/CosmoCreeper/Sine).

Inserts `#zpb-bar` into the selected `.browserSidebarContainer` and toggles `:root[zpb-active]` from Zia’s `zia-loading` and tab `busy`/`progress`. Works when Zia hides Zen’s native pill.

**Styles:** Neon (glow), Windows XP copy chunks, Tahoe glass edge.  
**Progress:** real byte progress via `onProgressChange` when the browser reports totals; otherwise ping-pong indeterminate. On finish, snaps to 100% then hides.

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

1. Copy this folder into your profile: `chrome/sine-mods/zen-progress-bar/`.
2. Register the mod in Sine / `mods.json` (or install again via `owner/repo`).
3. Restart Zen / clear startup cache via `about:support` if needed.

## Settings

Available in the Sine mod preferences panel (`uc.zen-progress-bar.*`):

| Setting | Default | Notes |
|--------|---------|--------|
| Enable progress bar | on | Master toggle |
| Style | Neon | Neon / Windows XP / Tahoe glass |
| Bar height | 2px | Neon only — 1 / 2 / 3 / 4 px |
| Color mode | contrast | Neon only — contrast vs page / Zen accent / custom |
| Custom color | (custom mode) | Neon only — any CSS color |
| Glow effect | on | Neon only — soft drop-shadow |
| Glow strength | medium | Neon only — soft / medium / strong |
| Position | top | All styles — top or bottom of the content area |
| Rounded leading edge | on | Neon only |

**Progress behavior:** determinate `scaleX` from download bytes when available; ping-pong animation when totals are unknown (SPA, cache, Zia-only). After load completes, the bar snaps full then disappears (~150ms).

## Acceptance checklist

- [ ] Mod appears after installing `olegfour3/zen-progress-bar` in Sine
- [ ] Neon / XP / Tahoe styles switch in Sine prefs and look distinct
- [ ] Normal navigation shows determinate growth when bytes are reported
- [ ] Pages without byte totals show ping-pong until load ends
- [ ] After load, bar reaches full width briefly then hides
- [ ] Dual-toolbar / compact / single-toolbar layouts keep the bar under (or clear of) the navbar
- [ ] Zen Glance overlay does not leave a full-bleed bar behind the glance card

## Compatibility notes

- **Works with Zia.** Zia hides `#zen-loading-progress-bar` and uses a urlbar loader (`zia-loading`). We draw `#zpb-bar` inside `.browserSidebarContainer` from that flag and tab busy state — Zia stays on.
- **Sine:** CSS must not be wrapped in `@-moz-document` — Sine injects chrome sheets itself.
- **Sine updates:** detection uses `updatedAt` (strictly newer ISO date); `version` is for humans / display.
- **Zen updates:** Chrome selectors can change after major Zen releases; re-check the bar if it jumps.

## License

MIT — see [LICENSE](LICENSE).
