# Zen Progress Bar

Full-width thin loading bar with glow for [Zen Browser](https://zen-browser.app/), installed via [Sine Mods](https://github.com/CosmoCreeper/Sine).

While a tab is loading, a 2px accent-colored bar grows across the content area (`15% → 45% → 85% → 95%` from tab `busy` / `pendingicon` / `progress` attributes). CSS-only — no userChromeJS.

## Install (Sine)

1. Install [Sine](https://github.com/CosmoCreeper/Sine) for Zen Browser if you do not have it yet.
2. Open **Settings → Sine mods**.
3. Under *add your own locally from a GitHub repo*, paste this repository URL and click **Add**.
4. Enable **Zen Progress Bar** and restart Zen if styles do not apply immediately.

### Manual fallback

1. Copy this folder into your profile: `chrome/sine-mods/zen-progress-bar/`.
2. Register the mod in Sine / `mods.json` (or re-add via the GitHub URL flow).
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

- [ ] Mod appears after adding the GitHub repo URL in Sine
- [ ] Navigating to a page shows a thin glowing bar across the content width
- [ ] Changing height / color / glow in Sine prefs updates the bar without editing files
- [ ] Dual-toolbar / compact / single-toolbar layouts keep the bar under (or clear of) the navbar
- [ ] Zen Glance overlay does not leave a full-bleed bar behind the glance card

## Compatibility notes

- **Other loadbars:** Mods such as Blended Addressbar’s loadbar also paint `::before` on `.browserSidebarContainer`. Disable the other loadbar to avoid conflicts.
- **Zen updates:** Chrome selectors can change after major Zen releases; re-check the bar position if it jumps.
- **Progress accuracy:** Stages are discrete (attribute-based), not byte-accurate download percent.

## License

MIT — see [LICENSE](LICENSE).
